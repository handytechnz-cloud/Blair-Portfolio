
import React, { useState, useEffect } from 'react';
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
import { Photo, UserRole, AccessKey, UserSession, AboutContent } from './types';
import { 
  loadPhotosFromDB, 
  savePhotosToDB, 
  loadAccessKeys, 
  saveAccessKeys,
  loadAboutContent,
  saveAboutContent
} from './services/storageService';

type View = 'hero' | 'gallery' | 'about' | 'contact' | 'store' | 'qa' | 'admin' | 'studio';

const MASTER_KEY = "blair-studio-2026";

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
  const [aboutContent, setAboutContent] = useState<AboutContent>(DEFAULT_ABOUT);
  const [isLoaded, setIsLoaded] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [userRole, setUserRole] = useState<UserRole>('GUEST');
  const [userName, setUserName] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginInput, setLoginInput] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const [savedPhotos, savedKeys, savedAbout] = await Promise.all([
          loadPhotosFromDB(),
          loadAccessKeys(),
          loadAboutContent()
        ]);
        
        if (savedPhotos && savedPhotos.length > 0) {
          setPhotos(savedPhotos);
        } else {
          setPhotos(SAMPLE_PHOTOS);
        }
        
        setAccessKeys(savedKeys || []);
        if (savedAbout) setAboutContent(savedAbout);

        const session = sessionStorage.getItem('blair_session');
        if (session) {
          const parsed: UserSession = JSON.parse(session);
          setUserRole(parsed.role);
          setUserName(parsed.label);
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setError("Failed to initialize the studio. Please refresh the page.");
        setPhotos(SAMPLE_PHOTOS);
      } finally {
        setIsLoaded(true);
      }
    };
    init();
  }, []);

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

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginInput === MASTER_KEY) {
      const session: UserSession = { role: 'ADMIN', label: 'Owner' };
      setUserRole('ADMIN');
      setUserName('Owner');
      sessionStorage.setItem('blair_session', JSON.stringify(session));
      setShowLoginModal(false);
      setLoginInput('');
      setSuccess("Authenticated as Owner");
    } else {
      alert("Invalid Access Key");
    }
  };

  const handleUpdateAbout = async (newContent: AboutContent) => {
    setAboutContent(newContent);
    await saveAboutContent(newContent).catch(console.error);
    setSuccess("Portfolio updated successfully.");
  };

  const renderContent = () => {
    if (!isLoaded) return (
      <div className="h-screen flex items-center justify-center bg-sky-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-bold tracking-[0.3em] text-slate-400 uppercase text-xs">Loading Studio...</span>
        </div>
      </div>
    );

    if (error) return (
      <div className="h-screen flex items-center justify-center text-red-500 font-bold px-10 text-center bg-sky-50">
        {error}
      </div>
    );

    switch (view) {
      case 'hero': return <Hero onStart={() => setView('gallery')} />;
      case 'gallery': return <Gallery photos={photos} onAddPhoto={(p) => setPhotos([p, ...photos])} onDeletePhoto={(id) => setPhotos(photos.filter(p => p.id !== id))} onClearAll={() => setPhotos([])} userRole={userRole} />;
      case 'about': return <About content={aboutContent} onUpdate={handleUpdateAbout} userRole={userRole} />;
      case 'contact': return <Contact />;
      case 'store': return <Store photos={photos.filter(p => p.price && p.price > 0)} />;
      case 'qa': return <QA />;
      case 'studio': return <AIStudio />;
      case 'admin': return <Admin accessKeys={accessKeys} onAddKey={(l, r) => setAccessKeys([...accessKeys, { id: Date.now().toString(), label: l, role: r, key: Math.random().toString(36).slice(-6).toUpperCase(), createdAt: Date.now() }])} onRemoveKey={(id) => setAccessKeys(accessKeys.filter(k => k.id !== id))} />;
      default: return <Gallery photos={photos} onAddPhoto={()=>{}} onDeletePhoto={()=>{}} onClearAll={()=>{}} userRole={userRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 text-slate-900 transition-colors duration-500">
      {view !== 'hero' && <Navbar onNavClick={setView as any} activeView={view} userRole={userRole} userName={userName} onSignOut={() => {setUserRole('GUEST'); sessionStorage.removeItem('blair_session'); setSuccess("Signed Out");}} onSignInClick={() => setShowLoginModal(true)} />}
      
      {success && <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[500] bg-cyan-600 text-white px-8 py-3 rounded-full font-black text-xs tracking-[0.2em] shadow-2xl animate-bounce">{success}</div>}

      {showLoginModal && (
        <div className="fixed inset-0 z-[600] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] w-full max-w-md p-10 relative text-center shadow-2xl">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><Icons.Close /></button>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 text-slate-900">Studio Access</h2>
            <form onSubmit={handleSignIn} className="space-y-6">
              <input type="password" placeholder="ENTER ACCESS KEY" className="w-full bg-sky-50 border border-slate-200 rounded-2xl px-6 py-5 text-center text-xl font-mono focus:border-cyan-500 outline-none text-slate-900" value={loginInput} onChange={e => setLoginInput(e.target.value)} />
              <button className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-cyan-600 transition-all uppercase tracking-widest">Unlock Profile</button>
            </form>
          </div>
        </div>
      )}

      <main className={view !== 'hero' ? 'pt-20' : ''}>{renderContent()}</main>

      {view !== 'hero' && (
        <footer className="py-20 px-6 border-t border-slate-200 text-center mt-20">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.5em]">© 2024 BLAIR STUDIO | BUILT FOR THE CRAFT</span>
        </footer>
      )}
    </div>
  );
};

export default App;
