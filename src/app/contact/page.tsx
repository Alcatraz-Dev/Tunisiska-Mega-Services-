"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, ArrowRight } from "lucide-react";
import { translations } from "@/translations";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { getSectionContent, isSectionVisible } from "@/lib/pageSettings";
import RealAppShot from "@/components/RealAppShot";

export default function ContactPage() {
  const { lang } = useLanguage();
  const { settings } = useSettings();
  const t = translations[lang];
  const content = getSectionContent(settings, "contact", lang, t.contactPage);
  if (settings && !isSectionVisible(settings, "contact")) return null;
  return (
    <main className="content-page" dir="ltr">
      <div className="content-shell">
        <header className="content-heading" dir={lang === "ar" ? "auto" : "ltr"}><h1>{content.title}</h1><p>{content.subtitle}</p></header>
        <section className="contact-layout">
          <aside className="contact-aside" dir={lang === "ar" ? "auto" : "ltr"}>
            <article className="contact-detail"><span className="content-icon"><MapPin size={20} /></span><div><strong>{content.addressTitle}</strong><p><b>{content.addressSweden}</b><br />Sveavägen 44<br />111 34 Stockholm</p><p><b>{content.addressTunisia}</b><br />Avenue Habib Bourguiba<br />1000 Tunis</p></div></article>
            <article className="contact-detail"><span className="content-icon"><Mail size={20} /></span><div><strong>{content.emailTitle}</strong><a href="mailto:support@tunsiska.com">support@tunsiska.com</a><a href="mailto:business@tunsiska.com">business@tunsiska.com</a></div></article>
            <article className="contact-detail"><span className="content-icon"><Phone size={20} /></span><div><strong>{content.phoneTitle}</strong><p>SE: +46 8 123 45 67</p><p>TN: +216 71 123 456</p></div></article>
            {/* <RealAppShot screen="news" alt={t.landing.newsScreenLabel} className="contact-shot" /> */}
          </aside>
          <motion.form className="contact-form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }} dir={lang === "ar" ? "auto" : "ltr"}>
            <div className="contact-form-title"><span>{content.emailTitle}</span><ArrowRight size={18} /></div>
            <div className="contact-fields">
              <label>{content.formName}<input type="text" name="name" autoComplete="name" placeholder="" /></label>
              <label>{content.formEmail}<input type="email" name="email" autoComplete="email" placeholder="" /></label>
            </div>
            <label>{content.formSubject}<input type="text" name="subject" /></label>
            <label>{content.formMessage}<textarea name="message" rows={6} /></label>
            <button type="button" className="content-primary-button"><Send size={17} />{content.formSubmit}</button>
          </motion.form>
        </section>
      </div>
    </main>
  );
}
