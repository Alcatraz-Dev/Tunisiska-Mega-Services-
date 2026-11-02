"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import { translations } from "@/translations";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import RealAppShot from "@/components/RealAppShot";
import { getSectionContent, isSectionVisible } from "@/lib/pageSettings";

type LocalizedCopy = Record<string, string | undefined>;
type CareerPosition = { id: string; link: string; title: LocalizedCopy; department: LocalizedCopy; location: LocalizedCopy; type: LocalizedCopy };

export default function CareersPage() {
  const { lang } = useLanguage();
  const { settings } = useSettings();
  const t = translations[lang];
  const careerData = settings?.sections?.careers;
  const positions = (careerData?.positions || []) as CareerPosition[];
  const content = getSectionContent(settings, "careers", lang, t.careersPage);
  if (settings && !isSectionVisible(settings, "careers")) return null;
  return (
    <main className="content-page" dir="ltr">
      <div className="content-shell">
        <header className="content-heading" dir={lang === "ar" ? "auto" : "ltr"}><h1>{content.title}</h1><p>{content.subtitle}</p></header>
        <section className="careers-layout">
          <div className="careers-list" dir={lang === "ar" ? "auto" : "ltr"}>
            {positions.length ? positions.map((job, i: number) => <motion.a key={job.id} href={job.link} target="_blank" rel="noopener noreferrer" className="career-row" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05 }}><span className="content-icon"><Briefcase size={20} /></span><span className="career-copy"><strong>{job.title[lang] || job.title.en}</strong><span><span><Briefcase size={14} />{job.department[lang] || job.department.en}</span><span><MapPin size={14} />{job.location[lang] || job.location.en}</span><span><Clock size={14} />{job.type[lang] || job.type.en}</span></span></span><ArrowRight size={18} /></motion.a>) : <section className="careers-empty"><span className="content-icon"><Briefcase size={22} /></span><h2>{content.openPositions}</h2><p>{content.noPositions}</p></section>}
            <div className="career-resume"><strong>{content.sendResume}</strong><a href="mailto:business@tunsiska.com">business@tunsiska.com<ArrowRight size={15} /></a></div>
          </div>
          <RealAppShot screen="home" alt={t.landing.homeScreenLabel} className="career-shot" />
        </section>
      </div>
    </main>
  );
}
