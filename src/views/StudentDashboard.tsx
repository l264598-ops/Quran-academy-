import React, { useState } from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Filter,
  GraduationCap,
  HelpCircle,
  ListChecks,
  MessageCircle,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Video,
} from 'lucide-react';
import { db } from '../services/db';
import { Course, Enrollment, Homework, PaymentInvoice } from '../types';
import { playAuditoryChime } from '../utils/islamicUtils';

interface StudentDashboardProps {
  onOpenClassroom: (classData?: any) => void;
  onOpenPaymentModal: (course: Course) => void;
  onNavigate: (view: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenClassroom,
  onOpenPaymentModal,
  onNavigate,
}) => {
  const currentUser = db.getCurrentUser();
  const allCourses = db.getCourses();
  
  // Real-time enrollments state for progress tracking
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() =>
    db.getEnrollments().filter((e) => e.studentId === currentUser.id)
  );

  const allClasses = db.getClasses().filter((c) => c.studentId === currentUser.id);
  const allAttendance = db.getAttendance().filter((a) => a.studentId === currentUser.id);
  const allInvoices = db.getInvoices().filter((i) => i.studentId === currentUser.id);
  const progressRecord = db.getStudentProgress(currentUser.id);

  // Homework state with live refresh
  const [homeworkList, setHomeworkList] = useState<Homework[]>(() =>
    db.getHomework().filter((h) => h.studentId === currentUser.id)
  );
  const [hwFilterStatus, setHwFilterStatus] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

  const [activeTab, setActiveTab] = useState<'courses' | 'classes' | 'homework' | 'attendance' | 'invoices'>('courses');
  const [selectedCourseForProgress, setSelectedCourseForProgress] = useState<Course | null>(
    allCourses.find((c) => enrollments.some((e) => e.courseId === c.id)) || allCourses[0]
  );

  // Homework submission state
  const [submissionModalHwId, setSubmissionModalHwId] = useState<string | null>(null);
  const [submissionType, setSubmissionType] = useState<Homework['submissionType']>('completion_confirmation');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionConfirmed, setSubmissionConfirmed] = useState(true);
  const [submissionAttachment, setSubmissionAttachment] = useState('');
  const [submissionSuccessToast, setSubmissionSuccessToast] = useState<string | null>(null);

  // Track lesson completion dynamically
  const completedLessonIds = selectedCourseForProgress
    ? db.getCompletedLessons(currentUser.id, selectedCourseForProgress.id)
    : [];

  const handleToggleLesson = (lessonId: string) => {
    if (!selectedCourseForProgress) return;
    const res = db.toggleLessonCompletion(currentUser.id, selectedCourseForProgress.id, lessonId);
    if (res.completed) {
      playAuditoryChime('complete');
    } else {
      playAuditoryChime('click');
    }
    // Synchronize enrollments state from db so all progress bars update
    setEnrollments(db.getEnrollments().filter((e) => e.studentId === currentUser.id));
    setSelectedCourseForProgress({ ...selectedCourseForProgress });
  };

  const handleHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionModalHwId || !submissionNotes.trim()) return;

    db.submitHomework(submissionModalHwId, {
      studentNotes: submissionNotes.trim(),
      submissionType,
      attachmentName: submissionAttachment.trim() || undefined,
    });

    setHomeworkList(db.getHomework().filter((h) => h.studentId === currentUser.id));
    setSubmissionModalHwId(null);
    setSubmissionNotes('');
    setSubmissionAttachment('');
    setSubmissionSuccessToast('Homework submission received! Teacher Bua Qasim will review and provide feedback.');
    playAuditoryChime('complete');
    setTimeout(() => setSubmissionSuccessToast(null), 4000);
  };

  const currentEnrollment = enrollments.find(
    (e) => e.courseId === selectedCourseForProgress?.id
  );

  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((acc, e) => acc + (e.progressPercent || 0), 0) / enrollments.length)
    : 0;
  const totalClassesCompleted = enrollments.reduce((acc, e) => acc + (e.completedClasses || 0), 0);
  const totalClassesTarget = enrollments.reduce((acc, e) => acc + (e.totalClasses || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" /> Student Learning Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Assalamu Alaikum, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              Teacher: <strong className="text-white">Bua Qasim Shigry</strong> · Timezone: {currentUser.timeZone}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => onOpenClassroom({ courseTitle: 'Quran Recitation Session' })}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <Video className="w-4 h-4" /> Join Live Classroom
            </button>
          </div>
        </div>

        {/* Progress Snapshot Badges */}
        {progressRecord && (
          <div className="mt-6 pt-6 border-t border-emerald-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-emerald-800/40 p-3 rounded-xl border border-emerald-700/50">
              <span className="text-emerald-200 block text-[11px]">Current Surah / Lesson</span>
              <span className="text-sm font-bold text-white block mt-0.5">{progressRecord.currentSurah}</span>
              <span className="text-[10px] text-amber-300">{progressRecord.currentAyah}</span>
            </div>

            <div className="bg-emerald-800/40 p-3 rounded-xl border border-emerald-700/50">
              <span className="text-emerald-200 block text-[11px]">Tajweed Accuracy</span>
              <span className="text-sm font-bold text-white block mt-0.5">{progressRecord.tajweedMasteryScore}%</span>
              <span className="text-[10px] text-emerald-300">Jayyid Jiddan (Very Good)</span>
            </div>

            <div className="bg-emerald-800/40 p-3 rounded-xl border border-emerald-700/50">
              <span className="text-emerald-200 block text-[11px]">Memorized Pages</span>
              <span className="text-sm font-bold text-white block mt-0.5">{progressRecord.hifzMemorizedPages} Pages</span>
              <span className="text-[10px] text-emerald-300">Juz {progressRecord.currentParaOrJuz}</span>
            </div>

            <div className="bg-emerald-800/40 p-3 rounded-xl border border-emerald-700/50">
              <span className="text-emerald-200 block text-[11px]">Fluency Level</span>
              <span className="text-sm font-bold text-white block mt-0.5">{progressRecord.fluencyRating}</span>
              <span className="text-[10px] text-slate-300">Updated {progressRecord.lastUpdated}</span>
            </div>
          </div>
        )}
      </div>

      {/* FEATURE: ENROLLED QURAN COURSES PROGRESS TRACKER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-800" />
              <h2 className="text-lg font-bold text-slate-900">Enrolled Quran Courses Progress Tracker</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live curriculum progress, visual milestone meters, and completion percentages for your active Quran classes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                Average Completion
              </span>
              <span className="text-lg font-bold font-mono text-emerald-900">{avgProgress}%</span>
            </div>
            <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-700"
                style={{ width: `${avgProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Grid of Enrolled Courses with Visual Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrollments.map((enr) => {
            const courseObj = allCourses.find((c) => c.id === enr.courseId);
            const completedTopics = db.getCompletedLessons(currentUser.id, enr.courseId).length;
            const totalTopics = courseObj?.syllabusWeeks?.reduce((acc, w) => acc + (w.topics?.length || 1), 0) || 12;
            const isSelected = selectedCourseForProgress?.id === enr.courseId;

            // Determine milestone badge
            let milestoneLabel = 'Foundation Stage';
            if (enr.progressPercent >= 75) milestoneLabel = 'Advanced Tajweed Mastery';
            else if (enr.progressPercent >= 50) milestoneLabel = 'Intermediate Fluency';
            else if (enr.progressPercent >= 25) milestoneLabel = 'Steadily Advancing';

            return (
              <div
                key={enr.id}
                onClick={() => {
                  if (courseObj) {
                    setSelectedCourseForProgress(courseObj);
                    setActiveTab('courses');
                    playAuditoryChime('click');
                  }
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50/20 ring-2 ring-emerald-700/20 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-semibold text-emerald-900 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {enr.packageName}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {enr.status === 'active' ? 'Active Learner' : 'Enrolled'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                      {enr.courseTitle}
                    </h3>
                    {courseObj?.arabicTitle && (
                      <p className="font-arabic text-xs text-slate-500 mt-0.5 text-right font-medium" dir="rtl">
                        {courseObj.arabicTitle}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 mt-1">
                      Instructor: <strong className="text-slate-700">Teacher Bua Qasim Shigry</strong>
                    </p>
                  </div>

                  {/* Visual Progress Bar and Percentage Display */}
                  <div className="pt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-700" /> Course Progress
                      </span>
                      <span className="text-sm font-bold font-mono text-emerald-900">
                        {enr.progressPercent}%
                      </span>
                    </div>

                    {/* Styled Visual Progress Bar */}
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 transition-all duration-700 shadow-xs"
                        style={{ width: `${Math.max(4, enr.progressPercent)}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                      <span>{completedTopics} / {totalTopics} Topics Completed</span>
                      <span className="font-medium text-emerald-800">{milestoneLabel}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-900 font-semibold group-hover:underline">
                  <span>View Syllabus Modules</span>
                  <ChevronRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'courses' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Courses & Lesson Progress
        </button>
        <button
          onClick={() => setActiveTab('classes')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'classes' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Class Timetable ({allClasses.length})
        </button>
        <button
          onClick={() => setActiveTab('homework')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'homework' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Homework & Assignments ({homeworkList.length})
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'attendance' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Attendance Record
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'invoices' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Invoices & Tuition
        </button>
      </div>

      {/* TAB 1: COURSES & INTERACTIVE LESSON PROGRESS TRACKING */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-800" />
                Your Enrolled Quran Courses ({enrollments.length})
              </h3>
              <p className="text-xs text-slate-500">
                Select a course below to view its full week-by-week syllabus and track your lesson completions.
              </p>
            </div>
          </div>

          {/* Enrolled Courses Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrollments.map((enr) => {
              const courseObj = allCourses.find((c) => c.id === enr.courseId);
              const completedCount = db.getCompletedLessons(currentUser.id, enr.courseId).length;
              const totalTopics = courseObj?.syllabusWeeks?.reduce((acc, w) => acc + (w.topics?.length || 1), 0) || 12;
              const isSelected = selectedCourseForProgress?.id === enr.courseId;

              return (
                <div
                  key={enr.id}
                  onClick={() => {
                    if (courseObj) {
                      setSelectedCourseForProgress(courseObj);
                      playAuditoryChime('click');
                    }
                  }}
                  className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-700 ring-2 ring-emerald-700/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {enr.packageName}
                      </span>
                      <span className="text-lg font-bold font-mono text-emerald-900">
                        {enr.progressPercent}%
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{enr.courseTitle}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Teacher: {enr.teacherName} · {enr.frequency}
                      </p>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Course Completion</span>
                        <span className="font-bold text-emerald-900 font-mono">{enr.progressPercent}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 transition-all duration-700"
                          style={{ width: `${Math.max(5, enr.progressPercent)}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{completedCount} / {totalTopics} Topics Mastered</span>
                        <span>{enr.completedClasses} / {enr.totalClasses} Classes</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className={`font-semibold ${isSelected ? 'text-emerald-800' : 'text-slate-500'}`}>
                      {isSelected ? '● Currently Selected' : 'Click to inspect syllabus'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Module-by-Module Lesson Completion Tracker */}
          {selectedCourseForProgress && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" /> Interactive Syllabus Tracker
                    </span>
                    <span className="text-[11px] text-slate-400">· Click any topic to mark complete</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {selectedCourseForProgress.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Category: {selectedCourseForProgress.category} · Level: {selectedCourseForProgress.level} · Weekly Classes: {selectedCourseForProgress.classesPerWeek}x
                  </p>
                </div>

                {/* Big Visual Progress Indicator */}
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 min-w-[280px] space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      Overall Progress
                    </span>
                    <span className="text-2xl font-black font-mono text-emerald-900">
                      {currentEnrollment?.progressPercent || 0}%
                    </span>
                  </div>

                  {/* High-Impact Visual Progress Bar */}
                  <div className="w-full h-3.5 bg-white rounded-full overflow-hidden p-0.5 border border-emerald-200 shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 transition-all duration-700 shadow-xs"
                      style={{ width: `${Math.max(4, currentEnrollment?.progressPercent || 0)}%` }}
                    ></div>
                  </div>

                  {/* Milestone Track Points */}
                  <div className="flex justify-between text-[10px] text-emerald-800/80 font-medium pt-0.5">
                    <span>Start (0%)</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>Mastery (100%)</span>
                  </div>
                </div>
              </div>

              {/* Milestone Congratulation Message */}
              {(currentEnrollment?.progressPercent || 0) >= 70 && (
                <div className="p-4 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white rounded-xl flex items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-amber-300 shrink-0" />
                    <div>
                      <p className="font-bold text-xs sm:text-sm">Masha'Allah! You have completed over 70% of this course!</p>
                      <p className="text-[11px] text-emerald-100">
                        Teacher Bua Qasim Shigry commends your steadfast dedication to the Quran. Keep advancing toward your certificate!
                      </p>
                    </div>
                  </div>
                  <Sparkles className="w-5 h-5 text-amber-300 hidden sm:block shrink-0" />
                </div>
              )}

              {/* Weekly Syllabus Topics Checklist */}
              <div className="space-y-6">
                {selectedCourseForProgress.syllabusWeeks.map((week) => (
                  <div key={week.week} className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Week {week.week}: {week.title}
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        {week.topics.filter((_, tIdx) => completedLessonIds.includes(`${selectedCourseForProgress.id}_w${week.week}_t${tIdx}`)).length} / {week.topics.length} Done
                      </span>
                    </div>

                    <div className="space-y-2">
                      {week.topics.map((topic, tIdx) => {
                        const lessonKey = `${selectedCourseForProgress.id}_w${week.week}_t${tIdx}`;
                        const isDone = completedLessonIds.includes(lessonKey);

                        return (
                          <div
                            key={tIdx}
                            onClick={() => handleToggleLesson(lessonKey)}
                            className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isDone
                                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                                  isDone
                                    ? 'bg-emerald-700 text-white'
                                    : 'border border-slate-300 bg-white hover:border-emerald-600'
                                }`}
                              >
                                {isDone && <CheckCircle2 className="w-4 h-4" />}
                              </button>
                              <span className="text-xs">{topic}</span>
                            </div>

                            <span className="text-[11px] font-semibold text-slate-500">
                              {isDone ? 'Completed' : 'Mark as Complete'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CLASS TIMETABLE */}
      {activeTab === 'classes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Your Scheduled Classes</h3>
            <span className="text-xs text-slate-500">Timezone: {currentUser.timeZone}</span>
          </div>

          <div className="space-y-3">
            {allClasses.map((cls) => (
              <div
                key={cls.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-800">
                      {cls.status}
                    </span>
                    <span className="text-xs text-slate-500">
                      {cls.date} at {cls.startTime} ({cls.durationMins}m)
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{cls.title}</h4>
                  <p className="text-xs text-slate-600">{cls.lessonTopic}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenClassroom(cls)}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" /> Join Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HOMEWORK & ASSIGNMENTS */}
      {activeTab === 'homework' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-800" />
                <h3 className="text-lg font-bold text-slate-900">Homework & Tajweed Drills</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Review assigned recitation exercises from Teacher Bua Qasim Shigry, submit your work or completion confirmation, and track grades.
              </p>
            </div>
          </div>

          {/* Toast Notification */}
          {submissionSuccessToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{submissionSuccessToast}</span>
            </div>
          )}

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto text-xs">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <button
              onClick={() => setHwFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                hwFilterStatus === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Assignments ({homeworkList.length})
            </button>
            <button
              onClick={() => setHwFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                hwFilterStatus === 'pending'
                  ? 'bg-amber-700 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Pending ({homeworkList.filter((h) => h.status === 'pending').length})
            </button>
            <button
              onClick={() => setHwFilterStatus('submitted')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                hwFilterStatus === 'submitted'
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              Submitted ({homeworkList.filter((h) => h.status === 'submitted').length})
            </button>
            <button
              onClick={() => setHwFilterStatus('graded')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                hwFilterStatus === 'graded'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Graded ({homeworkList.filter((h) => h.status === 'graded' || h.status === 'reviewed').length})
            </button>
          </div>

          {/* Assignments List */}
          <div className="space-y-4">
            {homeworkList
              .filter((h) => {
                if (hwFilterStatus === 'pending') return h.status === 'pending';
                if (hwFilterStatus === 'submitted') return h.status === 'submitted';
                if (hwFilterStatus === 'graded') return h.status === 'graded' || h.status === 'reviewed';
                return true;
              })
              .map((hw) => {
                const isPending = hw.status === 'pending';
                const isSubmitted = hw.status === 'submitted';
                const isGraded = hw.status === 'graded' || hw.status === 'reviewed';

                return (
                  <div
                    key={hw.id}
                    className={`p-5 rounded-2xl border transition-all text-xs space-y-3.5 ${
                      isSubmitted
                        ? 'border-blue-300 bg-blue-50/20'
                        : isGraded
                        ? 'border-slate-200 bg-white'
                        : 'border-amber-200 bg-amber-50/10'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center flex-wrap gap-2">
                          {/* Required Status Badges */}
                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" /> Pending
                            </span>
                          )}
                          {isSubmitted && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                              <Send className="w-3 h-3 text-blue-600" /> Submitted
                            </span>
                          )}
                          {isGraded && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Graded
                            </span>
                          )}

                          <span className="text-slate-500 font-medium">{hw.courseTitle}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">Due: <strong>{hw.dueDate}</strong></span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 mt-1">{hw.title}</h4>
                        <div className="inline-block bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded font-mono text-[11px] font-medium">
                          Lesson Reference: {hw.surahOrLesson}
                        </div>
                      </div>

                      {/* Header Right / Grade */}
                      <div className="shrink-0 flex items-center gap-2">
                        {isGraded && (
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Official Grade</span>
                            <span className="text-sm font-bold text-emerald-900 font-mono bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 block">
                              {hw.grade}
                            </span>
                          </div>
                        )}

                        {isPending && (
                          <button
                            onClick={() => {
                              setSubmissionModalHwId(hw.id);
                              setSubmissionType('completion_confirmation');
                              setSubmissionNotes('');
                              setSubmissionConfirmed(true);
                            }}
                            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" /> Submit Work / Confirmation
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Teacher Assignment Instructions */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-700 space-y-1">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-900">
                        <FileText className="w-3.5 h-3.5 text-emerald-800" /> Teacher Bua Qasim’s Instructions:
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600">{hw.description}</p>
                      {hw.attachmentName && (
                        <p className="text-[11px] text-emerald-800 font-medium pt-1">
                          Attached Reference Material: 📄 {hw.attachmentName}
                        </p>
                      )}
                    </div>

                    {/* Student Submission Record */}
                    {(isSubmitted || isGraded) && hw.studentNotes && (
                      <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 text-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-blue-950 flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-blue-700" /> Your Submitted Confirmation & Notes:
                          </span>
                          {hw.submittedAt && (
                            <span className="text-slate-500 text-[10px]">
                              Submitted {new Date(hw.submittedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-xs italic text-slate-700 pl-4 border-l-2 border-blue-300 py-0.5">
                          "{hw.studentNotes}"
                        </p>
                        {isSubmitted && (
                          <p className="text-[11px] text-blue-800 font-medium pt-1">
                            Status: Awaiting review & grading by Teacher Bua Qasim in upcoming session.
                          </p>
                        )}
                      </div>
                    )}

                    {/* Teacher Feedback when Graded */}
                    {isGraded && hw.teacherFeedback && (
                      <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-emerald-700" /> Teacher Bua Qasim’s Feedback & Guidance:
                          </span>
                          {hw.gradedAt && (
                            <span className="text-emerald-700/70 text-[10px]">
                              Graded {new Date(hw.gradedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-emerald-900 pl-4 border-l-2 border-emerald-400 py-0.5">
                          {hw.teacherFeedback}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

            {homeworkList.length === 0 && (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No homework assignments found</p>
                <p className="text-xs text-slate-500">Assignments assigned by your teacher will appear here.</p>
              </div>
            )}
          </div>

          {/* Student Submission Modal */}
          {submissionModalHwId && (() => {
            const activeHw = homeworkList.find((h) => h.id === submissionModalHwId);
            if (!activeHw) return null;

            return (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl my-8">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-emerald-800" />
                      <h3 className="text-base font-bold text-slate-900">Submit Homework & Confirmation</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSubmissionModalHwId(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                    >
                      <RotateCcw className="w-4 h-4 hidden" />
                      ✕
                    </button>
                  </div>

                  {/* Assignment Summary */}
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900">{activeHw.title}</h4>
                      <span className="text-[11px] text-slate-500 font-mono">Due: {activeHw.dueDate}</span>
                    </div>
                    <p className="text-emerald-900 font-medium">Reference: {activeHw.surahOrLesson}</p>
                    <p className="text-slate-600 leading-relaxed text-[11px] border-t border-slate-200 pt-1.5 mt-1.5">
                      <strong>Teacher Instructions:</strong> {activeHw.description}
                    </p>
                  </div>

                  <form onSubmit={handleHomeworkSubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">Submission Mode</label>
                      <select
                        value={submissionType}
                        onChange={(e) => setSubmissionType(e.target.value as any)}
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-700"
                      >
                        <option value="completion_confirmation">Completion Confirmation & Recitation Log</option>
                        <option value="recitation_audio">Recitation Voice Memo / Audio Link</option>
                        <option value="written_exercise">Written Tajweed Exercise / Rule Summary</option>
                      </select>
                    </div>

                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="confirm_practice"
                        checked={submissionConfirmed}
                        onChange={(e) => setSubmissionConfirmed(e.target.checked)}
                        required
                        className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-600"
                      />
                      <label htmlFor="confirm_practice" className="text-emerald-950 font-medium text-[11px] leading-snug">
                        I confirm that I have recited, reviewed, and practiced this lesson with sincerity according to Teacher Bua Qasim Shigry's guidelines.
                      </label>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">
                        Practice Notes, Recitation Details & Self-Reflection
                      </label>
                      <textarea
                        rows={4}
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                        placeholder="e.g. Practiced Surah Al-Mulk Verses 1-10 three times. Verified Qalqalah letters with parent listening. Paused accurately on the Waqf signs..."
                        required
                        className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">
                        Recording Link or Audio Memo Reference (Optional)
                      </label>
                      <input
                        type="text"
                        value={submissionAttachment}
                        onChange={(e) => setSubmissionAttachment(e.target.value)}
                        placeholder="e.g. Drive link or 'Recited aloud in parent presence'"
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setSubmissionModalHwId(null)}
                        className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!submissionConfirmed}
                        className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" /> Confirm & Submit to Teacher
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 4: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-slate-900">Official Attendance Log</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {allAttendance.map((att) => (
              <div key={att.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{att.courseTitle}</p>
                  <p className="text-slate-500">{att.date} · {att.remarks}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      att.status === 'present' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {att.status}
                  </span>
                  <span className="text-slate-400 text-[11px] font-mono">({att.punctuality})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INVOICES & TUITION */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Tuition Invoices & Receipts</h3>
            <span className="text-xs text-slate-500">Official proof of enrollment</span>
          </div>

          <div className="space-y-3">
            {allInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">{inv.courseTitle} · {inv.packageName}</p>
                  <p className="text-slate-400 text-[11px]">Issued: {inv.issueDate} · Due: {inv.dueDate}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-emerald-900">
                      {inv.currency} {inv.amount}
                    </span>
                    {inv.paymentMethod && (
                      <span className="text-[10px] text-slate-400 block">{inv.paymentMethod}</span>
                    )}
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                    title="Print Receipt"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
