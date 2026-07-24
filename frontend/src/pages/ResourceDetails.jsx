import React, { useState, useEffect } from 'react';
import { resourceAPI } from '../services/api';
import { ArrowLeft, Clock, Download, FileText, User, Quote, Calendar, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResourceDetails({ resourceId, onBack }) {
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const typeMap = {
    'CONCEPT_NOTE': 'ConceptNote',
    'PUBLIC_HANDBOOK': 'PublicHandbook',
    'INSPIRATION': 'Inspiration',
    'TESTIMONIAL': 'Testimonial',
    'ConceptNote': 'ConceptNote',
    'PublicHandbook': 'PublicHandbook',
    'Inspiration': 'Inspiration',
    'Testimonial': 'Testimonial'
  };

  const type = resource ? (resource.type || typeMap[resource.contentType] || resource.contentType) : '';
  const pdf = resource ? (resource.pdf || resource.image || '') : '';
  const thumbnail = resource ? (resource.thumbnail || resource.image || '') : '';
  const clientAvatar = resource ? (resource.clientAvatar || resource.image || '') : '';

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await resourceAPI.getById(resourceId);
        if (response.success) {
          setResource(response.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load resource details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [resourceId]);

  // Handle PDF download audit logging
  const handleDownload = async () => {
    if (!resource || !resource.pdf) return;
    
    // Trigger download count increment on server (ConceptNote only)
    if (type === 'ConceptNote') {
      try {
        const response = await resourceAPI.getById(resourceId, { download: 'true' });
        if (response.success) {
          setResource(prev => ({ ...prev, downloadCount: response.data.downloadCount }));
        }
      } catch (err) {
        console.error('Failed to log download:', err);
      }
    }
    
    // Open file in new tab
    window.open(pdf, '_blank');
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto px-6 py-12 flex flex-col gap-6 animate-pulse select-none z-10">
        <div className="h-6 w-24 bg-slate-200 rounded" />
        <div className="h-12 w-3/4 bg-slate-200 rounded-lg" />
        <div className="h-4 w-1/2 bg-slate-200 rounded" />
        <div className="h-64 w-full bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="w-full max-w-3xl mx-auto px-6 py-12 text-center select-none z-10">
        <h3 className="text-xl font-bold text-red-600">Error loading details</h3>
        <p className="text-slate-500 text-sm mt-1">{error || 'Resource not found'}</p>
        <button onClick={onBack} className="mt-6 flex items-center gap-1 text-xs font-bold text-pf-dark hover:underline mx-auto">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full max-w-4xl mx-auto px-6 py-8 z-10 select-none"
    >
      {/* Back button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-pf-dark transition-colors duration-200 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Library</span>
      </button>

      {/* Main card panel */}
      <div className="rounded-3xl glass-panel-lime p-8 border border-pf-lime-text/25 shadow-pf-card">
        
        {/* Polymorphic Layout 1: CONCEPT NOTE */}
        {type === 'ConceptNote' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-start gap-4">
              <span className="text-[10px] font-bold px-3 py-1 bg-pf-lime text-pf-lime-text border border-pf-lime-text/10 rounded-full uppercase tracking-wider">
                {resource.category}
              </span>
              <FileText className="w-6 h-6 text-pf-lime-text opacity-70" />
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-pf-dark tracking-tight leading-tight">
              {resource.title}
            </h1>

            <div className="flex items-center gap-6 text-xs text-slate-400 font-bold border-b border-slate-100 pb-4">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {resource.author || 'Pathfinder'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(resource.createdAt)}
              </span>
            </div>

            <div className="text-slate-600 text-sm leading-relaxed font-medium space-y-4 pt-2">
              <p>{resource.description}</p>
            </div>

            {pdf && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6 mt-4">
                <span className="text-xs text-slate-400 font-bold">
                  PDF downloaded {resource.downloadCount || 0} times.
                </span>
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-pf-dark hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all duration-200 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Concept Note (PDF)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Polymorphic Layout 2: PUBLIC HANDBOOK */}
        {type === 'PublicHandbook' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full uppercase tracking-wider">
                {resource.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                <Clock className="w-4 h-4" />
                <span>{resource.readTimeMinutes || 5} min read</span>
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-pf-dark tracking-tight leading-tight">
              {resource.title}
            </h1>

            <div className="flex flex-col md:flex-row gap-8 pt-4">
              {/* Left Column: Chapters / Contents */}
              {resource.chapters && resource.chapters.length > 0 && (
                <div className="w-full md:w-[240px] shrink-0 bg-slate-50 border border-slate-150 p-5 rounded-2xl h-fit">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Table of Contents
                  </h4>
                  <ul className="space-y-2">
                    {resource.chapters.map((ch, idx) => (
                      <li key={idx} className="text-xs font-bold text-slate-600 flex items-start gap-2">
                        <span className="text-pf-lime-text font-black">{idx + 1}.</span>
                        <span className="hover:underline cursor-pointer">{ch}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Right Column: Description & download */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="text-slate-600 text-sm leading-relaxed font-medium space-y-4">
                  <p>{resource.description}</p>
                </div>

                {pdf && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 self-start px-6 py-3 bg-pf-dark hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all duration-200 shadow-md w-full sm:w-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Handbook PDF</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Polymorphic Layout 3: INSPIRATION */}
        {type === 'Inspiration' && (
          <div className="flex flex-col gap-6 relative overflow-hidden">
            <Quote className="absolute right-4 top-2 w-36 h-36 text-slate-100/50 pointer-events-none z-0" />
            
            <div className="relative z-10 flex flex-col gap-6">
              <span className="self-start text-[10px] font-bold px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full uppercase tracking-wider">
                {resource.category}
              </span>

              {/* Central Quote Header */}
              <blockquote className="font-serif italic text-2xl lg:text-3xl text-pf-dark/95 leading-relaxed tracking-wide border-l-4 border-pf-lime pl-4 mb-2">
                "{resource.quote || resource.description}"
              </blockquote>

              <div className="flex items-center gap-4 border-y border-slate-100 py-4 my-2">
                <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-100">
                  {thumbnail && (
                    <img src={thumbnail} alt={resource.personName} loading="lazy" className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-pf-dark leading-tight">{resource.personName}</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    {resource.roleTitle && `${resource.roleTitle}`}
                    {resource.companyName && ` at ${resource.companyName}`}
                  </p>
                </div>
                {resource.socialLink && (
                  <a 
                    href={resource.socialLink}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto text-slate-400 hover:text-pf-lime-text p-2 border border-slate-200 rounded-xl"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="text-slate-600 text-sm leading-relaxed font-medium">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Biography & Insight</h4>
                <p>{resource.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Polymorphic Layout 4: TESTIMONIAL */}
        {type === 'Testimonial' && (
          <div className="flex flex-col gap-6 text-center max-w-2xl mx-auto pt-4">
            <span className="self-center text-[10px] font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full uppercase tracking-wider mb-2">
              {resource.category}
            </span>

            {/* Testimonial Quote Bubble */}
            <p className="font-serif italic text-xl lg:text-2xl text-pf-dark/95 leading-relaxed tracking-wide">
              "{resource.quote || resource.description}"
            </p>

            {/* Profile Avatar Card */}
            <div className="flex flex-col items-center gap-2 border-t border-slate-200/50 pt-6 mt-4">
              <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-100 mb-2">
                {clientAvatar && (
                  <img src={clientAvatar} alt={resource.clientName} loading="lazy" className="w-full h-full object-cover" />
                )}
              </div>
              <h4 className="text-base font-bold text-pf-dark leading-tight">{resource.clientName}</h4>
              <p className="text-xs text-slate-400 font-semibold">
                {resource.clientCompany}
              </p>
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
