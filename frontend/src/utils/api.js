// frontend/src/utils/api.js
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://parfumocomparisontool.onrender.com/api' 
  : 'http://localhost:3001/api';


export const scrapeParfumoUrl = async (url) => {
  console.log('Calling API:', API_URL); // Add this for debugging
  try {
    const response = await fetch(`${API_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    });
    
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};