'use client';

import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import { translations } from '@/translations';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';

export default function CareersPage() {
  const { lang } = useLanguage();
  const { settings } = useSettings();
  const t = translations[lang];
  const careerData = settings?.sections?.careers;
  const positions = careerData?.positions || [];
  const content = careerData?.content?.[lang] || translations[lang].careersPage;

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
        {positions.length > 0 ? (
          <div className="grid gap-4">
            {positions.map((job: any, index: number) => (
              <motion.a
                key={job.id}
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {job.title[lang] || job.title['en']}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.department[lang] || job.department['en']}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location[lang] || job.location['en']}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{job.type[lang] || job.type['en']}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
            <Briefcase className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">{content.openPositions}</h2>
            <p className="text-gray-400 mb-8">{content.noPositions}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-white/5 rounded-2xl p-6 border border-white/10">
            <p className="text-gray-300">{content.sendResume}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
