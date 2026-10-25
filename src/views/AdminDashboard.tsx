import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Award,
  BookOpen,
  Building,
  Calendar,
  CheckCircle2,
  Code,
  CreditCard,
  DollarSign,
  Edit,
  ExternalLink,
  Eye,
  FileCode,
  FileText,
  Globe,
  Info,
  Layers,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { db, DEFAULT_SEO_SETTINGS, PaymentGatewayConfig } from '../services/db';
import { AcademySettings, Course, DemoRequest, PaymentInvoice, SEOSettings, User } from '../types';
import { playAuditoryChime } from '../utils/islamicUtils';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'courses' | 'payments' | 'demos' | 'settings' | 'gateway' | 'seo' | 'audit'>('overview');

  const settings = db.getSettings();
  const gatewayConfig = db.getGatewayConfig();
  const users = db.getUsers();
  const courses = db.getCourses();
  const invoices = db.getInvoices();
  const demoRequests = db.getDemoRequests();
  const auditLogs = db.getAuditLogs();

  // Settings form state
  const [announcementText, setAnnouncementText] = useState(settings.announcementText);
  const [announcementActive, setAnnouncementActive] = useState(settings.announcementActive);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [phone, setPhone] = useState(settings.phone);
  const [experienceYears, setExperienceYears] = useState(settings.experienceYears);
  const [studentsCount, setStudentsCount] = useState(settings.studentsCount);
  const [bankDetails, setBankDetails] = useState(settings.bankAccountDetails);
  const [easypaisaDetails, setEasypaisaDetails] = useState(settings.easypaisaDetails);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Gateway config state
  const [gatewayMode, setGatewayMode] = useState<'sandbox' | 'live'>(gatewayConfig.mode);
  const [stripeKey, setStripeKey] = useState(gatewayConfig.stripePublishableKey);
  const [paypalClient, setPaypalClient] = useState(gatewayConfig.paypalClientId);
  const [gatewaySavedMessage, setGatewaySavedMessage] = useState(false);

  // SEO settings state
  const initialSEO = db.getSEOSettings();
  const [metaTitle, setMetaTitle] = useState(initialSEO.metaTitle);
  const [metaDescription, setMetaDescription] = useState(initialSEO.metaDescription);
  const [metaKeywords, setMetaKeywords] = useState(initialSEO.metaKeywords);
  const [canonicalUrl, setCanonicalUrl] = useState(initialSEO.canonicalUrl);
  const [ogTitle, setOgTitle] = useState(initialSEO.ogTitle);
  const [ogDescription, setOgDescription] = useState(initialSEO.ogDescription);
  const [ogImage, setOgImage] = useState(initialSEO.ogImage);
  const [ogType, setOgType] = useState(initialSEO.ogType);
  const [ogSiteName, setOgSiteName] = useState(initialSEO.ogSiteName);
  const [twitterCard, setTwitterCard] = useState<'summary' | 'summary_large_image'>(initialSEO.twitterCard);
  const [twitterTitle, setTwitterTitle] = useState(initialSEO.twitterTitle);
  const [twitterDescription, setTwitterDescription] = useState(initialSEO.twitterDescription);
  const [twitterImage, setTwitterImage] = useState(initialSEO.twitterImage);
  const [structuredDataJson, setStructuredDataJson] = useState(initialSEO.structuredDataJson);
  const [seoSavedMessage, setSeoSavedMessage] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [seoActiveSubtab, setSeoActiveSubtab] = useState<'meta' | 'opengraph' | 'twitter' | 'schema' | 'preview'>('meta');

  const handleSaveSEO = (e: React.FormEvent) => {
    e.preventDefault();
    setJsonError(null);

    if (structuredDataJson.trim()) {
      try {
        JSON.parse(structuredDataJson);
      } catch (err: any) {
        setJsonError('Invalid JSON format in Structured Data: ' + err.message);
        return;
      }
    }

    db.updateSEOSettings({
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage,
      ogType,
      ogSiteName,
      twitterCard,
      twitterTitle,
      twitterDescription,
      twitterImage,
      structuredDataJson,
    });

    setSeoSavedMessage(true);
    playAuditoryChime('complete');
    setTimeout(() => setSeoSavedMessage(false), 3000);
  };

  const handleResetSEODefaults = () => {
    setMetaTitle(DEFAULT_SEO_SETTINGS.metaTitle);
    setMetaDescription(DEFAULT_SEO_SETTINGS.metaDescription);
    setMetaKeywords(DEFAULT_SEO_SETTINGS.metaKeywords);
    setCanonicalUrl(DEFAULT_SEO_SETTINGS.canonicalUrl);
    setOgTitle(DEFAULT_SEO_SETTINGS.ogTitle);
    setOgDescription(DEFAULT_SEO_SETTINGS.ogDescription);
    setOgImage(DEFAULT_SEO_SETTINGS.ogImage);
    setOgType(DEFAULT_SEO_SETTINGS.ogType);
    setOgSiteName(DEFAULT_SEO_SETTINGS.ogSiteName);
    setTwitterCard(DEFAULT_SEO_SETTINGS.twitterCard);
    setTwitterTitle(DEFAULT_SEO_SETTINGS.twitterTitle);
    setTwitterDescription(DEFAULT_SEO_SETTINGS.twitterDescription);
    setTwitterImage(DEFAULT_SEO_SETTINGS.twitterImage);
    setStructuredDataJson(DEFAULT_SEO_SETTINGS.structuredDataJson);
    setJsonError(null);
    playAuditoryChime('click');
  };

  const handleSyncTwitterFromOG = () => {
    setTwitterTitle(ogTitle || metaTitle);
    setTwitterDescription(ogDescription || metaDescription);
    setTwitterImage(ogImage);
    playAuditoryChime('click');
  };

  const handleUseCurrentUrl = () => {
    if (typeof window !== 'undefined') {
      setCanonicalUrl(window.location.origin + window.location.pathname);
      playAuditoryChime('click');
    }
  };

  // Calculate metrics
  const totalRevenue = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingDemosCount = demoRequests.filter((d) => d.status === 'pending').length;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSettings({
      announcementText,
      announcementActive,
      whatsappNumber,
      contactEmail,
      phone,
      experienceYears,
      studentsCount,
      bankAccountDetails: bankDetails,
      easypaisaDetails,
    });
    setSettingsSavedMessage(true);
    playAuditoryChime('complete');
    setTimeout(() => setSettingsSavedMessage(false), 3000);
  };

  const handleSaveGateway = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateGatewayConfig({
      mode: gatewayMode,
      stripePublishableKey: stripeKey,
      paypalClientId: paypalClient,
    });
    setGatewaySavedMessage(true);
    playAuditoryChime('complete');
    setTimeout(() => setGatewaySavedMessage(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Global Administration Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Academy Management System
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Teacher Bua Qasim Shigry Online Quran Academy · Real Database Connected
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-950 border border-emerald-700/60 text-emerald-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>SYSTEM ACTIVE</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'overview' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Overview & KPIs
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'students' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Students ({users.filter((u) => u.role === 'student').length})
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'courses' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Course Management ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'payments' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Payments & Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('demos')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'demos' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Demo Requests ({pendingDemosCount} Pending)
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'settings' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Website Settings
        </button>
        <button
          onClick={() => setActiveTab('gateway')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'gateway' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Payment Gateway
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'seo' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          SEO Settings
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'audit' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Audit Logs
        </button>
      </div>

      {/* TAB 1: OVERVIEW & KPIS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Total Community Students</span>
              <p className="text-3xl font-extrabold font-mono text-emerald-950 mt-1">
                {settings.studentsCount}+
              </p>
              <span className="text-[11px] text-emerald-700 font-medium">16 Years Continuous Teaching</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Active Courses Offered</span>
              <p className="text-3xl font-extrabold font-mono text-emerald-950 mt-1">
                {courses.length}
              </p>
              <span className="text-[11px] text-emerald-700 font-medium">Nazira, Tajweed, Hifz, Urdu</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Verified Tuition Collected</span>
              <p className="text-3xl font-extrabold font-mono text-emerald-950 mt-1">
                ${totalRevenue.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-400">USD & Equivalent</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Pending Trial Requests</span>
              <p className="text-3xl font-extrabold font-mono text-amber-700 mt-1">
                {pendingDemosCount}
              </p>
              <span className="text-[11px] text-amber-600 font-medium">Awaiting teacher assignment</span>
            </div>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Immediate Administrative Tasks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <button
                onClick={() => setActiveTab('demos')}
                className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-left transition-colors"
              >
                <span className="font-bold text-slate-900 block">Review Free Trial Bookings</span>
                <span className="text-slate-500 mt-1 block">
                  {pendingDemosCount} requests from UK, US, Canada and Pakistan
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-left transition-colors"
              >
                <span className="font-bold text-slate-900 block">Edit Announcement & WhatsApp</span>
                <span className="text-slate-500 mt-1 block">
                  Change banner text or update banking account credentials
                </span>
              </button>

              <button
                onClick={() => setActiveTab('gateway')}
                className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-left transition-colors"
              >
                <span className="font-bold text-slate-900 block">Payment Gateway (Stripe/PayPal)</span>
                <span className="text-slate-500 mt-1 block">
                  Currently in {gatewayConfig.mode.toUpperCase()} mode
                </span>
              </button>

              <button
                onClick={() => setActiveTab('seo')}
                className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-left transition-colors"
              >
                <span className="font-bold text-slate-900 block">SEO & Social Meta Tags</span>
                <span className="text-slate-500 mt-1 block">
                  Google snippets, OpenGraph cards & JSON-LD
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENTS */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Enrolled Student Accounts</h3>
            <span className="text-xs text-slate-500">All registered learner records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Country & Timezone</th>
                  <th className="py-3 px-4">WhatsApp Contact</th>
                  <th className="py-3 px-4">Parent / Age</th>
                  <th className="py-3 px-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4 font-mono">{u.email}</td>
                    <td className="py-3 px-4">{u.country} ({u.timeZone})</td>
                    <td className="py-3 px-4 font-mono">{u.whatsapp || u.phone || 'N/A'}</td>
                    <td className="py-3 px-4">{u.parentName ? `${u.parentName} (${u.studentAgeRange})` : u.studentAgeRange || 'Adult'}</td>
                    <td className="py-3 px-4 text-slate-400">{u.createdAt.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: COURSES */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Course Catalog Management</h3>
            <span className="text-xs text-slate-500">{courses.length} courses published</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {c.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{c.title}</h4>
                    <p className="font-arabic text-emerald-900 font-semibold">{c.arabicTitle}</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-900 text-sm">
                    ${c.pricePerMonthUSD}/mo
                  </span>
                </div>
                <p className="text-slate-600 line-clamp-2">{c.shortDesc}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Duration: {c.durationMonths} months ({c.classesPerWeek} classes/wk)</span>
                  <span>{c.totalEnrolled} Enrolled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PAYMENTS & INVOICES */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Tuition & Invoices</h3>
              <p className="text-xs text-slate-500">Track all paid, pending, and bank-wire payments</p>
            </div>
            <span className="text-xs font-bold text-emerald-900 font-mono">
              Total: ${totalRevenue.toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method / Ref</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Dates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4 font-semibold">{inv.studentName}</td>
                    <td className="py-3 px-4">{inv.courseTitle}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-900">
                      {inv.currency} {inv.amount}
                    </td>
                    <td className="py-3 px-4">
                      <span>{inv.paymentMethod || 'Online'}</span>
                      {inv.transactionReference && (
                        <span className="block font-mono text-[10px] text-slate-400">{inv.transactionReference}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      Issued: {inv.issueDate}
                      {inv.paidDate && <span className="block text-emerald-700">Paid: {inv.paidDate}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: DEMO REQUESTS */}
      {activeTab === 'demos' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Free Trial Booking Submissions</h3>
            <span className="text-xs text-slate-500">{demoRequests.length} total entries</span>
          </div>

          <div className="space-y-3">
            {demoRequests.map((d) => (
              <div key={d.id} className="p-4 rounded-xl border border-slate-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-900">{d.referenceCode}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        d.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {d.status}
                    </span>
                    <span className="text-slate-400">{d.country} · {d.timeZone}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {d.studentName} {d.parentName ? `(Parent: ${d.parentName})` : ''}
                  </h4>
                  <p className="text-slate-600">Course: {d.courseTitle} · WhatsApp: {d.whatsapp}</p>
                  <p className="text-slate-500">Slots: {d.preferredTimeSlot} ({d.preferredDays.join(', ')})</p>
                </div>

                <div>
                  {d.status === 'pending' ? (
                    <button
                      onClick={() => {
                        db.updateDemoStatus(d.id, 'approved', '2026-10-29 18:00', 'https://meet.google.com/quran-bua-qasim');
                        playAuditoryChime('complete');
                      }}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl"
                    >
                      Approve Request
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Approved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: WEBSITE SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Website & Content Settings</h3>
              <p className="text-xs text-slate-500">Update verified facts, announcement bar, and banking credentials</p>
            </div>
            {settingsSavedMessage && (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Settings Saved!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Top Announcement Bar Text
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Teacher Verified Teaching Experience (Years)
              </label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value))}
                className="w-full p-2 border rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Total Satisfied Students Milestone
              </label>
              <input
                type="number"
                value={studentsCount}
                onChange={(e) => setStudentsCount(parseInt(e.target.value))}
                className="w-full p-2 border rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Direct WhatsApp Contact Number (with Country Code)
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full p-2 border rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Official Academy Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full p-2 border rounded-lg font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Official Bank Wire Account Details (Meezan Bank Ltd)
              </label>
              <textarea
                rows={2}
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                className="w-full p-2 border rounded-lg font-mono text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Easypaisa / JazzCash Account Details
              </label>
              <input
                type="text"
                value={easypaisaDetails}
                onChange={(e) => setEasypaisaDetails(e.target.value)}
                className="w-full p-2 border rounded-lg font-mono text-slate-800"
              />
            </div>
          </div>

          <div className="pt-3 border-t flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs"
            >
              Save Academy Settings
            </button>
          </div>
        </form>
      )}

      {/* TAB 7: PAYMENT GATEWAY CONFIG */}
      {activeTab === 'gateway' && (
        <form onSubmit={handleSaveGateway} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Payment Gateway Configuration</h3>
              <p className="text-xs text-slate-500">Manage Stripe & PayPal sandbox or production credentials</p>
            </div>
            {gatewaySavedMessage && (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Gateway Updated!
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Operating Mode</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    checked={gatewayMode === 'sandbox'}
                    onChange={() => setGatewayMode('sandbox')}
                  />
                  <span>Sandbox / Test Mode (Recommended for evaluation)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    checked={gatewayMode === 'live'}
                    onChange={() => setGatewayMode('live')}
                  />
                  <span>Live Production</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Stripe Publishable API Key
              </label>
              <input
                type="text"
                value={stripeKey}
                onChange={(e) => setStripeKey(e.target.value)}
                className="w-full p-2 border rounded-lg font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                PayPal Client ID
              </label>
              <input
                type="text"
                value={paypalClient}
                onChange={(e) => setPaypalClient(e.target.value)}
                className="w-full p-2 border rounded-lg font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="pt-3 border-t flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs"
            >
              Update Gateway Configuration
            </button>
          </div>
        </form>
      )}

      {/* TAB: SEO SETTINGS */}
      {activeTab === 'seo' && (
        <form onSubmit={handleSaveSEO} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                  Metadata & Visibility
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                  Live Dynamic Head Injection
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Search Engine Optimization & Social Sharing (SEO)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update site title, description, OpenGraph social cards, Twitter cards, and Schema.org structured data dynamically stored in the database.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleResetSEODefaults}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                title="Restore academy default SEO tags"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-amber-300" />
                <span>Save SEO Settings</span>
              </button>
            </div>
          </div>

          {/* Feedback Banners */}
          {seoSavedMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>SEO Settings Saved & Applied:</strong> All meta tags, OpenGraph attributes, and Schema.org structured data have been updated in the database and injected into the browser <code className="bg-emerald-100 px-1 py-0.5 rounded text-[11px]">&lt;head&gt;</code>!
              </span>
            </div>
          )}

          {jsonError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
              <span>{jsonError}</span>
            </div>
          )}

          {/* SEO Subtabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => setSeoActiveSubtab('meta')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                seoActiveSubtab === 'meta' ? 'bg-white text-emerald-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-emerald-700" /> Core Meta Tags
            </button>
            <button
              type="button"
              onClick={() => setSeoActiveSubtab('opengraph')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                seoActiveSubtab === 'opengraph' ? 'bg-white text-emerald-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-700" /> OpenGraph (WhatsApp & Facebook)
            </button>
            <button
              type="button"
              onClick={() => setSeoActiveSubtab('twitter')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                seoActiveSubtab === 'twitter' ? 'bg-white text-emerald-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" /> Twitter / X Cards
            </button>
            <button
              type="button"
              onClick={() => setSeoActiveSubtab('schema')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                seoActiveSubtab === 'schema' ? 'bg-white text-emerald-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-emerald-700" /> Structured Data (JSON-LD)
            </button>
            <button
              type="button"
              onClick={() => setSeoActiveSubtab('preview')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                seoActiveSubtab === 'preview' ? 'bg-white text-emerald-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-emerald-700" /> Live SERP & Social Previews
            </button>
          </div>

          {/* SUBTAB 1: CORE META TAGS */}
          {seoActiveSubtab === 'meta' && (
            <div className="space-y-5 text-xs">
              {/* Site Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-800">
                    Page Title (<code className="text-emerald-800">&lt;title&gt;</code>)
                  </label>
                  <span
                    className={`font-mono font-medium text-[11px] px-2 py-0.5 rounded ${
                      metaTitle.length >= 30 && metaTitle.length <= 60
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {metaTitle.length} characters (Recommended: 30–60)
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="e.g. Online Quran Academy — Teacher Bua Qasim Shigry"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 font-medium text-slate-900"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Appears as the primary clickable headline in search engine results and the browser tab.
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-800">
                    Meta Description (<code className="text-emerald-800">&lt;meta name="description"&gt;</code>)
                  </label>
                  <span
                    className={`font-mono font-medium text-[11px] px-2 py-0.5 rounded ${
                      metaDescription.length >= 120 && metaDescription.length <= 160
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {metaDescription.length} characters (Recommended: 120–160)
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Summarize the core value proposition and key features in 1-2 compelling sentences..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-slate-800 leading-relaxed"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Search engines show this snippet below your page title. Include an actionable call to action.
                </p>
              </div>

              {/* Meta Keywords */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Meta Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder="online quran academy, learn quran online, quran teacher bua qasim shigry, tajweed"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-slate-800"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Comma-separated topic keywords helping search engines categorize the academy.
                </p>
              </div>

              {/* Canonical URL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-800">
                    Canonical URL (<code className="text-emerald-800">&lt;link rel="canonical"&gt;</code>)
                  </label>
                  <button
                    type="button"
                    onClick={handleUseCurrentUrl}
                    className="text-[11px] text-emerald-800 hover:underline font-semibold"
                  >
                    Use Current Window URL
                  </button>
                </div>
                <input
                  type="url"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="https://quranacademy.example.com"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-slate-800"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Specifies the definitive master URL to prevent duplicate content penalties from parameters or proxies.
                </p>
              </div>
            </div>
          )}

          {/* SUBTAB 2: OPENGRAPH SOCIAL CARDS */}
          {seoActiveSubtab === 'opengraph' && (
            <div className="space-y-5 text-xs">
              <div className="bg-emerald-50/60 border border-emerald-200/70 p-3 rounded-xl text-emerald-950 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  OpenGraph tags control how link previews appear when prospective students or parents share links via <strong>WhatsApp, Facebook, LinkedIn, Discord, and iMessage</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    OpenGraph Title (<code className="text-emerald-800">og:title</code>)
                  </label>
                  <input
                    type="text"
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    placeholder="Online Quran Academy — Teacher Bua Qasim Shigry"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Site Name (<code className="text-emerald-800">og:site_name</code>)
                  </label>
                  <input
                    type="text"
                    value={ogSiteName}
                    onChange={(e) => setOgSiteName(e.target.value)}
                    placeholder="Online Quran Academy"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  OpenGraph Description (<code className="text-emerald-800">og:description</code>)
                </label>
                <textarea
                  rows={2}
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  placeholder="Engaging summary for WhatsApp and social link shares..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  OpenGraph Type (<code className="text-emerald-800">og:type</code>)
                </label>
                <select
                  value={ogType}
                  onChange={(e) => setOgType(e.target.value)}
                  className="w-full sm:w-64 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 bg-white"
                >
                  <option value="website">website</option>
                  <option value="article">article</option>
                  <option value="profile">profile</option>
                </select>
              </div>

              {/* Social Share Card Image */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Social Share Card Image URL (<code className="text-emerald-800">og:image</code>)
                </label>
                <input
                  type="text"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-slate-800 mb-2"
                />

                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-600 block">
                    Choose from High-Fidelity Academy Assets:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      {
                        name: 'Holy Quran on Rehal',
                        path: '/src/assets/images/hero_quran_academy_1792917817098.jpg',
                      },
                      {
                        name: 'Teacher Bua Qasim',
                        path: '/src/assets/images/teacher_bua_qasim_1792917817962.jpg',
                      },
                      {
                        name: 'Online Classroom',
                        path: '/src/assets/images/quran_classroom_session_1792917818040.jpg',
                      },
                      {
                        name: 'Classical Books',
                        path: '/src/assets/images/islamic_library_books_1792917819817.jpg',
                      },
                    ].map((img) => (
                      <button
                        type="button"
                        key={img.path}
                        onClick={() => {
                          setOgImage(img.path);
                          playAuditoryChime('click');
                        }}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          ogImage === img.path
                            ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-semibold ring-2 ring-emerald-700/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={img.path}
                          alt={img.name}
                          className="w-8 h-8 rounded-lg object-cover shrink-0"
                        />
                        <span className="text-[11px] truncate">{img.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: TWITTER / X CARDS */}
          {seoActiveSubtab === 'twitter' && (
            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between pb-1">
                <span className="text-slate-600">
                  Configure rich cards displayed on X (Twitter).
                </span>
                <button
                  type="button"
                  onClick={handleSyncTwitterFromOG}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold rounded-lg border border-emerald-700/20 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Sync from OpenGraph Values</span>
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Twitter Card Type (<code className="text-emerald-800">twitter:card</code>)
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="twitterCard"
                      checked={twitterCard === 'summary_large_image'}
                      onChange={() => setTwitterCard('summary_large_image')}
                    />
                    <span>summary_large_image (Large prominent banner - Recommended)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="twitterCard"
                      checked={twitterCard === 'summary'}
                      onChange={() => setTwitterCard('summary')}
                    />
                    <span>summary (Compact square thumbnail)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Twitter Title (<code className="text-emerald-800">twitter:title</code>)
                </label>
                <input
                  type="text"
                  value={twitterTitle}
                  onChange={(e) => setTwitterTitle(e.target.value)}
                  placeholder="Online Quran Academy — Teacher Bua Qasim Shigry"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Twitter Description (<code className="text-emerald-800">twitter:description</code>)
                </label>
                <textarea
                  rows={2}
                  value={twitterDescription}
                  onChange={(e) => setTwitterDescription(e.target.value)}
                  placeholder="Short description for Twitter cards..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Twitter Image URL (<code className="text-emerald-800">twitter:image</code>)
                </label>
                <input
                  type="text"
                  value={twitterImage}
                  onChange={(e) => setTwitterImage(e.target.value)}
                  placeholder="/src/assets/images/hero_quran_academy_1792917817098.jpg"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 text-slate-800"
                />
              </div>
            </div>
          )}

          {/* SUBTAB 4: STRUCTURED DATA (JSON-LD) */}
          {seoActiveSubtab === 'schema' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <span className="font-semibold text-slate-800 block">
                    Schema.org Structured Data (<code className="text-emerald-800">&lt;script type="application/ld+json"&gt;</code>)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Enables Google rich search snippets, knowledge graph cards, and educational course classifications.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStructuredDataJson(DEFAULT_SEO_SETTINGS.structuredDataJson);
                    setJsonError(null);
                    playAuditoryChime('click');
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-300 text-[11px]"
                >
                  Reset to EducationalOrganization Template
                </button>
              </div>

              <textarea
                rows={12}
                value={structuredDataJson}
                onChange={(e) => {
                  setStructuredDataJson(e.target.value);
                  setJsonError(null);
                }}
                className="w-full p-4 font-mono text-[11px] bg-slate-950 text-emerald-300 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 leading-relaxed"
                spellCheck={false}
              />
            </div>
          )}

          {/* SUBTAB 5: LIVE SERP & SOCIAL PREVIEWS */}
          {seoActiveSubtab === 'preview' && (
            <div className="space-y-6 text-xs">
              {/* Google Search Snippet Preview */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-900 uppercase tracking-wide text-[11px] block">
                  Google Search Snippet Preview (Desktop & Mobile)
                </span>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs max-w-2xl space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="w-4 h-4 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[9px] font-bold">
                      Q
                    </div>
                    <span className="font-mono text-[11px] text-slate-700 truncate">
                      {canonicalUrl ? canonicalUrl.replace(/^https?:\/\//, '') : 'quranacademy.example.com'}
                    </span>
                    <span className="text-slate-400">› courses › tajweed</span>
                  </div>

                  <h4 className="text-base text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug">
                    {metaTitle || 'Online Quran Academy — Teacher Bua Qasim Shigry'}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed pt-0.5 line-clamp-2">
                    {metaDescription ||
                      'Learn Holy Quran with Tajweed, Nazira, Hifz, and Islamic studies online with Teacher Bua Qasim Shigry. 16 years teaching experience, 500+ satisfied students worldwide.'}
                  </p>
                </div>
              </div>

              {/* Social Share Card Preview (WhatsApp / Facebook) */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-900 uppercase tracking-wide text-[11px] block">
                  Social Share Card Preview (WhatsApp, Facebook, LinkedIn, iMessage)
                </span>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md overflow-hidden space-y-0">
                  <div className="aspect-16/9 bg-slate-100 overflow-hidden relative">
                    <img
                      src={ogImage || '/src/assets/images/hero_quran_academy_1792917817098.jpg'}
                      alt="Social share preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                      PREVIEW
                    </div>
                  </div>

                  <div className="p-4 space-y-1 bg-white">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                      {ogSiteName || 'Online Quran Academy'}
                    </span>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                      {ogTitle || metaTitle}
                    </h5>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {ogDescription || metaDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Strip */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Changes are immediately synchronized into database and browser document head.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetSEODefaults}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-amber-300" />
                <span>Save SEO Settings</span>
              </button>
            </div>
          </div>
        </form>
      )}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Security & Operational Audit Trail</h3>
              <p className="text-xs text-slate-500">Every sensitive action is tracked with actor and timestamp</p>
            </div>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log: any) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-[11px] text-slate-500">by {log.actor}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{log.details}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
