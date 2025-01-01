import React, { useState } from 'react';
import { scrapeParfumoUrl } from '../utils/api';
import { List, Grid, ChevronDown, ChevronUp, Search } from 'lucide-react';

const PerfumeCard = ({ perfume, viewMode }) => {
  const displayName = perfume.name.replace(/-/g, ' ');

  if (viewMode === 'grid') {
    return (
      <div className="border rounded p-2 flex flex-col items-center hover:bg-gray-50 transition-colors cursor-default">
        <div className="w-24 h-24 mb-2">
          <img 
            src={perfume.imageUrl} 
            alt={displayName} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center text-sm w-full break-words min-h-[2.5rem]">
          {displayName}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-default">
      <div className="w-12 h-12 shrink-0">
        <img 
          src={perfume.imageUrl} 
          alt={displayName} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="break-words">
        {displayName}
      </div>
    </div>
  );
};

const CollapsibleSection = ({ title, children, count }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border rounded mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100"
      >
        <span className="font-bold">{title} ({count})</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && <div className="p-3">{children}</div>}
    </div>
  );
};

const FilterableCollection = ({ perfumes, title, viewMode }) => {
  const [filter, setFilter] = useState('');
  const filteredPerfumes = perfumes.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <CollapsibleSection title={title} count={filteredPerfumes.length}>
      <div className="mb-3 relative">
        <input
          type="text"
          placeholder="Filter perfumes..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 pr-8 border rounded"
        />
        <Search size={18} className="absolute right-2 top-2.5 text-gray-400" />
      </div>
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
        : "space-y-2"
      }>
        {filteredPerfumes.map((perfume, index) => (
          <PerfumeCard key={index} perfume={perfume} viewMode={viewMode} />
        ))}
      </div>
    </CollapsibleSection>
  );
};

const ComparisonView = ({ collections, viewMode }) => {
  if (!collections || collections.length < 2) return null;

  const extractPerfumes = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const collectionTitle = doc.querySelector('h2')?.textContent?.trim() || '';
    const perfumes = [];
    
    doc.querySelectorAll('.war_it').forEach(item => {
      const imgElement = item.querySelector('img');
      perfumes.push({
        name: item.getAttribute('alt') || '',
        id: item.getAttribute('data-id') || '',
        imageUrl: imgElement?.src || '',
      });
    });
    
    return { perfumes, collectionTitle };
  };

  const collection1Data = extractPerfumes(collections[0].data.debug.wrapperContent);
  const collection2Data = extractPerfumes(collections[1].data.debug.wrapperContent);
  
  const collection1 = collection1Data.perfumes;
  const collection2 = collection2Data.perfumes;

  const commonPerfumes = collection1.filter(p1 => 
    collection2.some(p2 => p2.id === p1.id)
  );

  const uniqueToFirst = collection1.filter(p1 => 
    !collection2.some(p2 => p2.id === p1.id)
  );

  const uniqueToSecond = collection2.filter(p2 => 
    !collection1.some(p1 => p1.id === p2.id)
  );

  return (
    <div className="space-y-4">
      <FilterableCollection 
        perfumes={commonPerfumes} 
        title="Found in Both Collections"
        viewMode={viewMode}
      />
      
      <FilterableCollection 
        perfumes={uniqueToFirst} 
        title={`Only in ${collection1Data.collectionTitle}`}
        viewMode={viewMode}
      />
      
      <FilterableCollection 
        perfumes={uniqueToSecond} 
        title={`Only in ${collection2Data.collectionTitle}`}
        viewMode={viewMode}
      />
    </div>
  );
};

const ParfumoCompare = () => {
  const [urls, setUrls] = useState(['', '']);
  const [scrapedData, setScrapedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const results = await Promise.all(
        urls.map(url => scrapeParfumoUrl(url))
      );
      setScrapedData(results);
    } catch (err) {
      setError('Failed to fetch data. Please check the URLs and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Parfumo Collection Comparison</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        {urls.map((url, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              placeholder="Enter Parfumo.de collection URL"
              className="flex-1 p-2 border rounded"
            />
          </div>
        ))}
        
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Loading...' : 'Compare Collections'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {scrapedData.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-end items-center mb-6 gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : ''}`}
              title="Grid view"
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : ''}`}
              title="List view"
            >
              <List size={20} />
            </button>
          </div>

          <ComparisonView collections={scrapedData} viewMode={viewMode} />
        </div>
      )}
    </div>
  );
};

export default ParfumoCompare;