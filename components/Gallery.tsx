
import React, { useState } from 'react';
import { Icons } from '../constants';
import { Category, Photo, UserRole } from '../types';

interface GalleryProps {
  photos: Photo[];
  onAddPhoto: (photo: Photo) => void;
  onUpdatePhoto: (photo: Photo) => void;
  onDeletePhoto: (id: string) => void;
  onClearAll: () => void;
  userRole: UserRole;
  onInquire: (photo: Photo) => void;
}

const Gallery: React.FC<GalleryProps> = ({ photos, onAddPhoto, onUpdatePhoto, onDeletePhoto, onClearAll, userRole, onInquire }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isManageMode, setIsManageMode] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);

  const canEdit = userRole === 'ADMIN' || userRole === 'EDITOR';

  const [formData, setFormData] = useState({
    title: '',
    category: Category.GENERAL,
    description: '',
    inquiryNote: '',
    url: '',
    price: '',
    shutter: '',
    aperture: '',
    iso: '',
    lens: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setUploadError("Image is extremely large (>15MB). Consider a smaller version.");
        return;
      }

      const reader = new FileReader();
      reader.onloadstart = () => setUploadError("Processing image...");
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, url: reader.result as string }));
        setUploadError(null);
      };
      reader.onerror = () => setUploadError("Failed to read file.");
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    if (!formData.url || !formData.title) {
      setUploadError("Please provide a title and an image.");
      return;
    }

    const photo: Photo = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      url: formData.url,
      title: formData.title,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      description: formData.description,
      inquiryNote: formData.inquiryNote,
      settings: {
        shutter: formData.shutter,
        aperture: formData.aperture,
        iso: formData.iso,
        lens: formData.lens
      }
    };

    onAddPhoto(photo);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhoto || !canEdit) return;

    const updated: Photo = {
      ...selectedPhoto,
      title: formData.title,
      description: formData.description,
      inquiryNote: formData.inquiryNote,
      price: parseFloat(formData.price) || 0,
      settings: {
        shutter: formData.shutter,
        aperture: formData.aperture,
        iso: formData.iso,
        lens: formData.lens
      }
    };

    onUpdatePhoto(updated);
    setSelectedPhoto(updated);
    setShowEditModal(false);
  };

  const startEdit = () => {
    if (!selectedPhoto) return;
    setFormData({
      title: selectedPhoto.title,
      category: selectedPhoto.category as Category,
      description: selectedPhoto.description || '',
      inquiryNote: selectedPhoto.inquiryNote || '',
      url: selectedPhoto.url,
      price: selectedPhoto.price?.toString() || '',
      shutter: selectedPhoto.settings?.shutter || '',
      aperture: selectedPhoto.settings?.aperture || '',
      iso: selectedPhoto.settings?.iso || '',
      lens: selectedPhoto.settings?.lens || ''
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: Category.GENERAL,
      description: '',
      inquiryNote: '',
      url: '',
      price: '',
      shutter: '',
      aperture: '',
      iso: '',
      lens: ''
    });
  };

  const handleFinalDelete = () => {
    if (photoToDelete) {
      onDeletePhoto(photoToDelete.id);
      if (selectedPhoto?.id === photoToDelete.id) {
        setSelectedPhoto(null);
      }
      setPhotoToDelete(null);
    }
  };

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black mb-2 text-slate-900 tracking-tighter uppercase">Portfolio</h2>
          <p className="text-slate-500 font-medium">Curated visual stories and commercial works.</p>
        </div>
        
        <div className="flex flex-col items-end gap-4 w-full md:w-auto">
          {canEdit && (
            <div className="flex flex-wrap justify-end gap-2">
              <button 
                onClick={() => setIsManageMode(!isManageMode)}
                className={`px-4 py-2 rounded-lg text-sm font-black transition-all border flex items-center gap-2 ${
                  isManageMode 
                  ? 'bg-red-600 text-white border-red-600 shadow-lg' 
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icons.Close />
                {isManageMode ? 'Exit Manage Mode' : 'Manage Gallery'}
              </button>
              <button 
                onClick={() => { resetForm(); setShowAddModal(true); }}
                className="bg-slate-900 text-white px-6 py-2 rounded-lg font-black flex items-center gap-2 hover:bg-cyan-600 transition-all shadow-xl"
              >
                <Icons.Camera /> Upload Work
              </button>
            </div>
          )}
        </div>
      </div>

      {(!photos || photos.length === 0) ? (
        <div className="text-center py-32 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
          <p className="text-slate-400 mb-4 font-bold">No photos in this collection yet.</p>
          {canEdit && (
            <button onClick={() => setShowAddModal(true)} className="text-cyan-600 font-black uppercase tracking-widest text-sm underline">
              Start by uploading a photo
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {photos.map((photo) => (
            <div 
              key={photo.id}
              className={`group relative aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-xl shadow-sky-900/5 cursor-pointer transition-all duration-500 ${
                isManageMode ? 'ring-4 ring-red-500 ring-offset-4 ring-offset-sky-50 scale-95' : 'hover:scale-[1.02]'
              }`}
              onClick={() => isManageMode ? setPhotoToDelete(photo) : setSelectedPhoto(photo)}
            >
              <img 
                src={photo.url} 
                alt={photo.title}
                className={`object-cover w-full h-full transition-all duration-700 ${isManageMode ? 'grayscale opacity-40' : 'group-hover:scale-110'}`}
              />
              
              {!isManageMode && (
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{photo.title}</h3>
                </div>
              )}

              {isManageMode && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-600 text-white p-4 rounded-full shadow-2xl transform scale-125">
                    <Icons.Close />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {photoToDelete && (
        <div className="fixed inset-0 z-[500] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] w-full max-w-md p-10 relative text-center shadow-2xl animate-fade-in">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-slate-900">Archive Piece?</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">This action will permanently remove "{photoToDelete.title}" from the studio gallery.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setPhotoToDelete(null)}
                className="flex-1 bg-slate-100 text-slate-900 font-black py-5 rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
              >
                Cancel
              </button>
              <button 
                onClick={handleFinalDelete}
                className="flex-1 bg-red-600 text-white font-black py-5 rounded-2xl hover:bg-red-700 transition-all uppercase tracking-widest text-xs shadow-xl"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Publish Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[400] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-[3rem] w-full max-w-2xl p-10 relative shadow-2xl my-auto">
            <button onClick={() => setShowEditModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900">
              <Icons.Close />
            </button>
            <h3 className="text-3xl font-black mb-8 text-slate-900 uppercase tracking-tighter">Refine Details</h3>
            
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-lg border border-slate-200">
                    <img src={formData.url} className="w-full h-full object-cover" alt="Selected" />
                  </div>
                  <input 
                    type="number" 
                    placeholder="Price ($)" 
                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-cyan-500 outline-none"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="flex-[1.5] space-y-4">
                  <input 
                    required 
                    placeholder="Photo Title" 
                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-cyan-500 outline-none"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                  <textarea 
                    placeholder="Artistic Story" 
                    rows={3}
                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:border-cyan-500 outline-none resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                   <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Shutter" className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-mono" value={formData.shutter} onChange={e => setFormData({...formData, shutter: e.target.value})} />
                      <input placeholder="Aperture" className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-mono" value={formData.aperture} onChange={e => setFormData({...formData, aperture: e.target.value})} />
                      <input placeholder="ISO" className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-mono" value={formData.iso} onChange={e => setFormData({...formData, iso: e.target.value})} />
                      <input placeholder="Lens" className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-mono" value={formData.lens} onChange={e => setFormData({...formData, lens: e.target.value})} />
                   </div>
                  <textarea 
                    placeholder="Custom Inquiry Details" 
                    rows={2}
                    className="w-full bg-cyan-50 border border-cyan-100 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:border-cyan-500 outline-none resize-none"
                    value={formData.inquiryNote}
                    onChange={e => setFormData({...formData, inquiryNote: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-cyan-600 transition-all uppercase tracking-[0.2em] shadow-xl">
                Update Published Work
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedPhoto && (
        <div className="fixed inset-0 z-[200] bg-white/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 overflow-y-auto">
          <button 
            className="absolute top-8 right-8 text-slate-900 hover:text-cyan-600 transition-colors z-[210] p-2 bg-white rounded-full shadow-xl"
            onClick={() => setSelectedPhoto(null)}
          >
            <Icons.Close />
          </button>
          <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-12 items-center lg:items-start py-12">
            <div className="flex-1">
              <img src={selectedPhoto.url} className="max-h-[80vh] w-auto mx-auto rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)]" alt={selectedPhoto.title} />
            </div>
            <div className="lg:w-96 text-left space-y-8">
              <div className="flex justify-between items-start">
                <h3 className="text-5xl font-black leading-none text-slate-900 uppercase tracking-tighter">{selectedPhoto.title}</h3>
                {canEdit && (
                  <button 
                    onClick={startEdit}
                    className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-cyan-600 transition-colors shadow-lg"
                    title="Edit Piece"
                  >
                    <Icons.Sparkles />
                  </button>
                )}
              </div>
              <p className="text-slate-600 leading-relaxed font-medium text-lg">{selectedPhoto.description}</p>
              
              {selectedPhoto.inquiryNote && (
                <div className="bg-cyan-50 border border-cyan-100 p-6 rounded-2xl">
                  <p className="text-[10px] uppercase text-cyan-600 mb-2 font-black tracking-widest">Inquiry Details</p>
                  <p className="text-sm font-medium text-slate-700 italic">{selectedPhoto.inquiryNote}</p>
                </div>
              )}

              {selectedPhoto.settings && (
                <div className="grid grid-cols-2 gap-6 border-t border-slate-200 pt-8">
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 mb-1 font-black tracking-widest">Shutter</p>
                    <p className="text-sm font-bold text-slate-900 font-mono">{selectedPhoto.settings.shutter || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 mb-1 font-black tracking-widest">Aperture</p>
                    <p className="text-sm font-bold text-slate-900 font-mono">{selectedPhoto.settings.aperture || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 mb-1 font-black tracking-widest">ISO</p>
                    <p className="text-sm font-bold text-slate-900 font-mono">{selectedPhoto.settings.iso || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 mb-1 font-black tracking-widest">Lens</p>
                    <p className="text-sm font-bold text-slate-900 font-mono">{selectedPhoto.settings.lens || 'N/A'}</p>
                  </div>
                </div>
              )}
              <button 
                onClick={() => { onInquire(selectedPhoto); setSelectedPhoto(null); }}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-cyan-600 transition-all uppercase tracking-widest text-xs"
              >
                Inquire about this piece
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal (Add New) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-[3rem] w-full max-w-2xl p-10 relative shadow-2xl my-auto">
            <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900">
              <Icons.Close />
            </button>
            <h3 className="text-3xl font-black mb-8 text-slate-900 uppercase tracking-tighter">Upload New Work</h3>
            {uploadError && <p className="mb-6 text-red-500 text-xs font-black uppercase tracking-widest">{uploadError}</p>}
            
            <form onSubmit={handleAddSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="aspect-square border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center overflow-hidden bg-sky-50 relative">
                    {formData.url ? (
                      <img src={formData.url} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center">
                        <Icons.Camera />
                        <span className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">Choose Image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    )}
                  </div>
                  <input 
                    type="number" 
                    placeholder="Price (optional)" 
                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-cyan-500 outline-none"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="flex-[1.5] space-y-4">
                  <input 
                    required 
                    placeholder="Photo Title" 
                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-cyan-500 outline-none"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                  <textarea 
                    placeholder="Story or Description" 
                    rows={3}
                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:border-cyan-500 outline-none resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                  <textarea 
                    placeholder="Inquire Details" 
                    rows={2}
                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-medium border-cyan-100 focus:border-cyan-500 outline-none resize-none"
                    value={formData.inquiryNote}
                    onChange={e => setFormData({...formData, inquiryNote: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-cyan-600 transition-all uppercase tracking-[0.2em] shadow-xl">
                Publish to Portfolio
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
