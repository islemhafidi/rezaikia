import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, ArrowLeft, X, Newspaper } from 'lucide-react';

export default function News({ lang, text }) {
  const [activeNews, setActiveNews] = useState(null);
  const isRtl = lang === 'ar';

  return (
    <section id="news" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-algerian-green/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {text.news.title}
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-algerian-green to-algerian-gold mx-auto rounded-full mb-4" />
          <p className="text-slate-600 text-base sm:text-lg">
            {text.news.subtitle}
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {text.news.list.map((item) => (
            <motion.article
              key={item.id}
              whileHover={{ y: -6 }}
              className="bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between hover:shadow-lg transition-all group"
            >
              <div className="p-6 sm:p-8">
                {/* Date Tag */}
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-4">
                  <Calendar className="h-4 w-4 text-algerian-gold" />
                  <span>{item.date}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-algerian-green transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
              </div>

              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
                <button
                  onClick={() => setActiveNews(item)}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs py-3 px-4 rounded-xl hover:bg-algerian-green hover:text-white hover:border-algerian-green transition-all"
                >
                  <span>{text.news.readMore}</span>
                  {isRtl ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Modal Overlay */}
        <AnimatePresence>
          {activeNews && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveNews(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 relative"
              >
                {/* Visual Flag Accents */}
                <div className="h-2 flex">
                  <div className="bg-algerian-green flex-1" />
                  <div className="bg-white w-4" />
                  <div className="bg-algerian-red flex-1" />
                </div>

                <div className="p-8">
                  {/* Close button */}
                  <button
                    onClick={() => setActiveNews(null)}
                    className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-2.5 text-xs text-slate-400 font-bold mb-4">
                    <Calendar className="h-4 w-4 text-algerian-gold" />
                    <span>{activeNews.date}</span>
                    <span className="text-slate-200">|</span>
                    <span className="flex items-center gap-1 text-algerian-green">
                      <Newspaper className="h-3.5 w-3.5" />
                      {text.nav.news}
                    </span>
                  </div>

                  <h4 className="text-2xl font-black text-slate-800 mb-6 leading-tight">
                    {activeNews.title}
                  </h4>

                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
                    {activeNews.fullText}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setActiveNews(null)}
                      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-sm font-bold transition-all"
                    >
                      {text.program.close}
                    </button>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
