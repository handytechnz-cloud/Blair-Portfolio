
import React, { useState } from 'react';
import { Icons } from '../constants';
import { UserRole, AppView } from '../types';
import { ThemeType } from '../App';

interface NavbarProps {
  onNavClick: (view: AppView) => void;
  activeView: string;
  userRole: UserRole;
  userName: string;
  onSignOut: () => void;
  onSignInClick: () => void;
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  blendColors: string[];
  onToggleBlendColor: (color: string) => void;
  isGlobalEventActive: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onNavClick, activeView, userRole, userName, onSignOut, onSignInClick, currentTheme, onThemeChange, blendColors, onToggleBlendColor, isGlobalEventActive
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const handleNavClick = (view: AppView) => {
    onNavClick(view);
    setIsMobileMenuOpen(false);
  };

  const navLinks: { id: AppView; label: string; isSpecial?: boolean }[] = [
    { id: 'gallery', label: 'Gallery' },
    { id: 'store', label: 'Prints', isSpecial: true },
    { id: 'qa', label: 'Q&A' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const themeOptions: {id: ThemeType, color: string, label: string, isSelectable?: boolean, adminOnly?: boolean}[] = [
    { id: 'black', color: 'bg-black border-white/20', label: 'Obsidian' },
    { id: 'white', color: 'bg-[#fffdfa] border-amber-100', label: 'Off-White' },
    { id: 'rainbow', color: 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500', label: 'Rainbow', adminOnly: true },
    { id: 'gold', color: 'bg-gradient-to-tr from-amber-200 via-yellow-500 to-amber-700', label: 'Shiny Gold', adminOnly: true },
    { id: 'red', color: 'bg-red-300', label: 'Red', isSelectable: true },
    { id: 'yellow', color: 'bg-yellow-300', label: 'Yellow', isSelectable: true },
    { id: 'blue', color: 'bg-blue-300', label: 'Blue', isSelectable: true },
    { id: 'green', color: 'bg-green-300', label: 'Green', isSelectable: true },
    { id: 'orange', color: 'bg-orange-300', label: 'Orange', isSelectable: true },
    { id: 'blend', color: 'bg-gradient-to-tr from-red-400 via-blue-400 to-orange-400', label: 'Custom Blend' },
  ];

  const currentThemeLabel = themeOptions.find(t => t.id === currentTheme)?.label || 'Theme';
  const isDarkTheme = currentTheme === 'black' || currentTheme === 'rainbow' || currentTheme === 'gold';
  const navTextColor = isDarkTheme ? 'text-white' : 'text-slate-800';
  const navSubColor = isDarkTheme ? 'text-slate-400' : 'text-slate-500';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] ${isDarkTheme ? 'bg-black/90' : 'bg-[#fffdfa]/80'} backdrop-blur-lg border-b ${isDarkTheme ? 'border-white/10' : 'border-amber-100'} px-6 py-4 transition-colors`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        <div 
          className="flex items-center gap-2 cursor-pointer group z-[150]"
          onClick={() => handleNavClick('gallery')}
        >
          <div className={`${navTextColor} group-hover:scale-110 transition-transform`}>
            <Icons.Camera />
          </div>
          <span className={`text-xl font-black tracking-tighter uppercase ${navTextColor}`}>BLAIR</span>
        </div>
        
        <div className="hidden lg:flex gap-6 items-center text-sm font-medium tracking-wide">
          {navLinks.map(link => (
            <button 
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`${activeView === link.id ? (link.isSpecial ? 'text-cyan-600' : navTextColor) : navSubColor + ' hover:' + navTextColor} transition-colors uppercase font-bold`}
            >
              {link.label}
            </button>
          ))}
          
          {userRole === 'ADMIN' && (
            <button 
              onClick={() => handleNavClick('admin')}
              className={`${activeView === 'admin' ? 'text-purple-600' : navSubColor + ' hover:' + navTextColor} transition-colors uppercase flex items-center gap-1.5 font-black`}
            >
              Access Control
            </button>
          )}

          <div className={`h-4 w-px ${isDarkTheme ? 'bg-white/20' : 'bg-slate-200'} mx-2`} />

          <div className="relative">
            <button 
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className={`flex items-center gap-2 text-[10px] uppercase font-black tracking-widest ${navSubColor} hover:${navTextColor} transition-colors`}
            >
              {currentTheme === 'blend' ? 'Blend' : currentThemeLabel}
              <div className={`w-3 h-3 rounded-full border border-slate-200 shadow-sm ${themeOptions.find(t => t.id === currentTheme)?.color}`} />
            </button>
            
            {showThemeMenu && (
              <div className="absolute top-full mt-4 right-0 bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl flex flex-col gap-3 min-w-[220px] animate-fade-in z-[200]">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 pb-3 mb-2">
                  {isGlobalEventActive ? 'Atmosphere Event' : 'Choose Atmosphere'}
                </p>
                {themeOptions.map(theme => {
                  const isUserAdmin = userRole === 'ADMIN';
                  if (isGlobalEventActive && !isUserAdmin) {
                    if (theme.id !== 'white' && theme.id !== currentTheme) return null;
                  } else {
                    if (theme.adminOnly && !isUserAdmin) return null;
                  }

                  return (
                    <div key={theme.id} className="flex items-center justify-between gap-4">
                      <button 
                        onClick={() => { onThemeChange(theme.id); if(theme.id !== 'blend') setShowThemeMenu(false); }}
                        className={`flex items-center gap-3 flex-1 px-3 py-2 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all ${currentTheme === theme.id ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <div className={`w-3 h-3 rounded-full border border-slate-200 ${theme.color}`} />
                        {theme.label}
                        {theme.id === 'white' && isGlobalEventActive && <span className="ml-auto text-[8px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">RESTORE</span>}
                      </button>
                      
                      {currentTheme === 'blend' && theme.isSelectable && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onToggleBlendColor(theme.id); }}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${blendColors.includes(theme.id) ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className={`h-4 w-px ${isDarkTheme ? 'bg-white/20' : 'bg-slate-200'} mx-2`} />

          {userName ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className={`text-[10px] ${navSubColor} uppercase tracking-widest leading-none mb-1 font-black`}>
                  {userRole === 'ADMIN' ? 'Owner' : 'Guest'}
                </span>
                <span className={`text-xs ${isDarkTheme ? 'text-cyan-400' : 'text-cyan-600'} font-black`}>{userName}</span>
              </div>
              <button 
                onClick={onSignOut} 
                className="bg-slate-900 text-white hover:bg-black px-5 py-2 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all shadow-xl active:scale-95 whitespace-nowrap"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={onSignInClick} 
              className={`border-2 ${isDarkTheme ? 'border-white text-white hover:bg-white hover:text-black' : 'border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white'} px-6 py-1.5 rounded-full text-xs uppercase font-black tracking-widest transition-all`}
            >
              Login
            </button>
          )}
        </div>

        <button 
          className={`lg:hidden ${navTextColor} z-[150] p-3 hover:bg-white/10 rounded-full transition-all active:scale-90`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <Icons.Close /> : <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>}
        </button>
      </div>

      <div className={`fixed inset-0 bg-[#fffdfa]/95 backdrop-blur-3xl z-[140] transition-all duration-500 ease-in-out lg:hidden ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className="flex flex-col h-full items-center justify-center p-12 space-y-10">
          <div className="flex flex-col items-center gap-6 w-full">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => handleNavClick(link.id)} className={`text-2xl font-black uppercase tracking-[0.25em] transition-all ${activeView === link.id ? (link.isSpecial ? 'text-cyan-600' : 'text-slate-800') : 'text-slate-400 hover:text-slate-800'}`}>{link.label}</button>
            ))}
            {userName && (
               <button onClick={onSignOut} className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-xl font-black uppercase tracking-widest mt-12 shadow-2xl">Sign Out</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
