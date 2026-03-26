'use client';

import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Calendar } from 'lucide-react';
import { translations } from '@/translations';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';

export default function PressPage() {
  const { lang } = useLanguage();
  const { settings } = useSettings();
  const t = translations[lang];
  const pressData = settings?.sections?.press;
  const pressList = pressData?.pressList || [];
  const content = pressData?.content?.[lang] || translations[lang].pressPage;

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{content.title}</h1>
        <p className="text-xl text-gray-400">{content.subtitle}</p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {pressList.length > 0 ? (
          <div className="grid gap-6">
            {pressList.map((item: any, index: number) => (
              <motion.a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col md:flex-row md:items-center gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-primary text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {item.title[lang] || item.title['en']}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {item.excerpt[lang] || item.excerpt['en']}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </div>
              </motion.a>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center"
          >
            <Newspaper className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">{content.pressReleases}</h2>
            <p className="text-gray-400 mb-8">{content.noReleases}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-white/5 rounded-2xl p-6 border border-white/10">
            <p className="text-gray-300">{content.mediaContact}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
