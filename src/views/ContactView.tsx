import React, { useState } from 'react';
import { Mail, MapPin, MessageCircle, Phone, Send, Sparkles } from 'lucide-react';
import { db } from '../services/db';
import { createWhatsAppLink, playAuditoryChime } from '../utils/islamicUtils';

export const ContactView: React.FC = () => {
  const settings = db.getSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const waLink = createWhatsAppLink(
    settings.whatsappNumber,
    'Assalamu Alaikum Teacher Bua Qasim, I am reaching out through the academy contact page.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSent(true);
    playAuditoryChime('complete');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
          Direct Inquiries
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950">
          Get in Touch with Online Quran Academy
        </h1>
        <p className="text-sm text-slate-600">
          Have questions regarding class timings, fee payments, or which program suits your family best? Teacher Bua Qasim Shigry and our support team are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-emerald-950 text-white rounded-3xl p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Academy Information</h3>
            <p className="text-xs text-emerald-200 mt-1">
              Teacher Bua Qasim Shigry Online Quran Academy
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Main Academy Studio:</strong>
                <p>{settings.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Direct Phone Line:</strong>
                <p>{settings.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Official Email Address:</strong>
                <p>{settings.contactEmail}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-900">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white font-semibold text-xs rounded-xl hover:bg-[#20bd5a] transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Message Teacher Directly on WhatsApp
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
          {sent ? (
            <div className="p-8 text-center space-y-3">
              <Sparkles className="w-8 h-8 mx-auto text-emerald-700" />
              <h3 className="text-xl font-bold text-slate-900">Message Dispatched!</h3>
              <p className="text-xs text-slate-600">
                Jazakum Allahu Khairan. Teacher Bua Qasim will respond to your WhatsApp or email promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Imran Ali"
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="imran@example.com"
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">WhatsApp / Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7700 900123"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Message or Inquiry</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about class schedules, child learning, fee options..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Submit Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
