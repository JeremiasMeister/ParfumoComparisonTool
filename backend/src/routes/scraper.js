const express = require('express');
const { scrapeWithPuppeteer } = require('../utils/scrapers');

const router = express.Router();

router.post('/scrape', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url.includes('parfumo.de') && !url.includes('parfumo.net') && !url.includes('parfumo.com')) {
      return res.status(400).json({ error: 'Invalid URL. Must be from parfumo.de' });
    }

    console.log('Fetching URL:', url);
    
    try {
      const data = await scrapeWithPuppeteer(url);
      console.log('Successfully scraped data:', data);
      res.json(data);
    } catch (error) {
      console.error('Detailed scraping error:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({ 
      error: 'Failed to scrape data', 
      details: error.message,
      stack: error.stack,
      name: error.name
    });
  }
});

module.exports = router;