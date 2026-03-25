"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Sparkles,
  Car,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react";
import { translations } from "@/translations";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";

export default function HomePage() {
  const { lang } = useLanguage();
  const { settings } = useSettings();
  const t = translations[lang];
  const isRtl = lang === "ar";

  const openAppModal = () =>
    window.dispatchEvent(new CustomEvent("open-app-modal"));

  const handleDownload = (type: "appStore" | "googlePlay") => {
    if (settings?.links?.[type]) {
      window.open(settings.links[type], "_blank");
    } else {
      openAppModal();
    }
  };

  const getSectionContent = (id: string, defaultContent: any) => {
    const customContent = settings?.sections?.[id]?.content?.[lang];
    if (customContent) {
      return { ...defaultContent, ...customContent };
    }
    return defaultContent;
  };

  const heroContent = getSectionContent("hero", t.hero);
  const featuresContent = getSectionContent("features", t.features);
  const ctaContent = getSectionContent("cta", t.cta);

  const renderSensors = (style: string) => {
    switch (style) {
      case "iphone-15":
        return <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-[1.25rem] z-20 border border-white/5 shadow-sm" />;
      case "iphone-notch":
        return <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-20" />;
      case "android-centered":
        return <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full z-20 ring-1 ring-white/10" />;
      case "android-left":
        return <div className="absolute top-3 left-6 w-3 h-3 bg-black rounded-full z-20 ring-1 ring-white/10" />;
      case "laptop":
        return <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full z-20" />;
      default:
        return null;
    }
  };

  const renderButtons = (style: string) => {
    const isIphone = style === "iphone-15" || style === "iphone-notch";
    const isAndroid = style.startsWith("android");
    const isTablet = style === "ipad" || style === "tablet";

    if (isIphone) {
      return (
        <>
          {/* Silent/Action button */}
          <div className="absolute top-[12%] -left-[3px] w-[3px] h-[4%] bg-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-r-sm z-0" />
          {/* Volume Up */}
          <div className="absolute top-[20%] -left-[3px] w-[3px] h-[8%] bg-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-r-sm z-0" />
          {/* Volume Down */}
          <div className="absolute top-[29%] -left-[3px] w-[3px] h-[8%] bg-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-r-sm z-0" />
          {/* Power */}
          <div className="absolute top-[24%] -right-[3px] w-[3px] h-[12%] bg-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-l-sm z-0" />
        </>
      );
    }

    if (isAndroid) {
      return (
        <>
          {/* Power */}
          <div className="absolute top-[18%] -right-[3px] w-[3px] h-[10%] bg-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-l-sm z-0" />
          {/* Volume */}
          <div className="absolute top-[30%] -right-[3px] w-[3px] h-[6%] bg-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-l-sm z-0" />
        </>
      );
    }

    if (isTablet) {
      return (
        <>
          {/* Volume Up */}
          <div className="absolute top-[10%] -right-[3px] w-[3px] h-[8%] bg-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-l-sm z-0" />
          {/* Volume Down */}
          <div className="absolute top-[20%] -right-[3px] w-[3px] h-[8%] bg-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-l-sm z-0" />
        </>
      );
    }

    return null;
  };

  const DeviceMockup = ({
    style = "iphone-15",
    children,
    className = "",
    innerClassName = "",
  }: {
    style?: string;
    children: React.ReactNode;
    className?: string;
    innerClassName?: string;
  }) => {
    const isLaptop = style === "laptop";
    const isTablet = style === "ipad" || style === "tablet";

    const getAspect = () => {
      if (isLaptop) return "aspect-16/10";
      if (isTablet) return "aspect-3/4";
      return "aspect-9/19";
    };

    const rounding = isLaptop ? "rounded-xl" : isTablet ? "rounded-[2.5rem]" : "rounded-[3rem]";
    const innerRounding = isLaptop ? "rounded-lg" : isTablet ? "rounded-[2rem]" : "rounded-[2.5rem]";
    const bezel = isLaptop ? "border-4" : "border-[6px]";

    return (
      <div className={`flex flex-col items-center group relative ${className}`}>
        {renderButtons(style)}
        <div
          className={`${
            isLaptop ? "aspect-16/10 w-full" : isTablet ? "aspect-3/4 w-full" : "aspect-9/19 w-full"
          } bg-slate-950 ${rounding} shadow-2xl relative overflow-hidden ring-1 ring-white/10 transition-all duration-500`}
        >
          {/* Hardware Bezel Trim */}
          <div className={`absolute inset-0 ${rounding} ${bezel} border-slate-900/90 pointer-events-none z-10`} />
          <div className={`absolute inset-0.5 ${innerRounding} border border-white/5 pointer-events-none z-20`} />

          {/* Sensors */}
          {renderSensors(style)}

          {/* Screen Content */}
          <div className={`relative w-full h-full overflow-hidden ${innerRounding} ${innerClassName} z-0 ${!isLaptop && !isTablet ? 'p-1.5' : ''}`}>
            {children}
          </div>
        </div>

        {/* Laptop Keyboard Base */}
        {isLaptop && (
          <div className="w-[115%] h-4 bg-slate-800 rounded-b-2xl -mt-1 border-t border-white/10 relative flex flex-col items-center shadow-lg">
            <div className="w-12 h-1 bg-black/40 rounded-full mt-1" />
          </div>
        )}
      </div>
    );
  };

  // Helper to get icon component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "sparkles": return Sparkles;
      case "car": return Car;
      case "map-pin": return MapPin;
      default: return Package;
    }
  };

  const MockupContent = ({ 
    config, 
    isLaptop = false, 
    isTablet = false,
    className = ""
  }: { 
    config: any; 
    isLaptop?: boolean; 
    isTablet?: boolean;
    className?: string;
  }) => {
    if (!config) return null;
    if (config.type === "image" && config.image) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={config.image}
          alt="App Mockup"
          className="w-full h-full object-cover"
        />
      );
    }

    const Icon = getIcon(config.icon);

    const bgColor = config.color === "purple" 
      ? "bg-purple-600" 
      : config.color === "accent" 
        ? "bg-accent" 
        : "bg-primary";

    const size = isLaptop ? "w-24 h-24" : isTablet ? "w-20 h-20" : "w-16 h-16";
    const iconSize = isLaptop ? "w-12 h-12" : isTablet ? "w-10 h-10" : "w-8 h-8";

    return (
      <div className={`flex flex-col items-center justify-center gap-4 ${className} w-full h-full`}>
        <div className={`${size} ${bgColor} rounded-3xl flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.3)] ring-4 ring-white/10 rotate-12 transition-all duration-700 hover:rotate-0 hover:scale-110`}>
          <Icon className={`${iconSize} text-white shadow-sm`} />
        </div>
        {(isLaptop || isTablet) && (
          <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-1000">
            <p className="text-white font-bold text-lg leading-tight">Tunsiska</p>
            <p className="text-gray-400 text-sm">Mega Services</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {settings?.sections?.hero?.visible !== false && (
        <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden bg-gradient-hero">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-sm font-medium text-primary mb-6">
                <Sparkles className="w-4 h-4" />
                <span>{heroContent.tag}</span>
              </div>

              <h1 className="text-3xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
                {heroContent.title1}{" "}
                <span className="text-gradient">{heroContent.title2}</span>
              </h1>

              <p className="text-lg lg:text-xl text-gray-400 mb-10 leading-relaxed max-w-xl">
                {heroContent.desc}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleDownload("appStore")}
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-semibold hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg viewBox="0 0 384 512" className="w-6 h-6 fill-current">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  <div className={`text-${isRtl ? "right" : "left"}`}>
                    <div className="text-[10px] uppercase tracking-wider opacity-80">
                      {t.hero.downloadAppStore}
                    </div>
                    <div className="text-sm leading-tight">App Store</div>
                  </div>
                </button>

                <button
                  onClick={() => handleDownload("googlePlay")}
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl glass-card text-white font-semibold hover:bg-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg
                    viewBox="0 0 512 512"
                    className="w-6 h-6 fill-current text-green-400"
                  >
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                  </svg>
                  <div className={`text-${isRtl ? "right" : "left"}`}>
                    <div className="text-[10px] uppercase tracking-wider opacity-80">
                      {t.hero.getGooglePlay}
                    </div>
                    <div className="text-sm leading-tight">Google Play</div>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Right Content - 3D Mockup */}
            <div
              className="relative h-[600px] lg:h-[700px] flex items-center justify-center perspective-1000"
              dir="ltr"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/30 blur-[120px] rounded-full"></div>

              {/* Left Phone */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 0.8, x: -140 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute z-0 hidden md:block"
              >
                <DeviceMockup
                  style={settings?.mockups?.heroLeft?.style || settings?.mockups?.style}
                  className="w-56 lg:w-60"
                  innerClassName={settings?.mockups?.heroLeft?.type === "image" ? "" : "bg-linear-to-b from-indigo-950 to-slate-900"}
                >
                  <MockupContent 
                    config={settings?.mockups?.heroLeft} 
                    isLaptop={(settings?.mockups?.heroLeft?.style || settings?.mockups?.style) === "laptop"}
                    isTablet={(settings?.mockups?.heroLeft?.style === "ipad" || settings?.mockups?.heroLeft?.style === "tablet")}
                  />
                </DeviceMockup>
              </motion.div>

              {/* Right Phone */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 0.8, x: 140 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                className="absolute z-0 hidden md:block"
              >
                <DeviceMockup
                  style={settings?.mockups?.heroRight?.style || settings?.mockups?.style}
                  className="w-56 lg:w-60"
                  innerClassName={settings?.mockups?.heroRight?.type === "image" ? "" : "bg-linear-to-b from-purple-950 to-slate-900"}
                >
                  <MockupContent 
                    config={settings?.mockups?.heroRight} 
                    isLaptop={(settings?.mockups?.heroRight?.style || settings?.mockups?.style) === "laptop"}
                    isTablet={(settings?.mockups?.heroRight?.style === "ipad" || settings?.mockups?.heroRight?.style === "tablet")}
                  />
                </DeviceMockup>
              </motion.div>

              {/* Center Phone */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                className="relative z-10"
              >
                <DeviceMockup
                  style={settings?.mockups?.heroCenter?.style || settings?.mockups?.style}
                  className="w-64 lg:w-72"
                  innerClassName={
                    settings?.mockups?.heroCenter?.type === "image"
                      ? ""
                      : "bg-linear-to-b from-slate-900 to-indigo-950"
                  }
                >
                  <MockupContent 
                    config={settings?.mockups?.heroCenter} 
                    isLaptop={(settings?.mockups?.heroCenter?.style || settings?.mockups?.style) === "laptop"}
                    isTablet={(settings?.mockups?.heroCenter?.style === "ipad" || settings?.mockups?.heroCenter?.style === "tablet")}
                  />
                </DeviceMockup>
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut",
                }}
                className={`absolute top-20 ${isRtl ? "-right-12 lg:-right-24" : "-left-12 lg:-left-24"} z-20 glass-card rounded-2xl p-4 flex items-center gap-4 w-64`}
                dir={isRtl ? "rtl" : "ltr"}
              >
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    {t.mockup.bookingConfirmed}
                  </div>
                  <div className="text-xs text-gray-400">
                    {t.mockup.cleaningScheduled}
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className={`absolute bottom-32 ${isRtl ? "-left-8 lg:-left-16" : "-right-8 lg:-right-16"} z-20 glass-card rounded-2xl p-4 flex items-center gap-4 w-56`}
                dir={isRtl ? "rtl" : "ltr"}
              >
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">
                    {t.mockup.estimatedArrival}
                  </div>
                  <div className="text-sm font-semibold">{t.mockup.time}</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {settings?.sections?.features?.visible !== false && (
        <section id="services" className="py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                {featuresContent.title1} <br />
                {featuresContent.title2}
              </h2>
              <p className="text-gray-400">{featuresContent.desc}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: "shipping",
                  icon: <Package className="w-6 h-6 text-primary" />,
                  title: t.features.f1Title,
                  desc: t.features.f1Desc,
                },
                {
                  id: "cleaning",
                  icon: <Sparkles className="w-6 h-6 text-accent" />,
                  title: t.features.f2Title,
                  desc: t.features.f2Desc,
                },
                {
                  id: "taxi",
                  icon: <Car className="w-6 h-6 text-purple-400" />,
                  title: t.features.f3Title,
                  desc: t.features.f3Desc,
                },
                {
                  id: "containerShipping",
                  icon: <Package className="w-6 h-6 text-blue-400" />,
                  title: t.features.f4Title,
                  desc: t.features.f4Desc,
                },
              ].map((feature, i) => (
                <Link href={`/services/${feature.id}`} key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="glass-card rounded-3xl p-8 group cursor-pointer h-full flex flex-col"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed grow">
                      {feature.desc}
                    </p>
                    <div className="mt-6 flex items-center text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                      {t.features.learnMore}{" "}
                      <ArrowRight
                        className={`w-4 h-4 ${isRtl ? "mr-1 rotate-180" : "ml-1"} opacity-0 group-hover:opacity-100 transition-all`}
                      />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {settings?.sections?.cta?.visible !== false && (
        <section className="pt-24 pb-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-primary/5"></div>
          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              {ctaContent.title}
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              {ctaContent.desc}
            </p>
            <button
              onClick={openAppModal}
              className="px-8 py-4 mb-20 rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 text-lg shadow-[0_0_40px_rgba(99,102,241,0.3)]"
            >
              {ctaContent.button}
            </button>

            {/* Mockups Showcase */}
            <div
              className="relative w-full h-[300px] md:h-[400px] flex justify-center perspective-1000 border-b border-white/10"
              dir="ltr"
            >
              {/* Background Glow */}
              <div className="absolute bottom-0 w-[80%] md:w-[600px] h-[300px] bg-primary/20 blur-[120px] rounded-[100%] z-0 translate-y-1/2"></div>

              {/* Left Phone (Cleaning) */}
              <motion.div
                initial={{ y: 200, x: 60, rotate: 15, opacity: 0 }}
                whileInView={{ y: 80, x: 20, rotate: -15, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                className="absolute left-0 md:left-[10%] z-10 hidden sm:block origin-bottom transition-transform"
              >
                <DeviceMockup
                  style={settings?.mockups?.ctaLeft?.style || settings?.mockups?.style}
                  className="w-44 md:w-56"
                  innerClassName={settings?.mockups?.ctaLeft?.type === "image" ? "" : "bg-linear-to-tr from-slate-950 to-indigo-950"}
                >
                  <MockupContent 
                    config={settings?.mockups?.ctaLeft} 
                    isLaptop={(settings?.mockups?.ctaLeft?.style || settings?.mockups?.style) === "laptop"}
                  />
                </DeviceMockup>
              </motion.div>

              {/* Right Phone (Taxi) */}
              <motion.div
                initial={{ y: 200, x: -60, rotate: -15, opacity: 0 }}
                whileInView={{ y: 80, x: -20, rotate: 15, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="absolute right-0 md:right-[10%] z-10 hidden sm:block origin-bottom transition-transform"
              >
                <DeviceMockup
                  style={settings?.mockups?.ctaRight?.style || settings?.mockups?.style}
                  className="w-44 md:w-56"
                  innerClassName={settings?.mockups?.ctaRight?.type === "image" ? "" : "bg-linear-to-bl from-slate-950 to-purple-950"}
                >
                  <MockupContent 
                    config={settings?.mockups?.ctaRight} 
                    isLaptop={(settings?.mockups?.ctaRight?.style || settings?.mockups?.style) === "laptop"}
                  />
                </DeviceMockup>
              </motion.div>

              {/* Center Phone (Shipping/Main) */}
              <motion.div
                initial={{ y: 300, opacity: 0 }}
                whileInView={{ y: 30, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                className="absolute z-20 origin-bottom hover:-translate-y-4 transition-transform duration-500"
              >
                <DeviceMockup
                  style={settings?.mockups?.ctaCenter?.style || settings?.mockups?.style}
                  className="w-56 md:w-64 shadow-2xl"
                  innerClassName={
                    settings?.mockups?.ctaCenter?.type === "image"
                      ? ""
                      : "bg-linear-to-b from-indigo-500/10 to-slate-900 flex flex-col pt-12 p-4 gap-4"
                  }
                >
                  {settings?.mockups?.ctaCenter?.type === "image" ? (
                    <MockupContent config={settings.mockups.ctaCenter} />
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                          {(() => {
                            const CtaIcon = getIcon(settings?.mockups?.ctaCenter?.icon);
                            return <CtaIcon className="w-5 h-5 text-primary" />;
                          })()}
                        </div>
                        <div className="space-y-1.5 grow">
                          <div className="h-2.5 w-full bg-white/20 rounded-full"></div>
                          <div className="h-1.5 w-2/3 bg-white/10 rounded-full"></div>
                        </div>
                      </div>
                      <div className="h-32 w-full bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center gap-2">
                        <MapPin className="w-6 h-6 text-white/50" />
                        <div className="h-1.5 w-1/2 bg-white/10 rounded-full"></div>
                      </div>
                      <div className="space-y-2 mt-auto mb-2">
                        <div className="h-10 w-full bg-white/10 rounded-xl"></div>
                        <div className="h-10 w-full bg-primary text-xs flex items-center justify-center font-medium text-white shadow-lg rounded-xl">
                          Tracking Details
                        </div>
                      </div>
                    </>
                  )}
                </DeviceMockup>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* App Screens Gallery */}
      {settings?.sections?.gallery?.visible !== false && settings?.mockups?.gallery?.filter((g: any) => g.image).length > 0 && (
        <section className="relative w-full py-24 overflow-hidden bg-black/50 border-t border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none"></div>

          <div className="text-center max-w-3xl mx-auto px-6 mb-16 relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
            >
              {lang === "ar"
                ? "اكتشف شكل التطبيق"
                : lang === "sv"
                ? "Utforska Appen"
                : "Explore the App"}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg mx-auto"
            >
              {lang === "ar"
                ? "ألق نظرة على التصميم الأنيق والواجهة السلسة لخدماتنا في التطبيق."
                : lang === "sv"
                ? "Ta en titt på den eleganta designen och det smidiga gränssnittet för våra tjänster i appen."
                : "Take a look at the elegant design and seamless interface of our services in the app."}
            </motion.p>
          </div>

          <div className="w-full overflow-hidden relative">
            <div className="flex gap-6 md:gap-10 px-8 md:px-[20vw] overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar items-center">
              {settings.mockups.gallery.map((mock: any, idx: number) => {
                if (!mock.image) return null;
                
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="snap-center shrink-0 w-[240px] md:w-[280px]"
                  >
                    <DeviceMockup style={mock.style}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={mock.image}
                        alt={`App Screen ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </DeviceMockup>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Scroll fading edges */}
            <div className={`absolute top-0 bottom-0 ${isRtl ? 'right-0 bg-linear-to-l' : 'left-0 bg-linear-to-r'} from-black to-transparent w-16 md:w-48 pointer-events-none z-10`}></div>
            <div className={`absolute top-0 bottom-0 ${isRtl ? 'left-0 bg-linear-to-r' : 'right-0 bg-linear-to-l'} from-black to-transparent w-16 md:w-48 pointer-events-none z-10`}></div>
          </div>
        </section>
      )}
    </>
  );
}
