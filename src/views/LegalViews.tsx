import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface LegalViewsProps {
  type: 'privacy' | 'terms' | 'refund' | 'child-safety';
  onBack: () => void;
}

export const LegalViews: React.FC<LegalViewsProps> = ({ type, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
        {type === 'child-safety' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-widest">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Student Protection Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
              Child Safety & Student Protection Policy
            </h1>
            <p className="text-sm text-slate-700 leading-relaxed">
              At Online Quran Academy — Teacher Bua Qasim Shigry, safeguarding the moral, emotional, and physical well-being of young learners is our highest institutional obligation.
            </p>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <h3 className="text-sm font-bold text-slate-900">1. Full Parental Access & Open Classroom Principle</h3>
              <p>
                Parents and legal guardians possess an unrestricted right to join, observe, and listen to any live 1-on-1 or group Quran class at any moment without prior notice.
              </p>

              <h3 className="text-sm font-bold text-slate-900">2. Respectful & Positive Pedagogy</h3>
              <p>
                Teacher Bua Qasim adheres strictly to prophetic gentleness (Rifq). Harsh language, reprimands that demean a child, or any form of inappropriate conduct is strictly prohibited. Mistakes are treated with patient correction and smiles.
              </p>

              <h3 className="text-sm font-bold text-slate-900">3. Private Data & Minor Information Protection</h3>
              <p>
                Student personal contact information, home addresses, or private photos are never published, shared with third parties, or indexed by search engines. All communication regarding classes takes place directly through the parent or designated guardian.
              </p>
            </div>
          </div>
        )}

        {type === 'privacy' && (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">Privacy Policy</h1>
            <p className="text-xs text-slate-500">Effective Date: October 2026</p>
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <p>
                Online Quran Academy respects your privacy. We collect only information essential to providing academic tutoring (student name, email, WhatsApp contact, country, and learning level).
              </p>
              <h3 className="text-sm font-bold text-slate-900">Payment Security</h3>
              <p>
                We do not store complete credit card numbers on our servers. Payment processing is tokenized securely via PCI-DSS compliant providers (Stripe, PayPal, and verified banking channels).
              </p>
            </div>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">Terms and Conditions</h1>
            <p className="text-xs text-slate-500">Effective Date: October 2026</p>
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <h3 className="text-sm font-bold text-slate-900">1. Trial & Enrollment</h3>
              <p>
                Trial classes are provided free of charge for prospective students. Regular enrollment commences once a tuition package is selected and verified.
              </p>
              <h3 className="text-sm font-bold text-slate-900">2. Attendance & Rescheduling</h3>
              <p>
                Students may reschedule class sessions by notifying Teacher Bua Qasim at least 4 hours in advance via WhatsApp. Missed classes due to emergency will be made up according to teacher availability.
              </p>
            </div>
          </div>
        )}

        {type === 'refund' && (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">Refund Policy</h1>
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <p>
                We want you to be 100% satisfied with your Quran learning journey. If after your first week of paid classes you feel the teaching style is not suitable for your child, we will refund the remaining unused classes of your monthly fee without hesitation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
