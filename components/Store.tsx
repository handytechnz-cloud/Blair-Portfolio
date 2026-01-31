
import React from 'react';
import { Photo } from '../types';

interface StoreProps {
  photos: Photo[];
}

const Store: React.FC<StoreProps> = ({ photos }) => {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="text-5xl font-black mb-4 text-slate-900 uppercase tracking-tighter">Print Store</h2>
        <p className="text-slate-600 max-w-2xl font-medium text-lg leading-relaxed">
          Bring a piece of the Blair collection into your space. All prints are produced on museum-quality archival paper with custom framing options available.
        </p>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-sky-900/5">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No items currently for sale.</p>
          <p className="text-slate-300 text-xs mt-2">Add photos with a price in the Gallery to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {photos.map((photo) => (
            <div key={photo.id} className="group">
              <div className="aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-white mb-8 shadow-2xl shadow-sky-900/10 border-8 border-white">
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start mb-6 px-2">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{photo.title}</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black">{photo.category}</p>
                </div>
                <p className="text-2xl font-black text-cyan-600 font-mono">${photo.price?.toFixed(2)}</p>
              </div>
              <button className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-cyan-600 transition-all uppercase text-xs tracking-[0.2em] shadow-xl">
                Buy Limited Print
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Store;
