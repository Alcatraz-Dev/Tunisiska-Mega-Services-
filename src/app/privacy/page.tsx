"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { translations } from "@/translations";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyPage() {
  const { lang } = useLanguage();
  const t = translations[lang].privacyPage;
  const heading = (text: string) => <h2>{text}</h2>;
  const list = (items: string[]) => <ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>;
  return (
    <main className="content-page legal-page" dir="ltr"><article className="legal-shell" dir={lang === "ar" ? "rtl" : "ltr"}>
      <motion.header className="legal-header" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><span className="legal-icon"><ShieldCheck size={22} /></span><h1>{t.title}</h1><p>{t.intro}</p></motion.header>
      <div className="legal-content">
        {heading(t.collectionTitle)}<p>{t.collectionDesc}</p>{list(t.collectionItems)}<p>{t.collectionLocation}</p><p>{t.collectionAI}</p><p>{t.collectionMarketing}</p><p>{t.collectionPII}</p>
        {heading(t.thirdPartyTitle)}<p>{t.thirdPartyDesc}</p><p>{t.thirdPartyLinks}</p>{list(["Google Play Services", "Expo", "Clerk"])}<p>{t.thirdPartyDisclose}</p>{list(t.thirdPartyDiscloseItems)}
        {heading(t.optOutTitle)}<p>{t.optOutDesc}</p>{heading(t.retentionTitle)}<p>{t.retentionDesc}</p>{heading(t.childrenTitle)}<p>{t.childrenDesc1}</p><p>{t.childrenDesc2}</p>{heading(t.securityTitle)}<p>{t.securityDesc}</p>{heading(t.changesTitle)}<p>{t.changesDesc}</p><p>{t.effectiveDate}</p>{heading(t.consentTitle)}<p>{t.consentDesc}</p>{heading(t.contactTitle)}<p>{t.contactDesc}</p>
      </div>
    </article></main>
  );
}
