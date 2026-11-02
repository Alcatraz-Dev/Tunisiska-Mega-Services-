"use client";

import { motion } from "framer-motion";
import { FileCheck2 } from "lucide-react";
import { translations } from "@/translations";
import { useLanguage } from "@/context/LanguageContext";

export default function TermsPage() {
  const { lang } = useLanguage();
  const t = translations[lang].termsPage;
  return (
    <main className="content-page legal-page" dir="ltr"><article className="legal-shell" dir={lang === "ar" ? "rtl" : "ltr"}>
      <motion.header className="legal-header" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><span className="legal-icon"><FileCheck2 size={22} /></span><h1>{t.title}</h1><p>{t.intro}</p></motion.header>
      <div className="legal-content"><p>{t.terms1}</p><p>{t.terms2}</p><p>{t.terms3}</p><p>{t.thirdPartyIntro}</p><ul><li>Google Play Services</li><li>Expo</li><li>Clerk</li></ul><h2>{t.changesTitle}</h2><p>{t.changesDesc}</p><p>{t.effectiveDate}</p><h2>{t.contactTitle}</h2><p>{t.contactDesc}</p></div>
    </article></main>
  );
}
