import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaCalendarAlt, 
  FaUser, 
  FaTag, 
  FaBookmark,
  FaChevronUp 
} from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import VideoEmbed from '../components/VideoEmbed';
import CommentSection from '../components/CommentSection';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Get the API URL from environment variables
const DIRECT_IMAGE_URL = process.env.REACT_APP_DIRECT_IMAGE_URL || 'http://localhost:8000/direct-image';

const ContentDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToc, setShowToc] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const contentRef = useRef(null);
  const headingsRef = useRef({});
  const htmlContentRef = useRef(null);
  const [processedContent, setProcessedContent] = useState('');
  
  // Fetch content data based on ID
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        // Try to get content from both endpoints for flexibility
        let response;
        try {
          response = await api.get(`/content/${id}`);
        } catch (err) {
          console.log('Trying alternate endpoint...');
          response = await api.get(`/admin/content/${id}`);
        }
        
        console.log('Content data:', response.data);
        
        // Log some info about the content type
        if (response.data?.content) {
          const isHtml = response.data.content.includes('<') && response.data.content.includes('>');
          console.log(`Content appears to be ${isHtml ? 'HTML' : 'Markdown'}`);
          
          if (isHtml) {
            console.log('First 150 chars of HTML content:', response.data.content.substring(0, 150));
          }
        }
        
        // Enhanced video URL logging
        console.log('Video URL data type:', typeof response.data?.videoUrl);
        console.log('Video URL from content:', response.data?.videoUrl || 'No video URL found');

        // Check if response contains all expected fields
        console.log('Content object keys:', Object.keys(response.data));
        
        // Create a processed version of the content with guaranteed videoUrl
        const processedContentData = {
          ...response.data,
          videoUrl: response.data.videoUrl || '' // Ensure videoUrl always exists
        };
        
        console.log('Processed content:', processedContentData);
        
        setContent(processedContentData);
        
        // Process any image placeholders in the content
        if (processedContentData.content) {
          const processedHtml = processContentImages(processedContentData.content);
          setProcessedContent(processedHtml);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContent();
    }
  }, [id]);
  
  // Setup intersection observer for table of contents highlighting
  useEffect(() => {
    if (!content || loading) return;

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveHeading(entry.target.id);
        }
      });
    };

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(callback, options);

    // Register all heading elements with the observer
    Object.values(headingsRef.current).forEach((headingRef) => {
      if (headingRef) {
        observer.observe(headingRef);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [content, loading]);
  
  // Scroll to heading when TOC link is clicked
  const scrollToHeading = (headingId) => {
    const headingElement = document.getElementById(headingId);
    if (headingElement) {
      window.scrollTo({
        top: headingElement.offsetTop - 100, // Offset to account for navbar
        behavior: 'smooth',
      });
    }
  };
  
  // Format date to a readable string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Custom components for ReactMarkdown to add IDs to headings
  const MarkdownComponents = {
    h1: ({node, children, ...props}) => {
      if (!children || children.length === 0) return null;
      const id = children.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return <h1 id={id} ref={el => headingsRef.current[id] = el} {...props}>{children}</h1>;
    },
    h2: ({node, children, ...props}) => {
      if (!children || children.length === 0) return null;
      const id = children.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return <h2 id={id} ref={el => headingsRef.current[id] = el} {...props}>{children}</h2>;
    },
    h3: ({node, children, ...props}) => {
      if (!children || children.length === 0) return null;
      const id = children.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return <h3 id={id} ref={el => headingsRef.current[id] = el} {...props}>{children}</h3>;
    },
    h4: ({node, children, ...props}) => {
      if (!children || children.length === 0) return null;
      const id = children.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return <h4 id={id} ref={el => headingsRef.current[id] = el} {...props}>{children}</h4>;
    },
    h5: ({node, children, ...props}) => {
      if (!children || children.length === 0) return null;
      const id = children.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return <h5 id={id} ref={el => headingsRef.current[id] = el} {...props}>{children}</h5>;
    },
    h6: ({node, children, ...props}) => {
      if (!children || children.length === 0) return null;
      const id = children.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return <h6 id={id} ref={el => headingsRef.current[id] = el} {...props}>{children}</h6>;
    }
  };
  
  // Process HTML content to add IDs to headings if needed
  useEffect(() => {
    // Only run this effect if we have HTML content
    if (content?.content?.includes('<') && 
        content?.content?.includes('>') && 
        htmlContentRef.current) {
      
      console.log('Processing HTML content to add IDs to headings');
      
      // Find all heading elements
      const headingElements = htmlContentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      // If we don't already have a table of contents, create one
      if (!content.tableOfContents || content.tableOfContents.length === 0) {
        const toc = [];
        
        // Process each heading to add an ID
        headingElements.forEach((heading) => {
          // Skip if already has an ID
          if (heading.id) return;
          
          const headingText = heading.textContent;
          const id = headingText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
          
          // Add the ID to the heading
          heading.id = id;
          
          // Add to our refs
          headingsRef.current[id] = heading;
          
          // Add to our table of contents
          toc.push({
            id,
            title: headingText,
            level: parseInt(heading.tagName.substring(1)) // Extract number from h1, h2, etc.
          });
        });
        
        // If we found headings, update content with toc
        if (toc.length > 0) {
          setContent(prevContent => ({
            ...prevContent,
            tableOfContents: toc
          }));
        }
      }
    }
  }, [content]);
  
  // Process content to replace image placeholders with actual img tags
  const processContentImages = (htmlContent) => {
    if (!htmlContent) return '';
    
    console.log('Processing content HTML with length:', htmlContent.length);
    console.log('Raw content HTML first 300 chars:', htmlContent.substring(0, 300));
    console.log('Using image URL base:', DIRECT_IMAGE_URL);
    
    // This regex matches both standalone [IMG:img-id] and <img> tags with [IMG:img-id] in the src
    const imgTagRegex = /<img[^>]*src="[^"]*\[IMG:(img-[a-zA-Z0-9-]+)\][^"]*"[^>]*>/g;
    const imgPlaceholderRegex = /\[IMG:(img-[a-zA-Z0-9-]+)\]/g;
    
    // First process <img> tags that already have [IMG:id] in their src attribute
    let processed = htmlContent.replace(imgTagRegex, (match, imageId) => {
      console.log(`Found image tag with placeholder in src: [IMG:${imageId}]`);
      
      // Extract the alt text and style if present
      let alt = 'Content Image';
      let style = 'max-width: 100%; height: auto;';
      let extraAttributes = '';
      
      const altMatch = match.match(/alt="([^"]*)"/);
      if (altMatch && altMatch[1]) {
        alt = altMatch[1];
      }
      
      const styleMatch = match.match(/style="([^"]*)"/);
      if (styleMatch && styleMatch[1]) {
        style = styleMatch[1];
      }
      
      // Copy over other data attributes if present
      const dataFilenameMatch = match.match(/data-filename="([^"]*)"/);
      if (dataFilenameMatch) {
        extraAttributes += ` data-filename="${dataFilenameMatch[1]}"`;
      }
      
      const dataIdMatch = match.match(/data-id="([^"]*)"/);
      if (dataIdMatch) {
        extraAttributes += ` data-id="${dataIdMatch[1]}"`;
      }
      
      console.log(`Creating img tag for ID ${imageId} with alt="${alt}" and style="${style}"`);
      return `<img src="${DIRECT_IMAGE_URL}/${imageId}" alt="${alt}" style="${style}"${extraAttributes} />`;
    });
    
    // Then process any standalone [IMG:id] placeholders
    processed = processed.replace(imgPlaceholderRegex, (match, imageId) => {
      console.log(`Replacing standalone image placeholder [IMG:${imageId}] with img tag`);
      return `<img src="${DIRECT_IMAGE_URL}/${imageId}" alt="Content Image" style="max-width: 100%; height: auto;" />`;
    });
    
    console.log('Image placeholders replaced with img tags');
    
    return processed;
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading content...</LoadingText>
      </LoadingContainer>
    );
  }
  
  if (error) {
    return (
      <ErrorContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <BackButton to="/content">Return to Content Listing</BackButton>
      </ErrorContainer>
    );
  }
  
  if (!content) {
    return (
      <ErrorContainer>
        <ErrorMessage>Content not found</ErrorMessage>
        <BackButton to="/content">Return to Content Listing</BackButton>
      </ErrorContainer>
    );
  }
  
  return (
    <ContentContainer>
      <ContentHeader>
        <ContentBreadcrumb>
          <BreadcrumbLink to="/content">Content</BreadcrumbLink>
          {content?.categoryPath && content.categoryPath !== '/' && (
            <>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbLink to={`/content?path=${encodeURIComponent(content.categoryPath)}`}>
                {content.categoryPath.split('/').pop()}
              </BreadcrumbLink>
            </>
          )}
        </ContentBreadcrumb>
        
        <ContentTitle>{content?.title}</ContentTitle>
        
        <ContentMeta>
          <MetaItem>
            <FaCalendarAlt />
            <span>{formatDate(content?.createdAt)}</span>
          </MetaItem>
          {content?.author && (
            <MetaItem>
              <FaUser />
              <span>
                {typeof content.author === 'object' 
                  ? `${content.author.name || 'Unknown'}, ${content.author.title || 'Contributor'}` 
                  : 'Author'}
              </span>
            </MetaItem>
          )}
          {content?.category && (
            <MetaItem>
              <FaTag />
              <span>{content.category}</span>
            </MetaItem>
          )}
        </ContentMeta>
      </ContentHeader>
      
      <ContentWrapper>
        <ContentLayout>
          <div>
            <TableOfContents>
              <TocTitle>{content.tableOfContents && content.tableOfContents.length > 0 ? 'Table of Contents' : 'Document Navigation'}</TocTitle>
              {content.tableOfContents && content.tableOfContents.length > 0 ? (
                <TocList>
                  {content.tableOfContents.map(item => (
                    <TocItem 
                      key={item.id}
                      isActive={activeHeading === item.id}
                      onClick={() => scrollToHeading(item.id)}
                    >
                      {item.title}
                    </TocItem>
                  ))}
                </TocList>
              ) : (
                <EmptySidebar>
                  <p>This document doesn't have a table of contents yet.</p>
                  <DocumentInfo>
                    <DocumentInfoItem>
                      <InfoLabel>Category:</InfoLabel>
                      <InfoValue>{content.category || 'General'}</InfoValue>
                    </DocumentInfoItem>
                    {content.author && (
                      <DocumentInfoItem>
                        <InfoLabel>Author:</InfoLabel>
                        <InfoValue>
                          {typeof content.author === 'object' 
                            ? `${content.author.name || 'Unknown'}` 
                            : 'Author'}
                        </InfoValue>
                      </DocumentInfoItem>
                    )}
                    <DocumentInfoItem>
                      <InfoLabel>Published:</InfoLabel>
                      <InfoValue>{formatDate(content?.createdAt)}</InfoValue>
                    </DocumentInfoItem>
                  </DocumentInfo>
                </EmptySidebar>
              )}
              
              <RelatedActions>
                <SidebarButton onClick={() => window.print()}>
                  Print Document
                </SidebarButton>
                <SidebarButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Back to Top
                </SidebarButton>
              </RelatedActions>
            </TableOfContents>
          </div>
          
          <ContentBody>
            <article 
              ref={contentRef}
              className="content-html"
            >
              <MarkdownStyles>
                {content?.content?.includes('<') && content?.content?.includes('>') ? (
                  // If content looks like HTML, render it using dangerouslySetInnerHTML with processed content
                  <div 
                    ref={htmlContentRef}
                    dangerouslySetInnerHTML={{ __html: processedContent || processContentImages(content?.content) }} 
                  />
                ) : (
                  // Otherwise, use ReactMarkdown as before
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    components={MarkdownComponents}
                  >
                    {content?.content || ''}
                  </ReactMarkdown>
                )}
              </MarkdownStyles>
            </article>
            
            {/* Show video section if videoUrl exists */}
            {content?.videoUrl && content.videoUrl.trim() !== '' ? (
              <VideoSection>
                <SectionTitle>Video</SectionTitle>
                <VideoEmbed videoUrl={content.videoUrl} />
              </VideoSection>
            ) : (
              <VideoSection style={{ display: 'none' }}></VideoSection>
            )}
            
            {content?.references && content.references.length > 0 && (
              <ReferencesSection>
                <ReferencesTitle>
                  <FaBookmark />
                  References
                </ReferencesTitle>
                <ReferencesList>
                  {content.references.map((reference, index) => (
                    <ReferenceItem key={index}>
                      <ReferenceNumber>{index + 1}.</ReferenceNumber>
                      <ReferenceText>{reference}</ReferenceText>
                    </ReferenceItem>
                  ))}
                </ReferencesList>
              </ReferencesSection>
            )}
            
            {isAuthenticated() && (
              <CommentSection contentId={content._id || content.id} />
            )}
          </ContentBody>
        </ContentLayout>
      </ContentWrapper>
      
      {/* Debug section - hidden from view but shows content data */}
      <div style={{ display: 'none' }}>
        <pre>{JSON.stringify({ 
          contentId: content?._id || content?.id,
          hasVideoUrl: !!content?.videoUrl,
          videoUrl: content?.videoUrl
        }, null, 2)}</pre>
      </div>
      
      <BackToTopButton 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <FaChevronUp />
      </BackToTopButton>
    </ContentContainer>
  );
};

// Styled components
const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
`;

const ContentHeader = styled.header`
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e1e4e8;
`;

const ContentBreadcrumb = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #7f8c8d;
`;

const BreadcrumbLink = styled(Link)`
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 0.5rem;
  color: #bdc3c7;
`;

const ContentTitle = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.2;
`;

const ContentMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  color: #7f8c8d;
  font-size: 0.95rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #3498db;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TableOfContents = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  position: sticky;
  top: 100px;
  height: fit-content;
  display: block;
  
  @media (max-width: 768px) {
    position: relative;
    top: 0;
    margin-bottom: 2rem;
  }
`;

const TocTitle = styled.h3`
  font-size: 1.2rem;
  margin-top: 0;
  margin-bottom: 1.2rem;
  color: #2c3e50;
`;

const TocList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TocItem = styled.li`
  margin-bottom: 0.8rem;
  padding-left: ${props => props.isActive ? '1rem' : '0'};
  border-left: ${props => props.isActive ? '3px solid #3498db' : '3px solid transparent'};
  padding-left: ${props => props.isActive ? '0.5rem' : '0.5rem'};
  color: ${props => props.isActive ? '#3498db' : '#34495e'};
  text-decoration: none;
  cursor: pointer;
  display: block;
  font-size: 0.95rem;
  line-height: 1.4;
  
  &:hover {
    color: #3498db;
  }
`;

const ContentBody = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  
  .content-html {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #34495e;
  }
`;

const VideoSection = styled.section`
  margin-top: 3rem;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
`;

const ReferencesSection = styled.section`
  margin-top: 3rem;
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
`;

const ReferencesTitle = styled.h2`
  font-size: 1.8rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  svg {
    color: #3498db;
  }
`;

const ReferencesList = styled.ol`
  padding-left: 1.5rem;
  margin: 0;
`;

const ReferenceItem = styled.li`
  margin-bottom: 1rem;
  display: flex;
  color: #34495e;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ReferenceNumber = styled.span`
  font-weight: 600;
  margin-right: 0.5rem;
`;

const ReferenceText = styled.span`
  flex: 1;
`;

const BackToTopButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #3498db;
  color: white;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #7f8c8d;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
`;

const ErrorMessage = styled.p`
  font-size: 1.2rem;
  color: #e74c3c;
  margin-bottom: 2rem;
`;

const BackButton = styled(Link)`
  background-color: #3498db;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

// Add these new styles for markdown content
const MarkdownStyles = styled.div`
  /* Base styles */
  line-height: 1.6;
  color: #333;
  font-size: 1.05rem;
  
  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 600;
    line-height: 1.25;
    color: #2c3e50;
  }
  
  h1 {
    font-size: 2.2em;
    padding-bottom: 0.3em;
    border-bottom: 1px solid #eaecef;
    margin-top: 0;
  }
  
  h2 {
    font-size: 1.65em;
    padding-bottom: 0.3em;
    border-bottom: 1px solid #eaecef;
    margin-top: 1.8em;
  }
  
  h3 {
    font-size: 1.35em;
    margin-top: 1.5em;
  }
  
  /* Paragraphs and lists */
  p {
    margin-bottom: 1.25em;
    line-height: 1.7;
  }
  
  ul, ol {
    margin-bottom: 1.25em;
    padding-left: 2em;
  }
  
  li {
    margin: 0.4em 0;
  }
  
  /* Links */
  a {
    color: #3498db;
    text-decoration: none;
    border-bottom: 1px dotted #3498db;
    transition: color 0.2s, border-bottom 0.2s;
  }
  
  a:hover {
    color: #2980b9;
    border-bottom: 1px solid #2980b9;
  }
  
  /* Code */
  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 90%;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  }
  
  pre {
    padding: 1em;
    overflow: auto;
    font-size: 90%;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 6px;
    margin-bottom: 1.25em;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  pre code {
    padding: 0;
    margin: 0;
    background-color: transparent;
    border: 0;
    word-break: normal;
    white-space: pre;
    max-width: 100%;
    overflow: auto;
    display: block;
  }
  
  /* Blockquotes */
  blockquote {
    padding: 0.75em 1.2em;
    color: #6a737d;
    border-left: 0.3em solid #3498db;
    margin: 0 0 1.25em 0;
    background-color: #f8f9fa;
    border-radius: 0 4px 4px 0;
  }
  
  blockquote > :last-child {
    margin-bottom: 0;
  }
  
  /* Tables */
  table {
    border-collapse: collapse;
    width: 100%;
    overflow: auto;
    margin-bottom: 1.25em;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
  }
  
  table th {
    font-weight: 600;
    background-color: #f8f9fa;
  }
  
  table th, table td {
    padding: 0.75em 1em;
    border: 1px solid #e1e4e8;
  }
  
  table tr {
    background-color: #fff;
    border-top: 1px solid #c6cbd1;
  }
  
  table tr:nth-child(2n) {
    background-color: #f8f9fa;
  }
  
  /* Images */
  img {
    max-width: 100%;
    box-sizing: border-box;
    margin: 1em auto;
    border-radius: 6px;
    display: block;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  /* Additional styles for HTML from the editor */
  div {
    margin-bottom: 1em;
  }
  
  /* Text alignment */
  [style*="text-align: center"] {
    text-align: center;
  }
  
  [style*="text-align: right"] {
    text-align: right;
  }
  
  [style*="text-align: left"] {
    text-align: left;
  }
  
  /* Lists from content editor */
  ul li {
    list-style-type: disc;
  }
  
  ol li {
    list-style-type: decimal;
  }
  
  /* Indentation */
  [style*="margin-left"] {
    margin-left: 2em;
  }
  
  /* Format for code blocks */
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  
  /* Fix for nested blockquotes */
  blockquote blockquote {
    margin-left: 0;
  }
  
  /* Fix for tables with border styling */
  table[style*="border"] td,
  table[style*="border"] th {
    border: 1px solid #ddd;
  }
`;

const EmptySidebar = styled.div`
  margin-top: 1rem;
  color: #7f8c8d;
  font-size: 0.9rem;
  
  p {
    margin-bottom: 1.5rem;
  }
`;

const DocumentInfo = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e1e4e8;
`;

const DocumentInfoItem = styled.div`
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #34495e;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.span`
  color: #7f8c8d;
`;

const RelatedActions = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e1e4e8;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SidebarButton = styled.button`
  background-color: #f1f1f1;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  color: #34495e;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e4e4e4;
  }
`;

export default ContentDetail; 