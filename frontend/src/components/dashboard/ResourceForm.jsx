import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { uploadAPI } from '../../services/api';
import { X, Upload, Plus, Trash, AlertCircle, RefreshCw } from 'lucide-react';

export default function ResourceForm({ resource, categories, onClose, onSave }) {
  const isEdit = !!resource;
  const [uploadingField, setUploadingField] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm({
    defaultValues: {
      type: resource?.type || 'ConceptNote',
      title: resource?.title || '',
      description: resource?.description || '',
      category: resource?.category || '',
      pdf: resource?.pdf || '',
      thumbnail: resource?.thumbnail || '',
      author: resource?.author || '',
      readTimeMinutes: resource?.readTimeMinutes || 5,
      chapters: resource?.chapters || [],
      personName: resource?.personName || '',
      roleTitle: resource?.roleTitle || '',
      companyName: resource?.companyName || '',
      quote: resource?.quote || '',
      socialLink: resource?.socialLink || '',
      clientName: resource?.clientName || '',
      clientCompany: resource?.clientCompany || '',
      clientAvatar: resource?.clientAvatar || '',
    }
  });

  const selectedType = watch('type');
  const pdfUrl = watch('pdf');
  const thumbnailUrl = watch('thumbnail');
  const clientAvatarUrl = watch('clientAvatar');

  // Chapters field array manager for Handbooks
  const { fields: chapterFields, append: appendChapter, remove: removeChapter } = useFieldArray({
    control,
    name: 'chapters'
  });

  // Handle asynchronous PDF/Image uploads
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingField(fieldName);
    setUploadError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await uploadAPI.uploadFile(formData);
      // Support fileUrl, url, and nested response data structures
      const uploadedUrl = response?.data?.fileUrl || response?.data?.url || response?.fileUrl || response?.url || (typeof response === 'string' ? response : null);
      
      if (uploadedUrl) {
        setValue(fieldName, uploadedUrl, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      } else {
        setUploadError('File upload completed but no URL was returned.');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      const msg = err.response?.data?.message || err.message || 'File upload failed';
      setUploadError(msg);
    } finally {
      setUploadingField(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const typeToContentTypeMap = {
        'ConceptNote': 'CONCEPT_NOTE',
        'PublicHandbook': 'PUBLIC_HANDBOOK',
        'Inspiration': 'INSPIRATION',
        'Testimonial': 'TESTIMONIAL'
      };
      const contentType = typeToContentTypeMap[selectedType] || 'CONCEPT_NOTE';

      const cleanedData = { 
        type: selectedType, 
        contentType, 
        category: formData.category, 
        description: formData.description 
      };
      
      if (selectedType === 'ConceptNote') {
        cleanedData.title = formData.title;
        cleanedData.pdf = formData.pdf;
        cleanedData.author = formData.author;
      } else if (selectedType === 'PublicHandbook') {
        cleanedData.title = formData.title;
        cleanedData.pdf = formData.pdf;
        cleanedData.readTimeMinutes = Number(formData.readTimeMinutes) || 5;
        if (Array.isArray(formData.chapters)) {
          cleanedData.chapters = formData.chapters
            .map(c => (typeof c === 'string' ? c : (c.value || c.title || c.chapter || '')))
            .filter(Boolean);
        }
      } else if (selectedType === 'Inspiration') {
        cleanedData.title = formData.personName;
        cleanedData.personName = formData.personName;
        cleanedData.roleTitle = formData.roleTitle;
        cleanedData.companyName = formData.companyName;
        cleanedData.quote = formData.quote;
        cleanedData.thumbnail = formData.thumbnail;
        cleanedData.socialLink = formData.socialLink;
      } else if (selectedType === 'Testimonial') {
        cleanedData.title = formData.clientName;
        cleanedData.clientName = formData.clientName;
        cleanedData.clientCompany = formData.clientCompany;
        cleanedData.quote = formData.quote;
        cleanedData.clientAvatar = formData.clientAvatar;
      }

      await onSave(cleanedData);
    } catch (err) {
      setUploadError(err.message || 'Saving resource failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold font-display text-pf-dark">
            {isEdit ? 'Edit Resource' : 'Add New Resource'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-pf-dark hover:bg-slate-50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 flex-1 flex flex-col gap-5">
          {uploadError && (
            <div className="rounded-2xl bg-red-50 border border-red-100 p-4 flex items-start gap-2.5 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="text-xs font-semibold leading-normal">{uploadError}</span>
            </div>
          )}

          {/* Core Polymorphic Selector */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                Resource Type
              </label>
              <select
                disabled={isEdit}
                {...register('type')}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pf-lime-text/40 focus:border-pf-lime-text font-medium text-pf-dark text-sm shadow-sm transition-all"
              >
                <option value="ConceptNote">Concept Note</option>
                <option value="PublicHandbook">Public Handbook</option>
                <option value="Inspiration">Our Inspiration</option>
                <option value="Testimonial">Testimonial</option>
              </select>
            </div>

            {/* Category selector */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                Category Pillar
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pf-lime-text/40 focus:border-pf-lime-text font-medium text-pf-dark text-sm shadow-sm transition-all"
              >
                <option value="">Select Category</option>
                {(categories && categories.length > 0
                  ? categories
                  : [
                      { _id: 'cat-1', name: 'Handbooks' },
                      { _id: 'cat-2', name: 'Testimonials' },
                      { _id: 'cat-3', name: 'Inspirations' },
                      { _id: 'cat-4', name: 'Strategy' },
                      { _id: 'cat-5', name: 'General' },
                    ]
                ).map((cat) => (
                  <option key={cat._id || cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {errors.category && (
                <span className="text-[10px] font-bold text-red-600 mt-1 ml-1 block">{errors.category.message}</span>
              )}
            </div>
          </div>

          {/* Conditional Layouts based on watch('type') */}

          {/* Type A: CONCEPT NOTE / HANDBOOK Title */}
          {(selectedType === 'ConceptNote' || selectedType === 'PublicHandbook') && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                Document Title
              </label>
              <input
                type="text"
                placeholder="Enter title (e.g. Sequenced Choice Architecture)"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pf-lime-text/40 focus:border-pf-lime-text font-medium text-pf-dark text-sm shadow-sm transition-all"
              />
              {errors.title && (
                <span className="text-[10px] font-bold text-red-600 mt-1 ml-1 block">{errors.title.message}</span>
              )}
            </div>
          )}

          {/* Type B: INSPIRATION Person Details */}
          {selectedType === 'Inspiration' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    Inspired Figure Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Paul Graham"
                    {...register('personName', { required: 'Name is required' })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    Social Link
                  </label>
                  <input
                    type="text"
                    placeholder="Twitter/LinkedIn URL"
                    {...register('socialLink')}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Co-founder"
                    {...register('roleTitle')}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Y Combinator"
                    {...register('companyName')}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Type C: TESTIMONIAL Client Details */}
          {selectedType === 'Testimonial' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                  Client Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  {...register('clientName', { required: 'Client name is required' })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                  Client Company / Position
                </label>
                <input
                  type="text"
                  placeholder="e.g. CEO, Apex Tech"
                  {...register('clientCompany', { required: 'Client details are required' })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Type D: Descriptions & Quotes */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
              {(selectedType === 'Inspiration' || selectedType === 'Testimonial') ? 'Central Quote / Insight' : 'Long-form Overview Description'}
            </label>
            {selectedType === 'Inspiration' || selectedType === 'Testimonial' ? (
              <textarea
                placeholder="Enter quote here..."
                rows={3}
                {...register('quote', { required: 'Quote content is required' })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pf-lime-text/40 focus:border-pf-lime-text font-medium text-pf-dark text-sm shadow-sm transition-all"
              />
            ) : (
              <textarea
                placeholder="Enter document summary/description details..."
                rows={4}
                {...register('description', { required: 'Description is required' })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pf-lime-text/40 focus:border-pf-lime-text font-medium text-pf-dark text-sm shadow-sm transition-all"
              />
            )}
          </div>

          {/* Type E: Extra metadata fields for Handbook */}
          {selectedType === 'PublicHandbook' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    Read Time (Minutes)
                  </label>
                  <input
                    type="number"
                    {...register('readTimeMinutes')}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    Chapters List
                  </label>
                  <button
                    type="button"
                    onClick={() => appendChapter('')}
                    className="flex items-center gap-1 text-[10px] font-bold text-pf-lime-text mt-1.5 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Chapter</span>
                  </button>
                </div>
              </div>

              {chapterFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    placeholder={`Chapter ${index + 1} Title`}
                    {...register(`chapters.${index}`)}
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeChapter(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Type F: Optional fields for ConceptNote */}
          {selectedType === 'ConceptNote' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                Author Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Vikramsd"
                {...register('author')}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none"
              />
            </div>
          )}

          {/* Type G: File Uploaders */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
            {/* Document PDF Uploader (Notes / Handbooks) */}
            {(selectedType === 'ConceptNote' || selectedType === 'PublicHandbook') && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                  Document PDF Attachment
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200/80 rounded-2xl text-xs font-bold text-slate-600 cursor-pointer transition-colors shrink-0">
                    {uploadingField === 'pdf' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-pf-lime-text" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload File</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf"
                      disabled={uploadingField !== null}
                      onChange={(e) => handleFileUpload(e, 'pdf')}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="No PDF selected"
                    readOnly
                    value={pdfUrl || ''}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-semibold text-slate-700 focus:outline-none truncate"
                  />
                </div>
              </div>
            )}

            {/* Thumbnail/Avatar Image Uploader (Inspirations / Testimonials / Notes) */}
            {selectedType === 'Inspiration' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                  Inspiration Profile Image
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200/80 rounded-2xl text-xs font-bold text-slate-600 cursor-pointer transition-colors shrink-0">
                    {uploadingField === 'thumbnail' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-pf-lime-text" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload Image</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingField !== null}
                      onChange={(e) => handleFileUpload(e, 'thumbnail')}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="No image"
                    readOnly
                    value={thumbnailUrl || ''}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-semibold text-slate-700 focus:outline-none truncate"
                  />
                </div>
              </div>
            )}

            {selectedType === 'Testimonial' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                  Client Avatar Image
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200/80 rounded-2xl text-xs font-bold text-slate-600 cursor-pointer transition-colors shrink-0">
                    {uploadingField === 'clientAvatar' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-pf-lime-text" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload Image</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingField !== null}
                      onChange={(e) => handleFileUpload(e, 'clientAvatar')}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="No avatar"
                    readOnly
                    value={clientAvatarUrl || ''}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-semibold text-slate-700 focus:outline-none truncate"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Actions footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl text-xs font-bold transition-all duration-200"
            >
              Cancel
            </button>
            <button
              disabled={uploadingField !== null || submitting}
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-pf-dark hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all duration-200 shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Resource...</span>
                </>
              ) : (
                <span>Save Resource</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
