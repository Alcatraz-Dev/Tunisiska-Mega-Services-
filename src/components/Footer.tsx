"use client";

import Link from "next/link";
import { Globe, Share2, Share } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { translations } from "@/translations";
import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa6";
import { SlSocialFacebook } from "react-icons/sl";
export default function Footer() {
  const { lang } = useLanguage();
  const { settings } = useSettings();
  const t = translations[lang];
  const isRtl = lang === "ar";

  const openAppModal = () =>
    window.dispatchEvent(new CustomEvent("open-app-modal"));

  return (
    <footer className="border-t border-white/10 bg-[#05080f] pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img
                src="/logo.png"
                alt="Tunsiska Mega Services"
                className="h-12 w-auto object-contain rounded-full bg-white p-0.5"
              />
            </div>
            <p className="text-sm text-gray-400 max-w-xs mb-6 leading-relaxed">
              {t.footer.desc}
            </p>
            <div className="flex gap-3 flex-wrap">
              {settings?.social?.instagramEnabled && settings?.social?.instagram && (
                <a
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-linear-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white transition-all duration-300 group"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
              )}
              {settings?.social?.facebookEnabled && settings?.social?.facebook && (
                <a
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 group"
                  aria-label="Facebook"
                >
                  <SlSocialFacebook className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
              )}
              {settings?.social?.youtubeEnabled && settings?.social?.youtube && (
                <a
                  href={settings.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 group"
                  aria-label="YouTube"
                >
                  <FaYoutube className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
              )}
              {settings?.social?.tiktokEnabled && settings?.social?.tiktok && (
                <a
                  href={settings.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-black hover:ring-1 hover:ring-white/20 transition-all duration-300 group"
                  aria-label="TikTok"
                >
                  <FaTiktok className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.company}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  {t.footer.aboutUs}
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-white transition-colors"
                >
                  {t.footer.careers}
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="hover:text-white transition-colors"
                >
                  {t.footer.press}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  {t.footer.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.services}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link
                  href="/services/shipping"
                  className="hover:text-white transition-colors"
                >
                  {t.footer.shipping}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/taxi"
                  className="hover:text-white transition-colors"
                >
                  {t.footer.taxi}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/cleaning"
                  className="hover:text-white transition-colors"
                >
                  {t.footer.cleaning}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/containerShipping"
                  className="hover:text-white transition-colors"
                >
                  {t.footer.containerShipping}
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="font-semibold mb-4">{t.footer.getApp}</h4>
            <div className="flex flex-col gap-3">
              {settings?.links?.appStore ? (
                <a
                  href={settings.links.appStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors w-full sm:w-auto lg:w-full"
                >
                  <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  <div className={`text-${isRtl ? "right" : "left"}`}>
                    <div className="text-[9px] uppercase tracking-wider opacity-80">
                      {t.hero.downloadAppStore}
                    </div>
                    <div className="text-xs leading-tight font-medium">
                      App Store
                    </div>
                  </div>
                </a>
              ) : (
                <button
                  onClick={openAppModal}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors w-full sm:w-auto lg:w-full"
                >
                  <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  <div className={`text-${isRtl ? "right" : "left"}`}>
                    <div className="text-[9px] uppercase tracking-wider opacity-80">
                      {t.hero.downloadAppStore}
                    </div>
                    <div className="text-xs leading-tight font-medium">
                      App Store
                    </div>
                  </div>
                </button>
              )}

              {settings?.links?.googlePlay ? (
                <a
                  href={settings.links.googlePlay}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors w-full sm:w-auto lg:w-full"
                >
                  <svg
                    viewBox="0 0 512 512"
                    className="w-5 h-5 fill-current text-green-400"
                  >
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                  </svg>
                  <div className={`text-${isRtl ? "right" : "left"}`}>
                    <div className="text-[9px] uppercase tracking-wider opacity-80">
                      {t.hero.getGooglePlay}
                    </div>
                    <div className="text-xs leading-tight font-medium">
                      Google Play
                    </div>
                  </div>
                </a>
              ) : (
                <button
                  onClick={openAppModal}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors w-full sm:w-auto lg:w-full"
                >
                  <svg
                    viewBox="0 0 512 512"
                    className="w-5 h-5 fill-current text-green-400"
                  >
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                  </svg>
                  <div className={`text-${isRtl ? "right" : "left"}`}>
                    <div className="text-[9px] uppercase tracking-wider opacity-80">
                      {t.hero.getGooglePlay}
                    </div>
                    <div className="text-xs leading-tight font-medium">
                      Google Play
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>{t.footer.copyright.replace("{year}", new Date().getFullYear().toString())}</p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-gray-300 transition-colors"
            >
              {t.footer.privacy}
            </Link>
            <Link
              href="/terms"
              className="hover:text-gray-300 transition-colors"
            >
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
