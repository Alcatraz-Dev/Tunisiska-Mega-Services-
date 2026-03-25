'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { translations } from '@/translations';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.contactPage.title}</h1>
        <p className="text-xl text-gray-400">{t.contactPage.subtitle}</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1 space-y-8"
        >
          <div className="glass-card rounded-3xl p-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">{t.contactPage.addressTitle}</h3>
            <div className="space-y-4 text-gray-400">
              <p>
                <strong className="text-white block mb-1">{t.contactPage.addressSweden}</strong>
                Sveavägen 44<br />111 34 Stockholm
              </p>
              <p>
                <strong className="text-white block mb-1">{t.contactPage.addressTunisia}</strong>
                Avenue Habib Bourguiba<br />1000 Tunis
              </p>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
              <Mail className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-4">{t.contactPage.emailTitle}</h3>
            <div className="space-y-2 text-gray-400">
              <a href="mailto:support@tunsiska.com" className="block hover:text-white transition-colors">support@tunsiska.com</a>
              <a href="mailto:business@tunsiska.com" className="block hover:text-white transition-colors">business@tunsiska.com</a>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8">
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center mb-6">
              <Phone className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">{t.contactPage.phoneTitle}</h3>
            <div className="space-y-2 text-gray-400">
              <p>SE: +46 8 123 45 67</p>
              <p>TN: +216 71 123 456</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 glass-card rounded-3xl p-8 md:p-12"
        >
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-300">{t.contactPage.formName}</label>
                <input type="text" id="name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">{t.contactPage.formEmail}</label>
                <input type="email" id="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="john@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-gray-300">{t.contactPage.formSubject}</label>
              <input type="text" id="subject" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="How can we help?" />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-300">{t.contactPage.formMessage}</label>
              <textarea id="message" rows={6} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" placeholder="Tell us more about your inquiry..."></textarea>
            </div>

            <button type="button" className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Send className="w-5 h-5" />
              {t.contactPage.formSubmit}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
