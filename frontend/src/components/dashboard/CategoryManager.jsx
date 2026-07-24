import React, { useState } from 'react';
import { resourceAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash, AlertCircle, Tag, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CategoryManager({ categories, onRefresh }) {
  const { user } = useAuth();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await resourceAPI.createCategory({ name: newCategoryName.trim() });
      if (response.success) {
        setNewCategoryName('');
        onRefresh();
      }
    } catch (err) {
      setError(err.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? Resources in this category will not be deleted but will lose their filter tag.')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await resourceAPI.deleteCategory(id);
      if (response.success) {
        onRefresh();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const isSMM = user?.role?.toLowerCase() !== 'admin';

  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-pf-card p-6 flex flex-col gap-6 select-none">
      
      {/* Title */}
      <div>
        <h3 className="text-xl font-bold font-display text-pf-dark flex items-center gap-2">
          <Tag className="w-5 h-5 text-pf-lime-text" />
          <span>Category Pillars Manager</span>
        </h3>
        <p className="text-slate-500 text-xs mt-1 leading-normal font-medium">
          Add new thematic categories for Library classification, or clean up obsolete tags.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-100 p-4 flex items-start gap-2.5 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-xs font-semibold leading-normal">{error}</span>
        </div>
      )}

      {/* Creation Form */}
      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          type="text"
          placeholder="Enter category name (e.g. Scaling)"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pf-lime-text/40 focus:border-pf-lime-text font-medium text-pf-dark text-sm shadow-sm transition-all"
        />
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={loading || !newCategoryName.trim()}
          type="submit"
          className="px-5 py-3 bg-pf-dark hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-2xl text-xs font-bold transition-all duration-200 shadow-md flex items-center gap-1.5 shrink-0 disabled:cursor-not-allowed"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </>
          )}
        </motion.button>
      </form>

      {/* Category List Table */}
      <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Category Name
              </th>
              <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {categories.length === 0 ? (
              <tr>
                <td colSpan="2" className="px-5 py-8 text-center text-xs font-semibold text-slate-400">
                  No categories found. Create one using the input above.
                </td>
              </tr>
            ) : (
              categories.map((cat) => {
                const isDefault = cat.isSystemPillar || [
                  'Concept notes',
                  'Public handbooks',
                  'Our inspirations (people)',
                  'Testimonials',
                  'Concept Notes',
                  'Public Handbooks',
                  'Our Inspirations',
                  'Handbooks'
                ].includes(cat.name);

                return (
                  <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-bold text-pf-dark flex items-center gap-2">
                      <span>{cat.name}</span>
                      {isDefault && (
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 border border-slate-200 rounded text-[9px] font-bold uppercase tracking-wider">
                          System Default
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        disabled={isSMM || isDefault || loading}
                        onClick={() => handleDelete(cat._id)}
                        className={`p-2 rounded-xl transition-colors ${
                          isSMM || isDefault
                            ? 'text-slate-200 cursor-not-allowed'
                            : 'text-red-500 hover:bg-red-50 hover:text-red-600'
                        }`}
                        title={
                          isSMM 
                            ? 'Only Admins can delete categories' 
                            : isDefault 
                              ? 'System default categories cannot be deleted' 
                              : 'Delete category'
                        }
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
