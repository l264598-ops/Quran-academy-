import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Globe,
  GraduationCap,
  Sparkles,
  Users,
} from 'lucide-react';
import { db } from '../services/db';
import { Course, CourseCategory } from '../types';
import { formatCurrencyPrice } from '../utils/islamicUtils';

interface CoursesViewProps {
  onSelectCourse: (courseSlug: string) => void;
  onOpenDemoModal: (courseId?: string) => void;
  onOpenPaymentModal: (course: Course) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  onSelectCourse,
  onOpenDemoModal,
  onOpenPaymentModal,
}) => {
  const courses = db.getCourses();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [currency, setCurrency] = useState('USD');

  const filteredCourses = courses.filter((c) => {
    const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchLvl = selectedLevel === 'all' || c.level === selectedLevel;
    return matchCat && matchLvl;
  });

  const categories: string[] = [
    'all',
    'Quran Reading & Nazira',
    'Tajweed & Tarteel',
    'Hifz & Memorization',
    'Translation & Tafseer',
    'Islamic Education',
    'Languages & Urdu',
    'Specialized Programs',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
          Comprehensive Academy Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950">
          All 18 Quranic & Islamic Educational Programs
        </h1>
        <p className="text-sm text-slate-600">
          Personalized 1-on-1 instruction taught with 16 years of experience by Teacher Bua Qasim Shigry. Every course features structured weekly milestone syllabi.
        </p>
      </div>

      {/* Filter and Currency Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All 18 Courses' : cat}
            </button>
          ))}
        </div>

        {/* Currency Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-600">Currency:</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-semibold text-emerald-900"
          >
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
            <option value="EUR">EUR (€)</option>
            <option value="CAD">CAD (CA$)</option>
            <option value="AED">AED</option>
            <option value="PKR">PKR (Rs.)</option>
          </select>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
          >
            <div>
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
                  {formatCurrencyPrice(c.pricePerMonthUSD, currency)}/mo
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="text-right font-arabic text-emerald-800 text-sm font-bold" dir="rtl">
                  {c.arabicTitle}
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {c.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {c.shortDesc}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" /> {c.classesPerWeek} classes/wk ({c.classDurationMins}m)
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-700" /> {c.totalEnrolled}+ learners
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center gap-2">
              <button
                onClick={() => onSelectCourse(c.slug)}
                className="flex-1 py-2.5 px-3 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 text-center"
              >
                View Syllabus
              </button>
              <button
                onClick={() => onOpenPaymentModal(c)}
                className="py-2.5 px-4 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs"
              >
                Enroll
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface CourseDetailViewProps {
  courseSlug: string;
  onBack: () => void;
  onOpenDemoModal: (courseId?: string) => void;
  onOpenPaymentModal: (course: Course) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  courseSlug,
  onBack,
  onOpenDemoModal,
  onOpenPaymentModal,
}) => {
  const course = db.getCourseBySlug(courseSlug) || db.getCourses()[0];
  const settings = db.getSettings();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Courses
      </button>

      {/* Main Course Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase">
                {course.category}
              </span>
              <span className="text-xs text-slate-500 font-medium">· Level: {course.level}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 mt-2">
              {course.title}
            </h1>
            <p className="font-arabic text-emerald-900 text-lg font-bold mt-1" dir="rtl">
              {course.arabicTitle}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-950">
              ${course.pricePerMonthUSD}
            </span>
            <span className="text-xs text-slate-500 block">/ month (Tuition)</span>
          </div>
        </div>

        {/* Detailed Image & Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-slate-900">About this Program</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{course.fullDesc}</p>

            <h3 className="text-base font-bold text-slate-900 pt-3">Key Learning Outcomes</h3>
            <div className="grid grid-cols-1 gap-2.5">
              {course.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wide">Class Specifics</h4>
            <div className="space-y-2 text-slate-600">
              <p><strong>Teacher:</strong> {course.teacherName} (16 yrs exp)</p>
              <p><strong>Weekly Frequency:</strong> {course.classesPerWeek} Classes / Week</p>
              <p><strong>Class Duration:</strong> {course.classDurationMins} Minutes</p>
              <p><strong>Languages:</strong> {course.language}</p>
              <p><strong>Suitable For:</strong> {course.suitableFor}</p>
              <p><strong>Est. Duration:</strong> {course.durationMonths} Months</p>
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={() => onOpenPaymentModal(course)}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl shadow-xs transition-colors"
              >
                Enroll in this Course
              </button>
              <button
                onClick={() => onOpenDemoModal(course.id)}
                className="w-full py-2.5 bg-white hover:bg-slate-100 text-emerald-950 font-semibold rounded-xl border border-slate-300 transition-colors"
              >
                Test in Free Demo Class
              </button>
            </div>
          </div>
        </div>

        {/* Milestone Syllabus Accordion */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Structured Milestone Syllabus</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.syllabusWeeks.map((week) => (
              <div key={week.week} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-emerald-800 font-mono">
                  WEEK {week.week}
                </span>
                <h4 className="text-xs font-bold text-slate-900">{week.title}</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                  {week.topics.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
