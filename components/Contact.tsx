
import React from 'react';
import { Icons } from '../constants';

const Contact: React.FC = () => {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div>
            <h2 className="text-5xl font-black mb-6 text-slate-900 uppercase tracking-tighter">Let's Create <br /> Something Bold.</h2>
            <p className="text-slate-600 text-lg max-w-md font-medium">
              Available for international commissions, editorial assignments, and commercial projects.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-slate-700">
              <div className="p-4 bg-white shadow-lg rounded-2xl text-cyan-600"><Icons.Mail /></div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Email</p>
                <p className="font-bold text-slate-900">studio@luminalens.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-700">
              <div className="p-4 bg-white shadow-lg rounded-2xl text-cyan-600"><Icons.User /></div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Social</p>
                <p className="font-bold text-slate-900">@lumina_lens_studio</p>
              </div>
            </div>
          </div>
        </div>

        <form className="space-y-6 bg-white p-10 rounded-[3rem] shadow-xl shadow-sky-900/5 border border-slate-200" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Name</label>
              <input 
                type="text" 
                className="w-full bg-sky-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500 transition-colors text-slate-900 font-bold"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Email</label>
              <input 
                type="email" 
                className="w-full bg-sky-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500 transition-colors text-slate-900 font-bold"
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Inquiry Type</label>
            <div className="relative">
              <select className="w-full bg-sky-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500 transition-colors appearance-none text-slate-900 font-bold">
                <option>Commercial Project</option>
                <option>Personal Portrait</option>
                <option>Event Coverage</option>
                <option>Print Acquisition</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Message</label>
            <textarea 
              rows={5}
              className="w-full bg-sky-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500 transition-colors resize-none text-slate-900 font-medium"
              placeholder="Tell me about your vision..."
            />
          </div>
          <button className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-cyan-600 transition-all uppercase tracking-[0.2em] shadow-xl">
            Send Inquiry
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
