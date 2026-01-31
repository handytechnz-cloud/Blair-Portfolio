
import React, { useState } from 'react';
import { AccessKey, UserRole, Inquiry } from '../types';
import { Icons } from '../constants';
import { ThemeType } from '../App';

interface AdminProps {
  accessKeys: AccessKey[];
  inquiries: Inquiry[];
  onAddKey: (label: string, role: UserRole) => void;
  onRemoveKey: (id: string) => void;
  onDeleteInquiry: (id: string) => void;
  onPublishAtmosphere: (theme: ThemeType) => void;
}

const Admin: React.FC<AdminProps> = ({ accessKeys, inquiries, onAddKey, onRemoveKey, onDeleteInquiry, onPublishAtmosphere }) => {
  const [activeTab, setActiveTab] = useState<'keys' | 'inbox' | 'system'>('inbox');
  const [newLabel, setNewLabel] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('EDITOR');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel) return;
    onAddKey(newLabel, newRole);
    setNewLabel('');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="py-24 px-6 max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black mb-2 text-slate-900 uppercase tracking-tighter">Control Center</h2>
          <p className="text-slate-500 font-medium">Manage studio security and server-wide aesthetics.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xl shadow-sky-900/5">
          <button onClick={() => setActiveTab('inbox')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'inbox' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}>Studio Inbox</button>
          <button onClick={() => setActiveTab('keys')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'keys' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}>Access Keys</button>
          <button onClick={() => setActiveTab('system')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'system' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}>Broadcast</button>
        </div>
      </div>

      {activeTab === 'system' && (
        <div className="animate-fade-in space-y-12">
          <div className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-2xl">
             <div className="max-w-xl">
               <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Aesthetic Overlord</h3>
               <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                 As an Admin, you can broadcast a specific atmosphere to every single visitor on the server. This state lasts for 3 minutes and automatically triggers global events.
               </p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 border-2 border-red-500/30 rounded-[2rem] bg-red-50 relative overflow-hidden group">
                     <div className="absolute inset-0 theme-rainbow opacity-20 pointer-events-none" />
                     <h4 className="text-xl font-black text-red-600 uppercase tracking-tight relative mb-2">Rainbow Burst</h4>
                     <p className="text-xs text-red-500 font-bold relative mb-6">Triggers 20% OFF sale across the store for 3 minutes.</p>
                     <button 
                        onClick={() => onPublishAtmosphere('rainbow')}
                        className="relative w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform"
                     >
                        Broadcast Rainbow
                     </button>
                  </div>

                  <div className="p-8 border-2 border-amber-500/30 rounded-[2rem] bg-amber-50 relative overflow-hidden group">
                     <div className="absolute inset-0 theme-gold opacity-20 pointer-events-none" />
                     <h4 className="text-xl font-black text-amber-600 uppercase tracking-tight relative mb-2">Shiny Gold</h4>
                     {/* Fix: Escaped < to prevent it being treated as a JSX tag start */}
                     <p className="text-xs text-amber-600 font-bold relative mb-6">$10 Cap for >$30, {"<"}$3 is FREE, others 30% OFF.</p>
                     <button 
                        onClick={() => onPublishAtmosphere('gold')}
                        className="relative w-full bg-amber-600 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform"
                     >
                        Broadcast Gold
                     </button>
                  </div>

                  <div className="p-8 border-2 border-slate-900/30 rounded-[2rem] bg-slate-50 relative group">
                     <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight relative mb-2">Obsidian Dark</h4>
                     <p className="text-xs text-slate-500 font-bold relative mb-6">Sets all visitors to Obsidian Black theme for maximum contrast.</p>
                     <button 
                        onClick={() => onPublishAtmosphere('black')}
                        className="relative w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform"
                     >
                        Broadcast Dark
                     </button>
                  </div>
               </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'inbox' && (
        <div className="grid gap-6 animate-fade-in">
           {inquiries.length === 0 ? (
             <div className="py-32 border-2 border-dashed border-slate-200 rounded-[3rem] text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Inbox Empty</div>
           ) : (
             inquiries.map(inquiry => (
               <div key={inquiry.id} className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-xl shadow-sky-900/5 flex flex-col md:flex-row justify-between gap-8">
                 <div className="flex-1 space-y-4">
                    <span className="bg-sky-50 text-cyan-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-100">{inquiry.type}</span>
                    <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{inquiry.name}</h4>
                    <p className="text-slate-700 leading-relaxed font-medium italic">"{inquiry.message}"</p>
                 </div>
                 <button onClick={() => onDeleteInquiry(inquiry.id)} className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest h-fit">Archive</button>
               </div>
             ))
           )}
        </div>
      )}
      
      {activeTab === 'keys' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fade-in">
          <div className="lg:col-span-1">
             <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl space-y-6">
                <input type="text" placeholder="Staff Label" className="w-full bg-sky-50 p-4 rounded-xl font-bold" value={newLabel} onChange={e => setNewLabel(e.target.value)} />
                <button type="submit" className="w-full bg-slate-900 text-white p-4 rounded-xl font-black uppercase text-xs tracking-widest">Generate Key</button>
             </form>
          </div>
          <div className="lg:col-span-2 space-y-6">
             {accessKeys.map(key => (
               <div key={key.id} className="bg-white border border-slate-200 p-8 rounded-[2rem] flex justify-between items-center shadow-lg">
                 <div>
                    <h4 className="font-black text-slate-900 uppercase">{key.label}</h4>
                    <p className="text-cyan-600 font-mono text-sm">{key.key}</p>
                 </div>
                 <button onClick={() => onRemoveKey(key.id)} className="bg-red-50 text-red-600 p-3 rounded-xl"><Icons.Close /></button>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
