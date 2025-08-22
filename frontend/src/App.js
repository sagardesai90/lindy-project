import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import axios from 'axios';
import { useDebounce } from 'use-debounce';

const API_BASE_URL = 'http://localhost:3001/api';

function App() {
  const [gifs, setGifs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500); // 500ms delay
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedGif, setSelectedGif] = useState(null);

  const observer = useRef();
  const lastGifElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prevOffset => prevOffset + 20);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchGifs = async (isSearch = false, query = '', currentOffset = 0) => {
    try {
      setLoading(true);
      const endpoint = isSearch ? '/search' : '/trending';
      const params = isSearch
        ? { q: query, limit: 20, offset: currentOffset }
        : { limit: 20, offset: currentOffset };

      const response = await axios.get(`${API_BASE_URL}${endpoint}`, { params });

      if (currentOffset === 0) {
        setGifs(response.data.data);
      } else {
        setGifs(prev => [...prev, ...response.data.data]);
      }

      setHasMore(response.data.data.length === 20);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect for initial load and search changes
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      setOffset(0);
      setIsSearchMode(true);
      fetchGifs(true, debouncedSearchQuery, 0);
    } else {
      setOffset(0);
      setIsSearchMode(false);
      fetchGifs(false, '', 0);
    }
  }, [debouncedSearchQuery]);

  // Effect for infinite scrolling
  useEffect(() => {
    if (offset > 0) {
      if (isSearchMode && debouncedSearchQuery.trim()) {
        fetchGifs(true, debouncedSearchQuery, offset);
      } else {
        fetchGifs(false, '', offset);
      }
    }
  }, [offset, isSearchMode, debouncedSearchQuery]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchMode(false);
    setOffset(0);
    setGifs([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>GIF Explorer</h1>
        {selectedGif && (
          <div style={{ color: 'white', fontSize: '12px', marginBottom: '10px' }}>
            Selected: {selectedGif.title}
          </div>
        )}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for GIFs..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          {searchQuery && (
            <button onClick={handleClearSearch} className="clear-button">
              Clear
            </button>
          )}
        </div>
      </header>

      <main className="gif-container">
        {gifs.map((gif, index) => (
          <div
            key={`${gif.id}-${index}`}
            ref={index === gifs.length - 1 ? lastGifElementRef : null}
            className="gif-item"
            onClick={() => setSelectedGif(gif)}
          >
            <img
              src={gif.images.fixed_height.url}
              alt={gif.title}
              loading="lazy"
            />
          </div>
        ))}
        {loading && <div className="loading">Loading more GIFs...</div>}
        {!hasMore && gifs.length > 0 && (
          <div className="no-more">No more GIFs to load</div>
        )}
      </main>

      {/* GIF Details Section */}
      {selectedGif && (
        <div className="gif-details">
          <div className="gif-details-header">
            <h2>GIF Details</h2>
            <button
              className="close-button"
              onClick={() => setSelectedGif(null)}
            >
              ×
            </button>
          </div>
          <div className="gif-details-content">
            <div className="gif-preview">
              <img
                src={selectedGif.images.original.url}
                alt={selectedGif.title}
                className="gif-preview-image"
              />
            </div>
            <div className="gif-info">
              <h3>{selectedGif.title}</h3>
              <div className="gif-metadata">
                <p><strong>Rating:</strong> {selectedGif.rating.toUpperCase()}</p>
                {selectedGif.username && (
                  <p><strong>Creator:</strong> {selectedGif.username}</p>
                )}
                {selectedGif.source && (
                  <p><strong>Source:</strong>
                    <a href={selectedGif.source} target="_blank" rel="noopener noreferrer">
                      {selectedGif.source_tld || 'External Link'}
                    </a>
                  </p>
                )}
                <p><strong>Uploaded:</strong> {new Date(selectedGif.import_datetime).toLocaleDateString()}</p>
                {selectedGif.trending_datetime !== '0000-00-00 00:00:00' && (
                  <p><strong>Trending since:</strong> {new Date(selectedGif.trending_datetime).toLocaleDateString()}</p>
                )}
              </div>
              <div className="gif-actions">
                <a
                  href={selectedGif.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-button"
                >
                  View on Giphy
                </a>
                <a
                  href={selectedGif.images.original.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-button"
                >
                  Download Original
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
