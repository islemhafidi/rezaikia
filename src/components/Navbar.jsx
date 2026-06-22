import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Vote, Menu, X, ChevronDown } from 'lucide-react';

// ─────────────────────────────────────────────────────────
// Sub-component: Desktop Nav Link with animated underline
// ─────────────────────────────────────────────────────────
function NavLink({ href, children, scrolled, onClick }) {
  const [hovered, setHovered] = useState(false);

  const textColor = scrolled
    ? hovered ? '#D4AF37' : '#e2e8f0'
    : hovered ? '#D4AF37' : '#1e293b';

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col items-center gap-0.5 font-semibold text-lg tracking-wide transition-colors duration-300 cursor-pointer select-none"
      style={{ color: textColor }}
    >
      <span>{children}</span>
      {/* Animated underline expanding from center */}
      <motion.span
        className="block h-0.5 rounded-full"
        style={{ backgroundColor: '#D4AF37' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      />
    </a>
  );
}

// ─────────────────────────────────────────────────────────
// Main Navbar Component
// ─────────────────────────────────────────────────────────
export default function Navbar({ lang, setLang, text, setShowVoting, settings }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isRtl = lang === 'ar';

  // Dynamic values from settings with fallbacks
  const candidateName = lang === 'ar'
    ? (settings?.candidate_name || 'عماد رزايقية')
    : (settings?.candidate_name_en || 'Imad Rezayguia');
  const listNumber = settings?.list_number ?? 102;
  const candidateNumber = settings?.candidate_number ?? 2;


  // ── Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const navLinks = [
    { href: '#hero',    ar: 'الرئيسية', en: 'Home'     },
    { href: '#about',   ar: 'من أنا',   en: 'About'    },
    { href: '#program', ar: 'البرنامج', en: 'Program'  },
    { href: '#news',    ar: 'الأخبار',  en: 'News'     },
  ];

  const handleVote = () => {
    setDrawerOpen(false);
    setShowVoting(true);
  };

  // ── Navbar background: glassmorphic ↔ solid green
  const navVariants = {
    top: {
      backgroundColor: 'rgba(255,255,255,0.08)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(255,255,255,0.12)',
      boxShadow: 'none',
      height: '96px',
    },
    scrolled: {
      backgroundColor: '#006233',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      borderBottom: '1px solid rgba(212,175,55,0.25)',
      boxShadow: '0 4px 30px rgba(0,0,0,0.25)',
      height: '72px',
    },
  };

  return (
    <>
      {/* ══════════════════ NAVBAR STRIP ══════════════════ */}
      <motion.nav
        dir="rtl"
        variants={navVariants}
        animate={scrolled ? 'scrolled' : 'top'}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-40 flex items-center"
      >
        <div className="w-full max-w-screen-xl mx-auto px-5 sm:px-8 flex items-center justify-between gap-6 h-full">

          {/* ── RIGHT: Branding (RTL = visually right side) ── */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="leading-none">
              {/* Candidate Name — solid color avoids gradient-text rectangle bug in Framer Motion */}
              <span
                className="block font-black tracking-tight leading-none font-tajawal transition-colors duration-400 text-[1.75rem] pb-0.5"
                style={{
                  color: scrolled ? '#D4AF37' : '#006233',
                }}
              >
                {candidateName}
              </span>

              {/* Badges: List + Candidate */}
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-bold bg-algerian-green text-white px-2 py-0.5 rounded-full border border-white/10 shadow-sm whitespace-nowrap">
                  {isRtl ? `القائمة ${listNumber}` : `List ${listNumber}`}
                </span>
                <span className="text-[10px] font-bold bg-algerian-red text-white px-2 py-0.5 rounded-full border border-white/10 shadow-sm whitespace-nowrap">
                  {isRtl ? `المرشح ${candidateNumber}` : `Candidate ${candidateNumber}`}
                </span>
              </div>
            </div>
          </div>

          {/* ── CENTER: Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-8 font-arabic">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                scrolled={scrolled}
              >
                {isRtl ? link.ar : link.en}
              </NavLink>
            ))}
          </div>

          {/* ── LEFT: Language Toggle + CTA ── */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Language toggle pill */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-colors border"
              style={{
                color: scrolled ? '#D4AF37' : '#006233',
                borderColor: scrolled ? 'rgba(212,175,55,0.4)' : 'rgba(0,98,51,0.3)',
                background: scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.75)',
              }}
            >
              🌐
              <span>{lang === 'ar' ? 'EN' : 'ع'}</span>
            </motion.button>

            {/* Pulsing "Vote Now" CTA */}
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: '0 0 22px rgba(210,16,52,0.65)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVote}
              className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-white text-base tracking-wide overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #D21034, #a30d26)', boxShadow: '0 0 14px rgba(210,16,52,0.45)' }}
            >
              {/* Pulsing ring */}
              <span className="absolute inset-0 rounded-xl animate-ping opacity-20 bg-algerian-red" />
              <Vote className="h-4.5 w-4.5 relative z-10" />
              <span className="relative z-10 font-arabic">{isRtl ? 'صوّت الآن' : 'Vote Now'}</span>
            </motion.button>
          </div>

          {/* ── MOBILE: Hamburger + Lang Toggle ── */}
          <div className="flex md:hidden items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="p-2 rounded-xl text-sm font-black border"
              style={{
                color: scrolled ? '#D4AF37' : '#006233',
                borderColor: scrolled ? 'rgba(212,175,55,0.4)' : 'rgba(0,98,51,0.3)',
                background: scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)',
              }}
            >
              {lang === 'ar' ? 'EN' : 'ع'}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setDrawerOpen(true)}
              className="p-2.5 rounded-xl border"
              style={{
                color: scrolled ? '#D4AF37' : '#006233',
                borderColor: scrolled ? 'rgba(212,175,55,0.3)' : 'rgba(0,98,51,0.2)',
                background: scrolled ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.7)',
              }}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </motion.button>
          </div>

        </div>
      </motion.nav>

      {/* ══════════════════ MOBILE FULL-SCREEN DRAWER ══════════════════ */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer Panel */}
            <motion.div
              key="drawer"
              dir="rtl"
              initial={{ x: isRtl ? '100%' : '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isRtl ? '100%' : '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 z-50 h-full w-[82vw] max-w-sm flex flex-col overflow-hidden"
              style={{ background: 'linear-gradient(160deg, #006233 0%, #03170D 100%)' }}
            >
              {/* ─ Decorative flag stripe at the top ─ */}
              <div className="h-1.5 flex shrink-0">
                <div className="bg-algerian-green flex-1" />
                <div className="bg-white w-6" />
                <div className="bg-algerian-red flex-1" />
              </div>

              {/* ─ Drawer header ─ */}
              <div className="flex items-center justify-between px-6 py-5">
                <div className="leading-none">
                  <span className="block font-black text-[1.5rem] text-yellow-300 font-tajawal tracking-tight mb-1">{candidateName}</span>
                  <div className="flex gap-1.5 mt-1.5">
                    <span className="text-[10px] font-bold bg-white/10 border border-algerian-gold/30 text-algerian-gold px-2 py-0.5 rounded-full">
                      {isRtl ? `القائمة ${listNumber}` : `List ${listNumber}`}
                    </span>
                    <span className="text-[10px] font-bold bg-algerian-red/90 text-white px-2 py-0.5 rounded-full">
                      {isRtl ? `المرشح ${candidateNumber}` : `Candidate ${candidateNumber}`}
                    </span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.85, rotate: 90 }}
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              {/* ─ Divider ─ */}
              <div className="mx-6 h-px bg-white/10" />

              {/* ─ Nav Links ─ */}
              <nav className="flex flex-col gap-1 px-4 py-6 flex-1 font-arabic">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.07 * i, duration: 0.3 }}
                    className="flex items-center justify-between px-4 py-4 rounded-2xl text-slate-200 hover:text-yellow-300 hover:bg-white/8 text-xl font-bold transition-all group"
                  >
                    <span>{isRtl ? link.ar : link.en}</span>
                    <ChevronDown className="h-4 w-4 opacity-40 -rotate-90 group-hover:opacity-80 transition-opacity" />
                  </motion.a>
                ))}
              </nav>

              {/* ─ CTA at the bottom ─ */}
              <div className="px-5 pb-10">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  whileHover={{ scale: 1.03, boxShadow: '0 0 28px rgba(210,16,52,0.7)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleVote}
                  className="relative w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xl text-white overflow-hidden font-arabic"
                  style={{ background: 'linear-gradient(135deg, #D21034, #9b0e25)', boxShadow: '0 0 18px rgba(210,16,52,0.45)' }}
                >
                  <span className="absolute inset-0 rounded-2xl animate-ping opacity-15 bg-algerian-red" />
                  <Vote className="h-6 w-6 relative z-10" />
                  <span className="relative z-10">{isRtl ? 'صوّت الآن' : 'Vote Now'}</span>
                </motion.button>

                <p className="text-center text-slate-500 text-xs mt-4 font-arabic">
                  {isRtl ? 'صوتك أمانة • القائمة 102' : 'Your vote matters • List 102'}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
