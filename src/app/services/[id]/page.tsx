'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { translations } from '@/translations';
import { useLanguage } from '@/context/LanguageContext';
import { redirect } from 'next/navigation';
import { use } from 'react';

const VALID_SERVICES = ['shipping', 'taxi', 'cleaning', 'containerShipping'];

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang } = useLanguage();
  const t = translations[lang];

  if (!VALID_SERVICES.includes(id)) {
    redirect('/services');
  }

  const serviceKey = id as keyof typeof t.serviceDetails;
  const service = t.serviceDetails[serviceKey];

  const openAppModal = () => window.dispatchEvent(new CustomEvent('open-app-modal'));

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{service.title}</h1>
        <p className="text-xl text-gray-400">{service.desc}</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          <ul className="space-y-4">
            {service.features.map((item: string, i: number) => (
              <li key={i} className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={openAppModal}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {service.cta} <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/10 relative">
            <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent mix-blend-overlay"></div>
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
