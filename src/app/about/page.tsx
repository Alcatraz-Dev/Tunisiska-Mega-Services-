'use client';

import { motion } from 'framer-motion';
import { translations } from '@/translations';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.aboutPage.title}</h1>
        <p className="text-xl text-gray-400">{t.aboutPage.subtitle}</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 relative">
            <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-purple-500/20 mix-blend-overlay"></div>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000"
              alt="Team collaboration"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-2xl font-bold mb-4 text-primary">{t.aboutPage.missionTitle}</h2>
            <p className="text-gray-300 leading-relaxed text-lg">{t.aboutPage.missionDesc}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-accent">{t.aboutPage.visionTitle}</h2>
            <p className="text-gray-300 leading-relaxed text-lg">{t.aboutPage.visionDesc}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
