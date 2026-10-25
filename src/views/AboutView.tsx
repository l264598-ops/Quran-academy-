import React from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Heart,
  MessageCircle,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import { db } from '../services/db';
import { createWhatsAppLink } from '../utils/islamicUtils';

interface AboutViewProps {
  onOpenDemoModal: () => void;
  onNavigate: (view: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenDemoModal, onNavigate }) => {
  const settings = db.getSettings();
  const waLink = createWhatsAppLink(
    settings.whatsappNumber,
    'Assalamu Alaikum Teacher Bua Qasim, I would like to learn more about your teaching background and classes.'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-800/20 text-emerald-900 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
            <span>Dedicated Quran Educator Since 2010</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight leading-tight">
            Meet Teacher Bua Qasim Shigry
          </h1>

          <p className="text-base text-slate-700 leading-relaxed font-normal">
            For more than 16 years, Teacher Bua Qasim Shigry has dedicated his life to teaching the Holy Quran to Muslims of all generations. Originally hailing from the serene northern valleys of Skardu, Gilgit-Baltistan, Pakistan, he now reaches students across the United Kingdom, North America, the Middle East, Europe, and Australia.
          </p>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <span className="text-2xl font-bold font-mono text-emerald-900 block">16+ Years</span>
              <span className="text-slate-600 font-medium">Continuous Quran Teaching</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <span className="text-2xl font-bold font-mono text-emerald-900 block">500+ Students</span>
              <span className="text-slate-600 font-medium">Successfully Mentored</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onOpenDemoModal}
              className="px-6 py-3 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-300" /> Book a Trial Session with Teacher
            </button>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" /> Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Teacher Portrait */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-emerald-950 aspect-4/3">
            <img
              src="/src/assets/images/teacher_bua_qasim_1792917817962.jpg"
              alt="Teacher Bua Qasim Shigry"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-2xl p-4 text-white text-xs">
              <p className="font-bold text-amber-300 text-sm">Teacher Bua Qasim Shigry</p>
              <p className="text-slate-200 text-[11px] mt-0.5">
                "My teaching approach is rooted in gentleness (Rifq), accurate articulation, and encouraging children to love Allah's divine speech."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Teaching Philosophy & Core Principles */}
      <div className="bg-[#FAF7EE] rounded-3xl p-8 sm:p-12 border border-[#C8B88A]/40 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold text-[#8C7A4E] uppercase tracking-widest">
            Teaching Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950">
            A Compassionate, Child-Conscious Approach
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
            <Heart className="w-6 h-6 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">Gentle & Encouraging (No Harshness)</h3>
            <p className="leading-relaxed">
              We completely eliminate old-fashioned harsh disciplinary methods. Children are guided with smiles, gentle praises, and positive reinforcement so they look forward to every class.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
            <BookOpen className="w-6 h-6 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">Rigorous Tajweed Precision</h3>
            <p className="leading-relaxed">
              Patience does not compromise accuracy. Teacher Bua Qasim listens with an expert ear to ensure proper Makharij, Ghunnah, and Qalqalah are formed accurately from day one.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
            <Shield className="w-6 h-6 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">Complete Parental Transparency</h3>
            <p className="leading-relaxed">
              Parents are welcome to observe classes at any time. Our digital portal provides transparent attendance logs, weekly progress scores, and direct messaging with the teacher.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
