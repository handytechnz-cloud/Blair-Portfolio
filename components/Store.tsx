
import React from 'react';
import { Photo } from '../types';
import { ThemeType } from '../App';

interface StoreProps {
  photos: Photo[];
  onInquire: (photo: Photo) => void;
  activeTheme: ThemeType;
}

const Store: React.FC<StoreProps> = ({ photos, onInquire, activeTheme }) => {
  const isRainbowActive = activeTheme === 'rainbow';
  const isGoldActive = activeTheme === 'gold';

  const handleDownload = (photo: Photo) => {
    window.open(photo.url, '_blank');
  };

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black mb-4 text-slate-800 uppercase tracking-tighter">Print Store</h2>
          <p className="text-slate-600 max-w-2xl font-medium text-lg leading-relaxed">
            Museum-quality archival paper. Hand-inspected and signed by Blair.
          </p>
        </div>
        {isRainbowActive && <div className="bg-red-600 text-white px-8 py-4 rounded-[2rem] shadow-2xl animate-pulse font-black italic">RAINBOW SALE: 20% OFF</div>}
        {isGoldActive && (
          <div className="bg-amber-600 text-white px-8 py-4 rounded-[2rem] shadow-2xl animate-bounce border-4 border-yellow-300">
            <span className="text-xl font-black italic tracking-tighter block uppercase">Shiny Gold Event</span>
            <span className="text-[10px] font-black uppercase tracking-widest">CAP AT $10 | &lt;$3 IS FREE</span>
          </div>
        )}
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[3rem] border border-amber-50 shadow-xl shadow-sky-900/5">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No items currently listed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {photos.map((photo) => {
            const originalPrice = photo.price || 0;
            let finalPrice = originalPrice;
            if (isRainbowActive) finalPrice = originalPrice * 0.8;
            else if (isGoldActive) {
              if (originalPrice < 3) finalPrice = 0;
              else if (originalPrice > 30) finalPrice = 10;
              else finalPrice = originalPrice * 0.7;
            }
            const isFree = finalPrice === 0;
            return (
              <div key={photo.id} className="group">
                <div className={`aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-white mb-8 shadow-2xl shadow-sky-900/5 border-8 ${isGoldActive ? 'border-amber-400' : 'border-white'} transition-all`}>
                  <img src={photo.url} alt={photo.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex justify-between items-start mb-6 px-2">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{photo.title}</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black">{photo.category}</p>
                  </div>
                  <div className="text-right">
                    {(isRainbowActive || isGoldActive) && !isFree && <p className="text-xs text-red-500 font-black line-through opacity-60">${originalPrice.toFixed(2)}</p>}
                    <p className={`text-2xl font-black ${isFree ? 'text-amber-500' : 'text-slate-800'} tracking-tighter`}>{isFree ? 'FREE' : `$${finalPrice.toFixed(2)}`}</p>
                  </div>
                </div>
                <button onClick={() => isFree ? handleDownload(photo) : onInquire(photo)} className={`w-full font-black py-4 rounded-2xl transition-all uppercase text-xs tracking-[0.2em] shadow-xl ${isFree ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}>{isFree ? 'Get Free Piece' : 'Acquire Print'}</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Store;
