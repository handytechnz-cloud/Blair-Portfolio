
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { AboutContent, UserRole } from '../types';

interface AboutProps {
  content: AboutContent;
  onUpdate: (newContent: AboutContent) => void;
  userRole: UserRole;
}

const About: React.FC<AboutProps> = ({ content, onUpdate, userRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState<AboutContent>(content);
  const canEdit = userRole === 'ADMIN' || userRole === 'EDITOR';

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handlePublish = () => {
    onUpdate(localContent);
    setIsEditing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updatePhilosophy = (index: number, field: 'title' | 'description', value: string) => {
    const newPhil = [...localContent.philosophy];
    newPhil[index] = { ...newPhil[index], [field]: value };
    setLocalContent({ ...localContent, philosophy: newPhil });
  };

  if (isEditing) {
    return (
      <div className="py-24 px-6 max-w-7xl mx-auto space-y-12 animate-fade-in bg-white/80 rounded-[3rem] border border-slate-200 my-10 shadow-2xl backdrop-blur-md">
        <div className="flex justify-between items-center border-b border-slate-100 pb-8">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter">Profile Editor</h2>
            <p className="text-sm font-medium">Update your public identity. Press Publish when ready.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setIsEditing(false)} className="px-8 py-4 rounded-2xl bg-slate-100 text-sm font-black uppercase tracking-widest">Cancel</button>
            <button onClick={handlePublish} className="px-10 py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest shadow-2xl">Publish</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h3 className="text-xl font-black border-l-4 border-cyan-500 pl-4 uppercase tracking-widest">Main Details</h3>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-black tracking-widest">Profile Image (URL)</label>
              <input type="text" className="w-full bg-sky-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-mono focus:border-cyan-500 outline-none" value={localContent.imageUrl} onChange={e => setLocalContent({...localContent, imageUrl: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-black tracking-widest">Your Name</label>
                   <input type="text" className="w-full bg-sky-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:border-cyan-500 outline-none font-bold" value={localContent.name} onChange={e => setLocalContent({...localContent, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-black tracking-widest">Tagline</label>
                   <input type="text" className="w-full bg-sky-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:border-cyan-500 outline-none font-bold" value={localContent.roleLabel} onChange={e => setLocalContent({...localContent, roleLabel: e.target.value})} />
                </div>
              </div>
              
              <label className="text-[10px] uppercase font-black tracking-widest block pt-4">Main Headline</label>
              <input type="text" className="w-full bg-sky-50 border border-slate-200 rounded-2xl px-6 py-4 text-xl font-black focus:border-cyan-500 outline-none" value={localContent.introHeading} onChange={e => setLocalContent({...localContent, introHeading: e.target.value})} />
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-black border-l-4 border-cyan-500 pl-4 uppercase tracking-widest">Biography</h3>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-black tracking-widest block">Intro Paragraph</label>
              <textarea rows={5} className="w-full bg-sky-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium leading-relaxed focus:border-cyan-500 outline-none resize-none" value={localContent.introDescription1} onChange={e => setLocalContent({...localContent, introDescription1: e.target.value})} />
              
              <label className="text-[10px] uppercase font-black tracking-widest block">Closing Statement</label>
              <textarea rows={5} className="w-full bg-sky-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium leading-relaxed focus:border-cyan-500 outline-none resize-none" value={localContent.introDescription2} onChange={e => setLocalContent({...localContent, introDescription2: e.target.value})} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto space-y-32">
      {canEdit && (
        <div className="flex justify-center mb-16">
          <button onClick={() => setIsEditing(true)} className="group bg-slate-900 text-white px-16 py-6 rounded-full font-black uppercase tracking-[0.3em] text-sm hover:bg-cyan-600 transition-all flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            <Icons.Sparkles /> Edit Portfolio Profile
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="relative aspect-[3/4] rounded-[4rem] overflow-hidden group shadow-[0_50px_100px_rgba(15,23,42,0.1)] border-8 border-white">
           <img src={content.imageUrl} className="w-full h-full object-cover transition-all duration-1000" alt="Portrait" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
           <div className="absolute bottom-16 left-16">
              <h2 className="text-6xl font-black uppercase tracking-tighter leading-none mb-2">{content.name}</h2>
              <p className="font-mono tracking-[0.5em] uppercase text-xs font-bold">{content.roleLabel}</p>
           </div>
        </div>

        <div className="space-y-12">
           <div className="inline-block px-6 py-2 rounded-full border border-cyan-500/30 font-black text-[10px] uppercase tracking-[0.5em] bg-cyan-50">Visionary Statement</div>
           <h2 className="text-7xl font-black tracking-tighter leading-[0.85]">{content.introHeading}</h2>
           <div className="space-y-8 text-xl font-medium leading-relaxed">
              <p>{content.introDescription1}</p>
              <p className="italic border-l-4 border-slate-200 pl-10">{content.introDescription2}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {content.philosophy.map((p, i) => (
          <div key={i} className="bg-white p-12 rounded-[3rem] border border-slate-200 hover:border-cyan-500/50 transition-all group shadow-xl shadow-sky-900/5">
             <div className="mb-8 transform group-hover:scale-110 transition-transform duration-500">
               {i === 0 ? <Icons.Image /> : i === 1 ? <Icons.Camera /> : <Icons.User />}
             </div>
             <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{p.title}</h3>
             <p className="text-sm leading-relaxed font-medium">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
