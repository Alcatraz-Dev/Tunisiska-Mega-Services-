'use client';

import { motion } from 'framer-motion';
import { translations } from '@/translations';
import { useLanguage } from '@/context/LanguageContext';

export default function TermsPage() {
  const { lang } = useLanguage();
  const t = translations[lang].termsPage;

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-white">{t.title}</h1>
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>{t.intro}</p>
          <p>{t.terms1}</p>
          <p>{t.terms2}</p>
          <p>{t.terms3}</p>
          <p>{t.thirdPartyIntro}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Google Play Services</li>
            <li>Expo</li>
            <li>Clerk</li>
          </ul>
          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">{t.changesTitle}</h2>
          <p>{t.changesDesc}</p>
          <p>{t.effectiveDate}</p>
          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">{t.contactTitle}</h2>
          <p>{t.contactDesc}</p>
        </div>
      </motion.div>
    </div>
  );
}
