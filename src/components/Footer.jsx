import React, { useState } from 'react';
import { Landmark, Send, Check } from 'lucide-react';
import { subscribeNewsletter } from '../utils/supabasePlaceholder';

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
  </svg>
);


export default function Footer({ lang, text, setShowVoting, settings }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const response = await subscribeNewsletter(email);
      if (response.success) {
        setSuccess(true);
        setEmail('');
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-algerian-dark text-slate-300 relative overflow-hidden border-t border-algerian-gold/15">
      {/* Decorative Ribbon Flag */}
      <div className="h-1.5 flex">
        <div className="bg-algerian-green flex-1" />
        <div className="bg-white w-4" />
        <div className="bg-algerian-red flex-1" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand and Slogan Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent block tracking-wide font-arabic">
                  {text.nav.brand}
                </span>
                <span className="text-[10px] font-bold text-algerian-gold uppercase tracking-wider block mt-0.5">
                  {text.nav.listNum} | Candidate 2
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {text.about.subtitle}
            </p>

            {/* Calligraphic Slogan */}
            <div className="border-r-2 border-algerian-gold pr-4 py-1.5 font-arabic text-lg font-bold text-white italic tracking-wide">
              "{lang === 'ar' ? (settings?.footer_slogan_ar || text.footer.slogan) : (settings?.footer_slogan_en || text.footer.slogan)}"
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider border-b border-white/10 pb-2 w-fit">
              {text.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#hero" className="hover:text-algerian-gold transition-colors block py-0.5">
                  {text.nav.home}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-algerian-gold transition-colors block py-0.5">
                  {text.nav.about}
                </a>
              </li>
              <li>
                <a href="#program" className="hover:text-algerian-gold transition-colors block py-0.5">
                  {text.nav.program}
                </a>
              </li>
              <li>
                <a href="#news" className="hover:text-algerian-gold transition-colors block py-0.5">
                  {text.nav.news}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setShowVoting(true)}
                  className="hover:text-algerian-gold transition-colors block py-0.5 text-start w-full"
                >
                  {text.nav.voting}
                </button>
              </li>
            </ul>
          </div>

          {/* Campaign Newsletter Sign Up */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider border-b border-white/10 pb-2 w-fit">
              {lang === 'ar' ? 'اشترك في النشرة الإخبارية' : 'Subscribe to Newsletter'}
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              {lang === 'ar'
                ? 'كن أول من يعلم بمواعيد التجمعات والندوات الصحفية للمرشح عماد رزايقية.'
                : 'Get live updates regarding meetings and press conferences of candidate Imad Rezayguia.'}
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Enter your email'}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-algerian-green/30 w-full text-white placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-algerian-green hover:bg-algerian-red text-white p-3.5 rounded-xl border border-white/10 transition-all flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4.5 w-4.5 border-2 border-white border-t-transparent" />
                ) : success ? (
                  <Check className="h-4.5 w-4.5 text-white" />
                ) : (
                  <Send className="h-4.5 w-4.5" />
                )}
              </button>
            </form>
            {success && (
              <span className="text-[11px] text-algerian-gold font-bold block mt-1.5 animate-pulse">
                {lang === 'ar' ? 'تم الاشتراك بنجاح!' : 'Successfully subscribed!'}
              </span>
            )}
          </div>

        </div>

        <hr className="border-white/5 my-12" />

        {/* Footer Bottom copyright and socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-500 text-center sm:text-start leading-relaxed">
            {text.footer.rights}
          </p>

          <div className="flex items-center gap-4">
            <a
              href={settings?.facebook_url || 'https://facebook.com'}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-algerian-green hover:text-white border border-white/5 text-slate-400 hover:border-algerian-green transition-all"
              aria-label="Facebook Link"
            >
              <FacebookIcon className="h-4.5 w-4.5" />
            </a>
            <a
              href={settings?.twitter_url || 'https://twitter.com'}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-algerian-green hover:text-white border border-white/5 text-slate-400 hover:border-algerian-green transition-all"
              aria-label="Twitter Link"
            >
              <TwitterIcon className="h-4.5 w-4.5" />
            </a>
            <a
              href={settings?.youtube_url || 'https://youtube.com'}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-algerian-green hover:text-white border border-white/5 text-slate-400 hover:border-algerian-green transition-all"
              aria-label="Youtube Link"
            >
              <YoutubeIcon className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
