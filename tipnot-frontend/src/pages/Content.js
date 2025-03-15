import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaBookMedical, FaVideo, FaFilePdf, FaPodcast, FaFolder, FaArrowLeft } from 'react-icons/fa';
import api from '../services/api';

// Mock data as fallback
const mockContent = [
  {
    id: 1,
    title: 'Understanding Cardiovascular Diseases',
    description: 'A comprehensive guide to common heart conditions and treatments.',
    type: 'article',
    category: 'cardiology',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 2,
    title: 'Neurological Assessment Techniques',
    description: 'Learn the latest methods for neurological examinations.',
    type: 'video',
    category: 'neurology',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 3,
    title: 'Pediatric Emergency Care',
    description: 'Essential guidelines for managing pediatric emergencies.',
    type: 'pdf',
    category: 'pediatrics',
    imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 4,
    title: 'Surgical Techniques in Orthopedics',
    description: 'Advanced surgical procedures for orthopedic conditions.',
    type: 'video',
    category: 'surgery',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 5,
    title: 'Mental Health in Primary Care',
    description: 'Integrating mental health assessments in general practice.',
    type: 'podcast',
    category: 'general',
    imageUrl: 'https://images.unsplash.com/photo-1560582861-45078880e48e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 6,
    title: 'Diabetes Management Updates',
    description: 'New approaches to diabetes care and prevention.',
    type: 'article',
    category: 'endocrinology',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
];

const Content = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current path from query params
  const queryParams = new URLSearchParams(location.search);
  const currentPath = queryParams.get('path') || '/';
  
  const [contentData, setContentData] = useState([]);
  const [contentStructure, setContentStructure] = useState({
    currentPath: '/',
    categories: [],
    contents: [],
    isEmpty: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    category: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch content structure from API
  useEffect(() => {
    const fetchContentStructure = async () => {
      setLoading(true);
      try {
        console.log('Fetching content structure for path:', currentPath);
        const response = await api.get('/content-structure', {
          params: { path: currentPath }
        });
        console.log('Content structure response:', response.data);
        
        setContentStructure(response.data);
        setContentData(response.data.contents || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching content structure:', err);
        setError('Failed to load content structure. Please try again later.');
        // Fallback to mock data in development
        if (process.env.NODE_ENV === 'development') {
          setContentData(mockContent);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContentStructure();
  }, [currentPath]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };
  
  // Filter content based on search term and filters
  const filteredContent = contentData && contentData.length > 0 
    ? contentData.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesType = filters.type === '' || item.type === filters.type;
        const matchesCategory = filters.category === '' || item.category === filters.category;
        
        return matchesSearch && matchesType && matchesCategory;
      })
    : [];
  
  // Function to get the appropriate icon for each content type
  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'article':
        return <FaBookMedical />;
      case 'video':
        return <FaVideo />;
      case 'pdf':
        return <FaFilePdf />;
      case 'podcast':
        return <FaPodcast />;
      default:
        return <FaBookMedical />;
    }
  };
  
  const handleNavigateToCategory = (categoryPath) => {
    navigate(`/content?path=${encodeURIComponent(categoryPath)}`);
  };
  
  const handleNavigateUp = () => {
    // Extract parent path
    const pathParts = currentPath.split('/');
    pathParts.pop(); // Remove last segment
    const parentPath = pathParts.join('/') || '/';
    navigate(`/content?path=${encodeURIComponent(parentPath)}`);
  };
  
  // Create a combined array of categories and content items - used for future features
  // eslint-disable-next-line no-unused-vars
  const combinedItems = [
    ...(contentStructure.categories || []).map(item => ({ ...item, itemType: 'category' })),
    ...(filteredContent || []).map(item => ({ ...item, itemType: 'content' }))
  ];
  
  return (
    <ContentContainer>
      <ContentHeader>
        <h1>
          {currentPath === '/' 
            ? 'Medical Education Resources' 
            : `Category: ${currentPath.split('/').pop()}`
          }
        </h1>
        <p>Browse our comprehensive collection of medical educational content</p>
      </ContentHeader>
      
      <FiltersSection>
        <PathNavigationBar>
          {currentPath !== '/' && (
            <ActionButton onClick={handleNavigateUp} title="Go up one level">
              <FaArrowLeft /> Back
            </ActionButton>
          )}
          <PathDisplay>
            <strong>Current Path:</strong> {currentPath}
          </PathDisplay>
        </PathNavigationBar>
        
        <SearchBarWrapper>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search for content..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </SearchBarWrapper>
        
        <FiltersGroup>
          <FilterSelect
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="article">Articles</option>
            <option value="video">Videos</option>
            <option value="pdf">PDFs</option>
            <option value="podcast">Podcasts</option>
          </FilterSelect>
          
          <FilterSelect
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="cardiology">Cardiology</option>
            <option value="neurology">Neurology</option>
            <option value="pediatrics">Pediatrics</option>
            <option value="surgery">Surgery</option>
            <option value="general">General Medicine</option>
            <option value="endocrinology">Endocrinology</option>
          </FilterSelect>
        </FiltersGroup>
      </FiltersSection>
      
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading content...</p>
        </LoadingContainer>
      ) : error ? (
        <ErrorContainer>{error}</ErrorContainer>
      ) : (
        <>
          {contentStructure.currentCategory && (
            <CurrentCategoryInfo>
              <h3>Current Category: {contentStructure.currentCategory.title}</h3>
              {contentStructure.currentCategory.description && (
                <p>{contentStructure.currentCategory.description}</p>
              )}
            </CurrentCategoryInfo>
          )}
          
          {contentStructure.isEmpty ? (
            <NoResults>
              No content is available in this category. Try navigating to a different category.
            </NoResults>
          ) : (
            <>
              {contentStructure.categories && contentStructure.categories.length > 0 && (
                <>
                  <SectionTitle>Categories</SectionTitle>
                  <ContentGrid>
                    {contentStructure.categories.map((item) => (
                      <ContentCard 
                        key={item._id}
                        onClick={() => handleNavigateToCategory(item.categoryPath)}
                        isCategory={true}
                      >
                        <ItemTypeIndicator isCategory={true}>
                          Category
                        </ItemTypeIndicator>
                        
                        <CardImage>
                          <CategoryIcon>
                            <FaFolder />
                          </CategoryIcon>
                        </CardImage>
                        
                        <CardCategory>{item.category || 'General'}</CardCategory>
                        <CardTitle>
                          <CardTitleText>{item.title}</CardTitleText>
                        </CardTitle>
                        <CardDescription>{item.description || 'No description provided'}</CardDescription>
                        <CardButton as="div">Browse Category</CardButton>
                      </ContentCard>
                    ))}
                  </ContentGrid>
                </>
              )}
              
              {filteredContent && filteredContent.length > 0 ? (
                <>
                  <SectionTitle>Content</SectionTitle>
                  <ContentGrid>
                    {filteredContent.map((item) => (
                      <ContentCard 
                        key={item._id || item.id}
                        isCategory={false}
                      >
                        <ItemTypeIndicator isCategory={false}>
                          Content
                        </ItemTypeIndicator>
                        
                        <CardImage>
                          <ContentTypeTag>
                            <TypeIcon>{getContentTypeIcon(item.type || 'article')}</TypeIcon>
                            <span>{item.type || 'article'}</span>
                          </ContentTypeTag>
                        </CardImage>
                        
                        <CardCategory>{item.category || 'General'}</CardCategory>
                        <CardTitle>
                          <CardTitleLink to={`/content/${item._id || item.id}`}>
                            {item.title}
                          </CardTitleLink>
                        </CardTitle>
                        <CardDescription>{item.description || 'No description provided'}</CardDescription>
                        <CardButton as={Link} to={`/content/${item._id || item.id}`}>Read More</CardButton>
                      </ContentCard>
                    ))}
                  </ContentGrid>
                </>
              ) : (
                <NoResults>
                  No content matches your search criteria. Try adjusting your filters.
                </NoResults>
              )}
            </>
          )}
        </>
      )}
    </ContentContainer>
  );
};

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ContentHeader = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #7f8c8d;
    font-size: 1.2rem;
  }
`;

const FiltersSection = styled.div`
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const SearchBarWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
  flex: 2;
`;

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  color: #3498db;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: none;
  outline: none;
  font-size: 1rem;
  background-color: transparent;
  
  &::placeholder {
    color: #bdc3c7;
  }
`;

const FiltersGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex: 1;
  flex-wrap: wrap;
  
  @media (min-width: 768px) {
    justify-content: flex-end;
  }
`;

const FilterSelect = styled.select`
  padding: 1rem;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  min-width: 150px;
  
  &:focus {
    border-color: #3498db;
    outline: none;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ContentCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  cursor: ${props => props.isCategory ? 'pointer' : 'default'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ItemTypeIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${props => props.isCategory ? '#f39c12' : '#3498db'};
  color: white;
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-bottom-right-radius: 4px;
  z-index: 1;
`;

const CardImage = styled.div`
  height: 180px;
  background-image: url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CategoryIcon = styled.div`
  font-size: 4rem;
  color: #f39c12;
  background-color: rgba(255, 255, 255, 0.8);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentTypeTag = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(52, 152, 219, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TypeIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardCategory = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  margin: 1rem;
  background-color: #f1f8fe;
  color: #3498db;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: capitalize;
`;

const CardTitle = styled.h3`
  padding: 0 1rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

const CardTitleLink = styled(Link)`
  color: #2c3e50;
  text-decoration: none;
  font-size: 1.2rem;
  
  &:hover {
    color: #3498db;
    text-decoration: underline;
  }
`;

const CardTitleText = styled.span`
  color: #2c3e50;
  font-size: 1.2rem;
`;

const CardDescription = styled.p`
  padding: 0 1rem;
  color: #7f8c8d;
  margin-bottom: 1.5rem;
`;

const CardButton = styled.div`
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #f5f7fa;
  border: none;
  color: #3498db;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: center;
  text-decoration: none;
  
  &:hover {
    background-color: #3498db;
    color: white;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #7f8c8d;
  font-size: 1.2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #7f8c8d;
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

const ErrorContainer = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin: 2rem 0;
  text-align: center;
`;

const PathNavigationBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const PathDisplay = styled.div`
  margin-left: 1rem;
  color: #7f8c8d;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #f1f1f1;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #e4e4e4;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const CurrentCategoryInfo = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #3498db;
  
  h3 {
    margin-top: 0;
    color: #2c3e50;
  }
  
  p {
    color: #7f8c8d;
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  margin: 1.5rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
  color: #2c3e50;
`;

export default Content; 