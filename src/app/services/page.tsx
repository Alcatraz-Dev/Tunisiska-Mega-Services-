'use client';

import { motion } from 'framer-motion';
import { Package, Sparkles, Car, ArrowRight } from 'lucide-react';
import { translations } from '@/translations';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function ServicesPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const services = [
    { id: 'shipping', icon: <Package className="w-8 h-8 text-primary" />, title: t.features.f1Title, desc: t.features.f1Desc, color: 'from-primary/20 to-transparent' },
    { id: 'cleaning', icon: <Sparkles className="w-8 h-8 text-accent" />, title: t.features.f2Title, desc: t.features.f2Desc, color: 'from-accent/20 to-transparent' },
    { id: 'taxi', icon: <Car className="w-8 h-8 text-purple-400" />, title: t.features.f3Title, desc: t.features.f3Desc, color: 'from-purple-500/20 to-transparent' },
    { id: 'containerShipping', icon: <Package className="w-8 h-8 text-blue-400" />, title: t.features.f4Title, desc: t.features.f4Desc, color: 'from-blue-500/20 to-transparent' },
  ];

  const openAppModal = () => window.dispatchEvent(new CustomEvent('open-app-modal'));

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.servicesPage.title}</h1>
        <p className="text-xl text-gray-400">{t.servicesPage.subtitle}</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {services.map((service, i) => (
          <Link href={`/services/${service.id}`} key={i}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-3xl p-8 relative overflow-hidden group h-full"
            >
              <div className="absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-linear-to-bl from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={`absolute top-0 right-0 w-64 h-64 bg-linear-to-bl ${service.color} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-8 grow">{service.desc}</p>
                <div className="flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors mt-auto">
                  {t.features.learnMore} <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="bg-linear-to-bl from-white/5 to-white/10 rounded-3xl p-8 border border-white/10 flex items-center justify-between">
        <div className="grow">
          <h3 className="text-xl font-bold mb-4">{t.servicesPage.allServices}</h3>
        </div>
        <button onClick={openAppModal} className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition-all hover:scale-105 active:scale-95">
          {t.cta.button}
        </button>
      </div>
    </div>
  );
}
