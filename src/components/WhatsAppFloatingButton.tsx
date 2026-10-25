import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { db } from '../services/db';
import { createWhatsAppLink } from '../utils/islamicUtils';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const settings = db.getSettings();

  const waLink = createWhatsAppLink(
    settings.whatsappNumber,
    'Assalamu Alaikum Teacher Bua Qasim! I would like to learn more about enrolling in Quran classes at Online Quran Academy.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {showTooltip && (
        <div className="bg-white border border-emerald-900/10 rounded-xl shadow-xl p-3 max-w-xs text-xs text-slate-700 animate-in fade-in slide-in-from-right-2 duration-200">
          <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-100">
            <span className="font-semibold text-emerald-900">Direct WhatsApp</span>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="mt-1 text-slate-600">
            Need advice on which course fits your child or your schedule? Speak directly with Teacher Bua Qasim Shigry.
          </p>
        </div>
      )}

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="flex items-center justify-center w-13 h-13 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all focus:outline-none"
        aria-label="Contact Teacher Bua Qasim on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
};
