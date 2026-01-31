
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import About from './components/About';
import Contact from './components/Contact';
import Store from './components/Store';
import QA from './components/QA';
import Admin from './components/Admin';
import AIStudio from './components/AIStudio';
import { Icons, SAMPLE_PHOTOS } from './constants';
import { Photo, UserRole, AccessKey, UserSession, AboutContent, Inquiry } from './types';
import { 
  loadPhotosFromDB, 
  savePhotosToDB, 
  loadAccessKeys, 
  saveAccessKeys,
  loadAboutContent,
  saveAboutContent,
  loadInquiries,
  saveInquiry,
  deleteInquiry
} from './services/storageService';

type View = 'hero' | 'gallery' | 'about' | 'contact' | 'store' | 'qa' | 'admin' | 'studio';

export type ThemeType = 'white' | 'red' | 'yellow' | 'blue' | 'green' | 'orange' | 'black' | 'blend' | 'rainbow' | 'gold';

const MASTER_KEY = "blair-studio-2026";
const GLOBAL_THEME_KEY = "blair_global_atmosphere";

const THEME_COLORS: Record<string, string> = {
  white: '#f8fafc',
  red: '#fee2e2',
  yellow: '#fef9c3',
  blue: '#dbeafe',
  green: '#dcfce7',
  orange: '#ffedd5',
  black: '#000000',
  rainbow: 'transparent',
  gold: 'transparent'
};

const GOLD_TIP = "GOLD EVENT: Pieces over $30 drop to $10, under $3 are FREE, and everything else is 30% OFF!";

const TIPS = [
  "You can add items to your gallery as an Admin to automatically see them in the Store.",
  "Double-click any photograph to view technical EXIF data like shutter speed and aperture.",
  "The AI Studio uses Gemini 3 Pro to generate poetic artistic statements for your uploads.",
  "Access control keys allow you to grant temporary 'Editor' permissions to other collaborators.",
  "Looking for location ideas? Use the Location Scout in AI Studio for real-time weather and shooting tips.",
  "Galleries are stored locally in your browser using IndexedDB for lightning-fast performance.",
  "You can buy limited edition prints directly from the Store—all archival museum quality."
];

const ADMIN_TIPS = [
  "RAINBOW EVENT: When the Owner triggers the global atmosphere, all store items are 20% OFF!",
  "THE RAINBOW EFFECT: This vibrant visual state lasts for exactly 3 minutes for every visitor.",
  "ADMIN TRICK: Only Owners can publish the Rainbow theme to the entire server."
];

const DEFAULT_ABOUT: AboutContent = {
  name: "Blair",
  roleLabel: "Visual Storyteller & Photographer",
  introHeading: "Capturing the Unseen Moments.",
  introDescription1: "I am Blair, a photographer driven by the pursuit of light, shadow, and the quiet stories told in between. My work isn't just about snapping a shutter; it's about freezing a feeling.",
  introDescription2: "With a focus on minimalism and high-contrast aesthetics, I specialize in commercial and portrait photography. Every image I produce is a deliberate composition.",
  imageUrl: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=2070&auto=format&fit=crop",
  philosophy: [
    { title: "Simplicity", description: "Finding beauty in the essential. Stripping away the noise to let the subject speak for itself." },
    { title: "Precision", description: "Technical excellence meets creative intuition. Every pixel and exposure is intentional." },
    { title: "Connection", description: "Photography is a bridge. It's about the relationship between the viewer and the subject." }
  ],
  equipment: ["Sony A1", "Leica Q3", "35mm f/1.4 GM", "85mm f/1.2 GM", "50mm f/1.2 GM"]
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('hero');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [accessKeys, setAccessKeys] = useState<AccessKey[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent>(DEFAULT_ABOUT);
  const [isLoaded, setIsLoaded] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [userRole, setUserRole] = useState<UserRole>('GUEST');
  const [userName, setUserName] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('blue');
  const [blendColors, setBlendColors] = useState<string[]>(['red', 'yellow', 'blue']);
  const [globalExpiry, setGlobalExpiry] = useState<number | null>(null);

  const [inquirySubject, setInquirySubject] = useState<string | null>(null);

  const currentTip = useMemo(() => {
    const roll = Math.random();
    if (roll < 0.225) return GOLD_TIP;
    
    const isAdminTipChance = Math.random() < 0.3;
    const list = isAdminTipChance ? ADMIN_TIPS : TIPS;
    return list[Math.floor(Math.random() * list.length)];
  }, [view]);

  useEffect(() => {
    const init = async () => {
      try {
        const [savedPhotos, savedKeys, savedAbout, savedInquiries] = await Promise.all([
          loadPhotosFromDB(),
          loadAccessKeys(),
          loadAboutContent(),
          loadInquiries()
        ]);
        
        if (savedPhotos && savedPhotos.length > 0) {
          setPhotos(savedPhotos);
        } else {
          setPhotos(SAMPLE_PHOTOS);
        }
        
        setAccessKeys(savedKeys || []);
        setInquiries(savedInquiries || []);
        if (savedAbout) setAboutContent(savedAbout);

        const session = sessionStorage.getItem('blair_session');
        if (session) {
          const parsed: UserSession = JSON.parse(session);
          setUserRole(parsed.role);
          setUserName(parsed.label);
        }

        const savedTheme = localStorage.getItem('blair_theme') as ThemeType;
        if (savedTheme) setCurrentTheme(savedTheme);

        const savedBlend = localStorage.getItem('blair_blend_colors');
        if (savedBlend) setBlendColors(JSON.parse(savedBlend));

        const globalAtm = localStorage.getItem(GLOBAL_THEME_KEY);
        if (globalAtm) {
          const { theme, expiry } = JSON.parse(globalAtm);
          if (Date.now() < expiry) {
            // Respect white theme override if manually set
            if (currentTheme !== theme && savedTheme !== 'white') setCurrentTheme(theme);
            setGlobalExpiry(expiry);
          }
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setError("Failed to initialize the studio. Please refresh the page.");
      } finally {
        setIsLoaded(true);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const globalAtm = localStorage.getItem(GLOBAL_THEME_KEY);
      if (globalAtm) {
        const { theme, expiry } = JSON.parse(globalAtm);
        if (Date.now() < expiry) {
          // Rule: If user manually chooses 'white', they can escape the event.
          const manualPreference = localStorage.getItem('blair_theme');
          if (currentTheme !== theme && manualPreference !== 'white') {
            setCurrentTheme(theme);
          }
          setGlobalExpiry(expiry);
        } else if (globalExpiry) {
          const lastSaved = (localStorage.getItem('blair_theme') as ThemeType) || 'blue';
          setCurrentTheme(lastSaved);
          setGlobalExpiry(null);
          localStorage.removeItem(GLOBAL_THEME_KEY);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [currentTheme, globalExpiry]);

  useEffect(() => {
    if (isLoaded && photos.length > 0) {
      savePhotosToDB(photos).catch(console.error);
    }
  }, [photos, isLoaded]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const backgroundStyle = useMemo(() => {
    if (currentTheme === 'rainbow' || currentTheme === 'gold') return {};
    if (currentTheme !== 'blend') {
      return { backgroundColor: THEME_COLORS[currentTheme] };
    }
    if (blendColors.length === 0) return { backgroundColor: THEME_COLORS.white };
    if (blendColors.length === 1) return { backgroundColor: THEME_COLORS[blendColors[0]] };
    
    const stops = blendColors.map(c => THEME_COLORS[c]).join(', ');
    return { background: `linear-gradient(135deg, ${stops})` };
  }, [currentTheme, blendColors]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim()) return;

    if (loginInput === MASTER_KEY) {
      const session: UserSession = { role: 'ADMIN', label: 'Owner' };
      setUserRole('ADMIN');
      setUserName('Owner');
      sessionStorage.setItem('blair_session', JSON.stringify(session));
      setSuccess("Authenticated as Owner");
    } else {
      const session: UserSession = { role: 'GUEST', label: loginInput };
      setUserRole('GUEST');
      setUserName(loginInput);
      sessionStorage.setItem('blair_session', JSON.stringify(session));
      setSuccess(`Welcome, ${loginInput}`);
    }

    setShowLoginModal(false);
    setLoginInput('');
  };

  const publishGlobalTheme = (theme: ThemeType) => {
    // Atmosphere duration: 3 minutes (180,000ms)
    const expiry = Date.now() + 3 * 60 * 1000;
    const payload = { theme, expiry };
    localStorage.setItem(GLOBAL_THEME_KEY, JSON.stringify(payload));
    
    // Clear white override for owner so they see what they published
    localStorage.setItem('blair_theme', theme);
    setCurrentTheme(theme);
    setGlobalExpiry(expiry);
    setSuccess(`GLOBAL EVENT: ${theme.toUpperCase()} ACTIVE FOR 3 MIN`);
  };

  const handleUpdateAbout = async (newContent: AboutContent) => {
    setAboutContent(newContent);
    await saveAboutContent(newContent).catch(console.error);
    setSuccess("Portfolio updated successfully.");
  };

  const handleUpdatePhoto = (updatedPhoto: Photo) => {
    setPhotos(prev => prev.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
    setSuccess("Piece updated successfully.");
  };

  const handleSendInquiry = async (inquiry: Inquiry) => {
    await saveInquiry(inquiry);
    const updated = await loadInquiries();
    setInquiries(updated);
  };

  const handleDeleteInquiry = async (id: string) => {
    await deleteInquiry(id);
    const updated = await loadInquiries();
    setInquiries(updated);
    setSuccess("Inquiry archived.");
  };

  const handleInquiry = (photo: Photo) => {
    setInquirySubject(`Inquiry for piece: "${photo.title}"`);
    setView('contact');
  };

  const handleThemeChange = (theme: ThemeType) => {
    setCurrentTheme(theme);
    localStorage.setItem('blair_theme', theme);
  };

  const toggleBlendColor = (color: string) => {
    const newBlend = blendColors.includes(color)
      ? blendColors.filter(c => c !== color)
      : [...blendColors, color];
    setBlendColors(newBlend);
    localStorage.setItem('blair_blend_colors', JSON.stringify(newBlend));
  };

  const renderContent = () => {
    if (!isLoaded) return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-black tracking-[0.3em] text-slate-400 uppercase text-xs">Entering Studio...</span>
        </div>
      </div>
    );

    if (error) return (
      <div className="h-screen flex items-center justify-center text-red-500 font-black px-10 text-center bg-slate-50 uppercase tracking-widest text-xs">
        {error}
      </div>
    );

    switch (view) {
      case 'hero': return <Hero onStart={() => setView('gallery')} />;
      case 'gallery': return <Gallery photos={photos} onAddPhoto={(p) => setPhotos([p, ...photos])} onUpdatePhoto={handleUpdatePhoto} onDeletePhoto={(id) => setPhotos(photos.filter(p => p.id !== id))} onClearAll={() => setPhotos([])} userRole={userRole} onInquire={handleInquiry} />;
      case 'about': return <About content={aboutContent} onUpdate={handleUpdateAbout} userRole={userRole} />;
      case 'contact': return <Contact prefilledMessage={inquirySubject || undefined} onClearPrefill={() => setInquirySubject(null)} onSendInquiry={handleSendInquiry} />;
      case 'store': return <Store photos={photos.filter(p => p.price && p.price > 0)} onInquire={handleInquiry} activeTheme={currentTheme} />;
      case 'qa': return <QA />;
      case 'studio': return <AIStudio />;
      case 'admin': return <Admin inquiries={inquiries} onDeleteInquiry={handleDeleteInquiry} accessKeys={accessKeys} onAddKey={(l, r) => setAccessKeys([...accessKeys, { id: Date.now().toString(), label: l, role: r, key: Math.random().toString(36).slice(-6).toUpperCase(), createdAt: Date.now() }])} onRemoveKey={(id) => setAccessKeys(accessKeys.filter(k => k.id !== id))} onPublishAtmosphere={publishGlobalTheme} />;
      default: return <Gallery photos={photos} onAddPhoto={()=>{}} onUpdatePhoto={()=>{}} onDeletePhoto={()=>{}} onClearAll={()=>{}} userRole={userRole} onInquire={handleInquiry} />;
    }
  };

  return (
    <div 
      className={`min-h-screen text-slate-900 transition-all duration-700 ease-in-out ${currentTheme === 'black' ? 'theme-black' : ''} ${currentTheme === 'rainbow' ? 'theme-rainbow' : ''} ${currentTheme === 'gold' ? 'theme-gold' : ''}`}
      style={backgroundStyle}
    >
      {view !== 'hero' && (
        <Navbar 
          onNavClick={setView as any} 
          activeView={view} 
          userRole={userRole} 
          userName={userName} 
          onSignOut={() => {setUserRole('GUEST'); setUserName(''); sessionStorage.removeItem('blair_session'); setSuccess("Signed Out");}} 
          onSignInClick={() => setShowLoginModal(true)}
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
          blendColors={blendColors}
          onToggleBlendColor={toggleBlendColor}
          isGlobalEventActive={!!globalExpiry}
        />
      )}
      
      {success && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[500] bg-slate-900 text-white px-8 py-3 rounded-full font-black text-xs tracking-[0.2em] shadow-2xl animate-bounce">
          {success}
        </div>
      )}

      {/* Atmosphere Box: Always black bg, white text, locked at the top */}
      {globalExpiry && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[90] bg-black border border-white/20 px-8 py-2.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md">
           Atmosphere Countdown: {Math.max(0, Math.floor((globalExpiry - Date.now()) / 1000))}s
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-[600] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] w-full max-w-md p-10 relative text-center shadow-2xl">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"><Icons.Close /></button>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-slate-900">Studio Entry</h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8">Access Secure Visual Data</p>
            <form onSubmit={handleSignIn} className="space-y-6">
              <input 
                type="text" 
                placeholder="NAME OR ACCESS KEY" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-center text-xl font-mono focus:border-slate-900 outline-none text-slate-900 placeholder:text-slate-300 placeholder:font-sans" 
                value={loginInput} 
                onChange={e => setLoginInput(e.target.value)} 
                autoFocus
              />
              <button className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-black transition-all uppercase tracking-widest shadow-lg">
                Enter Studio
              </button>
            </form>
          </div>
        </div>
      )}

      <main className={view !== 'hero' ? 'pt-20' : ''}>{renderContent()}</main>

      {view !== 'hero' && (
        <footer className="py-20 px-6 border-t border-slate-200 mt-20">
          <div className="max-w-4xl mx-auto mb-16 p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
             <div className="flex items-center gap-4 mb-5">
                <div className="bg-slate-900 p-2.5 rounded-xl text-white"><Icons.Sparkles /></div>
                <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400">Blair Insight</h4>
             </div>
             <p className="text-slate-700 font-bold italic text-lg leading-relaxed">"{currentTip}"</p>
          </div>
          <div className="text-center">
            <span className="text-slate-400 text-[10px] uppercase font-black tracking-[0.6em]">© 2024 BLAIR STUDIO | THE CRAFT OF LIGHT</span>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
