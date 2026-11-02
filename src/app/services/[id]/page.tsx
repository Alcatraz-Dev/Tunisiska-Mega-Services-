"use client";

import { use } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { translations } from "@/translations";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import RealAppShot, { type AppShotName } from "@/components/RealAppShot";
import { getSectionContent, isSectionVisible } from "@/lib/pageSettings";

const VALID_SERVICES = ["shipping", "taxi", "cleaning", "containerShipping"];
const serviceShots: Record<string, AppShotName> = { shipping: "trip-details", taxi: "home", cleaning: "news", containerShipping: "capacity-calendar" };

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang } = useLanguage();
  const { settings } = useSettings();
  const t = translations[lang];
  if (!VALID_SERVICES.includes(id)) redirect("/services");
  const serviceKey = id as keyof typeof t.serviceDetails;
  const fallback = t.serviceDetails[serviceKey];
  const sectionId = `service_${id}`;
  const localized = getSectionContent(settings, sectionId, lang, fallback);
  if (settings && !isSectionVisible(settings, sectionId)) redirect("/services");
  const features = Array.isArray(localized.features) ? localized.features : fallback.features;
  const service = { title: localized.title || fallback.title, desc: localized.desc || fallback.desc, features, cta: localized.cta || fallback.cta, image: typeof localized.image === "string" ? localized.image : undefined };
  return (
    <main className="content-page" dir="ltr">
      <div className="content-shell">
        <section className="service-detail-layout">
          <motion.div className="service-detail-copy" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }} dir={lang === "ar" ? "auto" : "ltr"}>
            <Link className="content-back-link" href="/services">{getSectionContent(settings, "services", lang, t.servicesPage).title}</Link>
            <h1>{service.title}</h1>
            <p className="content-lead">{service.desc}</p>
            <ul className="service-benefits">{service.features.map((item: string, i: number) => <li key={i}><CheckCircle2 size={19} /><span>{item}</span></li>)}</ul>
            <button className="content-primary-button" onClick={() => window.dispatchEvent(new CustomEvent("open-app-modal"))}>{service.cta}<ArrowRight size={17} /></button>
          </motion.div>
          <RealAppShot screen={serviceShots[id]} alt={service.title} className="service-detail-shot" src={service.image} />
        </section>
      </div>
    </main>
  );
}
