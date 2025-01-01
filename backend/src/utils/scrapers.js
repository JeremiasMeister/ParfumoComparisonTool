const puppeteer = require('puppeteer');

const scrapeWithPuppeteer = async (url) => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--single-process',
      '--disable-dev-shm-usage'
    ]
  });
  
  try {
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36');

    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Wait specifically for the content wrapper
    await page.waitForSelector('#wr_content_wrapper', { timeout: 30000 });
    
    if (url.includes('/Benutzer/') && url.includes('/Sammlung/') || url.includes('/Users/') && url.includes('Collection')) {
      const collectionData = await page.evaluate(() => {
        const perfumes = [];
        // Look for items specifically within the content wrapper
        const contentWrapper = document.querySelector('#wr_content_wrapper');
        const items = contentWrapper.querySelectorAll('.item');
        
        items.forEach(item => {
          // Log the structure of each item for debugging
          console.log('Item HTML:', item.outerHTML);
          
          perfumes.push({
            name: item.querySelector('.wl_full_perfume_name')?.textContent?.trim() || '',
            brand: item.querySelector('.wl_perfume_brand')?.textContent?.trim() || '',
            imageUrl: item.querySelector('img')?.src || '',
            rating: parseFloat(item.querySelector('.wl_rating')?.textContent) || null,
            url: item.querySelector('a')?.href || '',
            votes: parseInt(item.querySelector('.wl_rating_count')?.textContent) || 0
          });
        });

        // Get collection details from the content wrapper
        const collectionTitle = contentWrapper.querySelector('h1')?.textContent?.trim() || '';
        const [owner, collectionName] = collectionTitle.split(' - ').map(s => s.trim());

        return {
          collectionName,
          owner,
          totalPerfumes: perfumes.length,
          perfumes,
          debug: {
            foundElements: items.length,
            pageTitle: document.title,
            wrapperContent: contentWrapper.innerHTML
          }
        };
      });

      console.log('Collection debug info:', {
        itemsFound: collectionData.perfumes.length,
        collectionName: collectionData.collectionName,
        owner: collectionData.owner
      });
      
      return { type: 'collection', data: collectionData };
      
    } else if (url.includes('/Parfums/')) {
      const perfumeData = await page.evaluate(() => {
        const contentWrapper = document.querySelector('#wr_content_wrapper');
        
        const getNotes = (sectionClass) => {
          const section = contentWrapper.querySelector(sectionClass);
          return section ? Array.from(section.querySelectorAll('.note')).map(note => note.textContent.trim()) : [];
        };

        return {
          name: contentWrapper.querySelector('.perfume_name')?.textContent?.trim() || '',
          brand: contentWrapper.querySelector('.brand_name')?.textContent?.trim() || '',
          year: contentWrapper.querySelector('.launch_year')?.textContent?.trim() || '',
          scent: {
            top: getNotes('.top_notes'),
            middle: getNotes('.heart_notes'),
            base: getNotes('.base_notes')
          },
          rating: parseFloat(contentWrapper.querySelector('.rating_value')?.textContent) || null,
          longevity: contentWrapper.querySelector('.longevity')?.textContent?.trim() || '',
          sillage: contentWrapper.querySelector('.sillage')?.textContent?.trim() || '',
          debug: {
            pageTitle: document.title,
            wrapperFound: !!contentWrapper
          }
        };
      });

      console.log('Perfume debug info:', perfumeData.debug);
      return { type: 'perfume', data: perfumeData };
    }
  } catch (error) {
    console.error('Puppeteer error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw error;
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeWithPuppeteer };