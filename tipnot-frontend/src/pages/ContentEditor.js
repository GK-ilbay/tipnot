import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaFolder, FaFileAlt, FaEdit, FaArrowLeft, FaHeading, FaParagraph, FaList, FaTable, FaCode, FaImage, FaUpload, FaBold, FaItalic, FaUnderline, FaLink, FaAlignLeft, FaAlignCenter, FaAlignRight, FaListOl, FaListUl, FaIndent, FaVideo } from 'react-icons/fa';
import { BiCodeBlock } from 'react-icons/bi';

const ContentEditor = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const editorRef = useRef(null);
  const editorContentRef = useRef(''); // Store editor content in a ref
  const isUpdatingRef = useRef(false); // Flag to prevent recursive updates
  const imageInputRef = useRef(null); // Reference to the hidden file input
  
  // Get current path from query params
  const queryParams = new URLSearchParams(location.search);
  const currentPath = queryParams.get('path') || '/';
  
  // States
  const [view, setView] = useState('browser'); // 'browser', 'editor', 'categoryForm'
  const [previewMode, setPreviewMode] = useState(false);
  const [contentStructure, setContentStructure] = useState({
    currentPath: '/',
    categories: [],
    contents: [],
    isEmpty: true
  });
  const [selectedContent, setSelectedContent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryPath: currentPath,
    imageFile: null,
    videoUrl: '',
    $imageUrl: ''
  });
  const [categoryFormData, setCategoryFormData] = useState({
    title: '',
    description: ''
  });
  
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Add state for tracking multiple images
  const [contentImages, setContentImages] = useState([]);
  
  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  // Fetch content structure
  useEffect(() => {
    const fetchContentStructure = async () => {
      try {
        console.log('Fetching content structure for path:', currentPath);
        const response = await api.get('/admin/content-structure', {
          params: { path: currentPath }
        });
        console.log('Content structure response:', response.data);
        
        setContentStructure(response.data);
      } catch (err) {
        console.error('Failed to fetch content structure:', err);
        setError('Failed to load categories and content');
      }
    };
    
    fetchContentStructure();
  }, [currentPath]);
  
  // Form handlers for content
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Better handling for editor content changes
  const handleEditorChange = useCallback(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      // Just store content in ref, don't update state directly during typing
      editorContentRef.current = editorRef.current.innerHTML;
    }
  }, []);
  
  // Initialize editor when view changes
  useEffect(() => {
    if (view === 'editor' && editorRef.current) {
      // Set initial content when entering editor view
      if (!editorRef.current.innerHTML || editorRef.current.innerHTML === '<br>') {
        editorRef.current.innerHTML = formData.content || '';
      }
      
      // Keep focus on editor
      editorRef.current.focus();
      
      // Add input handler to track changes
      const handleInput = () => {
        editorContentRef.current = editorRef.current.innerHTML;
      };
      
      editorRef.current.addEventListener('input', handleInput);
      
      return () => {
        if (editorRef.current) {
          editorRef.current.removeEventListener('input', handleInput);
        }
      };
    }
  }, [view, formData.content]);
  
  // Execute a formatting command
  const execCommand = useCallback((command, value = null) => {
    if (editorRef.current) {
      try {
        // Focus the editor element
        editorRef.current.focus();
        
        // Log the command before executing
        console.log(`Executing command: ${command}${value ? ' with value: ' + value : ''}`);
        
        // Special handling for some commands
        if (command === 'fontName') {
          // For font family, we need to make sure it's properly applied
          document.execCommand(command, false, value);
          console.log(`Applied font family: ${value}`);
        } else {
          // Execute the standard command
          document.execCommand(command, false, value);
        }
        
        // Update the content ref
        editorContentRef.current = editorRef.current.innerHTML;
      } catch (error) {
        console.error(`Error executing command ${command}:`, error);
      }
    } else {
      console.warn('Editor reference not available');
    }
  }, []);
  
  // Insert element function
  const insertElement = useCallback((type) => {
    if (!editorRef.current) return;
    
    try {
      // Focus the editor first
      editorRef.current.focus();
      
      switch(type) {
        case 'heading':
          execCommand('formatBlock', '<h2>');
          break;
        case 'paragraph':
          execCommand('formatBlock', '<p>');
          break;
        case 'list':
          execCommand('insertUnorderedList');
          break;
        case 'image':
          const url = prompt('Enter image URL:');
          if (url) {
            execCommand('insertHTML', `<img src="${url}" alt="Image" style="max-width: 100%" />`);
          }
          break;
        case 'table':
          execCommand('insertHTML', `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
              <tr><td style="border: 1px solid #ddd; padding: 8px;">Cell 1</td><td style="border: 1px solid #ddd; padding: 8px;">Cell 2</td></tr>
              <tr><td style="border: 1px solid #ddd; padding: 8px;">Cell 3</td><td style="border: 1px solid #ddd; padding: 8px;">Cell 4</td></tr>
            </table>
          `);
          break;
        case 'code':
          execCommand('insertHTML', '<pre style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; font-family: monospace;"><code>Your code here</code></pre>');
          break;
        default:
          break;
      }
      
      // Update content ref
      editorContentRef.current = editorRef.current.innerHTML;
    } catch (error) {
      console.error('Error using editor:', error);
    }
  }, [execCommand]);
  
  // Form handlers for category
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryFormData({
      ...categoryFormData,
      [name]: value
    });
  };
  
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/admin/category', {
        ...categoryFormData,
        parentPath: currentPath
      });
      
      // Refresh content structure
      const response = await api.get('/admin/content-structure', {
        params: { path: currentPath }
      });
      setContentStructure(response.data);
      
      // Reset form and go back to browser view
      setCategoryFormData({ title: '', description: '' });
      setView('browser');
      setSuccess('Category created successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Category creation error:', err);
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSave();
  };
  
  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get the content from our ref
      let content = editorContentRef.current || '';
      
      console.log("Preparing to save content...");
      
      // Create a temporary DOM element to manipulate the content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      
      // Find all images with base64 data in the content
      const contentImgs = tempDiv.querySelectorAll('img[src^="data:image"]');
      
      // Process embedded images - replace base64 data with placeholders
      if (contentImgs.length > 0) {
        console.log(`Found ${contentImgs.length} embedded images in content - replacing with placeholders`);
        
        contentImgs.forEach((img, index) => {
          const imageId = img.getAttribute('data-id') || `img-${Date.now()}-${index}`;
          const filename = img.getAttribute('data-filename') || `image-${index}.png`;
          
          // Replace the base64 data with a placeholder
          img.setAttribute('src', `[IMG:${imageId}]`);
          img.setAttribute('data-filename', filename);
          img.setAttribute('data-id', imageId);
        });
        
        // Get the updated content without base64 data
        content = tempDiv.innerHTML;
      }
      
      // Create a regular JSON object instead of FormData
      const jsonData = {
        title: formData.title,
        content: content,
        categoryPath: formData.categoryPath || currentPath,
        hasVideo: false,
        videoUrl: '',
        contentImageCount: contentImgs.length
      };
      
      // Add video URL if provided
      if (formData.videoUrl && formData.videoUrl.trim()) {
        jsonData.hasVideo = true;
        jsonData.videoUrl = formData.videoUrl.trim();
      }
      
      // Simple config for JSON request
      const config = {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 seconds
      };
      
      // Save the basic content first without images
      console.log("Saving content without images first:", jsonData);
      
      let response;
      if (selectedContent) {
        console.log("Updating existing content with ID:", selectedContent._id);
        response = await api.put(`/admin/content/${selectedContent._id}`, jsonData, config);
      } else {
        console.log("Creating new content");
        response = await api.post('/admin/content', jsonData, config);
      }
      
      console.log("Content saved successfully:", response.data);
      
      // Now handle featured image upload separately if one exists
      const contentId = selectedContent ? selectedContent._id : response.data._id;
      
      if (formData.imageFile) {
        console.log("Uploading featured image separately:", formData.imageFile.name);
        
        // Create a new FormData just for the image
        const imageForm = new FormData();
        imageForm.append('image', formData.imageFile);
        
        const imageResponse = await api.post(`/admin/content/${contentId}/featured-image`, imageForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log("Featured image uploaded:", imageResponse.data);
      }
      
      // Handle content images one by one
      for (let img of contentImages) {
        if (img.file) {
          console.log(`Uploading content image: ${img.file.name} with ID ${img.id}`);
          
          // Create a new FormData for each image
          const imageForm = new FormData();
          imageForm.append('image', img.file);
          imageForm.append('imageId', img.id);
          
          const imageResponse = await api.post(`/admin/content/${contentId}/content-image`, imageForm, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          console.log(`Content image uploaded for ID ${img.id}:`, imageResponse.data);
        }
      }
      
      setSuccess('Content saved successfully!');
      
      // Update formData with current content
      setFormData(prev => ({
        ...prev,
        content: content
      }));
      
      // Reset form after success for new content
      if (!selectedContent) {
        setFormData({
          title: '',
          content: '',
          categoryPath: currentPath,
          imageFile: null,
          videoUrl: '',
          $imageUrl: ''
        });
        
        editorContentRef.current = '';
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
        }
        
        setPreview(null);
        setContentImages([]);
      }
      
      // Redirect back to content browser after short delay
      setTimeout(() => {
        setView('browser');
        setSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Failed to save content:', err);
      const errorDetails = err.response?.data?.message || err.response?.statusText || err.message || 'Unknown error';
      console.error('Error details:', errorDetails);
      setError(`Failed to save content: ${errorDetails}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleNavigateToCategory = (categoryPath) => {
    navigate(`/admin/content/create?path=${encodeURIComponent(categoryPath)}`);
  };
  
  const handleNavigateUp = () => {
    // Extract parent path
    const pathParts = currentPath.split('/');
    pathParts.pop(); // Remove last segment
    const parentPath = pathParts.join('/') || '/';
    navigate(`/admin/content/create?path=${encodeURIComponent(parentPath)}`);
  };
  
  const handleEditContent = (content) => {
    setSelectedContent(content);
    
    console.log("Editing content with video URL:", content.videoUrl || "None");
    
    setFormData({
      title: content.title,
      content: content.content,
      categoryPath: content.categoryPath,
      imageFile: null,
      videoUrl: content.videoUrl || '',
      $imageUrl: content.hasImage ? `/admin/content/${content._id}/image` : ''
    });
    
    // Also update content ref
    editorContentRef.current = content.content || '';
    
    // Reset content images when editing existing content
    setContentImages([]);
    
    if (content.hasImage) {
      setPreview(`/admin/content/${content._id}/image`);
    } else {
      setPreview(null);
    }
    
    setView('editor');
  };
  
  // Watch for format select changes and apply to editor
  useEffect(() => {
    if (view === 'editor') {
      const formatSelect = document.querySelector('select');
      if (formatSelect) {
        const handleFormatChange = (e) => {
          e.preventDefault();
          const tag = e.target.value;
          execCommand('formatBlock', `<${tag}>`);
        };
        
        formatSelect.addEventListener('change', handleFormatChange);
        return () => {
          formatSelect.removeEventListener('change', handleFormatChange);
        };
      }
    }
  }, [view, execCommand]);
  
  // Keep editor focused
  useEffect(() => {
    if (view === 'editor' && editorRef.current) {
      // Focus the editor when the view changes
      editorRef.current.focus();
      
      // Focus handler for toolbar buttons
      const handleButtonClick = () => {
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.focus();
          }
        }, 0);
      };
      
      // Apply to all editor toolbar buttons
      const buttons = document.querySelectorAll('.quill-button');
      buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
      });
      
      return () => {
        const buttons = document.querySelectorAll('.quill-button');
        buttons.forEach(button => {
          button.removeEventListener('click', handleButtonClick);
        });
      };
    }
  }, [view]);
  
  // Add these functions for image upload functionality
  const handleImageUpload = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleImageFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size - warn if larger than 5MB
    if (file.size > 5 * 1024 * 1024) {
      console.warn(`Image file is large (${Math.round(file.size/1024/1024)}MB). Consider optimizing it.`);
      // We'll still proceed, but warn the user
      alert(`Warning: The selected image is ${Math.round(file.size/1024/1024)}MB in size, which is quite large. This may cause slow uploads or server issues. Consider optimizing or resizing your image before uploading.`);
    }

    // Create a preview of the image
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (editorRef.current) {
        try {
          // Focus the editor
          editorRef.current.focus();
          
          // Generate a unique ID for the image
          const imageId = `img-${Date.now()}`;
          const imgSrc = event.target.result;
          
          // Insert the image at the current cursor position with a placeholder src
          // We'll use a small thumbnail version of the image for the editor view
          // This helps with performance in the editor while still showing a preview
          const imgHtml = `<img src="${imgSrc}" alt="Uploaded Image" style="max-width: 100%; height: auto; margin: 10px 0;" data-filename="${file.name}" data-id="${imageId}" />`;
          execCommand('insertHTML', imgHtml);
          
          // Store the file for later upload with the content
          console.log("Image selected:", file.name, file.type, `${Math.round(file.size/1024)}KB`);
          
          // Add to content images array
          setContentImages(prev => [...prev, { id: imageId, file: file, src: imgSrc }]);
          
          // Also update featured image if not set already
          if (!formData.imageFile) {
            setFormData(prevState => ({
              ...prevState,
              imageFile: file
            }));
          }
          
          console.log('Image inserted successfully');
        } catch (error) {
          console.error('Error inserting image:', error);
        }
      }
    };
    
    reader.onerror = () => {
      console.error('Error reading image file');
      setError('Failed to read the selected image file');
    };
    
    // Read the file as a data URL (base64)
    reader.readAsDataURL(file);
    
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };
  
  // Add this function to handle video embeds
  const insertVideoEmbed = (url) => {
    // Check if it's a YouTube URL
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      const videoId = match[1];
      const embedHtml = `<div class="video-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 15px 0;">
        <iframe 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          src="https://www.youtube.com/embed/${videoId}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>`;
      
      execCommand('insertHTML', embedHtml);
    } else {
      alert('Please enter a valid YouTube URL');
    }
  };
  
  // Add an effect to handle clicks outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close alignment dropdown when clicking outside
      const dropdowns = document.querySelectorAll('.alignment-dropdown');
      dropdowns.forEach(dropdown => {
        const alignmentDropdown = dropdown.querySelector('div[role="menu"]');
        if (alignmentDropdown && !dropdown.contains(event.target)) {
          alignmentDropdown.style.display = 'none';
        }
      });
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update the clipboard paste handler for better image handling
  useEffect(() => {
    const handlePaste = (e) => {
      if (!editorRef.current) return;
      
      // Check if we're pasting an image
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      
      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          e.preventDefault();
          
          const blob = item.getAsFile();
          
          // Check file size - warn if larger than 5MB
          if (blob.size > 5 * 1024 * 1024) {
            console.warn(`Pasted image is large (${Math.round(blob.size/1024/1024)}MB). This may cause issues.`);
            // Show warning in UI instead of alert for better UX during paste
            setError(`Warning: Pasted image is ${Math.round(blob.size/1024/1024)}MB, which may cause slow uploads or server issues.`);
            // Clear error after 5 seconds
            setTimeout(() => setError(''), 5000);
          }
          
          const reader = new FileReader();
          
          reader.onload = (event) => {
            const imgSrc = event.target.result;
            // Create a unique filename and ID for the pasted image
            const filename = `pasted-image-${Date.now()}.png`;
            const imageId = `img-${Date.now()}`;
            
            // Insert the image at the current cursor position
            const imgHtml = `<img src="${imgSrc}" alt="Pasted Image" style="max-width: 100%; height: auto; margin: 10px 0;" data-filename="${filename}" data-id="${imageId}" />`;
            execCommand('insertHTML', imgHtml);
            
            // Convert the blob to a File object
            const file = new File([blob], filename, { type: blob.type });
            
            // Store the file for upload
            console.log("Image pasted:", file.name, file.type, `${Math.round(file.size/1024)}KB`);
            
            // Add to content images array
            setContentImages(prev => [...prev, { id: imageId, file: file, src: imgSrc }]);
            
            // Also update featured image if not set already
            if (!formData.imageFile) {
              setFormData(prevState => ({
                ...prevState,
                imageFile: file
              }));
            }
          };
          
          reader.onerror = () => {
            console.error('Error reading pasted image');
            setError('Failed to process pasted image');
            // Clear error after 3 seconds
            setTimeout(() => setError(''), 3000);
          };
          
          reader.readAsDataURL(blob);
          return;
        }
      }
    };
    
    // Only add the paste handler when in editor view
    if (view === 'editor' && editorRef.current) {
      editorRef.current.addEventListener('paste', handlePaste);
      
      return () => {
        if (editorRef.current) {
          editorRef.current.removeEventListener('paste', handlePaste);
        }
      };
    }
  }, [view, execCommand, formData.imageFile, setError]);
  
  // Add a useEffect hook to configure Axios for handling large uploads
  useEffect(() => {
    // Configure API request defaults for better error handling and upload support
    if (api.defaults) {
      // Increase timeout for large file uploads
      api.defaults.timeout = 60000; // 60 seconds
      
      // Add response interceptor for better error handling
      const responseInterceptor = api.interceptors.response.use(
        response => response,
        error => {
          // Log detailed error information
          console.error('API Error:', error.message);
          if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            console.error('Headers:', error.response.headers);
          } else if (error.request) {
            console.error('No response received:', error.request);
          }
          
          // Check for payload too large error
          if (error.response && error.response.status === 413) {
            error.message = 'The file you are trying to upload is too large. Please use a smaller file or optimize your images.';
          }
          // Check for server errors
          else if (error.response && error.response.status >= 500) {
            error.message = 'The server encountered an error while processing your request. This might be due to the size or format of your content.';
          }
          
          return Promise.reject(error);
        }
      );
      
      // Clean up interceptor on component unmount
      return () => {
        api.interceptors.response.eject(responseInterceptor);
      };
    }
  }, []);
  
  const renderCategoryBrowser = () => {
    return (
      <BrowserContainer>
        <BrowserHeader>
          <h2>
            {currentPath === '/' ? 'Content Root' : `Category: ${currentPath.split('/').pop()}`}
          </h2>
          
          <BrowserActions>
            {currentPath !== '/' && (
              <ActionButton onClick={handleNavigateUp} title="Go up one level">
                <FaArrowLeft /> Back
              </ActionButton>
            )}
            <ActionButton 
              onClick={() => setView('categoryForm')}
              $primary
            >
              <FaFolder /> New Category
            </ActionButton>
            <ActionButton 
              onClick={() => {
                setSelectedContent(null);
                setFormData({
                  ...formData,
                  title: '',
                  content: '',
                  categoryPath: currentPath,
                  imageFile: null,
                  videoUrl: '',
                  $imageUrl: ''
                });
                setPreview(null);
                setView('editor');
              }}
              $primary
            >
              <FaFileAlt /> New Content
            </ActionButton>
          </BrowserActions>
        </BrowserHeader>
        
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <BrowserContent>
          {contentStructure.currentCategory && (
            <CurrentCategoryInfo>
              <h3>Current Category: {contentStructure.currentCategory.title}</h3>
              {contentStructure.currentCategory.description && (
                <p>{contentStructure.currentCategory.description}</p>
              )}
            </CurrentCategoryInfo>
          )}
          
          {contentStructure.isEmpty ? (
            <EmptyState>
              <p>There are no categories or content items here yet.</p>
              <p>Get started by creating a new category or content item.</p>
            </EmptyState>
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
                        $isCategory={true}
                      >
                        <ItemTypeIndicator $isCategory={true}>
                          Category
                        </ItemTypeIndicator>
                        
                        <CardImage>
                          <CategoryIcon>
                            <FaFolder />
                          </CategoryIcon>
                        </CardImage>
                        
                        <CardCategory>{item.category || 'General'}</CardCategory>
                        <CardTitle>
                          {item.title}
                        </CardTitle>
                        <CardDescription>{item.description || 'No description provided'}</CardDescription>
                        <CardButton>Browse Category</CardButton>
                      </ContentCard>
                    ))}
                  </ContentGrid>
                </>
              )}
              
              {contentStructure.contents && contentStructure.contents.length > 0 && (
                <>
                  <SectionTitle>Content</SectionTitle>
                  <ContentGrid>
                    {contentStructure.contents.map((item) => (
                      <ContentCard 
                        key={item._id}
                        $isCategory={false}
                      >
                        <ItemTypeIndicator $isCategory={false}>
                          Content
                        </ItemTypeIndicator>
                        
                        <CardImage>
                          <ContentIcon>
                            <FaFileAlt />
                          </ContentIcon>
                        </CardImage>
                        
                        <CardCategory>{item.category || 'General'}</CardCategory>
                        <CardTitle>
                          {item.title}
                        </CardTitle>
                        <CardDescription>{item.description || 'No description provided'}</CardDescription>
                        
                        <CardButtonGroup>
                          <EditButton onClick={(e) => {
                            e.stopPropagation();
                            handleEditContent(item);
                          }}>
                            <FaEdit /> Edit
                          </EditButton>
                        </CardButtonGroup>
                      </ContentCard>
                    ))}
                  </ContentGrid>
                </>
              )}
            </>
          )}
        </BrowserContent>
      </BrowserContainer>
    );
  };
  
  const renderCategoryForm = () => {
    return (
      <EditorContainer>
        <EditorHeader>
          <h1>Create New Category</h1>
          <p>In: {currentPath}</p>
        </EditorHeader>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <BasicEditorForm onSubmit={handleCategorySubmit}>
          <FormGroup>
            <Label htmlFor="title">Category Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={categoryFormData.title}
              onChange={handleCategoryChange}
              required
              placeholder="Enter category title"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={categoryFormData.description}
              onChange={handleCategoryChange}
              placeholder="Brief description of this category"
              rows="3"
            />
          </FormGroup>
          
          <ButtonGroup>
            <SecondaryButton 
              type="button" 
              onClick={() => setView('browser')}
            >
              Cancel
            </SecondaryButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Category'}
            </SubmitButton>
          </ButtonGroup>
        </BasicEditorForm>
      </EditorContainer>
    );
  };
  
  const renderContentForm = () => {    
    return (
      <FullWidthEditorContainer>
        <TabletContainer>
          <EditorMainArea>
            <EditorTopBar>
              <BackButton onClick={() => setView('browser')}>
                <FaArrowLeft /> Back to Browser
              </BackButton>
              <EditorTitle>
                {selectedContent ? 'Edit Content' : 'Create New Content'}
              </EditorTitle>
              <EditorActions>
                <SaveButton type="button" onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </SaveButton>
              </EditorActions>
            </EditorTopBar>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
            
            <ModernEditorForm id="editorForm" onSubmit={handleSubmit}>
              <TitleInput
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Document Title"
              />
              
              <EditorContainer>
                <EditorWrapper>
                  <QuillToolbar>
                    <ToolGroup>
                      <FormatSelect 
                        defaultValue="p"
                        onChange={(e) => {
                          e.preventDefault();
                          const tag = e.target.value;
                          execCommand('formatBlock', `<${tag}>`);
                        }}
                      >
                        <option value="p">Normal</option>
                        <option value="h1">Heading</option>
                        <option value="h2">Subheading</option>
                      </FormatSelect>
                    </ToolGroup>
                    
                    <ToolSeparator />
                    
                    <ToolGroup>
                      <FormatSelect 
                        defaultValue="Sailec Light"
                        onChange={(e) => {
                          e.preventDefault();
                          const fontFamily = e.target.value;
                          execCommand('fontName', fontFamily);
                        }}
                      >
                        <option value="Sailec Light">Sailec Light</option>
                        <option value="Sofia Pro">Sofia Pro</option>
                        <option value="Slabo 13px">Slabo 13px</option>
                        <option value="Roboto Slab">Roboto Slab</option>
                        <option value="Inconsolata">Inconsolata</option>
                        <option value="Ubuntu Mono">Ubuntu Mono</option>
                      </FormatSelect>
                    </ToolGroup>
                    
                    <ToolSeparator />
                    
                    <ToolGroup>
                      <QuillButton 
                        onClick={(e) => {
                          e.preventDefault();
                          execCommand('bold');
                        }} 
                        title="Bold"
                        aria-label="Bold"
                        type="button"
                        className="quill-button"
                      >
                        <FaBold />
                      </QuillButton>
                      <QuillButton 
                        onClick={(e) => {
                          e.preventDefault();
                          execCommand('italic');
                        }} 
                        title="Italic"
                        aria-label="Italic"
                        type="button"
                        className="quill-button"
                      >
                        <FaItalic />
                      </QuillButton>
                      <QuillButton 
                        onClick={(e) => {
                          e.preventDefault();
                          execCommand('underline');
                        }} 
                        title="Underline"
                        aria-label="Underline"
                        type="button"
                        className="quill-button"
                      >
                        <FaUnderline />
                      </QuillButton>
                    </ToolGroup>
                    
                    <ToolSeparator />
                    
                    <ToolGroup>
                      <div className="alignment-dropdown">
                        <QuillButton 
                          onClick={(e) => {
                            e.preventDefault();
                            // Toggle the dropdown
                            const dropdown = e.currentTarget.nextElementSibling;
                            if (dropdown) {
                              dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                            }
                          }} 
                          title="Text Alignment"
                          aria-label="Text Alignment"
                          type="button"
                          className="quill-button"
                        >
                          <FaAlignLeft />
                        </QuillButton>
                        <AlignmentDropdown role="menu">
                          <AlignmentOption onClick={(e) => {
                            e.preventDefault();
                            execCommand('justifyLeft');
                            e.currentTarget.parentElement.style.display = 'none';
                          }}>
                            <FaAlignLeft /> Left
                          </AlignmentOption>
                          <AlignmentOption onClick={(e) => {
                            e.preventDefault();
                            execCommand('justifyCenter');
                            e.currentTarget.parentElement.style.display = 'none';
                          }}>
                            <FaAlignCenter /> Center
                          </AlignmentOption>
                          <AlignmentOption onClick={(e) => {
                            e.preventDefault();
                            execCommand('justifyRight');
                            e.currentTarget.parentElement.style.display = 'none';
                          }}>
                            <FaAlignRight /> Right
                          </AlignmentOption>
                        </AlignmentDropdown>
                      </div>
                    </ToolGroup>
                    
                    <ToolSeparator />
                    
                    <ToolGroup>
                      <QuillButton 
                        onClick={(e) => {
                          e.preventDefault();
                          execCommand('insertUnorderedList');
                        }} 
                        title="Bullet List"
                        aria-label="Bullet List"
                        type="button"
                        className="quill-button"
                      >
                        <FaListUl />
                      </QuillButton>
                      <QuillButton 
                        onClick={(e) => {
                          e.preventDefault();
                          execCommand('insertOrderedList');
                        }} 
                        title="Numbered List"
                        aria-label="Numbered List"
                        type="button"
                        className="quill-button"
                      >
                        <FaListOl />
                      </QuillButton>
                      <QuillButton 
                        onClick={(e) => {
                          e.preventDefault();
                          execCommand('indent');
                        }} 
                        title="Increase Indent"
                        aria-label="Increase Indent"
                        type="button"
                        className="quill-button"
                      >
                        <FaIndent />
                      </QuillButton>
                    </ToolGroup>
                    
                    <ToolSeparator />
                    
                    <ToolGroup>
                      <QuillButton 
                        onClick={(e) => {
                          e.preventDefault();
                          const url = prompt('Enter link URL:');
                          if (url) execCommand('createLink', url);
                        }} 
                        title="Insert Link"
                        aria-label="Insert Link"
                        type="button"
                        className="quill-button"
                      >
                        <FaLink />
                      </QuillButton>
                      <QuillButton 
                        onClick={(e) => {
                          e.preventDefault();
                          handleImageUpload();
                        }} 
                        title="Insert Image"
                        aria-label="Insert Image"
                        type="button"
                        className="quill-button"
                      >
                        <FaImage />
                      </QuillButton>
                      <QuillButton 
                        onClick={(e) => {
                          e.preventDefault();
                          const videoUrl = prompt('Enter video URL:');
                          if (videoUrl) insertVideoEmbed(videoUrl);
                        }} 
                        title="Insert Video"
                        aria-label="Insert Video"
                        type="button"
                        className="quill-button"
                      >
                        <FaVideo />
                      </QuillButton>
                    </ToolGroup>
                    
                    <ToolSeparator />
                    
                    <ToolGroup>
                      <QuillButton 
                        onClick={(e) => {
                          e.preventDefault();
                          execCommand('insertHTML', '<pre style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; font-family: monospace;"><code>Your code here</code></pre>');
                        }} 
                        title="Insert Code Block"
                        aria-label="Insert Code Block"
                        type="button"
                        className="quill-button"
                      >
                        <BiCodeBlock />
                      </QuillButton>
                    </ToolGroup>
                  </QuillToolbar>
                  
                  <QuillEditorContent
                    ref={editorRef}
                    contentEditable="true"
                    onInput={handleEditorChange}
                    onFocus={() => console.log('Editor focused')}
                    onBlur={() => console.log('Editor blurred')}
                    onClick={() => editorRef.current?.focus()}
                    suppressContentEditableWarning={true}
                  />
                </EditorWrapper>
                
                {/* Hidden file input for image upload */}
                <input 
                  type="file" 
                  id="imageUpload" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleImageFileSelect} 
                  ref={imageInputRef} 
                />
              </EditorContainer>
              
              <VideoUrlContainer>
                <Label htmlFor="videoUrl">YouTube Video URL (Optional)</Label>
                <VideoUrlInput
                  type="text"
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)"
                />
                {formData.videoUrl && (
                  <VideoPreviewNote>
                    The video will appear at the end of your content when published.
                  </VideoPreviewNote>
                )}
              </VideoUrlContainer>
            </ModernEditorForm>
          </EditorMainArea>
        </TabletContainer>
      </FullWidthEditorContainer>
    );
  };
  
  // Render the appropriate view
  return (
    <Container>
      {view === 'browser' && renderCategoryBrowser()}
      {view === 'categoryForm' && renderCategoryForm()}
      {view === 'editor' && renderContentForm()}
    </Container>
  );
};

// Styled Components for the Editor
const EditorToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 8px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-bottom: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const ToolButton = styled.button`
  background: white;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 6px 10px;
  margin-right: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #f1f1f1;
  }
  
  svg {
    font-size: 14px;
  }
`;

const ToolSeparator = styled.div`
  width: 1px;
  height: 26px;
  background-color: #e0e0e0;
  margin: 0 8px;
`;

const EditableContent = styled.div`
  min-height: 400px;
  max-height: 600px;
  padding: 15px;
  border: 1px solid #ddd;
  border-top: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  font-size: 16px;
  line-height: 1.6;
  overflow-y: auto;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
  
  &:empty:before {
    content: 'Write your content here...';
    color: #aaa;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 1.5rem 0 1rem;
    color: #333;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  ul, ol {
    margin-bottom: 1rem;
    padding-left: 2rem;
  }
  
  img {
    max-width: 100%;
    height: auto;
    margin: 1rem 0;
  }
  
  a {
    color: #3498db;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// Add additional or updated styled components
const QuillToolbar = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  flex-wrap: nowrap;
  gap: 6px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  position: relative;
  z-index: 10;
  overflow-x: auto;
`;

const ToolGroup = styled.div`
  display: flex;
  align-items: center;
`;

const QuillButton = styled.button.attrs({ className: 'quill-button' })`
  background: transparent;
  border: none;
  width: 36px;
  height: 36px;
  padding: 6px;
  margin: 0 1px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #444;
  transition: all 0.15s ease-in-out;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
    color: #000;
  }
  
  &:active {
    background-color: rgba(0, 0, 0, 0.08);
  }
  
  svg {
    font-size: 16px;
  }
`;

const FormatSelect = styled.select`
  height: 36px;
  padding: 0 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  color: #444;
  cursor: pointer;
  outline: none;
  min-width: 120px;
  font-family: 'Sailec Light', Arial, sans-serif;
  appearance: menulist;
  transition: all 0.15s ease-in-out;
  margin: 0 2px;
  
  &:hover {
    border-color: #c1c1c1;
    background-color: #f9f9f9;
  }
  
  &:focus {
    border-color: #2a9eff;
    box-shadow: 0 0 0 1px rgba(42, 158, 255, 0.1);
  }
  
  &:hover, &:focus {
    border-color: #2a9eff;
  }
  
  option {
    padding: 8px;
    font-family: 'Sailec Light', Arial, sans-serif;
  }
`;

const QuillEditorContent = styled.div`
  min-height: 500px;
  padding: 30px 40px;
  font-size: 16px;
  line-height: 1.7;
  overflow-y: auto;
  background-color: white;
  
  &:focus {
    outline: none;
  }
  
  &:empty:before {
    content: 'Write your content here...';
    color: #aaa;
    position: absolute;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 1.8rem 0 1rem;
    color: #2c3e50;
    font-weight: 600;
    line-height: 1.3;
  }
  
  h1 {
    font-size: 2.2em;
  }
  
  h2 {
    font-size: 1.7em;
  }
  
  h3 {
    font-size: 1.4em;
  }
  
  p {
    margin-bottom: 1.2rem;
  }
  
  ul, ol {
    margin-bottom: 1.2rem;
    padding-left: 2.2rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  img {
    max-width: 100%;
    height: auto;
    margin: 1.2rem 0;
    border-radius: 6px;
  }
  
  a {
    color: #2a9eff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  pre {
    background-color: #f7f7f7;
    padding: 16px;
    border-radius: 6px;
    font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, monospace;
    margin-bottom: 1.2rem;
    overflow-x: auto;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1.2rem;
  }
  
  table td, table th {
    border: 1px solid #e0e0e0;
    padding: 10px;
  }
  
  blockquote {
    border-left: 4px solid #2a9eff;
    padding: 12px 20px;
    margin: 0 0 20px;
    background-color: #f8f9fa;
  }
`;

const EditorWrapper = styled.div`
  max-width: 100%;
  margin: 0 auto 24px;
  background: white;
`;

// Container and other required styled components 
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const EditorContainer = styled.div`
  position: relative;
  margin: 0;
`;

const BrowserContainer = styled(EditorContainer)`
  max-width: 1100px;
`;

// Rest of the required styled components
const EditorHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  
  h1 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #7f8c8d;
  }
`;

const BasicEditorForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ModernEditorForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 0;
  background-color: white;
  overflow-y: auto;
  flex: 1;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
  display: block;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 20px 40px;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 0;
  font-family: 'Sailec Light', Arial, sans-serif;
  background-color: white;
  color: #2c3e50;
  
  &:focus {
    outline: none;
    border-bottom-color: #2a9eff;
  }
  
  &::placeholder {
    color: #b0b0b0;
    font-weight: 400;
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  flex: 1;
  
  &:hover {
    background-color: #2980b9;
  }
  
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #ecf0f1;
  color: #34495e;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  flex: 1;
  
  &:hover {
    background-color: #dde4e6;
  }
`;

const ErrorMessage = styled.div`
  padding: 0.75rem;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

const SuccessMessage = styled.div`
  padding: 0.75rem;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

const VideoUrlContainer = styled.div`
  margin: 24px 0;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
`;

const VideoUrlInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    border-color: #2a9eff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(42, 158, 255, 0.1);
  }
`;

const VideoPreviewNote = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #6c757d;
  font-style: italic;
`;

const ImageUploadContainer = styled.div`
  margin-bottom: 20px;
`;

const FileInputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const FileInput = styled.input`
  padding: 0.5rem 0;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f1f1f1;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  
  &:hover {
    background-color: #e4e4e4;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const ImagePreview = styled.div`
  margin-top: 1rem;
  
  img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
`;

const EditorTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 40px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  box-shadow: 0 1px 0 rgba(0,0,0,0.05);
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: #f1f1f1;
  border: none;
  border-radius: 6px;
  color: #505050;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: #e4e4e4;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const EditorTitle = styled.h2`
  margin: 0;
  color: #2c3e50;
  font-size: 1.3rem;
`;

const SaveButton = styled.button`
  padding: 10px 16px;
  background-color: #2a9eff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: #1c8aed;
  }
  
  &:disabled {
    background-color: #a0c8e5;
    cursor: not-allowed;
  }
`;

const BrowserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h2 {
    color: #2c3e50;
    margin: 0;
  }
`;

const BrowserActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin-left: 10px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  border: none;
  background-color: ${props => props.$primary ? '#3498db' : '#f1f1f1'};
  color: ${props => props.$primary ? 'white' : '#333'};
  
  &:hover {
    background-color: ${props => props.$primary ? '#2980b9' : '#e4e4e4'};
  }
  
  svg {
    margin-right: 8px;
  }
`;

const BrowserContent = styled.div`
  min-height: 300px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
  color: #7f8c8d;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  
  p {
    margin: 0.5rem 0;
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
  cursor: ${props => props.$isCategory ? 'pointer' : 'default'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ItemTypeIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${props => props.$isCategory ? '#f39c12' : '#3498db'};
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

const ContentIcon = styled.div`
  font-size: 4rem;
  color: #3498db;
  background-color: rgba(255, 255, 255, 0.8);
  width: 100px;
  height: 100px;
  border-radius: 50%;
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
  color: #2c3e50;
  font-size: 1.2rem;
`;

const CardDescription = styled.p`
  padding: 0 1rem;
  color: #7f8c8d;
  margin-bottom: 1.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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

const CardButtonGroup = styled.div`
  display: flex;
  width: 100%;
`;

const EditButton = styled.button`
  flex: 1;
  padding: 1rem;
  background-color: #f5f7fa;
  border: none;
  color: #3498db;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #3498db;
    color: white;
  }
`;

const SectionTitle = styled.h3`
  margin: 1.5rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
  color: #2c3e50;
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

const FullWidthEditorContainer = styled.div`
  padding: 2rem;
  background-color: #f9f9f9;
  min-height: 100vh;
  width: 100%;
`;

const EditorMainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const EditorActions = styled.div`
  display: flex;
  align-items: center;
`;

const TabletContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  position: relative;
  margin: 0 auto;
  max-width: 940px;
  width: 100%;
`;

const AlignmentDropdown = styled.div`
  position: absolute;
  display: none;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  width: 140px;
  padding: 8px 0;
  margin-top: 4px;
`;

const AlignmentOption = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #444;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  svg {
    margin-right: 8px;
  }
`;

export default ContentEditor; 