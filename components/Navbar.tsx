
import React, { useState } from 'react';
import { Icons } from '../constants';
import { UserRole } from '../types';

interface NavbarProps {
  onNavClick: (view: 'gallery' | 'about' | 'contact' | 'store' | 'qa' | 'admin') => void;
  activeView: string;
  userRole: UserRole;
  userName: string;
  onSignOut: () => void;
  onSignInClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick, activeView, userRole, userName, onSignOut, onSignInClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'gallery' | 'about' | 'contact' | 'store' | 'qa' | 'admin') => {
    onNavClick(view);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'gallery', label: 'Gallery' },
    { id: 'store', label: 'Buy Prints', isSpecial: true },
    { id: 'qa', label: 'Q&A' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/70 backdrop-blur-lg border-b border-slate-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group z-[150]"
          onClick={() => handleNavClick('gallery')}
        >
          <div className="text-slate-900 group-hover:scale-110 transition-transform">
            <Icons.Camera />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase text-slate-900">BLAIR</span>
        </div>
        
        {/* Desktop Links (Hidden on small and medium screens) */}
        <div className="hidden lg:flex gap-8 items-center text-sm font-medium tracking-wide">
          {navLinks.map(link => (
            <button 
              key={link.id}
              onClick={() => handleNavClick(link.id as any)}
              className={`${activeView === link.id ? (link.isSpecial ? 'text-cyan-600' : 'text-slate-900') : 'text-slate-500 hover:text-slate-900'} transition-colors uppercase font-bold`}
            >
              {link.label}
            </button>
          ))}
          
          {userRole === 'ADMIN' && (
            <button 
              onClick={() => handleNavClick('admin')}
              className={`${activeView === 'admin' ? 'text-purple-600' : 'text-slate-500 hover:text-slate-900'} transition-colors uppercase flex items-center gap-1.5 font-black`}
            >
              Access Control
            </button>
          )}

          <div className="h-4 w-px bg-slate-200 mx-2" />

          {userRole !== 'GUEST' ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest leading-none mb-1 font-bold">Session</span>
                <span className="text-xs text-cyan-600 font-black">{userName}</span>
              </div>
              <button 
                onClick={onSignOut}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-tighter transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={onSignInClick}
              className="border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-4 py-1.5 rounded-full text-xs uppercase font-black tracking-widest transition-all"
            >
              Owner Login
            </button>
          )}
        </div>

        {/* Mobile Toggle Button (Visible when window is not full screen / small) */}
        <button 
          className="lg:hidden text-slate-900 z-[150] p-3 hover:bg-slate-100 rounded-full transition-all active:scale-90"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <Icons.Close />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`
        fixed inset-0 bg-white/95 backdrop-blur-3xl z-[140] transition-all duration-500 ease-in-out lg:hidden
        ${isMobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto visible' : 'opacity-0 -translate-y-full pointer-events-none invisible'}
      `}>
        <div className="flex flex-col h-full items-center justify-center p-12 space-y-10">
          <div className="flex flex-col items-center gap-8 w-full">
            {navLinks.map((link, idx) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id as any)}
                className={`
                  text-3xl font-black uppercase tracking-[0.25em] transition-all duration-300
                  ${activeView === link.id ? (link.isSpecial ? 'text-cyan-600' : 'text-slate-900') : 'text-slate-400 hover:text-slate-900'}
                `}
                style={{ transitionDelay: `${idx * 75}ms` }}
              >
                {link.label}
              </button>
            ))}

            {userRole === 'ADMIN' && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`text-2xl font-black uppercase tracking-[0.2em] ${activeView === 'admin' ? 'text-purple-600' : 'text-slate-400 hover:text-slate-900'}`}
              >
                Access Control
              </button>
            )}
          </div>

          <div className="w-32 h-1 bg-cyan-600/20 rounded-full" />

          <div className="flex flex-col items-center gap-6 pt-4 w-full max-w-xs">
            {userRole !== 'GUEST' ? (
              <>
                <div className="text-center">
                   <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-bold">Authenticated as</p>
                   <p className="text-2xl text-cyan-600 font-black uppercase">{userName}</p>
                </div>
                <button 
                  onClick={() => { onSignOut(); setIsMobileMenuOpen(false); }}
                  className="w-full bg-white border border-slate-200 text-slate-900 px-8 py-5 rounded-2xl text-xs uppercase font-black tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button 
                onClick={() => { onSignInClick(); setIsMobileMenuOpen(false); }}
                className="w-full bg-slate-900 text-white px-12 py-6 rounded-full text-sm uppercase font-black tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
              >
                Owner Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
