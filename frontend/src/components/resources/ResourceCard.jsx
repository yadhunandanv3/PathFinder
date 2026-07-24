import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, BookOpen, User, Quote, Download, Clock, ExternalLink } from 'lucide-react';
import { resourceAPI } from '../../services/api';

export default function ResourceCard({ resource, onClick }) {
  const [downloadCount, setDownloadCount] = useState(resource.downloadCount || 0);
  const { type: propType, contentType, title, description, category, thumbnail: propThumbnail, pdf: propPdf, author, createdAt } = resource;

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

  const type = propType || typeMap[contentType] || contentType;
  const pdf = propPdf || resource.image || '';
  const thumbnail = propThumbnail || resource.image || '';
  const clientAvatar = resource.clientAvatar || resource.image || '';

  const handlePdfDownload = async (e, fileData, filename) => {
    if (e) e.stopPropagation();
    if (!fileData) return;

    // Trigger download count increment on server in background
    try {
      await resourceAPI.getById(resource._id, { download: 'true' });
      setDownloadCount(prev => prev + 1);
    } catch (err) {
      console.error('Failed to log card download:', err);
    }

    try {
      if (fileData.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = fileData;
        link.download = filename || 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(fileData, '_blank');
      }
    } catch (err) {
      console.error('PDF download error:', err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // 1. Concept Note Card Render
  if (type === 'ConceptNote') {
    return (
      <motion.div
        layout
        whileHover={{ y: -6 }}
        className="rounded-3xl p-6 bg-white border border-slate-100 shadow-pf-card flex flex-col justify-between min-h-[220px] transition-shadow duration-300 hover:shadow-xl"
      >
        <div>
          {/* Header Tag */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold px-3 py-1 bg-pf-lime/40 text-pf-lime-text rounded-full uppercase tracking-wider">
              {category}
            </span>
            <FileText className="w-5 h-5 text-pf-lime-text opacity-70" />
          </div>

          {/* Details */}
          <h3 className="text-xl font-bold font-display text-pf-dark tracking-tight leading-tight mb-2 hover:underline cursor-pointer" onClick={onClick}>
            {title}
          </h3>
          <p className="text-slate-500 text-sm leading-normal font-medium line-clamp-3 mb-4">
            {description}
          </p>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
          <div className="text-[11px] text-slate-400 font-semibold">
            {author ? `By ${author}` : 'Concept Note'} • {formatDate(createdAt)}
          </div>
          {pdf && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handlePdfDownload(e, pdf, `${title || 'document'}.pdf`)}
              className="flex items-center gap-1 text-xs font-bold text-pf-lime-text hover:text-pf-dark transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  }

  // 2. Public Handbook Card Render
  if (type === 'PublicHandbook') {
    return (
      <motion.div
        layout
        whileHover={{ y: -6 }}
        className="rounded-3xl p-6 bg-white border border-slate-100 shadow-pf-card flex flex-col justify-between min-h-[240px] transition-shadow duration-300 hover:shadow-xl"
      >
        <div>
          {/* Header Tag */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full uppercase tracking-wider">
              {category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{resource.readTimeMinutes || 5} min read</span>
            </div>
          </div>

          {/* Details */}
          <h3 className="text-xl font-bold font-display text-pf-dark tracking-tight leading-tight mb-2 hover:underline cursor-pointer" onClick={onClick}>
            {title}
          </h3>
          <p className="text-slate-500 text-sm leading-normal font-medium line-clamp-3 mb-4">
            {description}
          </p>
        </div>

        {/* Chapters preview */}
        {resource.chapters && resource.chapters.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {resource.chapters.slice(0, 3).map((ch, idx) => (
              <span key={idx} className="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md font-semibold truncate max-w-[100px]">
                {ch}
              </span>
            ))}
            {resource.chapters.length > 3 && (
              <span className="text-[9px] text-slate-400 font-semibold align-center">+{resource.chapters.length - 3} more</span>
            )}
          </div>
        )}

        {/* Action Footers */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
          <div className="text-[11px] text-slate-400 font-semibold">
            {formatDate(createdAt)}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClick}
              className="text-xs font-bold text-pf-dark hover:text-pf-lime-text transition-colors duration-200"
            >
              Read online
            </button>
            {pdf && (
              <button
                onClick={(e) => handlePdfDownload(e, pdf, `${title || 'handbook'}.pdf`)}
                className="flex items-center gap-1 text-xs font-bold text-pf-lime-text hover:text-pf-dark transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // 3. Inspiration Card Render (Staggered quote profile)
  if (type === 'Inspiration') {
    return (
      <motion.div
        layout
        whileHover={{ y: -6 }}
        className="rounded-3xl p-6 bg-[#FCFDFE] border border-slate-100 shadow-pf-card flex flex-col justify-between min-h-[220px] transition-shadow duration-300 hover:shadow-xl relative overflow-hidden"
      >
        {/* Subtle decorative background quote mark */}
        <Quote className="absolute right-4 top-2 w-28 h-28 text-slate-100/50 pointer-events-none z-0" />

        <div className="relative z-10">
          {/* Header Tag */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full uppercase tracking-wider">
              {category}
            </span>
            <User className="w-5 h-5 text-slate-400" />
          </div>

          {/* Quote Block */}
          <blockquote className="font-serif italic text-base text-pf-dark/95 leading-relaxed tracking-wide mb-6">
            "{resource.quote || description}"
          </blockquote>
        </div>

        {/* Profile Card Footer */}
        <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mt-auto relative z-10">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center border border-slate-100">
            {thumbnail ? (
              <img src={thumbnail} alt={resource.personName} loading="lazy" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-slate-500 font-display">
                {resource.personName ? resource.personName.charAt(0) : 'I'}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-pf-dark truncate">{resource.personName}</h4>
            <p className="text-[11px] text-slate-500 font-semibold truncate">
              {resource.roleTitle && `${resource.roleTitle}`}
              {resource.companyName && ` at ${resource.companyName}`}
            </p>
          </div>
          {resource.socialLink && (
            <a 
              href={resource.socialLink}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-slate-400 hover:text-pf-lime-text transition-colors p-1"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </motion.div>
    );
  }

  // 4. Testimonial Card Render (Bubble quote style)
  if (type === 'Testimonial') {
    return (
      <motion.div
        layout
        whileHover={{ y: -6 }}
        className="rounded-3xl p-6 bg-slate-50 border border-slate-100 shadow-pf-card flex flex-col justify-between min-h-[200px] transition-shadow duration-300 hover:shadow-xl"
      >
        <div>
          {/* Tag */}
          <span className="text-[10px] font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full uppercase tracking-wider mb-4 inline-block">
            {category}
          </span>

          {/* Testimonial Quote */}
          <p className="text-slate-600 text-sm leading-relaxed font-semibold italic mb-6">
            "{resource.quote || description}"
          </p>
        </div>

        {/* Client Footer */}
        <div className="flex items-center gap-3 border-t border-slate-200/50 pt-4 mt-auto">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
            {clientAvatar ? (
              <img src={clientAvatar} alt={resource.clientName} loading="lazy" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-slate-500">
                {resource.clientName ? resource.clientName.charAt(0) : 'T'}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-pf-dark truncate">{resource.clientName}</h4>
            <p className="text-[11px] text-slate-400 font-semibold truncate">
              {resource.clientCompany}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}
