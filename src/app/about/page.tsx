"use client";

import { motion } from "framer-motion";
import { ArrowLeftRight, CheckCircle2 } from "lucide-react";
import { translations } from "@/translations";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { getSectionContent, isSectionVisible } from "@/lib/pageSettings";
import RealAppShot from "@/components/RealAppShot";

export default function AboutPage() {
  const { lang } = useLanguage();
  const { settings } = useSettings();
  const t = translations[lang];
  const content = getSectionContent(settings, "about", lang, t.aboutPage);
  if (settings && !isSectionVisible(settings, "about")) return null;
  return (
    <main className="content-page" dir="ltr">
      <div className="content-shell">
        <header className="content-heading" dir={lang === "ar" ? "auto" : "ltr"}><h1>{content.title}</h1><p>{content.subtitle}</p></header>
        <section className="about-layout">
          <motion.div className="about-copy" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .45 }} dir={lang === "ar" ? "auto" : "ltr"}>
            <div className="about-route-mark"><ArrowLeftRight size={20} /><span>Sweden <i>↔</i> Tunisia</span></div>
            <div className="about-copy-block"><h2>{content.missionTitle}</h2><p>{content.missionDesc}</p></div>
            <div className="about-copy-block"><h2>{content.visionTitle}</h2><p>{content.visionDesc}</p></div>
            <div className="about-proof"><CheckCircle2 size={18} /><span>{t.landing.routeCardFoot}</span></div>
          </motion.div>
          <RealAppShot screen="home" alt={t.landing.homeScreenLabel} className="about-shot" />
        </section>
      </div>
    </main>
  );
}
