import React, { useState, useEffect, useCallback } from 'react';
import { resourceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import ResourceForm from '../components/dashboard/ResourceForm';
import CategoryManager from '../components/dashboard/CategoryManager';
import { Plus, Edit3, Trash2, Search, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuth();
  
  // Tab control states: 'resources' | 'categories'
  const [activeTab, setActiveTab] = useState('resources');
  
  // Core lists states
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Filter/Query states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal / Form States
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  // Load categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await resourceAPI.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, []);

  // Load resources
  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 8,
        search: searchQuery || undefined,
        type: selectedType || undefined,
      };
      const response = await resourceAPI.getAll(params);
      if (response.success) {
        setResources(response.data.resources);
        setTotalPages(response.data.pagination.pages);
        setTotalCount(response.data.pagination.total);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch resources list');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedType]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (activeTab === 'resources') {
      fetchResources();
    }
  }, [activeTab, fetchResources]);

  // Handle resource deletion
  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this resource?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await resourceAPI.delete(id);
      if (response.success) {
        fetchResources();
      }
    } catch (err) {
      setError(err.message || 'Deletion failed');
    } finally {
      setLoading(false);
    }
  };

  // Open modal for creation
  const handleCreateOpen = () => {
    setEditingResource(null);
    setShowModal(true);
  };

  // Open modal for editing
  const handleEditOpen = (resource) => {
    setEditingResource(resource);
    setShowModal(true);
  };

  // Handle creation/edition save
  const handleSaveResource = async (cleanedData) => {
    try {
      let response;
      if (editingResource) {
        response = await resourceAPI.update(editingResource._id, cleanedData);
      } else {
        response = await resourceAPI.create(cleanedData);
      }

      if (response.success) {
        setShowModal(false);
        setEditingResource(null);
        fetchResources();
      }
    } catch (err) {
      throw new Error(err.message || 'Saving resource failed');
    }
  };

  const isSMM = user?.role !== 'admin';

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6 lg:py-10 z-10 flex flex-col lg:flex-row gap-8 select-none">
      {/* Left Navigation Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Right Panels workspace */}
      <div className="flex-1 min-w-0">
        
        {/* TAB 1: CATEGORY MANAGER */}
        {activeTab === 'categories' && (
          <CategoryManager categories={categories} onRefresh={fetchCategories} />
        )}

        {/* TAB 2: RESOURCES MANAGER */}
        {activeTab === 'resources' && (
          <div className="rounded-3xl bg-white border border-slate-100 shadow-pf-card p-6 flex flex-col gap-6">
            
            {/* Header controls row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-display text-pf-dark flex items-center gap-2">
                  <Layers className="w-5 h-5 text-pf-lime-text" />
                  <span>Library Resources Manager</span>
                </h3>
                <p className="text-slate-500 text-xs mt-1 leading-normal font-medium">
                  Perform search, filters, edits, and additions across your active catalog list.
                </p>
              </div>

              {/* Add Resource action */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCreateOpen}
                className="flex items-center justify-center gap-1.5 px-5 py-3 bg-pf-lime text-pf-dark border border-pf-lime-text/20 rounded-2xl text-xs font-bold shadow-pf-logo transition-transform"
              >
                <Plus className="w-4 h-4" />
                <span>Create Resource</span>
              </motion.button>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-100 p-4 flex items-start gap-2.5 text-red-700">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-xs font-semibold leading-normal">{error}</span>
              </div>
            )}

            {/* Filter controls row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Local Search input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Filter resources by title/quote..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-55 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pf-lime-text/30 focus:border-pf-lime-text font-medium text-pf-dark text-xs transition-all shadow-sm"
                />
              </div>

              {/* Type Filter Select */}
              <select
                value={selectedType}
                onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
                className="px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold text-slate-600 shadow-sm"
              >
                <option value="">All Types</option>
                <option value="ConceptNote">Concept Notes</option>
                <option value="PublicHandbook">Public Handbooks</option>
                <option value="Inspiration">Inspirations</option>
                <option value="Testimonial">Testimonials</option>
              </select>
            </div>

            {/* Main Listings Table */}
            <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Title / Quote
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[110px]">
                      Type
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[110px]">
                      Category
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right w-[120px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-5 py-12 text-center text-xs font-semibold text-slate-400">
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-pf-lime-text" />
                          <span>Loading database listings...</span>
                        </div>
                      </td>
                    </tr>
                  ) : resources.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-5 py-12 text-center text-xs font-semibold text-slate-400">
                        No resources found matching active filters.
                      </td>
                    </tr>
                  ) : (
                    resources.map((res) => (
                      <tr key={res._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5 min-w-[200px]">
                          <h4 className="text-xs font-bold text-pf-dark line-clamp-1">
                            {res.title || res.quote}
                          </h4>
                          <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">
                            Created {new Date(res.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-[10px] font-bold text-slate-500">
                          {res.type === 'ConceptNote' && 'Concept Note'}
                          {res.type === 'PublicHandbook' && 'Handbook'}
                          {res.type === 'Inspiration' && 'Inspiration'}
                          {res.type === 'Testimonial' && 'Testimonial'}
                        </td>
                        <td className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {res.category}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEditOpen(res)}
                              className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl hover:text-pf-dark transition-colors"
                              title="Edit resource"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              disabled={isSMM || loading}
                              onClick={() => handleDeleteResource(res._id)}
                              className={`p-2 rounded-xl transition-colors ${
                                isSMM
                                  ? 'text-slate-200 cursor-not-allowed'
                                  : 'text-red-500 hover:bg-red-50 hover:text-red-600'
                              }`}
                              title={isSMM ? 'SMM accounts are not authorized to delete resources' : 'Delete resource'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Showing {resources.length} of {totalCount} items
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <span className="text-[10px] font-bold text-slate-500 px-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* CRUD Creation Modal overlay */}
      {showModal && (
        <ResourceForm
          resource={editingResource}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSave={handleSaveResource}
        />
      )}

    </div>
  );
}
