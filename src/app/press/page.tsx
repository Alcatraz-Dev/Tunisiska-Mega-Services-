"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, ExternalLink, Newspaper } from "lucide-react";
import Link from "next/link";
import { translations } from "@/translations";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { getSectionContent, isSectionVisible } from "@/lib/pageSettings";

type PressItem = {
  id?: string;
  date?: string;
  link?: string;
  title?: string | Record<string, string | undefined>;
  excerpt?: string | Record<string, string | undefined>;
};

function localized(value: PressItem["title"], language: string) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const record = value as Record<string, string | undefined>;
    return record[language] || record.en || "";
  }
  return "";
}

export default function PressPage() {
  const { lang } = useLanguage();
  const { settings } = useSettings();
  const t = translations[lang];
  const pressData = settings?.sections?.press;
  const pressList = (pressData?.pressList || []) as PressItem[];
  const content = getSectionContent(settings, "press", lang, t.pressPage);
  if (settings && !isSectionVisible(settings, "press")) return null;

  return (
    <main className="press-page" dir="ltr">
      <div className="press-shell">
        <motion.header
          className="press-heading"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
        >
          <Link className="press-back" href="/">
            <ArrowLeft aria-hidden="true" size={17} />
            <span>{t.nav.home}</span>
          </Link>
          <span className="press-kicker"><Newspaper aria-hidden="true" size={15} />{content.pressReleases}</span>
          <h1 dir={lang === "ar" ? "auto" : "ltr"}>{content.title}</h1>
          <p dir={lang === "ar" ? "auto" : "ltr"}>{content.subtitle}</p>
        </motion.header>

        {pressList.length > 0 ? (
          <section className="press-list" aria-label={content.pressReleases}>
            {pressList.map((item, index) => (
              <motion.a
                key={item.id || `${item.date}-${index}`}
                href={item.link || undefined}
                target={item.link ? "_blank" : undefined}
                rel={item.link ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.36, delay: Math.min(index, 5) * 0.05 }}
                className="press-card"
                dir={lang === "ar" ? "auto" : "ltr"}
              >
                <span className="press-card-icon"><Newspaper aria-hidden="true" size={21} /></span>
                <span className="press-card-content">
                  {item.date ? <span className="press-date"><CalendarDays aria-hidden="true" size={14} />{item.date}</span> : null}
                  <strong>{localized(item.title, lang)}</strong>
                  <span className="press-excerpt">{localized(item.excerpt, lang)}</span>
                </span>
                {item.link ? <ExternalLink className="press-external" aria-hidden="true" size={18} /> : <ArrowRight className="press-external" aria-hidden="true" size={18} />}
              </motion.a>
            ))}
          </section>
        ) : (
          <motion.section
            className="press-empty-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.08 }}
            dir={lang === "ar" ? "auto" : "ltr"}
          >
            <span className="press-empty-icon"><Newspaper aria-hidden="true" size={25} /></span>
            <h2>{content.pressReleases}</h2>
            <p>{content.noReleases}</p>
          </motion.section>
        )}

        <motion.aside
          className="press-contact-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, delay: 0.14 }}
          dir={lang === "ar" ? "auto" : "ltr"}
        >
          <span className="press-contact-icon"><CalendarDays aria-hidden="true" size={20} /></span>
          <p>{content.mediaContact}</p>
          <ArrowRight aria-hidden="true" size={18} />
        </motion.aside>
      </div>
    </main>
  );
}
