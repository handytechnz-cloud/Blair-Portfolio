
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { getArtisticStatement, getShootingAdvice } from '../services/geminiService';
import { AISuggestion } from '../types';

const AIStudio: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISuggestion | null>(null);
  const [locationQuery, setLocationQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{ text: string; sources: any[] } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (showCamera && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(s => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(err => {
          console.error("Camera error:", err);
          setShowCamera(false);
        });
    }
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [showCamera]);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImage(dataUrl);
      setShowCamera(false);
      setResult(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    const suggestion = await getArtisticStatement(image);
    setResult(suggestion);
    setLoading(false);
  };

  const findAdvice = async () => {
    if (!locationQuery) return;
    setSearchLoading(true);
    const advice = await getShootingAdvice(locationQuery);
    setSearchResult(advice);
    setSearchLoading(false);
  };

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-5xl font-black mb-4 flex items-center justify-center gap-4 text-slate-900 uppercase tracking-tighter">
          <Icons.Sparkles /> Studio AI
        </h2>
        <p className="text-slate-600 font-medium text-lg leading-relaxed">
          Harness the power of Gemini to elevate your storytelling and planning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white border border-slate-200 rounded-[3rem] p-10 flex flex-col h-full shadow-xl shadow-sky-900/5">
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-900 uppercase tracking-tight">
            <Icons.Image /> Artistic Storyteller
          </h3>
          
          <div className="flex-1 space-y-8">
            <div 
              className={`border-2 border-dashed border-slate-200 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center transition-colors hover:border-cyan-500/30 relative overflow-hidden ${image || showCamera ? 'bg-slate-900' : 'bg-sky-50'}`}
            >
              {showCamera ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-8 flex gap-4">
                    <button onClick={takePhoto} className="bg-white text-slate-900 p-4 rounded-full hover:bg-cyan-500 hover:text-white transition-all shadow-2xl">
                      <Icons.Camera />
                    </button>
                    <button onClick={() => setShowCamera(false)} className="bg-red-600 text-white p-4 rounded-full hover:bg-red-500 transition-all shadow-2xl">
                      <Icons.Close />
                    </button>
                  </div>
                </div>
              ) : image ? (
                <>
                  <img src={image} className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center gap-4">
                    <button 
                      onClick={() => setImage(null)}
                      className="bg-white/90 p-4 rounded-full text-slate-900 hover:text-red-600 transition-colors shadow-xl"
                    >
                      <Icons.Close />
                    </button>
                    <button 
                      onClick={() => setShowCamera(true)}
                      className="bg-white/90 p-4 rounded-full text-slate-900 hover:text-cyan-600 transition-colors shadow-xl"
                    >
                      <Icons.Camera />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-6 p-10 text-center">
                  <div className="flex gap-6">
                    <label className="cursor-pointer flex flex-col items-center bg-white p-8 rounded-[2rem] hover:bg-sky-100 transition-all border border-slate-100 shadow-sm">
                      <Icons.Image />
                      <span className="mt-3 text-[10px] text-slate-500 font-black uppercase tracking-widest">Upload File</span>
                      <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                    </label>
                    <button 
                      onClick={() => setShowCamera(true)}
                      className="flex flex-col items-center bg-white p-8 rounded-[2rem] hover:bg-sky-100 transition-all border border-slate-100 shadow-sm"
                    >
                      <Icons.Camera />
                      <span className="mt-3 text-[10px] text-slate-500 font-black uppercase tracking-widest">Live Capture</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Capture a quick snapshot for instant feedback</p>
                </div>
              )}
            </div>
            
            <canvas ref={canvasRef} className="hidden" />

            {image && !result && (
              <button
                onClick={analyzeImage}
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-cyan-600 text-white font-black py-5 rounded-2xl transition-all disabled:opacity-50 shadow-xl uppercase tracking-[0.2em] text-xs"
              >
                {loading ? 'Analyzing with Gemini...' : 'Generate Story'}
              </button>
            )}

            {result && (
              <div className="space-y-8 animate-fade-in bg-sky-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
                <div>
                  <h4 className="text-cyan-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Title Suggestion</h4>
                  <p className="text-3xl font-black italic text-slate-900 tracking-tight">"{result.titleSuggestion}"</p>
                </div>
                <div>
                  <h4 className="text-cyan-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Artistic Statement</h4>
                  <p className="text-slate-600 leading-relaxed italic text-base font-medium">"{result.story}"</p>
                </div>
                <div>
                  <h4 className="text-cyan-600 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Technical Insights</h4>
                  <ul className="space-y-3">
                    {result.technicalTips.map((tip, i) => (
                      <li key={i} className="text-sm text-slate-500 flex gap-3 items-start font-medium">
                        <span className="text-cyan-600 font-black">•</span> <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button 
                  onClick={() => {setImage(null); setResult(null);}} 
                  className="w-full text-[10px] text-slate-400 hover:text-slate-900 uppercase font-black tracking-[0.4em] pt-6 border-t border-slate-200"
                >
                  Clear Analysis
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[3rem] p-10 flex flex-col h-full shadow-xl shadow-sky-900/5">
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-900 uppercase tracking-tight">
            <Icons.Search /> Location Scout
          </h3>
          
          <div className="flex-1 space-y-8">
            <div className="flex gap-4">
              <input 
                type="text"
                placeholder="Where is your next shoot? (e.g. Iceland, Brooklyn)"
                className="flex-1 bg-sky-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:border-cyan-500 transition-colors font-bold text-slate-900"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && findAdvice()}
              />
              <button 
                onClick={findAdvice}
                disabled={searchLoading}
                className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-black hover:bg-cyan-600 transition-all disabled:opacity-50 shadow-xl uppercase text-xs tracking-widest"
              >
                {searchLoading ? '...' : 'Scout'}
              </button>
            </div>

            {searchResult && (
              <div className="space-y-8 animate-fade-in">
                <div className="prose prose-slate max-w-none">
                  <div className="text-base text-slate-600 whitespace-pre-wrap leading-relaxed bg-sky-50 p-8 rounded-[2.5rem] border border-slate-100 font-medium shadow-inner">
                    {searchResult.text}
                  </div>
                </div>
                {searchResult.sources.length > 0 && (
                  <div className="pt-8 border-t border-slate-200">
                    <h4 className="text-[10px] uppercase text-slate-400 mb-4 font-black tracking-[0.3em]">Grounding Sources</h4>
                    <div className="flex flex-wrap gap-3">
                      {searchResult.sources.map((chunk: any, i: number) => (
                        chunk.web && (
                          <a 
                            key={i} 
                            href={chunk.web.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] bg-white text-slate-600 px-4 py-2 rounded-full hover:bg-cyan-50 hover:text-cyan-700 transition-all border border-slate-200 font-black uppercase tracking-widest shadow-sm"
                          >
                            {chunk.web.title || 'Source'}
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {!searchResult && !searchLoading && (
              <div className="flex-1 flex items-center justify-center text-slate-400 italic font-bold text-center py-20 px-10">
                Search for a location to get <br /> tailored shooting advice from Gemini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStudio;
