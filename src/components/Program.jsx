import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, GraduationCap, Cpu, HeartHandshake, X, ChevronRight, ChevronLeft } from 'lucide-react';

export default function Program({ lang, text }) {
  const [activePillar, setActivePillar] = useState(null);
  const isRtl = lang === 'ar';

  const pillars = [
    {
      id: 'economy',
      icon: <Landmark className="h-8 w-8 text-algerian-green" />,
      colorClass: 'border-algerian-green bg-algerian-green/5',
      title: text.program.pillars.economy.title,
      short: text.program.pillars.economy.short,
      detailed: text.program.pillars.economy.detailed
    },
    {
      id: 'youth',
      icon: <GraduationCap className="h-8 w-8 text-algerian-gold" />,
      colorClass: 'border-algerian-gold bg-algerian-gold/5',
      title: text.program.pillars.youth.title,
      short: text.program.pillars.youth.short,
      detailed: text.program.pillars.youth.detailed
    },
    {
      id: 'digital',
      icon: <Cpu className="h-8 w-8 text-algerian-red" />,
      colorClass: 'border-algerian-red bg-algerian-red/5',
      title: text.program.pillars.digital.title,
      short: text.program.pillars.digital.short,
      detailed: text.program.pillars.digital.detailed
    },
    {
      id: 'justice',
      icon: <HeartHandshake className="h-8 w-8 text-slate-700" />,
      colorClass: 'border-slate-300 bg-slate-50',
      title: text.program.pillars.justice.title,
      short: text.program.pillars.justice.short,
      detailed: text.program.pillars.justice.detailed
    }
  ];

  return (
    <section id="program" className="py-24 bg-algerian-cream relative bg-zellige overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-algerian-gold/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {text.program.title}
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-algerian-green to-algerian-gold mx-auto rounded-full mb-4" />
          <p className="text-slate-600 text-base sm:text-lg">
            {text.program.subtitle}
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActivePillar(pillar)}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-xl cursor-pointer flex flex-col justify-between transition-all group relative overflow-hidden"
            >
              {/* Inner Decorative Background Pattern */}
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-slate-50 group-hover:scale-150 group-hover:bg-slate-100/50 transition-all duration-300 -z-0" />
              
              <div className="relative z-10">
                <div className={`p-4 rounded-2xl border w-fit mb-6 ${pillar.colorClass}`}>
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-algerian-green transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {pillar.short}
                </p>
              </div>

              <div className="flex items-center gap-1 text-sm font-bold text-algerian-green group-hover:text-algerian-red transition-all relative z-10">
                <span>{text.program.readMore}</span>
                {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Modal for Detailed Pillar Information */}
        <AnimatePresence>
          {activePillar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePillar(null)}
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
                {/* Header Flag Line */}
                <div className="h-2 flex">
                  <div className="bg-algerian-green flex-1" />
                  <div className="bg-white w-4" />
                  <div className="bg-algerian-red flex-1" />
                </div>

                <div className="p-8">
                  {/* Close button */}
                  <button
                    onClick={() => setActivePillar(null)}
                    className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3.5 rounded-2xl border ${activePillar.colorClass}`}>
                      {activePillar.icon}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-algerian-gold tracking-widest block">
                        {text.hero.badgeTitle}
                      </span>
                      <h4 className="text-2xl font-black text-slate-800">
                        {activePillar.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-slate-600 text-base leading-relaxed mb-6 font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {activePillar.short}
                  </p>

                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm">
                    {activePillar.detailed}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => setActivePillar(null)}
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
