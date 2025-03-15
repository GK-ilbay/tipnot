/**
 * Utility to help diagnose video URL field issues
 * You can run this in your browser console to check if the videoUrl field exists
 */

const checkVideoUrlField = async (contentId) => {
  try {
    // Get the content from both possible endpoints
    console.log(`Checking videoUrl field for content ID: ${contentId}`);
    
    let contentData;
    try {
      const response = await fetch(`/api/content/${contentId}`);
      contentData = await response.json();
    } catch (error) {
      console.log('Trying admin endpoint...');
      const response = await fetch(`/api/admin/content/${contentId}`);
      contentData = await response.json();
    }
    
    console.log('Full content data:', contentData);
    
    // Check if videoUrl exists directly in content
    if ('videoUrl' in contentData) {
      console.log('✅ videoUrl field exists in the content object');
      console.log(`Value: "${contentData.videoUrl}"`);
      console.log(`Type: ${typeof contentData.videoUrl}`);
      return true;
    } else {
      console.log('❌ videoUrl field does NOT exist in the content object');
      console.log('Available fields:', Object.keys(contentData).join(', '));
      
      // Check if there's any field that might contain video information
      const possibleVideoFields = Object.keys(contentData).filter(key => 
        key.toLowerCase().includes('video') || 
        key.toLowerCase().includes('media') ||
        key.toLowerCase().includes('youtube')
      );
      
      if (possibleVideoFields.length > 0) {
        console.log('Possible video-related fields found:', possibleVideoFields);
        possibleVideoFields.forEach(field => {
          console.log(`${field}:`, contentData[field]);
        });
      }
      
      return false;
    }
  } catch (error) {
    console.error('Error checking video URL field:', error);
    return false;
  }
};

// Example usage:
// Run in browser console: 
// - checkVideoUrlField('your-content-id')

export default checkVideoUrlField; 