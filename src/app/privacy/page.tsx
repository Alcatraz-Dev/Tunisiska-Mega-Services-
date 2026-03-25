'use client';

import { motion } from 'framer-motion';
import { translations } from '@/translations';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
  const { lang } = useLanguage();
  const t = translations[lang].privacyPage;

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
          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">{t.collectionTitle}</h2>
          <p>{t.collectionDesc}</p>
          <ul className="list-disc pl-6 space-y-2">
            {t.collectionItems.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p>{t.collectionLocation}</p>
          <p>{t.collectionAI}</p>
          <p>{t.collectionMarketing}</p>
          <p>{t.collectionPII}</p>
          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">{t.thirdPartyTitle}</h2>
          <p>{t.thirdPartyDesc}</p>
          <p>{t.thirdPartyLinks}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Google Play Services</li>
            <li>Expo</li>
            <li>Clerk</li>
          </ul>
          <p>{t.thirdPartyDisclose}</p>
          <ul className="list-disc pl-6 space-y-2">
            {t.thirdPartyDiscloseItems.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">{t.optOutTitle}</h2>
          <p>{t.optOutDesc}</p>
          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">{t.retentionTitle}</h2>
          <p>{t.retentionDesc}</p>
          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">{t.childrenTitle}</h2>
          <p>{t.childrenDesc1}</p>
          <p>{t.childrenDesc2}</p>
          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">{t.securityTitle}</h2>
          <p>{t.securityDesc}</p>
          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">{t.changesTitle}</h2>
          <p>{t.changesDesc}</p>
          <p>{t.effectiveDate}</p>
          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">{t.consentTitle}</h2>
          <p>{t.consentDesc}</p>
          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">{t.contactTitle}</h2>
          <p>{t.contactDesc}</p>
        </div>
      </motion.div>
    </div>
  );
}
