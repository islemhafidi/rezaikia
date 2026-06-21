import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Vote, FileText, Landmark, Users } from 'lucide-react';
import { getTotalVotes } from '../utils/supabasePlaceholder';

export default function Hero({ lang, text, setShowVoting, refreshTrigger }) {
  const isRtl = lang === 'ar';
  const [voteCount, setVoteCount] = useState(0);
  const [loadingVotes, setLoadingVotes] = useState(true);

  useEffect(() => {
    fetchVoteCount();
  }, [refreshTrigger]);

  const fetchVoteCount = async () => {
    try {
      const result = await getTotalVotes();
      if (result.success) {
        setVoteCount(result.count);
      }
    } catch (error) {
      console.error('Failed to fetch vote count:', error);
    } finally {
      setLoadingVotes(false);
    }
  };

  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-12 flex items-center justify-center bg-zellige overflow-hidden">
      {/* Decorative Gradient Background Blobs */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-algerian-green/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-algerian-red/5 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ═══════════════════════════════════════
               HERO TEXT COLUMN — Premium Redesign
          ═══════════════════════════════════════ */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
            }}
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-start gap-0"
          >

            {/* ── Tagline pill ── */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } } }}
              className="inline-flex items-center gap-3 mb-6 px-5 py-2.5 rounded-full font-tajawal text-sm font-bold tracking-widest uppercase"
              style={{
                background: 'rgba(0,98,51,0.08)',
                border: '1px solid rgba(0,98,51,0.18)',
                color: '#006233',
                backdropFilter: 'blur(6px)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: '#D21034', boxShadow: '0 0 6px rgba(210,16,52,0.7)', animation: 'pulse 2s infinite' }}
              />
              <span>{text.hero.welcome}</span>
            </motion.div>

            {/* ── Candidate name ── */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
              className="relative mb-2"
            >
              {/* Gold left accent bar */}
              <span
                className="absolute -right-4 top-0 bottom-0 w-1 rounded-full hidden lg:block"
                style={{ background: 'linear-gradient(180deg, #D4AF37, #006233)' }}
              />
              <h1
                className="font-tajawal font-black leading-none tracking-tight"
                style={{
                  fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                  color: '#006233',
                  textShadow: '0 2px 24px rgba(0,98,51,0.12)',
                  letterSpacing: '-0.01em',
                }}
              >
                {text.hero.candidateName}
              </h1>
            </motion.div>

            {/* ── Slogan / subtitle heading ── */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
              className="mb-5"
            >
              <h2
                className="font-tajawal font-bold leading-snug"
                style={{
                  fontSize: 'clamp(1.25rem, 2.8vw, 2rem)',
                  color: '#1e293b',
                  letterSpacing: '-0.005em',
                }}
              >
                {text.hero.title}
              </h2>
            </motion.div>

            {/* ── Decorative divider ── */}
            <motion.div
              variants={{ hidden: { scaleX: 0, opacity: 0 }, visible: { scaleX: 1, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } } }}
              className="h-px w-24 mb-6 rounded-full"
              style={{
                originX: isRtl ? 1 : 0,
                background: 'linear-gradient(90deg, #D4AF37, rgba(212,175,55,0.1))',
              }}
            />

            {/* ── Body text ── */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } } }}
              className="font-tajawal text-lg leading-relaxed mb-9 max-w-lg"
              style={{ color: '#475569', fontWeight: 400, lineHeight: 1.9 }}
            >
              {text.hero.subtitle}
            </motion.p>

            {/* ── Vote Counter with Progress ── */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.3 } } }}
              className="w-full max-w-xl mb-4 bg-white/90 backdrop-blur-md px-10 py-8 rounded-3xl border border-algerian-gold/30 shadow-2xl"
            >
              <div className="flex flex-col items-center lg:items-start gap-6">
                {/* Vote Count Display */}
                <div className="flex items-center gap-6 w-full">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-algerian-green to-algerian-dark shadow-lg">
                    <Users className="h-10 w-10 text-algerian-gold" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-base font-bold text-slate-600 font-tajawal">
                      {lang === 'ar' ? 'عدد الأصوات' : 'Total Votes'}
                    </span>
                    <span className="text-7xl font-black bg-gradient-to-r from-algerian-green to-algerian-dark bg-clip-text text-transparent font-tajawal">
                      {loadingVotes ? (
                        <div className="w-48 h-20 bg-slate-200 rounded-xl animate-pulse" />
                      ) : (
                        voteCount.toLocaleString()
                      )}
                    </span>
                  </div>
                </div>

                {/* Progress Bar Section */}
                <div className="w-full flex flex-col gap-3">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm font-bold text-slate-500 font-tajawal">
                      {lang === 'ar' ? 'الهدف: 2500 صوت' : 'Goal: 2500 Votes'}
                    </span>
                    <span className="text-lg font-bold text-algerian-green font-tajawal">
                      {loadingVotes ? (
                        '0%'
                      ) : (
                        `${Math.min(100, Math.round((voteCount / 2500) * 100))}%`
                      )}
                    </span>
                  </div>
                  <div className="w-full h-6 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    {loadingVotes ? (
                      <div className="h-full bg-slate-200 animate-pulse" />
                    ) : (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (voteCount / 2500) * 100)}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-algerian-green via-algerian-gold to-algerian-red rounded-full shadow-inner"
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── CTA Buttons ── */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } } }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto"
            >
              {/* Primary CTA — Vote */}
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,98,51,0.35)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowVoting(true)}
                className="relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-2xl font-tajawal font-bold text-lg text-white overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #006233 0%, #004d28 100%)',
                  boxShadow: '0 4px 20px rgba(0,98,51,0.3)',
                }}
              >
                {/* Shimmer sweep */}
                <motion.span
                  className="absolute inset-0 opacity-0"
                  style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)' }}
                  animate={{ opacity: [0, 1, 0], x: ['-100%', '100%'] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
                />
                <Vote className="h-5 w-5 relative z-10" />
                <span className="relative z-10">{text.hero.ctaPrimary}</span>
              </motion.button>

              {/* Secondary CTA — Program */}
              <motion.a
                href="#program"
                whileHover={{ scale: 1.03, borderColor: '#D4AF37', color: '#006233' }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-tajawal font-bold text-lg transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  border: '2px solid rgba(212,175,55,0.4)',
                  color: '#374151',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <FileText className="h-5 w-5" style={{ color: '#D4AF37' }} />
                <span>{text.hero.ctaSecondary}</span>
              </motion.a>
            </motion.div>

            {/* ── Mobile-only list/candidate badges ── */}
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, delay: 0.15 } } }}
              className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:hidden"
            >
              <span className="inline-flex items-center gap-1.5 bg-algerian-green text-white text-xs font-bold font-tajawal px-4 py-2 rounded-xl shadow">
                {text.hero.listBadge}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-algerian-red text-white text-xs font-bold font-tajawal px-4 py-2 rounded-xl shadow">
                {text.hero.candidateBadge}
              </span>
            </motion.div>

          </motion.div>

          {/* Portrait / Campaign Poster Column */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -60 : 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-5 flex justify-center items-center relative py-8"
          >
            {/* ── Outer glow halo ── */}
            <div
              className="absolute inset-4 rounded-3xl blur-2xl opacity-30 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #006233, #D4AF37)' }}
            />

            {/* ── Decorative rotating dashed ring ── */}
            <div
              className="absolute inset-[-8px] rounded-[2.5rem] border-2 border-dashed border-algerian-gold/40 pointer-events-none"
              style={{ animation: 'spin 30s linear infinite' }}
            />

            {/* ── Main poster frame ── */}
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl"
              style={{
                border: '4px solid',
                borderColor: '#D4AF37',
                boxShadow: '0 0 0 1px rgba(0,98,51,0.3), 0 32px 64px rgba(0,0,0,0.25), 0 0 40px rgba(212,175,55,0.2)',
                maxWidth: '420px',
                width: '100%',
              }}
            >
              {/* Flag-colored top stripe */}
              <div className="h-1.5 flex">
                <div className="bg-algerian-green flex-1" />
                <div className="bg-white w-8" />
                <div className="bg-algerian-red flex-1" />
              </div>

              <img
                src="/candidate_portrait.png"
                alt={text.hero.candidateName}
                className="w-full h-auto object-cover block select-none"
                draggable={false}
              />

              {/* Flag-colored bottom stripe */}
              <div className="h-1.5 flex">
                <div className="bg-algerian-red flex-1" />
                <div className="bg-white w-8" />
                <div className="bg-algerian-green flex-1" />
              </div>
            </div>

            {/* ── Corner accent: top-right ── */}
            <div className="absolute top-6 right-4 w-10 h-10 border-t-4 border-r-4 border-algerian-green rounded-tr-2xl pointer-events-none z-20" />
            {/* ── Corner accent: bottom-left ── */}
            <div className="absolute bottom-6 left-4 w-10 h-10 border-b-4 border-l-4 border-algerian-red rounded-bl-2xl pointer-events-none z-20" />

            {/* ── FLOATING BADGE: Candidate #2 ── */}
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-2 -right-4 lg:-right-6 bg-gradient-to-br from-algerian-red to-algerian-red/80 text-white rounded-2xl p-3.5 shadow-xl border border-white/20 z-30"
            >
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Award className="h-5 w-5 text-algerian-gold" />
                </div>
                <div>
                  <span className="text-[10px] block opacity-90 leading-none">المرشح</span>
                  <span className="text-lg font-black leading-none text-algerian-gold">N° 2</span>
                </div>
              </div>
            </motion.div>

            {/* ── FLOATING BADGE: List #102 ── */}
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-2 -left-4 lg:-left-6 bg-gradient-to-br from-algerian-green to-algerian-dark text-white rounded-2xl p-3.5 shadow-xl border border-white/25 z-30 font-arabic"
            >
              <div className="flex items-center gap-2">
                <div className="bg-white/10 p-1.5 rounded-lg">
                  <Landmark className="h-5 w-5 text-algerian-gold" />
                </div>
                <div>
                  <span className="text-[10px] block opacity-90 leading-none">القائمة</span>
                  <span className="text-lg font-black leading-none text-algerian-gold">102</span>
                </div>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
