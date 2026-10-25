import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  BookMarked,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  Download,
  GraduationCap,
  Heart,
  HelpCircle,
  Languages,
  MessageCircle,
  Quote,
  Shield,
  Sparkles,
  Star,
  Users,
  Video,
} from 'lucide-react';
import { db } from '../services/db';
import { Course } from '../types';
import { createWhatsAppLink, formatCurrencyPrice } from '../utils/islamicUtils';

interface HomeViewProps {
  onNavigate: (view: string, courseSlug?: string) => void;
  onOpenDemoModal: (courseId?: string) => void;
  onOpenPaymentModal: (course: Course) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenDemoModal,
  onOpenPaymentModal,
}) => {
  const settings = db.getSettings();
  const courses = db.getCourses();
  const reviews = db.getReviews();

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const waLink = createWhatsAppLink(
    settings.whatsappNumber,
    'Assalamu Alaikum Teacher Bua Qasim, I am interested in booking a free Quran trial class.'
  );

  const featuredCourses = courses.filter((c) => c.featured);
  const displayedCourses =
    activeCategoryFilter === 'all'
      ? featuredCourses.slice(0, 6)
      : courses.filter((c) => c.category === activeCategoryFilter).slice(0, 6);

  const faqs = [
    {
      q: 'How do the online Quran classes work?',
      a: 'Classes take place 1-on-1 with Teacher Bua Qasim Shigry using our interactive online classroom, Google Meet, or Zoom. The student and teacher view the Quran Mushaf together with real-time Tajweed color-coding and personalized audio-visual feedback.',
    },
    {
      q: 'Who can enroll in the academy?',
      a: 'We welcome learners of all ages: children starting at age 4 with the basics (Noorani Qaida), teenagers polishing their fluency, adult beginners learning to read for the first time, and advanced students seeking full Quran Tajweed mastery or Hifz.',
    },
    {
      q: 'Can absolute beginners join without prior Arabic knowledge?',
      a: 'Yes, absolutely. Over 60% of our incoming students begin with zero Arabic knowledge. Teacher Bua Qasim’s patient Noorani Qaida method breaks down each letter and articulation point clearly in English and Urdu.',
    },
    {
      q: 'How does the Free Demo Class work?',
      a: 'The demo class is 100% free with no credit card required. You select your convenient day and time slot. Teacher Bua Qasim assesses the student’s current level, demonstrates the teaching method, and presents a customized learning roadmap.',
    },
    {
      q: 'How is class timing and rescheduling handled across time zones?',
      a: 'We accommodate all time zones (UK, US, Canada, Middle East, Australia, Pakistan). If you have exams, family travel, or illness, classes can easily be rescheduled with advance notice.',
    },
    {
      q: 'Which payment methods are accepted?',
      a: 'We accept international Credit/Debit cards (via Stripe), PayPal, direct bank wire transfer to Meezan Bank, and local mobile accounts (Easypaisa/JazzCash) for Pakistani families.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* SECTION 3: HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F4EC] to-[#FDFBF7] pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-emerald-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-800/20 text-emerald-900 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>16 Years of Dedicated Teaching Experience · 500+ Students</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-950 tracking-tight leading-[1.15]">
                Learn the Holy Quran with Confidence, Clarity & Tajweed
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl font-normal">
                Personalized 1-on-1 online Quran classes for children, adults, and families worldwide, taught by Teacher Bua Qasim Shigry. From the foundational Noorani Qaida to fluent recitation, Hifz, and word-by-word translation.
              </p>

              {/* Verified Trust Badges */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1.5 font-medium text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" /> 1-on-1 Individual Attention
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Worldwide Time Zone Flexibility
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Certified Tajweed Curriculum
                </span>
              </div>

              {/* CTA Group */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onOpenDemoModal()}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-emerald-900/20 group"
                >
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span>Book Your Free Demo Class</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('courses')}
                  className="px-6 py-3.5 text-sm font-semibold text-emerald-950 bg-white hover:bg-emerald-50 rounded-xl border border-emerald-900/15 transition-all text-center"
                >
                  Explore All 18 Courses
                </button>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100/50 rounded-xl transition-colors border border-emerald-900/10 flex items-center justify-center gap-1.5 text-xs font-semibold"
                  title="Direct WhatsApp Chat"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Media: Holy Quran Open Rehal Photography */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-emerald-900 aspect-16/11 group">
                <img
                  src="/src/assets/images/hero_quran_academy_1792917817098.jpg"
                  alt="Holy Quran on carved wooden rehal with prayer beads"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                  <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-amber-300 font-arabic text-base" dir="rtl">
                        وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
                      </p>
                      <p className="text-[11px] text-slate-200 mt-0.5">
                        "And recite the Quran with measured recitation." (73:4)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: TRUST & EXPERIENCE KPI ROW */}
          <div className="mt-14 pt-8 border-t border-emerald-900/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white/70 rounded-xl border border-emerald-900/10 shadow-xs">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-900 font-mono">16+</p>
              <p className="text-xs font-semibold text-slate-700 mt-1 uppercase tracking-wider">
                Years Teaching Experience
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Verified continuous service</p>
            </div>

            <div className="p-4 bg-white/70 rounded-xl border border-emerald-900/10 shadow-xs">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-900 font-mono">500+</p>
              <p className="text-xs font-semibold text-slate-700 mt-1 uppercase tracking-wider">
                Satisfied Students
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Children, youth & adults</p>
            </div>

            <div className="p-4 bg-white/70 rounded-xl border border-emerald-900/10 shadow-xs">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-900 font-mono">18</p>
              <p className="text-xs font-semibold text-slate-700 mt-1 uppercase tracking-wider">
                Comprehensive Courses
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">From basics to Tafseer</p>
            </div>

            <div className="p-4 bg-white/70 rounded-xl border border-emerald-900/10 shadow-xs">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-900 font-mono">12+</p>
              <p className="text-xs font-semibold text-slate-700 mt-1 uppercase tracking-wider">
                Countries Worldwide
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">UK, USA, Canada, UAE, PK</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: MEET THE TEACHER (BUA QASIM SHIGRY) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-900/10 shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Teacher Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-[#FAF7EE] bg-emerald-900 aspect-4/3">
                <img
                  src="/src/assets/images/teacher_bua_qasim_1792917817962.jpg"
                  alt="Teacher Bua Qasim Shigry"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md rounded-xl p-2.5 text-white text-xs flex items-center justify-between">
                  <div>
                    <p className="font-bold text-amber-300">Teacher Bua Qasim Shigry</p>
                    <p className="text-[10px] text-slate-200">16 Years Quran Teaching Experience</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-700 rounded text-[10px] font-semibold">Verified</span>
                </div>
              </div>
            </div>

            {/* Teacher Biography */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-widest">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>Meet Your Quran Teacher</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950">
                Teacher Bua Qasim Shigry
              </h2>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                With over <strong className="text-emerald-950">16 years of dedicated Quran teaching experience</strong> and having guided over <strong className="text-emerald-950">500+ students</strong> across the globe, Teacher Bua Qasim Shigry brings warmth, boundless patience, and academic rigor to every online session.
              </p>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-800">Child-Conscious Pedagogy:</strong> Gentle encouragement, zero harshness, engaging exercises, and patient repetition designed specifically for young attention spans.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-800">Authentic Articulation (Makharij):</strong> Precision coaching in Arabic letter throat and mouth exits, ensuring every verse is recited as it was revealed.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-800">Trilingual Instruction:</strong> Comfortable teaching in fluent English, Urdu, and Arabic to support both international diaspora and local students.
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('about')}
                  className="px-5 py-2.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-900/10"
                >
                  Read Teacher Philosophy & Background
                </button>
                <button
                  onClick={() => onOpenDemoModal()}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors"
                >
                  Book 1-on-1 Trial with Teacher
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: COURSE CATEGORIES & BROWSER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
            Structured Curriculum
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
            Quranic & Islamic Academic Courses
          </h2>
          <p className="text-sm text-slate-600">
            From complete beginners taking their first steps in Noorani Qaida to full Quran memorization and Tafseer analysis, all 18 educational programs are structured with progressive milestone syllabi.
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl max-w-4xl mx-auto">
          {[
            { id: 'all', label: 'All Featured' },
            { id: 'Quran Reading & Nazira', label: 'Reading & Nazira' },
            { id: 'Tajweed & Tarteel', label: 'Tajweed Rules' },
            { id: 'Hifz & Memorization', label: 'Hifz (Memorization)' },
            { id: 'Islamic Education', label: 'Islamic Education & Salah' },
            { id: 'Languages & Urdu', label: 'Urdu & Arabic' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-xl transition-all whitespace-nowrap ${
                activeCategoryFilter === cat.id
                  ? 'bg-white text-emerald-950 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Course Image */}
                <div className="aspect-16/9 overflow-hidden bg-slate-100 relative">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-semibold text-emerald-900 shadow-xs">
                    {c.level}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-900/90 text-amber-300 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold">
                    {formatCurrencyPrice(c.pricePerMonthUSD, selectedCurrency)}/mo
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="text-right font-arabic text-emerald-800 text-sm font-bold" dir="rtl">
                    {c.arabicTitle}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {c.shortDesc}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" /> {c.classesPerWeek} classes / wk ({c.classDurationMins}m)
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-700" /> {c.totalEnrolled}+ students
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center gap-2">
                <button
                  onClick={() => onNavigate('course-detail', c.slug)}
                  className="flex-1 py-2.5 px-3 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 text-center"
                >
                  View Curriculum
                </button>
                <button
                  onClick={() => onOpenPaymentModal(c)}
                  className="py-2.5 px-4 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('courses')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline"
          >
            <span>Browse Full Academy Catalog (All 18 Educational Services)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* SECTION 7: HOW IT WORKS */}
      <section className="bg-emerald-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Simple 4-Step Pathway
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How Your Online Quran Learning Begins
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Designed for ease and peace of mind for parents and international learners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Choose Your Course',
                desc: 'Select from our 18 verified Quran, Tajweed, Hifz, or Islamic Studies programs matching your goal.',
              },
              {
                step: '02',
                title: 'Book a Free Demo',
                desc: 'Submit your preferred schedule. Receive an instant reference code and personal meeting link.',
              },
              {
                step: '03',
                title: 'Meet Teacher Bua Qasim',
                desc: 'Attend your 1-on-1 trial session. The teacher evaluates your level and recommends a custom roadmap.',
              },
              {
                step: '04',
                title: 'Start Regular Classes',
                desc: 'Choose your weekly schedule, join live classes in our student portal, and track steady progress.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-emerald-900/50 border border-emerald-800/80 rounded-2xl p-6 relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-bold font-mono text-amber-400/90 block mb-3">
                    {s.step}
                  </span>
                  <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onOpenDemoModal()}
              className="px-6 py-3 text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Book Your Step 2 Free Trial Class
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 8 & 9: WHY CHOOSE US & LEARNING PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
              Academic Excellence
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950 leading-tight">
              Why Families Worldwide Entrust Their Children to Our Academy
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              We understand that parents need more than just a tutor; they seek a spiritual mentor who nurtures reverence for the Quran while maintaining unwavering safety, patience, and professional punctuality.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-white border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">100% Child Safety & Parent Visibility</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Parents can sit in during any session, access attendance logs, and receive weekly teacher feedback notes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-white border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Customized Pacing & Schedule Flexibility</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    No student is rushed or left behind. If a verse or Makhraj takes extra days to master, we dedicate the needed time patiently.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-white border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <BookMarked className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Complete Educational Portal</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Integrated Quran Mushaf reader, homework submissions, payment invoices, downloadable Islamic primers, and audio guides.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image: Classroom Study Atmosphere */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-emerald-950 aspect-16/11">
              <img
                src="/src/assets/images/quran_classroom_session_1792917818040.jpg"
                alt="Online Quran classroom session on laptop with Tajweed Mushaf"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: PRICING PREVIEW WITH MULTI-CURRENCY CONVERTER */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                Transparent Tuition
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
                Affordable International Course Packages
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Monthly tuition rates with no hidden fees or contracts. Family discounts available.
              </p>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs font-semibold text-slate-700">Display Currency:</span>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-semibold text-emerald-900 focus:ring-2 focus:ring-emerald-700"
              >
                <option value="USD">USD ($) - International</option>
                <option value="GBP">GBP (£) - United Kingdom</option>
                <option value="EUR">EUR (€) - Europe</option>
                <option value="CAD">CAD (CA$) - Canada</option>
                <option value="AED">AED - UAE & Gulf</option>
                <option value="PKR">PKR (Rs.) - Pakistan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                id: 'starter',
                name: 'Starter Package',
                classes: '2 Classes / Week',
                duration: '30 mins per session',
                baseUSD: 35,
                popular: false,
                features: ['8 Classes per month', '1-on-1 with Teacher Bua Qasim', 'Free Noorani Qaida PDF', 'Classroom video access'],
              },
              {
                id: 'standard',
                name: 'Standard (Recommended)',
                classes: '3 Classes / Week',
                duration: '35 mins per session',
                baseUSD: 45,
                popular: true,
                features: ['12 Classes per month', '1-on-1 with Teacher Bua Qasim', 'All Tajweed PDF guides', 'Weekly parent progress reports', 'Interactive homework assignments'],
              },
              {
                id: 'intensive',
                name: 'Intensive (Hifz & Fluency)',
                classes: '4-5 Classes / Week',
                duration: '40 mins per session',
                baseUSD: 60,
                popular: false,
                features: ['16-20 Classes per month', 'Ideal for Hifz memorization', 'Daily Sabaq & Sabqi revision', 'Priority weekend rescheduling', 'Certificate of Completion'],
              },
              {
                id: 'family',
                name: 'Family & Siblings',
                classes: 'Combined Family Circle',
                duration: '45 mins per session',
                baseUSD: 75,
                popular: false,
                features: ['Up to 2-3 siblings or family members', '12 Joint or split sessions', 'Special family discount savings', 'Shared household Islamic adab'],
              },
            ].map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl p-6 flex flex-col justify-between border transition-all ${
                  pkg.popular
                    ? 'border-emerald-700 shadow-md ring-2 ring-emerald-700/20'
                    : 'border-slate-200 shadow-xs'
                }`}
              >
                <div className="space-y-4">
                  {pkg.popular && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider inline-block">
                      Most Chosen by Parents
                    </span>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{pkg.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{pkg.classes}</p>
                    <p className="text-[11px] text-slate-400">{pkg.duration}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
                      {formatCurrencyPrice(pkg.baseUSD, selectedCurrency)}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">/ month</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 pt-2">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 space-y-2">
                  <button
                    onClick={() => onOpenPaymentModal(courses[0])}
                    className={`w-full py-2.5 text-xs font-semibold rounded-xl transition-colors shadow-xs ${
                      pkg.popular
                        ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    Enroll with {pkg.name.split(' ')[0]}
                  </button>
                  <button
                    onClick={() => onOpenDemoModal()}
                    className="w-full text-center text-[11px] text-emerald-800 hover:underline font-medium"
                  >
                    Test in Free Trial First
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12: STUDENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
            Verified Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950">
            What Parents & Students Say
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Factual feedback from our community of 500+ satisfied students across the UK, USA, Canada, and UAE.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl" title={rev.country}>{rev.flag}</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{rev.studentName}</h4>
                    <p className="text-[11px] text-slate-500">{rev.country} · {rev.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{rev.content}"
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-emerald-800 font-medium">Course: {rev.course}</span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Student
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 14: ISLAMIC RESOURCES PREVIEW */}
      <section className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Daily Worship & Remembrance
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Free Islamic Resources Hub
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                Access authentic Namaz guides, daily duas, Hadiths, digital tasbeeh, and prayer times.
              </p>
            </div>
            <button
              onClick={() => onNavigate('resources')}
              className="px-5 py-2.5 bg-white text-emerald-950 hover:bg-emerald-50 rounded-xl text-xs font-semibold self-start md:self-auto transition-colors"
            >
              Open Full Islamic Hub
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => onNavigate('resources')}
              className="bg-emerald-900/60 hover:bg-emerald-800/80 p-5 rounded-2xl border border-emerald-700/50 text-left transition-all group"
            >
              <Compass className="w-6 h-6 text-amber-300 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold text-white">Namaz & Salah Guide</h4>
              <p className="text-[11px] text-slate-300 mt-1">Step-by-step physical postures & Arabic recitations.</p>
            </button>

            <button
              onClick={() => onNavigate('resources')}
              className="bg-emerald-900/60 hover:bg-emerald-800/80 p-5 rounded-2xl border border-emerald-700/50 text-left transition-all group"
            >
              <Heart className="w-6 h-6 text-amber-300 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold text-white">Authentic Daily Duas</h4>
              <p className="text-[11px] text-slate-300 mt-1">Morning, evening, meals & protection prayers.</p>
            </button>

            <button
              onClick={() => onNavigate('resources')}
              className="bg-emerald-900/60 hover:bg-emerald-800/80 p-5 rounded-2xl border border-emerald-700/50 text-left transition-all group"
            >
              <Sparkles className="w-6 h-6 text-amber-300 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold text-white">Digital Tasbeeh</h4>
              <p className="text-[11px] text-slate-300 mt-1">Interactive counter with authentic dhikr presets.</p>
            </button>

            <button
              onClick={() => onNavigate('resources')}
              className="bg-emerald-900/60 hover:bg-emerald-800/80 p-5 rounded-2xl border border-emerald-700/50 text-left transition-all group"
            >
              <Clock className="w-6 h-6 text-amber-300 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold text-white">Prayer Times</h4>
              <p className="text-[11px] text-slate-300 mt-1">Worldwide accurate times & live countdown.</p>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 16: FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Clear, honest answers about our teaching schedule, trials, and technology.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 hover:text-emerald-800"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFaq === idx ? 'rotate-180 text-emerald-800' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 17: FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 rounded-3xl p-8 sm:p-14 text-white text-center space-y-6 relative overflow-hidden border border-emerald-800 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
              Begin Today with Teacher Bua Qasim Shigry
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Take the First Step Toward Better Quran Learning
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Book your complimentary 1-on-1 trial class today. No credit card required. Experience personalized instruction tailored to you or your child.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenDemoModal()}
              className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Book a Free Demo Class
            </button>
            <button
              onClick={() => onNavigate('courses')}
              className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-emerald-950 hover:bg-emerald-800 rounded-xl border border-emerald-700 transition-colors"
            >
              View All 18 Courses
            </button>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 text-xs sm:text-sm font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-xl transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" /> Contact on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
