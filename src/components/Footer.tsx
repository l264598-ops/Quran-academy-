import React from 'react';
import { BookOpen, Heart, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { db } from '../services/db';
import { createWhatsAppLink } from '../utils/islamicUtils';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenDemoModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDemoModal }) => {
  const settings = db.getSettings();
  const currentYear = new Date().getFullYear();

  const waLink = createWhatsAppLink(
    settings.whatsappNumber,
    'Assalamu Alaikum Teacher Bua Qasim, I would like to inquire about online Quran classes.'
  );

  return (
    <footer className="bg-emerald-950 text-slate-300 border-t border-emerald-900/60 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-900/40">
          {/* Col 1 & 2: Brand & Teacher Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold border border-emerald-700/50">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight block">
                  Online Quran Academy
                </span>
                <span className="text-xs text-amber-400 font-medium block">
                  Teacher Bua Qasim Shigry
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Empowering learners worldwide with authentic, gentle, and respectful Quranic education. With 16 years of Quran teaching experience and a community of 500+ satisfied students across the UK, USA, Canada, UAE, Pakistan, and Europe.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Skardu, Gilgit-Baltistan, Pakistan & Worldwide Online</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{settings.phone}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white font-semibold text-xs rounded-xl hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Message on WhatsApp
              </a>
            </div>
          </div>

          {/* Col 3: Academic Programs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Core Programs
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Quran Nazira (Fluent Reading)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Noorani Qaida for Beginners
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Quran with Tajweed & Tarteel
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Hifz-ul-Quran (Memorization)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Word-by-Word Translation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Tafseer-ul-Quran Studies
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Islamic Knowledge Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Islamic Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Namaz / Salah Step-by-Step
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Authentic Daily Duas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Prophetic Hadith Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Digital Tasbeeh Counter
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Prayer Times & Qibla
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('library')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Free Downloadable Islamic Books
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Academy & Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Portals & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenDemoModal}
                  className="text-amber-400 font-semibold hover:underline text-left flex items-center gap-1.5"
                >
                  <span>Book Free 1-on-1 Trial</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('student-dashboard')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Student Learning Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('teacher-dashboard')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Teacher Bua Qasim Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Academy Admin Console
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reviews')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Verified Student Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('child-safety')}
                  className="hover:text-amber-300 transition-colors text-left flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Child Safety Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            © {currentYear} Online Quran Academy — Teacher Bua Qasim Shigry. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={() => onNavigate('privacy-policy')}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onNavigate('terms-conditions')}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onNavigate('refund-policy')}
              className="hover:text-white transition-colors"
            >
              Refund Policy
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onNavigate('child-safety')}
              className="hover:text-white transition-colors"
            >
              Student Protection
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
