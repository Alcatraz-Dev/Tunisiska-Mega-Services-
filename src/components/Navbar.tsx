"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Globe, Menu, X, ChevronDown, Smartphone } from "lucide-react";
import { useLanguage, Language } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { translations } from "@/translations";

export default function Navbar() {
  const { lang, setLang } = useLanguage();
  const { settings } = useSettings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isComingSoonOnly, setIsComingSoonOnly] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const t = translations[lang];
  const isRtl = lang === "ar";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOpenModal = (e: any) => {
      setIsAppModalOpen(true);
      setIsComingSoonOnly(!!e.detail?.comingSoon);
    };
    window.addEventListener("open-app-modal", handleOpenModal as EventListener);
    return () =>
      window.removeEventListener(
        "open-app-modal",
        handleOpenModal as EventListener,
      );
  }, []);

  const toggleLang = (newLang: Language) => {
    setLang(newLang);
    setIsLangMenuOpen(false);
  };

  const openAppModal = () => {
    setIsComingSoonOnly(false);
    setIsAppModalOpen(true);
  };

  const StoreButtons = () => {
    const hasAppStore = !!settings?.links?.appStore;
    const hasGooglePlay = !!settings?.links?.googlePlay;
    const isAppStoreEnabled = settings?.links?.appStoreEnabled !== false;
    const isGooglePlayEnabled = settings?.links?.googlePlayEnabled !== false;

    if (!hasAppStore && !hasGooglePlay) return null;

    const handleButtonClick = (url: string, enabled: boolean) => {
      if (enabled) {
        window.open(url, "_blank");
      } else {
        setIsComingSoonOnly(true);
      }
    };

    return (
      <div className="flex flex-col gap-3 mt-8">
        {hasAppStore && (
          <button
            onClick={() =>
              handleButtonClick(settings.links.appStore, isAppStoreEnabled)
            }
            className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition-all w-full"
          >
            <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
            </svg>
            <div className={`text-left ${lang === "ar" ? "rtl" : "ltr"}`}>
              <div className="text-[10px] uppercase opacity-70 leading-none">
                {t.hero.downloadAppStore}
              </div>
              <div className="text-sm">{t.hero.appStore}</div>
            </div>
          </button>
        )}
        {hasGooglePlay && (
          <button
            onClick={() =>
              handleButtonClick(settings.links.googlePlay, isGooglePlayEnabled)
            }
            className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all w-full"
          >
            <svg viewBox="0 0 512 512" className="w-5 h-5 fill-current">
              <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
            </svg>
            <div className={`text-left ${lang === "ar" ? "rtl" : "ltr"}`}>
              <div className="text-[10px] uppercase opacity-70 leading-none">
                {t.hero.getGooglePlay}
              </div>
              <div className="text-sm">{t.hero.googlePlay}</div>
            </div>
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Navigation */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? "glass-panel py-0 shadow-lg" : "bg-transparent py-2"}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Tunsiska Mega Services"
              className="h-14 w-auto object-contain rounded-full bg-white p-1"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link href="/" className="hover:text-white transition-colors">
              {t.nav.home}
            </Link>
            <Link
              href="/services"
              className="hover:text-white transition-colors"
            >
              {t.nav.services}
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              {t.nav.about}
            </Link>
            <Link
              href="/contact"
              className="hover:text-white transition-colors"
            >
              {t.nav.contact}
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {lang.toUpperCase()} <ChevronDown className="w-4 h-4" />
              </button>
              {isLangMenuOpen && (
                <div
                  className={`absolute top-full mt-2 ${isRtl ? "left-0" : "right-0"} w-24 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden`}
                >
                  <button
                    onClick={() => toggleLang("sv")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                  >
                    SV
                  </button>
                  <button
                    onClick={() => toggleLang("en")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                  >
                    EN
                  </button>
                  <button
                    onClick={() => toggleLang("ar")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                  >
                    AR
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => openAppModal()}
              className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              {t.nav.getApp}
            </button>
          </div>

          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background-dark/95 backdrop-blur-xl pt-24 px-6 md:hidden">
          <div className="flex flex-col gap-6 text-lg font-medium">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              {t.nav.home}
            </Link>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)}>
              {t.nav.services}
            </Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
              {t.nav.about}
            </Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              {t.nav.contact}
            </Link>
            <hr className="border-white/10" />
            <div className="flex gap-4">
              <button
                onClick={() => toggleLang("sv")}
                className={`px-4 py-2 rounded-lg ${lang === "sv" ? "bg-primary text-white" : "bg-white/5"}`}
              >
                SV
              </button>
              <button
                onClick={() => toggleLang("en")}
                className={`px-4 py-2 rounded-lg ${lang === "en" ? "bg-primary text-white" : "bg-white/5"}`}
              >
                EN
              </button>
              <button
                onClick={() => toggleLang("ar")}
                className={`px-4 py-2 rounded-lg ${lang === "ar" ? "bg-primary text-white" : "bg-white/5"}`}
              >
                AR
              </button>
            </div>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openAppModal();
              }}
              className="px-5 py-3 rounded-xl bg-white text-black text-center"
            >
              {t.nav.getApp}
            </button>
          </div>
        </div>
      )}

      {/* App Modal */}
      {isAppModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/10 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setIsAppModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {isComingSoonOnly ||
                (!(
                  settings?.links?.appStore &&
                  settings?.links?.appStoreEnabled !== false
                ) &&
                  !(
                    settings?.links?.googlePlay &&
                    settings?.links?.googlePlayEnabled !== false
                  ))
                  ? t.modal.comingSoon
                  : t.modal.downloadTitle}
              </h3>
              <p className="text-gray-400">
                {isComingSoonOnly ||
                (!(
                  settings?.links?.appStore &&
                  settings?.links?.appStoreEnabled !== false
                ) &&
                  !(
                    settings?.links?.googlePlay &&
                    settings?.links?.googlePlayEnabled !== false
                  ))
                  ? t.modal.comingSoonDesc
                  : t.modal.downloadDesc}
              </p>

              {!isComingSoonOnly && <StoreButtons />}

              {(isComingSoonOnly ||
                (!(
                  settings?.links?.appStore &&
                  settings?.links?.appStoreEnabled !== false
                ) &&
                  !(
                    settings?.links?.googlePlay &&
                    settings?.links?.googlePlayEnabled !== false
                  ))) && (
                <button
                  onClick={() =>
                    isComingSoonOnly
                      ? setIsComingSoonOnly(false)
                      : setIsAppModalOpen(false)
                  }
                  className="w-full py-3 mt-8 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                >
                  {isComingSoonOnly
                    ? lang === "ar"
                      ? "رجوع"
                      : lang === "sv"
                        ? "Tillbaka"
                        : "Back"
                    : t.modal.gotIt}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
