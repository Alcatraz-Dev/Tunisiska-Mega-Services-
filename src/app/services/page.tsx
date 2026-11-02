"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Sparkles, Car, ArrowRight, Box } from "lucide-react";
import { translations } from "@/translations";
import { useLanguage } from "@/context/LanguageContext";
import RealAppShot from "@/components/RealAppShot";
import { getSectionContent, isSectionVisible } from "@/lib/pageSettings";
import { useSettings } from "@/context/SettingsContext";

export default function ServicesPage() {
  const { lang } = useLanguage();
  const { settings } = useSettings();
  const t = translations[lang];
  const content = getSectionContent(settings, "services", lang, t.servicesPage);
  const cta = getSectionContent(settings, "cta", lang, {
    title: t.cta.title,
    desc: t.landing.ctaDescription,
    button: t.cta.button,
  });
  if (settings && !isSectionVisible(settings, "services")) return null;
  const services = [
    { id: "shipping", Icon: Package, title: t.features.f1Title, desc: t.features.f1Desc },
    { id: "cleaning", Icon: Sparkles, title: t.features.f2Title, desc: t.features.f2Desc },
    { id: "taxi", Icon: Car, title: t.features.f3Title, desc: t.features.f3Desc },
    { id: "containerShipping", Icon: Box, title: t.features.f4Title, desc: t.features.f4Desc },
  ].filter(({ id }) => isSectionVisible(settings, `service_${id}`))
    .map((service) => {
      const section = getSectionContent(settings, `service_${service.id}`, lang, service);
      return { ...service, title: String(section.title || service.title), desc: String(section.desc || service.desc) };
    });
  return (
    <main className="content-page" dir="ltr">
      <div className="content-shell">
        <header className="content-heading" dir={lang === "ar" ? "auto" : "ltr"}>
          <h1>{content.title}</h1>
          <p>{content.subtitle}</p>
        </header>
        <section className="services-layout">
          <div className="services-list">
            {services.map(({ id, Icon, title, desc }, index) => (
              <motion.div key={id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }}>
                <Link href={`/services/${id}`} className="content-service-row" dir={lang === "ar" ? "auto" : "ltr"}>
                  <span className="content-icon"><Icon size={21} strokeWidth={1.8} /></span>
                  <span className="content-service-copy"><strong>{title}</strong><span>{desc}</span></span>
                  <ArrowRight className={lang === "ar" ? "rotate-180" : ""} size={18} />
                </Link>
              </motion.div>
            ))}
            <div className="content-note" dir={lang === "ar" ? "auto" : "ltr"}>
              <strong>{content.allServices}</strong>
              <span>{cta.title}</span>
              <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("open-app-modal"))}>{cta.button}<ArrowRight size={16} /></button>
            </div>
          </div>
          <RealAppShot screen="home" alt={t.landing.homeScreenLabel} className="content-feature-shot" />
        </section>
      </div>
    </main>
  );
}
