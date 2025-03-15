import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const VideoEmbed = ({ videoUrl }) => {
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Enhanced logging to check what we're receiving
    console.log('VideoEmbed received URL:', videoUrl);
    console.log('VideoEmbed URL type:', typeof videoUrl);
    
    // Extract YouTube video ID from URL
    if (!videoUrl || typeof videoUrl !== 'string' || videoUrl.trim() === '') {
      console.log('No valid video URL provided');
      return;
    }
    
    try {
      console.log('Processing video URL:', videoUrl);
      const id = getYouTubeId(videoUrl.trim());
      
      if (id) {
        console.log('Extracted YouTube ID:', id);
        setVideoId(id);
        setError(null);
      } else {
        console.log('Could not extract YouTube ID from URL');
        setError('Invalid YouTube URL format');
      }
    } catch (err) {
      console.error('Error processing video URL:', err);
      setError('Error processing video URL');
    }
  }, [videoUrl]);
  
  // Extract YouTube video ID from URL - enhanced with more patterns
  const getYouTubeId = (url) => {
    if (!url) return null;
    
    // Special case for already-extracted IDs (11 characters)
    if (url.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }
    
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\\?v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2] && match[2].length === 11) ? match[2] : null;
  };
  
  if (error) {
    return (
      <VideoContainer>
        <VideoTitle>Video Resource</VideoTitle>
        <ErrorMessage>
          Could not embed video: {error}. 
          <br />Please make sure the URL is a valid YouTube URL.
          <br /><small>Received: {videoUrl}</small>
        </ErrorMessage>
        {videoUrl && typeof videoUrl === 'string' && (
          <OriginalLink>
            <a href={videoUrl.startsWith('http') ? videoUrl : `https://www.youtube.com/watch?v=${videoUrl}`} 
               target="_blank" 
               rel="noopener noreferrer">
              Open video in a new tab
            </a>
          </OriginalLink>
        )}
      </VideoContainer>
    );
  }
  
  if (!videoId) return null;
  
  return (
    <VideoContainer>
      <VideoTitle>Video Resource</VideoTitle>
      <ResponsiveIframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </VideoContainer>
  );
};

const VideoContainer = styled.div`
  margin: 3rem 0;
  width: 100%;
`;

const VideoTitle = styled.h3`
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  border-left: 4px solid #3498db;
  padding-left: 1rem;
`;

const ResponsiveIframe = styled.iframe`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ErrorMessage = styled.div`
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #e74c3c;
  text-align: center;
  margin-bottom: 1rem;
`;

const OriginalLink = styled.div`
  text-align: center;
  
  a {
    color: #3498db;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default VideoEmbed; 