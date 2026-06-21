import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Program from './components/Program';
import News from './components/News';
import VotingSimulator from './components/VotingSimulator';
import Footer from './components/Footer';
import { translations } from './utils/translations';

function App() {
  // Set default language to Arabic ('ar') as the national language of Algeria
  const [lang, setLang] = useState('ar');
  const text = translations[lang];
  
  // Show voting simulator popup automatically upon site opening
  const [showVotingModal, setShowVotingModal] = useState(true);
  const [refreshVotes, setRefreshVotes] = useState(0); // Counter to trigger refresh

  const refreshVoteCount = () => {
    setRefreshVotes(prev => prev + 1);
  };

  useEffect(() => {
    // Dynamic RTL/LTR switching on the html element
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className={`min-h-screen text-slate-800 antialiased ${
      lang === 'ar' ? 'font-arabic' : 'font-english'
    }`}>
      {/* Sticky Navigation Bar */}
      <Navbar lang={lang} setLang={setLang} text={text} setShowVoting={setShowVotingModal} />

      {/* Hero Presentation Page */}
      <Hero lang={lang} text={text} setShowVoting={setShowVotingModal} refreshTrigger={refreshVotes} />

      {/* Storytelling Biography */}
      <About lang={lang} text={text} />

      {/* Electoral Grid Program */}
      <Program lang={lang} text={text} />

      {/* Campaign Milestones and News */}
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
      <Footer lang={lang} text={text} setShowVoting={setShowVotingModal} />
    </div>
  );
}

export default App;
