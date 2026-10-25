import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { AuthModal } from './components/AuthModal';
import { DemoBookingModal } from './components/DemoBookingModal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { LiveClassroomModal } from './components/LiveClassroomModal';
import { PaymentModal } from './components/PaymentModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { db } from './services/db';
import { RBACService } from './services/rbac';
import { Course, PaymentInvoice } from './types';
import { AboutView } from './views/AboutView';
import { AdminDashboard } from './views/AdminDashboard';
import { BooksLibraryView } from './views/BooksLibraryView';
import { ContactView } from './views/ContactView';
import { CourseDetailView, CoursesView } from './views/CoursesView';
import { HomeView } from './views/HomeView';
import { IslamicResourcesView } from './views/IslamicResourcesView';
import { LegalViews } from './views/LegalViews';
import { PricingView } from './views/PricingView';
import { ReviewsView } from './views/ReviewsView';
import { StudentDashboard } from './views/StudentDashboard';
import { TeacherDashboard } from './views/TeacherDashboard';
import { AlertCircle, Lock, ShieldCheck, User } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>('quran-with-tajweed');

  // Apply stored SEO metadata on mount
  useEffect(() => {
    try {
      const seoSettings = db.getSEOSettings();
      db.applySEOMetadata(seoSettings);
    } catch (e) {
      console.warn('SEO metadata initialization fallback:', e);
    }
  }, []);

  // Modals state
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [preselectedDemoCourseId, setPreselectedDemoCourseId] = useState<string | undefined>(undefined);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentCourse, setPaymentCourse] = useState<Course | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [classroomModalOpen, setClassroomModalOpen] = useState(false);
  const [classroomSessionData, setClassroomSessionData] = useState<any>(null);

  const currentUser = db.getCurrentUser();

  // Navigation handler with RBAC validation
  const handleNavigate = (view: string, courseSlug?: string) => {
    if (courseSlug) {
      setSelectedCourseSlug(courseSlug);
    }

    // Validate access permission
    const check = RBACService.validateRouteAccess(currentUser, view);
    if (!check.allowed) {
      // Direct user to switch role or login
      setAuthModalOpen(true);
      return;
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDemoModal = (courseId?: string) => {
    setPreselectedDemoCourseId(courseId);
    setDemoModalOpen(true);
  };

  const handleOpenPaymentModal = (course: Course) => {
    setPaymentCourse(course);
    setPaymentModalOpen(true);
  };

  const handleOpenClassroom = (sessionData?: any) => {
    setClassroomSessionData(sessionData);
    setClassroomModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Announcement Bar */}
      <AnnouncementBar onActionClick={() => handleOpenDemoModal()} />

      {/* Main Responsive Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenDemoModal={() => handleOpenDemoModal()}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenDemoModal={handleOpenDemoModal}
            onOpenPaymentModal={handleOpenPaymentModal}
          />
        )}

        {currentView === 'about' && (
          <AboutView
            onOpenDemoModal={() => handleOpenDemoModal()}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'courses' && (
          <CoursesView
            onSelectCourse={(slug) => handleNavigate('course-detail', slug)}
            onOpenDemoModal={handleOpenDemoModal}
            onOpenPaymentModal={handleOpenPaymentModal}
          />
        )}

        {currentView === 'course-detail' && (
          <CourseDetailView
            courseSlug={selectedCourseSlug}
            onBack={() => handleNavigate('courses')}
            onOpenDemoModal={handleOpenDemoModal}
            onOpenPaymentModal={handleOpenPaymentModal}
          />
        )}

        {currentView === 'pricing' && (
          <PricingView
            onOpenDemoModal={() => handleOpenDemoModal()}
            onOpenPaymentModal={handleOpenPaymentModal}
          />
        )}

        {currentView === 'resources' && <IslamicResourcesView />}

        {currentView === 'library' && <BooksLibraryView />}

        {currentView === 'reviews' && <ReviewsView />}

        {currentView === 'contact' && <ContactView />}

        {currentView === 'student-dashboard' && (
          <StudentDashboard
            onOpenClassroom={handleOpenClassroom}
            onOpenPaymentModal={handleOpenPaymentModal}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'teacher-dashboard' && (
          <TeacherDashboard
            onOpenClassroom={handleOpenClassroom}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboard onNavigate={handleNavigate} />
        )}

        {currentView === 'child-safety' && (
          <LegalViews type="child-safety" onBack={() => handleNavigate('home')} />
        )}

        {currentView === 'privacy-policy' && (
          <LegalViews type="privacy" onBack={() => handleNavigate('home')} />
        )}

        {currentView === 'terms-conditions' && (
          <LegalViews type="terms" onBack={() => handleNavigate('home')} />
        )}

        {currentView === 'refund-policy' && (
          <LegalViews type="refund" onBack={() => handleNavigate('home')} />
        )}
      </main>

      {/* Floating WhatsApp Contact Widget */}
      <WhatsAppFloatingButton />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} onOpenDemoModal={() => handleOpenDemoModal()} />

      {/* Interactive Modals */}
      <DemoBookingModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        preselectedCourseId={preselectedDemoCourseId}
      />

      {paymentCourse && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setPaymentCourse(null);
          }}
          course={paymentCourse}
          onPaymentSuccess={() => {
            handleNavigate('student-dashboard');
          }}
        />
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          const u = db.getCurrentUser();
          if (u.role === 'admin') handleNavigate('admin-dashboard');
          else if (u.role === 'teacher') handleNavigate('teacher-dashboard');
          else handleNavigate('student-dashboard');
        }}
      />

      <LiveClassroomModal
        isOpen={classroomModalOpen}
        onClose={() => setClassroomModalOpen(false)}
        title={classroomSessionData?.title || 'Interactive Quran Recitation Classroom'}
        courseTitle={classroomSessionData?.courseTitle || 'Quran with Tajweed'}
        studentName={classroomSessionData?.studentName || currentUser.name}
      />
    </div>
  );
}
