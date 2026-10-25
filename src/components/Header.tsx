import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { db } from '../services/db';
import { UserRole } from '../types';
import { createWhatsAppLink } from '../utils/islamicUtils';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenDemoModal: () => void;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenDemoModal,
  onOpenAuthModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const currentUser = db.getCurrentUser();
  const settings = db.getSettings();

  const handleRoleSwitch = (role: UserRole) => {
    db.switchRole(role);
    setRoleDropdownOpen(false);
    if (role === 'admin') onNavigate('admin-dashboard');
    else if (role === 'teacher') onNavigate('teacher-dashboard');
    else onNavigate('student-dashboard');
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Teacher' },
    { id: 'courses', label: 'Courses' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'resources', label: 'Islamic Resources' },
    { id: 'library', label: 'Library' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-xs">
      {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (4-5 Nav Links) — Zone 3 (Primary Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Single text element wordmark with elegant Quranic emblem */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left focus:outline-none group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold shadow-xs border border-emerald-700/50 group-hover:bg-emerald-900 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-emerald-950 tracking-tight whitespace-nowrap block">
                Online Quran Academy
              </span>
              <span className="text-xs text-emerald-700 font-medium block">
                Teacher Bua Qasim Shigry
              </span>
            </div>
          </button>

          {/* Zone 2: Clean single-line nav links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`whitespace-nowrap transition-colors py-1 hover:text-emerald-800 ${
                  currentView === link.id
                    ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                    : 'text-slate-600'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 primary action button + Quick Portal Access */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Role / Portal Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                title="Switch portal role or log in"
              >
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span className="max-w-[120px] truncate">{currentUser.name.split(' ')[0]}</span>
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                  {currentUser.role}
                </span>
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">{currentUser.name}</p>
                    <p className="text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => handleRoleSwitch('student')}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                        currentUser.role === 'student' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-emerald-700" /> Student Portal (Aisha)
                      </span>
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('teacher')}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                        currentUser.role === 'teacher' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-700" /> Teacher (Bua Qasim)
                      </span>
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('admin')}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                        currentUser.role === 'admin' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" /> Admin Console
                      </span>
                    </button>
                  </div>
                  <div className="border-t border-slate-100 p-1">
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        onOpenAuthModal();
                      }}
                      className="w-full text-left px-3 py-1.5 text-slate-600 hover:text-emerald-800 rounded-lg"
                    >
                      Sign In / Register New Account
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Dashboard Link */}
            <button
              onClick={() => {
                if (currentUser.role === 'admin') onNavigate('admin-dashboard');
                else if (currentUser.role === 'teacher') onNavigate('teacher-dashboard');
                else onNavigate('student-dashboard');
              }}
              className="p-2 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Go to My Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenDemoModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 border border-emerald-900/20"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>Book Free Demo</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenDemoModal}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 rounded-lg"
            >
              Free Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
                  currentView === link.id ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2">
            <p className="text-xs font-semibold text-slate-500 px-3 uppercase tracking-wider">
              Switch Portal Access
            </p>
            <div className="grid grid-cols-3 gap-2 px-1">
              <button
                onClick={() => {
                  handleRoleSwitch('student');
                  setMobileMenuOpen(false);
                }}
                className={`p-2 text-center rounded-lg border text-xs ${
                  currentUser.role === 'student' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold' : 'border-slate-200 text-slate-700'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => {
                  handleRoleSwitch('teacher');
                  setMobileMenuOpen(false);
                }}
                className={`p-2 text-center rounded-lg border text-xs ${
                  currentUser.role === 'teacher' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold' : 'border-slate-200 text-slate-700'
                }`}
              >
                Teacher
              </button>
              <button
                onClick={() => {
                  handleRoleSwitch('admin');
                  setMobileMenuOpen(false);
                }}
                className={`p-2 text-center rounded-lg border text-xs ${
                  currentUser.role === 'admin' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold' : 'border-slate-200 text-slate-700'
                }`}
              >
                Admin
              </button>
            </div>

            <div className="pt-2 px-1">
              <a
                href={createWhatsAppLink(settings.whatsappNumber, 'Assalamu Alaikum Teacher Bua Qasim, I would like to inquire about Quran classes.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg"
              >
                <MessageCircle className="w-4 h-4 text-emerald-200" /> WhatsApp Teacher Directly
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
