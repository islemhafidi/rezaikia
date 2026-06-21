import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, BookOpen, Compass } from 'lucide-react';

export default function About({ lang, text }) {
  const values = [
    {
      icon: <Shield className="h-6 w-6 text-algerian-gold" />,
      title: text.about.sovereignty,
      description: text.about.sovereigntyDesc
    },
    {
      icon: <Sparkles className="h-6 w-6 text-algerian-green" />,
      title: text.about.development,
      description: text.about.developmentDesc
    },
    {
      icon: <BookOpen className="h-6 w-6 text-algerian-red" />,
      title: text.about.heritage,
      description: text.about.heritageDesc
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-algerian-green/5 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Biography Text Column */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="lg:col-span-7"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                {text.about.title}
              </h2>
              <div className="h-1.5 w-24 bg-gradient-to-r from-algerian-green to-algerian-gold rounded-full mb-6" />
              <p className="text-lg font-semibold text-algerian-green mb-4">
                {text.about.subtitle}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6 text-slate-600 leading-relaxed">
              <p>{text.about.p1}</p>
              <p>{text.about.p2}</p>
              <p>{text.about.p3}</p>
            </motion.div>
          </motion.div>

          {/* Pillars & November Values Column */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="lg:col-span-5"
          >
            <motion.div 
              variants={itemVariants} 
              className="glass-panel p-8 rounded-3xl border border-slate-100 shadow-xl bg-slate-50/50 relative overflow-hidden"
            >
              {/* Flag Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                <div className="bg-algerian-green flex-1" />
                <div className="bg-white w-4" />
                <div className="bg-algerian-red flex-1" />
              </div>

              <div className="flex items-center gap-3 mb-6 mt-2">
                <div className="bg-algerian-gold/10 p-2 rounded-xl border border-algerian-gold/20">
                  <Compass className="h-6 w-6 text-algerian-gold" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  {text.about.novemberValues}
                </h3>
              </div>

              <div className="space-y-6">
                {values.map((val, idx) => (
                  <motion.div 
                    key={idx} 
                    variants={itemVariants}
                    className="flex gap-4 p-4 rounded-2xl bg-white shadow-sm border border-slate-100 hover:border-algerian-gold/20 hover:shadow-md transition-all group"
                  >
                    <div className="flex-shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:bg-slate-100 transition-colors">
                      {val.icon}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-800 mb-1 group-hover:text-algerian-green transition-colors">
                        {val.title}
                      </h4>
                      <p className="text-sm text-slate-500 leading-normal">
                        {val.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
