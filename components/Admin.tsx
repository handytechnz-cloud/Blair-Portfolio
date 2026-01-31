
import React, { useState } from 'react';
import { AccessKey, UserRole } from '../types';
import { Icons } from '../constants';

interface AdminProps {
  accessKeys: AccessKey[];
  onAddKey: (label: string, role: UserRole) => void;
  onRemoveKey: (id: string) => void;
}

const Admin: React.FC<AdminProps> = ({ accessKeys, onAddKey, onRemoveKey }) => {
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
    <div className="py-24 px-6 max-w-5xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl font-black mb-2 text-slate-900 uppercase tracking-tighter">Studio Access</h2>
          <p className="text-slate-500 font-medium">Manage collaborative permissions and master controls.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 text-slate-900 flex items-center gap-3 shadow-xl shadow-sky-900/5">
          <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Master Session Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl shadow-sky-900/5">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-slate-900 uppercase tracking-tight">
              <Icons.Sparkles /> Create Access
            </h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 mb-2 block tracking-widest">Staff Label</label>
                <input 
                  type="text" 
                  placeholder="e.g. Second Shooter"
                  className="w-full bg-sky-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500 transition-colors text-sm font-bold text-slate-900"
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 mb-2 block tracking-widest">Permissions</label>
                <select 
                  className="w-full bg-sky-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500 transition-colors text-sm font-bold text-slate-900 appearance-none"
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as UserRole)}
                >
                  <option value="EDITOR">Editor (Media Only)</option>
                  <option value="ADMIN">Co-Admin (Full)</option>
                </select>
              </div>
              <button 
                type="submit"
                className="w-full bg-slate-900 text-white font-black px-8 py-4 rounded-2xl hover:bg-cyan-600 transition-all shadow-xl active:scale-95 uppercase text-xs tracking-widest"
              >
                Generate Key
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-xl font-black flex items-center gap-3 text-slate-900 uppercase tracking-tight">
             Active Keys <span className="text-xs bg-slate-200 text-slate-600 px-3 py-1 rounded-full">{accessKeys.length}</span>
          </h3>
          
          {accessKeys.length === 0 ? (
            <div className="h-64 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex items-center justify-center text-slate-400 font-bold italic bg-white/50">
              No sub-access keys generated yet.
            </div>
          ) : (
            <div className="grid gap-6">
              {accessKeys.map(key => (
                <div key={key.id} className="bg-white border border-slate-200 p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6 transition-all hover:border-cyan-500/30 group shadow-xl shadow-sky-900/5">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-black text-lg text-slate-900 uppercase tracking-tight">{key.label}</h4>
                      <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] ${key.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' : 'bg-cyan-50 text-cyan-600'}`}>
                        {key.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Issued: {new Date(key.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div 
                      onClick={() => copyToClipboard(key.key, key.id)}
                      className="flex-1 md:flex-none bg-sky-50 px-6 py-4 rounded-2xl font-mono text-sm border border-slate-100 cursor-pointer group relative flex justify-between items-center gap-4 hover:border-cyan-500/50 transition-colors"
                    >
                      <span className="text-cyan-600 font-bold">{key.key}</span>
                      <div className="text-slate-400 group-hover:text-slate-900 transition-colors">
                        {copiedId === key.id ? 'COPIED' : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>}
                      </div>
                    </div>
                    <button 
                      onClick={() => confirm('Revoke this access key immediately?') && onRemoveKey(key.id)}
                      className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-4 rounded-2xl transition-all shadow-sm"
                    >
                      <Icons.Close />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
