'use client';

import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import { translations } from '@/translations';
import { useLanguage } from '@/context/LanguageContext';

export default function PressPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.pressPage.title}</h1>
        <p className="text-xl text-gray-400">{t.pressPage.subtitle}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center">
          <Newspaper className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-4">{t.pressPage.pressReleases}</h2>
          <p className="text-gray-400 mb-8">{t.pressPage.noReleases}</p>
          <div className="inline-block bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300">{t.pressPage.mediaContact}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
