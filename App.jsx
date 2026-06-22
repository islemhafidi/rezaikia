import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Public page components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Program from './components/Program';
import News from './components/News';
import VotingSimulator from './components/VotingSimulator';
import Footer from './components/Footer';

// Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import AdminArticles from './pages/admin/AdminArticles';
import AdminArticleEditor from './pages/admin/AdminArticleEditor';
import AdminVoters from './pages/admin/AdminVoters';
import AdminMap from './pages/admin/AdminMap';

// Hooks & Translations
import { translations } from './utils/translations';
import { useSettings } from './hooks/useSettings';

// ─── Main Landing Page ─────────────────────────────────────────────────────────
function LandingPage() {
  const [lang, setLang] = useState('ar');
  const text = translations[lang];
  const [showVotingModal, setShowVotingModal] = useState(true);
  const [refreshVotes, setRefreshVotes] = useState(0);

  // Fetch live settings from Supabase (falls back to defaults if offline)
  const { settings } = useSettings();

  const refreshVoteCount = () => {
    setRefreshVotes((prev) => prev + 1);
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className={`min-h-screen text-slate-800 antialiased ${
      lang === 'ar' ? 'font-arabic' : 'font-english'
    }`}>
      {/* Sticky Navigation Bar */}
      <Navbar lang={lang} setLang={setLang} text={text} setShowVoting={setShowVotingModal} settings={settings} />

      {/* Hero Presentation Page */}
      <Hero lang={lang} text={text} setShowVoting={setShowVotingModal} refreshTrigger={refreshVotes} settings={settings} />

      {/* Storytelling Biography */}
      <About lang={lang} text={text} />

      {/* Electoral Grid Program */}
      <Program lang={lang} text={text} />

      {/* Campaign Milestones and News (loaded from Supabase) */}
      <News lang={lang} text={text} />

      {/* Secure E-Voting Demo Simulator (Rendered as Popup Modal) */}
      <AnimatePresence>
        {showVotingModal && (
          <VotingSimulator
            lang={lang}
            text={text}
            onClose={() => setShowVotingModal(false)}
            onVoteSuccess={refreshVoteCount}
          />
        )}
      </AnimatePresence>

      {/* Campaign Footer Links and Slogans */}
      <Footer lang={lang} text={text} setShowVoting={setShowVotingModal} settings={settings} />
    </div>
  );
}

// ─── App with Router ───────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin panel (nested routes) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="map" element={<AdminMap />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="articles/new" element={<AdminArticleEditor />} />
          <Route path="articles/:id" element={<AdminArticleEditor />} />
          <Route path="voters" element={<AdminVoters />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
