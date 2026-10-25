import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Globe,
  MessageCircle,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { db } from '../services/db';
import { createWhatsAppLink } from '../utils/islamicUtils';

interface DemoBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCourseId?: string;
}

export const DemoBookingModal: React.FC<DemoBookingModalProps> = ({
  isOpen,
  onClose,
  preselectedCourseId,
}) => {
  const courses = db.getCourses();
  const settings = db.getSettings();

  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [ageRange, setAgeRange] = useState('8-12 years');
  const [courseId, setCourseId] = useState(preselectedCourseId || courses[0]?.id || 'c1');
  const [currentLevel, setCurrentLevel] = useState('Noorani Qaida basics');
  const [timeZone, setTimeZone] = useState('Europe/London (GMT+1)');
  const [preferredDays, setPreferredDays] = useState<string[]>(['Monday', 'Wednesday']);
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('17:00 - 18:00 (Evening)');
  const [learningGoals, setLearningGoals] = useState('');
  const [notes, setNotes] = useState('');

  const [submittedRefCode, setSubmittedRefCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDayToggle = (day: string) => {
    if (preferredDays.includes(day)) {
      setPreferredDays(preferredDays.filter((d) => d !== day));
    } else {
      setPreferredDays([...preferredDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !email.trim() || !whatsapp.trim()) {
      setError('Please provide student name, email, and WhatsApp number.');
      return;
    }

    const selectedCourse = courses.find((c) => c.id === courseId) || courses[0];

    const demo = db.createDemoRequest({
      studentName,
      parentName: parentName.trim() || undefined,
      email,
      whatsapp,
      country,
      ageRange,
      courseId: selectedCourse.id,
      courseTitle: selectedCourse.title,
      currentLevel,
      timeZone,
      preferredDays: preferredDays.length ? preferredDays : ['Flexible'],
      preferredTimeSlot,
      learningGoals: learningGoals || 'Develop fluent recitation with correct Tajweed rules.',
      notes,
    });

    setSubmittedRefCode(demo.referenceCode);
  };

  const copyRefCode = () => {
    if (submittedRefCode) {
      navigator.clipboard.writeText(submittedRefCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const waConfirmationLink = submittedRefCode
    ? createWhatsAppLink(
        settings.whatsappNumber,
        `Assalamu Alaikum Teacher Bua Qasim! I have booked a Free Quran Demo Class. Reference Code: ${submittedRefCode} for ${studentName} (${courseId}).`
      )
    : '#';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-emerald-200 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> 100% Free · No Payment Required
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Book Your Free 1-on-1 Trial Class</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Experience Teacher Bua Qasim Shigry’s personalized Quran teaching methodology.
          </p>
        </div>

        {submittedRefCode ? (
          /* Confirmation View */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Trial Class Request Received!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Alhamdulillah! Your free demo class has been registered in our academy database. Teacher Bua Qasim Shigry will review your preferred schedule and send your private classroom link via WhatsApp and email.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left">
              <p className="text-xs text-slate-500 uppercase font-semibold">Your Unique Reference Code</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-lg font-mono font-bold text-emerald-800 tracking-wider">
                  {submittedRefCode}
                </span>
                <button
                  onClick={copyRefCode}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-2 py-1 rounded"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                <p><strong className="text-slate-700">Student:</strong> {studentName}</p>
                <p><strong className="text-slate-700">Timezone:</strong> {timeZone}</p>
                <p><strong className="text-slate-700">Slots:</strong> {preferredTimeSlot}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={waConfirmationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] text-white font-semibold text-sm rounded-xl hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Fast Track on WhatsApp
              </a>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-200 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {error}
              </div>
            )}

            {/* Student & Guardian */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aisha Fatima"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parent / Guardian Name (if applicable)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tariq Khan"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            {/* Email & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp Number (with country code) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="+44 7700 900123"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            {/* Country & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Country of Residence
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                >
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="Other Country">Other Country</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Age Range
                </label>
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                >
                  <option value="4-7 years (Early Primer)">4-7 years (Early Primer)</option>
                  <option value="8-12 years (Elementary)">8-12 years (Elementary)</option>
                  <option value="13-17 years (Teenager)">13-17 years (Teenager)</option>
                  <option value="Adult (18+)">Adult (18+)</option>
                  <option value="Family / Siblings (Multiple)">Family / Siblings (Multiple)</option>
                </select>
              </div>
            </div>

            {/* Course & Current Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Desired Course
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white font-medium"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Quran Reading Level
                </label>
                <select
                  value={currentLevel}
                  onChange={(e) => setCurrentLevel(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                >
                  <option value="Absolute Beginner (Never studied Arabic)">Absolute Beginner (Never studied Arabic)</option>
                  <option value="Noorani Qaida basics">Noorani Qaida basics</option>
                  <option value="Can read slowly from Quran">Can read slowly from Quran</option>
                  <option value="Fluent reader seeking Tajweed perfection">Fluent reader seeking Tajweed perfection</option>
                  <option value="Starting or continuing Hifz (Memorization)">Starting or continuing Hifz (Memorization)</option>
                </select>
              </div>
            </div>

            {/* Timezone & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Timezone
                </label>
                <select
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                >
                  <option value="Europe/London (GMT+1)">UK / Europe (GMT / BST)</option>
                  <option value="America/New_York (EST)">US & Canada Eastern (EST)</option>
                  <option value="America/Chicago (CST)">US Central (CST)</option>
                  <option value="America/Los_Angeles (PST)">US Pacific (PST)</option>
                  <option value="Asia/Karachi (GMT+5)">Pakistan (PKT GMT+5)</option>
                  <option value="Asia/Dubai (GMT+4)">UAE / Gulf (GST GMT+4)</option>
                  <option value="Australia/Sydney (AEST)">Australia (AEST)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Time Slot
                </label>
                <select
                  value={preferredTimeSlot}
                  onChange={(e) => setPreferredTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                >
                  <option value="09:00 - 12:00 (Morning)">09:00 - 12:00 (Morning)</option>
                  <option value="12:00 - 16:00 (Afternoon)">12:00 - 16:00 (Afternoon)</option>
                  <option value="16:00 - 19:00 (After-School / Evening)">16:00 - 19:00 (After-School / Evening)</option>
                  <option value="19:00 - 22:00 (Night / Weekend)">19:00 - 22:00 (Night / Weekend)</option>
                </select>
              </div>
            </div>

            {/* Preferred Days */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Days for Classes
              </label>
              <div className="flex flex-wrap gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <button
                    type="button"
                    key={day}
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      preferredDays.includes(day)
                        ? 'bg-emerald-800 text-white border-emerald-800 font-semibold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Goals */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Learning Goals or Notes for Teacher Bua Qasim Shigry
              </label>
              <textarea
                rows={2}
                placeholder="e.g. My son wants to start Nazira and learn daily prayers with correct pronunciation."
                value={learningGoals}
                onChange={(e) => setLearningGoals(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            {/* Privacy notice */}
            <p className="text-[11px] text-slate-500 leading-relaxed">
              By submitting this form, you consent to receiving scheduling messages from Teacher Bua Qasim Shigry via WhatsApp and email. We protect your privacy and child information strictly in compliance with our Child Safety & Student Protection policy.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors"
              >
                Submit Demo Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
