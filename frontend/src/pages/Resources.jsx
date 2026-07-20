import React, { useState, useEffect, useCallback } from 'react';
import { resourceAPI } from '../services/api';
import SearchBar from '../components/resources/SearchBar';
import ResourceCard from '../components/resources/ResourceCard';
import ResourceDetails from './ResourceDetails';
import { RefreshCw, AlertCircle, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';

const TYPE_FILTERS = [
  { id: '', label: 'All Resources' },
  { id: 'ConceptNote', label: 'Concept Notes' },
  { id: 'PublicHandbook', label: 'Handbooks' },
  { id: 'Inspiration', label: 'Inspirations' },
  { id: 'Testimonial', label: 'Testimonials' },
];

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Detail navigation state
  const [selectedResourceId, setSelectedResourceId] = useState(null);

  // Fetch categories list on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await resourceAPI.getCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch resources based on filters
  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 6,
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        type: selectedType || undefined,
      };
      
      const response = await resourceAPI.getAll(params);
      if (response.success) {
        setResources(response.data.resources);
        setTotalPages(response.data.pagination.pages);
        setTotalCount(response.data.pagination.total);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve resources');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedCategory, selectedType]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Reset page index on filter change
  const handleFilterChange = (typeId) => {
    setSelectedType(typeId);
    setPage(1);
  };

  const handleCategoryChange = (catName) => {
    setSelectedCategory(selectedCategory === catName ? '' : catName);
    setPage(1);
  };

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  if (selectedResourceId) {
    return (
      <ResourceDetails 
        resourceId={selectedResourceId} 
        onBack={() => setSelectedResourceId(null)} 
      />
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-6 lg:py-10 z-10 flex flex-col gap-8 select-none">
      
      {/* Top Section: Search, Types filters, and Categories */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-pf-lime-text uppercase">
              Explore Knowledge
            </span>
            <h1 className="text-4xl lg:text-5xl font-black font-display tracking-tight text-pf-dark mt-1">
              LIBRARY / RESOURCES
            </h1>
          </div>
          
          {/* Debounced Search */}
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
        </div>

        {/* Horizontal Type Filters (Tabs) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/60 pb-3">
          {TYPE_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterChange(filter.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                selectedType === filter.id
                  ? 'bg-pf-dark text-white shadow-sm'
                  : 'bg-white/40 text-slate-500 hover:text-pf-dark hover:bg-white/70'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Category Pills list */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Categories:</span>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryChange(cat.name)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all duration-200 ${
                  selectedCategory === cat.name
                    ? 'bg-pf-lime border-pf-lime-text/40 text-pf-dark font-black shadow-sm'
                    : 'bg-white/30 border-slate-200 text-slate-500 hover:bg-white/60 hover:text-pf-dark'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {error && (
        <div className="rounded-3xl bg-red-50 border border-red-100 p-5 flex items-start gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Failed to load content</h4>
            <p className="text-xs text-red-600/90 mt-0.5">{error}</p>
            <button 
              onClick={fetchResources}
              className="mt-3 flex items-center gap-1 text-xs font-bold underline hover:text-red-950"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Query</span>
            </button>
          </div>
        </div>
      )}

      {/* Skeletal loader state */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-3xl p-6 bg-white border border-slate-100 shadow-pf-card min-h-[220px] flex flex-col justify-between animate-pulse">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-5 w-20 bg-slate-200 rounded-full" />
                  <div className="h-5 w-5 bg-slate-200 rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />
                <div className="h-4 w-full bg-slate-200 rounded-lg" />
                <div className="h-4 w-5/6 bg-slate-200 rounded-lg" />
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between">
                <div className="h-3 w-28 bg-slate-200 rounded" />
                <div className="h-4 w-12 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        // Empty State
        <div className="rounded-3xl glass-panel-lime border border-dashed border-pf-lime-text/20 p-12 flex flex-col items-center justify-center text-center shadow-pf-card min-h-[350px]">
          <Inbox className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-xl font-bold font-display text-pf-dark">No Resources Found</h3>
          <p className="text-slate-500 text-sm max-w-sm mt-1 leading-normal font-medium">
            We couldn't find any resources matching your active filters or search terms. Try loosening your inputs.
          </p>
          {(selectedCategory || selectedType || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedType('');
                setSearchQuery('');
                setPage(1);
              }}
              className="mt-6 px-5 py-2.5 bg-pf-dark text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        // Live catalog items
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard
              key={resource._id}
              resource={resource}
              onClick={() => setSelectedResourceId(resource._id)}
            />
          ))}
        </div>
      )}

      {/* Pagination component */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200/60 pt-6 mt-4">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Showing {resources.length} of {totalCount} items
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              className={`p-2 rounded-lg border transition-all duration-200 ${
                page === 1
                  ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                  : 'border-slate-200 text-pf-dark bg-white/40 hover:bg-white'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-slate-600 px-3">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              className={`p-2 rounded-lg border transition-all duration-200 ${
                page === totalPages
                  ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                  : 'border-slate-200 text-pf-dark bg-white/40 hover:bg-white'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
