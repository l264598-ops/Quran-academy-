import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Star } from 'lucide-react';
import { db } from '../services/db';
import { ReviewItem } from '../types';
import { playAuditoryChime } from '../utils/islamicUtils';

export const ReviewsView: React.FC = () => {
  const reviews = db.getReviews();
  const [studentName, setStudentName] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [course, setCourse] = useState('Quran with Tajweed & Nazira');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !content.trim()) return;

    db.addReview({
      studentName,
      country,
      flag: country === 'United Kingdom' ? '🇬🇧' : country === 'United States' ? '🇺🇸' : country === 'Canada' ? '🇨🇦' : country === 'Pakistan' ? '🇵🇰' : '🌍',
      rating,
      course,
      content,
    });

    setSubmitted(true);
    playAuditoryChime('complete');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
          Verified Student Community
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950">
          Student & Parent Testimonials
        </h1>
        <p className="text-sm text-slate-600">
          Authentic experiences from families learning Quran Nazira, Tajweed, and Hifz with Teacher Bua Qasim Shigry.
        </p>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{rev.flag}</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{rev.studentName}</h3>
                  <p className="text-xs text-slate-500">{rev.country} · {rev.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "{rev.content}"
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-emerald-800 font-semibold">{rev.course}</span>
              <span className="text-emerald-700 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Verified Student
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Review Submission Form */}
      <div className="bg-slate-50 rounded-3xl p-8 max-w-2xl mx-auto border border-slate-200 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 text-center">
          Share Your Experience with Teacher Bua Qasim
        </h3>

        {submitted ? (
          <div className="p-4 bg-emerald-100 text-emerald-900 rounded-xl text-center text-xs space-y-1">
            <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-700" />
            <p className="font-bold">Jazakum Allahu Khairan! Your feedback has been published.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Name / Parent Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Brother Farhan"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United Kingdom"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rating</label>
              <div className="flex gap-2">
                {[5, 4, 3, 2, 1].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRating(r)}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 ${
                      rating === r ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold' : 'bg-white border-slate-300'
                    }`}
                  >
                    <span>{r} Stars</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Review</label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your learning experience, teacher patience, or child recitation improvements..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl shadow-xs transition-colors"
            >
              Submit Verified Testimonial
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
