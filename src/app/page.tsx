"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Box,
  CarFront,
  Check,
  Package,
  Sparkles,
  MapPin,
} from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa6";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { translations } from "@/translations";
import { resolveStoreUrl, StoreSettings } from "@/lib/storeLinks";
import { getManagedGallery, getMockup, getMockupImage, getSectionContent, isSectionVisible, type ManagedMockup } from "@/lib/pageSettings";

function StoreBadge({
  store,
  settings,
  eyebrow,
  label,
}: {
  store: "appStore" | "googlePlay";
  settings: StoreSettings | null | undefined;
  eyebrow: string;
  label: string;
}) {
  if (settings?.links?.[`${store}Enabled`] === false) return null;
  const href = resolveStoreUrl(settings, store);
  const Icon = store === "appStore" ? FaApple : FaGooglePlay;

  return (
    <a
      className="store-badge"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${eyebrow} ${label}`}
    >
      <Icon aria-hidden="true" className="store-badge-icon" />
      <span className="store-badge-copy" dir="auto">
        <small>{eyebrow}</small>
        <strong>{label}</strong>
      </span>
      <ArrowUpRight aria-hidden="true" className="store-badge-arrow" />
    </a>
  );
}

function AppScreen({
  src,
  alt,
  config,
  className = "",
  sizes = "(max-width: 640px) 60vw, 280px",
  fallbackSrc = src,
}: {
  src: string;
  alt: string;
  config?: ManagedMockup;
  className?: string;
  sizes?: string;
  fallbackSrc?: string;
}) {
  const mockupImage = config?.type === "image" ? config.image : undefined;
  const requestedImage = mockupImage || src;
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const imageSource = failedImage === requestedImage ? fallbackSrc : requestedImage;
  const Icon = config?.icon === "sparkles"
    ? Sparkles
    : config?.icon === "car"
      ? CarFront
      : config?.icon === "map-pin"
        ? MapPin
        : Package;
  const deviceStyle = config?.style || "";
  const deviceKind = deviceStyle.toLowerCase().includes("laptop") || deviceStyle.toLowerCase().includes("macbook")
    ? "laptop"
    : deviceStyle.toLowerCase().includes("ipad") || deviceStyle.toLowerCase().includes("tablet")
      ? "tablet"
      : "phone";

  return (
    <div className={`app-screen-frame app-screen-${deviceKind} ${className}`} data-device-style={deviceStyle}>
      {config?.type === "icon" ? (
        <div className={`app-screen-icon app-screen-icon-${config.color || "primary"}`}>
          <Icon aria-hidden="true" size={34} strokeWidth={1.7} />
        </div>
      ) : (
        <Image
          src={imageSource}
          alt={alt}
          width={430}
          height={932}
          loading="eager"
          sizes={sizes}
          className="app-screen-image"
          unoptimized={imageSource.startsWith("http")}
          onError={() => {
            if (requestedImage !== fallbackSrc) setFailedImage(requestedImage);
          }}
        />
      )}
    </div>
  );
}

export default function HomePage() {
  const { lang } = useLanguage();
  const { settings } = useSettings();
  const galleryRef = useRef<HTMLDivElement>(null);
  const [galleryInView, setGalleryInView] = useState(false);
  const [galleryPaused, setGalleryPaused] = useState(false);
  const t = translations[lang];
  const copy = t.landing;
  const isRtl = lang === "ar";
  const heroCopy = getSectionContent(settings, "hero", lang, {
    tag: copy.eyebrow,
    title1: copy.title,
    title2: "",
    desc: copy.description,
  });
  const featureCopy = getSectionContent(settings, "features", lang, {
    title1: t.features.title1,
    title2: t.features.title2,
    desc: t.features.desc,
  });
  const galleryCopy = getSectionContent(settings, "gallery", lang, {
    headline: copy.screensTitle,
    description: copy.screensDescription,
  });
  const ctaCopy = getSectionContent(settings, "cta", lang, {
    title: t.cta.title,
    desc: copy.ctaDescription,
    button: t.cta.button,
  });
  const heroCenterConfig = getMockup(settings, "heroCenter");
  const heroLeftConfig = getMockup(settings, "heroLeft");
  const heroRightConfig = getMockup(settings, "heroRight");
  const heroMainImage = getMockupImage(settings, "heroCenter") || "/app-screens/home.webp";
  const heroSideImage = getMockupImage(settings, "heroLeft") || "/app-screens/trip-details.webp";
  const heroThirdImage = getMockupImage(settings, "heroRight") || "/app-screens/capacity-calendar.webp";
  const services = [
    { id: "shipping", title: t.features.f1Title, desc: t.features.f1Desc, Icon: Package },
    { id: "cleaning", title: t.features.f2Title, desc: t.features.f2Desc, Icon: Sparkles },
    { id: "taxi", title: t.features.f3Title, desc: t.features.f3Desc, Icon: CarFront },
    { id: "containerShipping", title: t.features.f4Title, desc: t.features.f4Desc, Icon: Box },
  ]
    .filter(({ id }) => isSectionVisible(settings, `service_${id}`))
    .map((service) => {
      const content = getSectionContent(settings, `service_${service.id}`, lang, service);
      return { ...service, title: String(content.title || service.title), desc: String(content.desc || service.desc) };
    });

  const defaultScreens = [
    { src: "/app-screens/trip-details.webp", title: copy.tripScreenLabel },
    { src: "/app-screens/capacity-calendar.webp", title: copy.capacityScreenLabel },
    { src: "/app-screens/news.webp", title: copy.newsScreenLabel },
    { src: "/app-screens/news-detail.webp", title: copy.newsDetailScreenLabel },
  ];
  const managedScreens = getManagedGallery(settings);
  const managedScreenCards: Array<{ src: string; alt: string; title: string; config?: ManagedMockup }> = managedScreens
        .map((screen, index) => ({
          src: screen.image || defaultScreens[index % defaultScreens.length].src,
          alt: screen.alt || screen.title || defaultScreens[index % defaultScreens.length].title,
          title: screen.title || defaultScreens[index % defaultScreens.length].title,
          config: screen,
        }));
  const screenCards = managedScreens.length
    ? managedScreenCards
    : defaultScreens.map((screen) => ({ ...screen, alt: screen.title, config: undefined }));

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setGalleryInView(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(gallery);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery || !galleryInView || galleryPaused || screenCards.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      const firstCard = gallery.querySelector<HTMLElement>(".screen-gallery-card");
      if (!firstCard) return;
      const gap = Number.parseFloat(window.getComputedStyle(gallery.querySelector(".screen-gallery-track")!).gap) || 0;
      const step = firstCard.getBoundingClientRect().width + gap;
      const lastPosition = gallery.scrollWidth - gallery.clientWidth;
      if (lastPosition <= 0) return;
      if (gallery.scrollLeft + step >= lastPosition - 2) gallery.scrollTo({ left: 0, behavior: "smooth" });
      else gallery.scrollBy({ left: step, behavior: "smooth" });
    }, 3600);
    return () => window.clearInterval(timer);
  }, [galleryInView, galleryPaused, screenCards.length]);

  return (
    <div className="landing-page" dir="ltr">
      {isSectionVisible(settings, "hero") && (
        <section className="landing-hero">
          <div className="landing-shell landing-hero-grid">
            <motion.div
              className="landing-hero-copy"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              dir={isRtl ? "auto" : "ltr"}
            >
              <div className="route-eyebrow">
                <span className="route-eyebrow-dot" />
                {heroCopy.tag}
              </div>
              <h1>{[heroCopy.title1, heroCopy.title2].filter(Boolean).join(" ")}</h1>
              <p className="landing-hero-description">{heroCopy.desc}</p>
              <div className="landing-store-row">
                <StoreBadge
                  store="appStore"
                  settings={settings}
                  eyebrow={t.hero.downloadAppStore}
                  label={t.hero.appStore}
                />
                <StoreBadge
                  store="googlePlay"
                  settings={settings}
                  eyebrow={t.hero.getGooglePlay}
                  label={t.hero.googlePlay}
                />
              </div>
              <Link className="text-action" href="#services">
                {copy.browseServices}
                <ArrowRight aria-hidden="true" className={isRtl ? "rotate-180" : ""} size={18} />
              </Link>
            </motion.div>

            <div className="landing-hero-visual" aria-label={copy.appPreviewLabel}>
              <div className="hero-orbit hero-orbit-one" />
              <div className="hero-orbit hero-orbit-two" />
              <motion.div
                className="hero-phone hero-phone-main"
                initial={{ opacity: 0, y: 24, rotate: 2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              >
                <AppScreen src={heroMainImage} alt={copy.homeScreenLabel} config={heroCenterConfig} fallbackSrc="/app-screens/home.webp" sizes="(max-width: 900px) 66vw, 340px" />
              </motion.div>
              <motion.div
                className="hero-phone hero-phone-side"
                initial={{ opacity: 0, x: 18, y: 12, rotate: 8 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 7 }}
                transition={{ duration: 0.7, delay: 0.28, ease: "easeOut" }}
              >
                <AppScreen src={heroSideImage} alt={copy.tripScreenLabel} config={heroLeftConfig} fallbackSrc="/app-screens/trip-details.webp" sizes="(max-width: 900px) 35vw, 190px" />
              </motion.div>
              <motion.div
                className="hero-phone hero-phone-third"
                initial={{ opacity: 0, x: -14, y: 16, rotate: -7 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: -7 }}
                transition={{ duration: 0.65, delay: 0.36, ease: "easeOut" }}
              >
                <AppScreen src={heroThirdImage} alt={copy.capacityScreenLabel} config={heroRightConfig} fallbackSrc="/app-screens/capacity-calendar.webp" sizes="(max-width: 900px) 28vw, 150px" />
              </motion.div>
              <div className="route-preview-card" dir={isRtl ? "auto" : "ltr"}>
                <div className="route-preview-brand">
                  <Image src="/brand/app-icon.png" alt="" width={38} height={38} />
                  <span>{copy.routeCardTitle}</span>
                </div>
                <div className="route-preview-stops">
                  <span className="route-stop"><i>SE</i>{copy.sweden}</span>
                  <ArrowLeftRight aria-hidden="true" size={20} />
                  <span className="route-stop"><i>TN</i>{copy.tunisia}</span>
                </div>
                <div className="route-preview-foot"><Check size={15} />{copy.routeCardFoot}</div>
              </div>
            </div>
          </div>
          <div className="landing-shell hero-route-strip">
            <div className="route-strip-icon"><ArrowLeftRight size={20} /></div>
            <div><strong>{copy.routeTitle}</strong><span>{copy.routeSubtitle}</span></div>
            <Link href="#screens" aria-label={copy.seeScreens}><ArrowRight size={19} className={isRtl ? "rotate-180" : ""} /></Link>
          </div>
        </section>
      )}

      {isSectionVisible(settings, "features") && services.length > 0 && (
        <section id="services" className="landing-section service-section">
          <div className="landing-shell">
            <div className="section-heading" dir={isRtl ? "auto" : "ltr"}>
              <div>
                <span className="section-kicker">{copy.serviceKicker}</span>
                <h2>{featureCopy.title1} {featureCopy.title2}</h2>
              </div>
              <p>{featureCopy.desc}</p>
            </div>
            <div className="service-grid">
              {services.map(({ id, title, desc, Icon }, index) => (
                <Link href={`/services/${id}`} key={id} className="service-card-link" dir={isRtl ? "auto" : "ltr"}>
                  <motion.article
                    className="service-card"
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.42, delay: index * 0.06 }}
                    whileHover={{ y: -5 }}
                  >
                    <span className={`service-icon service-icon-${index}`}><Icon aria-hidden="true" size={23} strokeWidth={1.8} /></span>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                    <span className="service-card-action">{t.features.learnMore}<ArrowRight size={16} className={isRtl ? "rotate-180" : ""} /></span>
                  </motion.article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {isSectionVisible(settings, "gallery") && (
        <section id="screens" className="landing-section screens-section">
          <div className="landing-shell">
            <div className="section-heading screens-heading" dir={isRtl ? "auto" : "ltr"}>
              <div>
                <span className="section-kicker">{copy.screensKicker}</span>
                <h2>{galleryCopy.headline}</h2>
              </div>
              <p>{galleryCopy.description}</p>
            </div>
            <div
              className="screen-gallery"
              ref={galleryRef}
              role="region"
              aria-label={copy.appPreviewLabel}
              tabIndex={0}
              onMouseEnter={() => setGalleryPaused(true)}
              onMouseLeave={() => setGalleryPaused(false)}
              onFocus={() => setGalleryPaused(true)}
              onBlur={() => setGalleryPaused(false)}
              onPointerDown={() => setGalleryPaused(true)}
              onPointerUp={() => setGalleryPaused(false)}
            >
              <div className="screen-gallery-track">
                {screenCards.map(({ src, alt, title, config }, index) => (
                  <article className="screen-gallery-card" key={`${src}-${index}`}>
                    <AppScreen src={src} alt={alt} config={config} fallbackSrc={defaultScreens[index % defaultScreens.length].src} sizes="(max-width: 640px) 70vw, (max-width: 1000px) 38vw, 220px" />
                    <h3 dir={isRtl ? "auto" : "ltr"}>{title}</h3>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {isSectionVisible(settings, "cta") && (
        <section className="landing-cta-section">
          <div className="landing-shell">
            <div className="landing-cta-panel" dir={isRtl ? "auto" : "ltr"}>
              <div className="cta-copy">
                <span className="section-kicker">{copy.ctaKicker}</span>
                <h2>{ctaCopy.title}</h2>
                <p>{ctaCopy.desc}</p>
              </div>
              <div className="cta-actions">
                <StoreBadge store="appStore" settings={settings} eyebrow={t.hero.downloadAppStore} label={t.hero.appStore} />
                <StoreBadge store="googlePlay" settings={settings} eyebrow={t.hero.getGooglePlay} label={t.hero.googlePlay} />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
