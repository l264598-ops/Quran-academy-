import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  Shield,
  Sparkles,
} from 'lucide-react';
import { db } from '../services/db';
import { Course } from '../types';
import { formatCurrencyPrice } from '../utils/islamicUtils';

interface PricingViewProps {
  onOpenDemoModal: () => void;
  onOpenPaymentModal: (course: Course) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  onOpenDemoModal,
  onOpenPaymentModal,
}) => {
  const courses = db.getCourses();
  const [currency, setCurrency] = useState('USD');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('monthly');

  const discountMultiplier = billingCycle === 'quarterly' ? 0.9 : 1; // 10% discount on term

  const packages = [
    {
      id: 'pkg_starter',
      name: 'Starter Package',
      classesPerWeek: '2 Classes / Week',
      duration: '30 mins per session',
      baseUSD: 35,
      description: 'Ideal for young beginners or busy school schedules.',
      features: [
        '8 one-to-one classes per month',
        'Direct tuition with Teacher Bua Qasim',
        'Free color-coded Noorani Qaida PDF',
        'Student portal attendance access',
      ],
      popular: false,
    },
    {
      id: 'pkg_standard',
      name: 'Standard Package',
      classesPerWeek: '3 Classes / Week',
      duration: '35 mins per session',
      baseUSD: 45,
      description: 'Our most popular plan for steady, continuous Quran recitation fluency.',
      features: [
        '12 one-to-one classes per month',
        'Complete Tajweed rules guide & drills',
        'Weekly parent progress reports & notes',
        'Interactive homework & audio reviews',
        'Flexible schedule adjustment with teacher',
      ],
      popular: true,
    },
    {
      id: 'pkg_intensive',
      name: 'Intensive (Hifz & Fluency)',
      classesPerWeek: '4-5 Classes / Week',
      duration: '40 mins per session',
      baseUSD: 65,
      description: 'Accelerated memorization track with daily revision protocols.',
      features: [
        '16-20 one-to-one classes per month',
        'Systematic Sabaq, Sabqi & Manzil revision',
        'Priority weekend rescheduling slots',
        'Dedicated memorization assessment certificate',
      ],
      popular: false,
    },
    {
      id: 'pkg_family',
      name: 'Family & Group Circle',
      classesPerWeek: 'Shared Household Circle',
      duration: '45 mins per session',
      baseUSD: 80,
      description: 'Multiple siblings or parent-child pairs learning together.',
      features: [
        'Up to 2-3 siblings or family members',
        '12 joint or split sessions per month',
        'High value family discount rate',
        'Shared home Islamic adab & daily duas',
      ],
      popular: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
          Transparent & Fair
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950">
          International Tuition Packages
        </h1>
        <p className="text-sm text-slate-600">
          Clear monthly tuition with no registration fees or hidden costs. Convert prices to your local currency.
        </p>

        {/* Currency & Frequency Toggle */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-300 text-xs shadow-xs">
            <span className="font-semibold text-slate-700">Currency:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent font-bold text-emerald-900 focus:outline-none"
            >
              <option value="USD">USD ($) - US & International</option>
              <option value="GBP">GBP (£) - United Kingdom</option>
              <option value="EUR">EUR (€) - Europe</option>
              <option value="CAD">CAD (CA$) - Canada</option>
              <option value="AED">AED - UAE & Gulf</option>
              <option value="PKR">PKR (Rs.) - Pakistan</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                billingCycle === 'monthly' ? 'bg-white text-emerald-950 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Monthly Tuition
            </button>
            <button
              onClick={() => setBillingCycle('quarterly')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                billingCycle === 'quarterly' ? 'bg-white text-emerald-950 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              3-Month Term (Save 10%)
            </button>
          </div>
        </div>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {packages.map((pkg) => {
          const calculatedUSD = pkg.baseUSD * discountMultiplier;

          return (
            <div
              key={pkg.id}
              className={`bg-white rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                pkg.popular
                  ? 'border-emerald-700 shadow-lg ring-2 ring-emerald-700/20'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              <div className="space-y-4">
                {pkg.popular && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider inline-block">
                    Recommended by Teacher
                  </span>
                )}
                <div>
                  <h3 className="text-base font-bold text-slate-900">{pkg.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{pkg.classesPerWeek}</p>
                  <p className="text-[11px] text-slate-400">{pkg.duration}</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-3xl font-extrabold text-emerald-950">
                    {formatCurrencyPrice(calculatedUSD, currency)}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">/ mo</span>
                  {billingCycle === 'quarterly' && (
                    <span className="block text-[10px] text-emerald-700 font-semibold mt-0.5">
                      Includes 10% Term Discount
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600">{pkg.description}</p>

                <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  {pkg.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
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
                  Enroll Now
                </button>
                <button
                  onClick={onOpenDemoModal}
                  className="w-full text-center text-[11px] text-emerald-800 hover:underline font-medium"
                >
                  Book Free Demo First
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
