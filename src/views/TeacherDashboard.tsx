import React, { useState } from 'react';
import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  FileText,
  Filter,
  GraduationCap,
  MessageCircle,
  Plus,
  Save,
  Search,
  Send,
  Upload,
  User,
  UserCheck,
  Video,
  X,
} from 'lucide-react';
import { db } from '../services/db';
import { AttendanceRecord, ClassSession, DemoRequest, Homework, StudentProgress } from '../types';
import { playAuditoryChime } from '../utils/islamicUtils';

interface TeacherDashboardProps {
  onOpenClassroom: (classData?: any) => void;
  onNavigate: (view: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onOpenClassroom,
  onNavigate,
}) => {
  const currentUser = db.getCurrentUser();
  const classes = db.getClasses();
  const demoRequests = db.getDemoRequests();
  const users = db.getUsers().filter((u) => u.role === 'student');
  const courses = db.getCourses();

  const [activeTab, setActiveTab] = useState<'schedule' | 'students' | 'demos' | 'homework' | 'attendance'>('schedule');

  // Homework state & filters
  const [homeworkList, setHomeworkList] = useState<Homework[]>(() => db.getHomework());
  const [hwFilterStatus, setHwFilterStatus] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignStudentId, setAssignStudentId] = useState(users[0]?.id || 'user_student_1');
  const [assignCourseTitle, setAssignCourseTitle] = useState('Quran with Tajweed');
  const [assignTitle, setAssignTitle] = useState('');
  const [assignSurahLesson, setAssignSurahLesson] = useState('');
  const [assignDescription, setAssignDescription] = useState('');
  const [assignSubmissionType, setAssignSubmissionType] = useState<Homework['submissionType']>('completion_confirmation');
  const [assignDueDate, setAssignDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [assignAttachment, setAssignAttachment] = useState('');
  const [hwSuccessMsg, setHwSuccessMsg] = useState<string | null>(null);

  // Demo approval modal
  const [selectedDemo, setSelectedDemo] = useState<DemoRequest | null>(null);
  const [demoScheduleTime, setDemoScheduleTime] = useState('2026-10-28 17:30');
  const [demoMeetingLink, setDemoMeetingLink] = useState('https://meet.google.com/quran-bua-qasim-demo');

  // Student progress update modal
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [progressSurah, setProgressSurah] = useState('');
  const [progressAyah, setProgressAyah] = useState('');
  const [progressScore, setProgressScore] = useState(85);
  const [progressNotes, setProgressNotes] = useState('');

  // Homework grading modal
  const [gradingHw, setGradingHw] = useState<Homework | null>(null);
  const [gradeInput, setGradeInput] = useState('Mumtaz (A+ - 98%)');
  const [feedbackInput, setFeedbackInput] = useState('');

  // Quick attendance marking
  const [attStatusMap, setAttStatusMap] = useState<Record<string, 'present' | 'absent' | 'excused'>>({});

  const handleApproveDemo = (demoId: string) => {
    db.updateDemoStatus(demoId, 'approved', demoScheduleTime, demoMeetingLink);
    setSelectedDemo(null);
    playAuditoryChime('complete');
  };

  const handleSaveProgress = (studentId: string) => {
    db.updateStudentProgress(studentId, {
      currentSurah: progressSurah,
      currentAyah: progressAyah,
      tajweedMasteryScore: progressScore,
      teacherNotes: progressNotes,
    });
    setEditingStudentId(null);
    playAuditoryChime('complete');
  };

  const handleSaveGrade = () => {
    if (!gradingHw) return;
    db.gradeHomework(gradingHw.id, gradeInput, feedbackInput);
    setGradingHw(null);
    setHomeworkList(db.getHomework());
    setHwSuccessMsg(`Grade and feedback recorded for ${gradingHw.title}`);
    playAuditoryChime('complete');
    setTimeout(() => setHwSuccessMsg(null), 3500);
  };

  const handleAssignHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim() || !assignDescription.trim()) return;
    const targetStudent = users.find((u) => u.id === assignStudentId);

    db.assignHomework({
      studentId: assignStudentId,
      studentName: targetStudent ? targetStudent.name : 'Enrolled Student',
      courseTitle: assignCourseTitle,
      title: assignTitle.trim(),
      surahOrLesson: assignSurahLesson.trim() || 'Daily Lesson Assignment',
      description: assignDescription.trim(),
      submissionType: assignSubmissionType,
      dueDate: assignDueDate,
      attachmentName: assignAttachment.trim() || undefined,
      assignedDate: new Date().toISOString().split('T')[0],
    });

    setHomeworkList(db.getHomework());
    setIsAssignModalOpen(false);
    setAssignTitle('');
    setAssignSurahLesson('');
    setAssignDescription('');
    setAssignAttachment('');
    setHwSuccessMsg('New assignment uploaded and assigned to student successfully!');
    playAuditoryChime('complete');
    setTimeout(() => setHwSuccessMsg(null), 4000);
  };

  const handleMarkClassAttendance = (cls: ClassSession, status: 'present' | 'absent') => {
    db.markAttendance({
      studentId: cls.studentId,
      studentName: cls.studentName,
      classId: cls.id,
      courseTitle: cls.courseTitle,
      date: cls.date,
      status,
      punctuality: status === 'present' ? 'on-time' : 'n/a',
      remarks: `Recorded by Teacher Bua Qasim Shigry on ${new Date().toLocaleTimeString()}`,
    });
    setAttStatusMap({ ...attStatusMap, [cls.id]: status });
    playAuditoryChime('click');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="/src/assets/images/teacher_bua_qasim_1792917817962.jpg"
            alt="Teacher Bua Qasim Shigry"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-300 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
              <UserCheck className="w-4 h-4" /> Faculty Portal · Lead Quran Instructor
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">Teacher Bua Qasim Shigry</h1>
            <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
              16 Years Experience · 500+ Community Learners · Skardu / Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenClassroom({ courseTitle: 'Teacher Demonstration Room' })}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <Video className="w-4 h-4" /> Open Live Classroom
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'schedule' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Daily Timetable & Attendance
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'students' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Student Roster & Progress ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('demos')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'demos' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Trial Demo Requests ({demoRequests.filter((d) => d.status === 'pending').length} New)
        </button>
        <button
          onClick={() => setActiveTab('homework')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'homework' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Homework Grading ({homeworkList.filter((h) => h.status === 'submitted').length} Pending)
        </button>
      </div>

      {/* TAB 1: SCHEDULE & ATTENDANCE */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Today & Upcoming Class Timetable</h3>
              <p className="text-xs text-slate-500">Conduct sessions and mark student attendance</p>
            </div>
            <span className="text-xs font-mono bg-slate-100 px-3 py-1 rounded-lg text-slate-700">
              GMT+5 (Pakistan Standard Time)
            </span>
          </div>

          <div className="space-y-3">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-900">
                      {cls.date} at {cls.startTime}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-800">
                      {cls.durationMins} mins
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {cls.studentName} — {cls.courseTitle}
                  </h4>
                  <p className="text-xs text-slate-600">Topic: {cls.lessonTopic}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onOpenClassroom(cls)}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" /> Start Class
                  </button>

                  {/* Attendance buttons */}
                  <button
                    onClick={() => handleMarkClassAttendance(cls, 'present')}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      attStatusMap[cls.id] === 'present'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    ✓ Present
                  </button>

                  <button
                    onClick={() => handleMarkClassAttendance(cls, 'absent')}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      attStatusMap[cls.id] === 'absent'
                        ? 'bg-red-700 text-white border-red-700'
                        : 'bg-slate-50 hover:bg-red-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    ✗ Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT ROSTER & PROGRESS */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Assigned Student Roster</h3>
              <p className="text-xs text-slate-500">Update current Surah, Tajweed accuracy, and notes</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {users.map((st) => {
              const prog = db.getStudentProgress(st.id);

              return (
                <div key={st.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{st.name}</h4>
                      <span className="text-xs text-slate-500">({st.country})</span>
                      {st.studentAgeRange && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {st.studentAgeRange}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{st.email} · WhatsApp: {st.whatsapp}</p>
                    {prog && (
                      <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-900 pt-1">
                        <span>Current: <strong>{prog.currentSurah}</strong> ({prog.currentAyah})</span>
                        <span>Tajweed: <strong>{prog.tajweedMasteryScore}%</strong></span>
                        <span>Rating: <strong>{prog.fluencyRating}</strong></span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setEditingStudentId(st.id);
                      setProgressSurah(prog?.currentSurah || 'Surah Al-Mulk');
                      setProgressAyah(prog?.currentAyah || 'Ayah 1');
                      setProgressScore(prog?.tajweedMasteryScore || 85);
                      setProgressNotes(prog?.teacherNotes || '');
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Update Progress
                  </button>
                </div>
              );
            })}
          </div>

          {/* Progress Edit Modal */}
          {editingStudentId && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                <div className="flex justify-between items-center pb-2 border-b">
                  <h3 className="text-base font-bold text-slate-900">Update Student Quran Progress</h3>
                  <button onClick={() => setEditingStudentId(null)}>
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Current Surah / Qaida Chapter</label>
                    <input
                      type="text"
                      value={progressSurah}
                      onChange={(e) => setProgressSurah(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Current Verse (Ayah)</label>
                    <input
                      type="text"
                      value={progressAyah}
                      onChange={(e) => setProgressAyah(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Tajweed Mastery Score ({progressScore}%)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={progressScore}
                      onChange={(e) => setProgressScore(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Teacher Notes for Student & Parents</label>
                    <textarea
                      rows={3}
                      value={progressNotes}
                      onChange={(e) => setProgressNotes(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingStudentId(null)}
                    className="px-3 py-1.5 text-xs text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveProgress(editingStudentId)}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-800 rounded-xl"
                  >
                    Save Progress Record
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TRIAL DEMO REQUESTS */}
      {activeTab === 'demos' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Incoming Free Trial Bookings</h3>
              <p className="text-xs text-slate-500">Approve slots and assign meeting link</p>
            </div>
          </div>

          <div className="space-y-4">
            {demoRequests.map((demo) => (
              <div
                key={demo.id}
                className="p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-900">{demo.referenceCode}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        demo.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {demo.status}
                    </span>
                    <span className="text-slate-400">{demo.country} · {demo.timeZone}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    {demo.studentName} {demo.parentName ? `(Parent: ${demo.parentName})` : ''}
                  </h4>
                  <p className="text-slate-600">Course: {demo.courseTitle} · Level: {demo.currentLevel}</p>
                  <p className="text-slate-500">Slots: {demo.preferredTimeSlot} ({demo.preferredDays.join(', ')})</p>
                  {demo.notes && <p className="italic text-slate-500">Note: "{demo.notes}"</p>}
                </div>

                <div className="flex items-center gap-2">
                  {demo.status === 'pending' ? (
                    <button
                      onClick={() => {
                        setSelectedDemo(demo);
                      }}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs"
                    >
                      Review & Approve Slot
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Approved for {demo.scheduledDateTime}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Demo Approval Dialog */}
          {selectedDemo && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                <div className="flex justify-between items-center pb-2 border-b">
                  <h3 className="text-base font-bold text-slate-900">Approve Free Demo Session</h3>
                  <button onClick={() => setSelectedDemo(null)}>
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <p>
                    Student: <strong>{selectedDemo.studentName}</strong> ({selectedDemo.country})
                  </p>
                  <div>
                    <label className="block font-semibold mb-1">Scheduled Date & Time (PST/Karachi)</label>
                    <input
                      type="text"
                      value={demoScheduleTime}
                      onChange={(e) => setDemoScheduleTime(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Classroom Link</label>
                    <input
                      type="text"
                      value={demoMeetingLink}
                      onChange={(e) => setDemoMeetingLink(e.target.value)}
                      className="w-full p-2 border rounded-lg font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedDemo(null)}
                    className="px-3 py-1.5 text-xs text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleApproveDemo(selectedDemo.id)}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-800 rounded-xl"
                  >
                    Confirm & Send Link
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: HOMEWORK & ASSIGNMENTS */}
      {activeTab === 'homework' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-800" />
                <h3 className="text-lg font-bold text-slate-900">Homework & Assignment Management</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload assignment descriptions, review student completion confirmations, and assign grades & feedback.
              </p>
            </div>

            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Upload & Assign Homework
            </button>
          </div>

          {/* Success Banner */}
          {hwSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{hwSuccessMsg}</span>
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
                const assignedStudent = users.find((u) => u.id === hw.studentId);
                const displayName = hw.studentName || assignedStudent?.name || 'Assigned Student';

                return (
                  <div
                    key={hw.id}
                    className={`p-5 rounded-2xl border transition-all text-xs space-y-3.5 ${
                      isSubmitted
                        ? 'border-blue-300 bg-blue-50/20 shadow-xs'
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

                          <span className="font-semibold text-slate-800">
                            Student: <strong className="text-emerald-950">{displayName}</strong>
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">{hw.courseTitle}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">Due: <strong>{hw.dueDate}</strong></span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 mt-1">{hw.title}</h4>
                        <div className="inline-block bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded font-mono text-[11px] font-medium">
                          Lesson Reference: {hw.surahOrLesson}
                        </div>
                      </div>

                      {/* Header Right Actions / Grade Badge */}
                      <div className="shrink-0 flex items-center gap-2">
                        {isGraded && (
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Assigned Grade</span>
                            <span className="text-sm font-bold text-emerald-900 font-mono bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 block">
                              {hw.grade}
                            </span>
                          </div>
                        )}

                        {isSubmitted && (
                          <button
                            onClick={() => {
                              setGradingHw(hw);
                              setGradeInput(hw.grade || 'Mumtaz (A+ - 98%)');
                              setFeedbackInput(
                                hw.teacherFeedback ||
                                  'MashaAllah, well-practiced! Pronunciation of letters and adherence to Tajweed rules were very clear.'
                              );
                            }}
                            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <Award className="w-3.5 h-3.5 text-amber-300" /> Review & Grade
                          </button>
                        )}

                        {isGraded && (
                          <button
                            onClick={() => {
                              setGradingHw(hw);
                              setGradeInput(hw.grade || 'Mumtaz (A+ - 98%)');
                              setFeedbackInput(hw.teacherFeedback || '');
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                          >
                            Edit Grade
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Assignment Instructions uploaded by Teacher */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-700 space-y-1">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-900">
                        <FileText className="w-3.5 h-3.5 text-emerald-800" /> Assignment Instructions:
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600">{hw.description}</p>
                      {hw.attachmentName && (
                        <p className="text-[11px] text-emerald-800 font-medium pt-1">
                          Attached Reference: 📄 {hw.attachmentName}
                        </p>
                      )}
                    </div>

                    {/* Student Submission & Confirmation */}
                    {(isSubmitted || isGraded) && hw.studentNotes && (
                      <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 text-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-blue-950 flex items-center gap-1.5">
                            <Send className="w-3.5 h-3.5 text-blue-700" /> Student Work / Completion Confirmation:
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
                      </div>
                    )}

                    {/* Teacher Feedback when Graded */}
                    {isGraded && hw.teacherFeedback && (
                      <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-emerald-700" /> Your Feedback & Tajweed Notes:
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
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No homework assignments found</p>
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="px-4 py-2 bg-emerald-800 text-white font-semibold text-xs rounded-xl"
                >
                  Upload First Assignment
                </button>
              </div>
            )}
          </div>

          {/* Modal 1: Assign New Homework */}
          {isAssignModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl my-8">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-800" />
                    <h3 className="text-base font-bold text-slate-900">Upload & Assign Homework</h3>
                  </div>
                  <button
                    onClick={() => setIsAssignModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAssignHomeworkSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">Target Student</label>
                    <select
                      value={assignStudentId}
                      onChange={(e) => setAssignStudentId(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-700"
                    >
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email} · {u.timeZone})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">Course Title</label>
                      <select
                        value={assignCourseTitle}
                        onChange={(e) => setAssignCourseTitle(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-700"
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">Due Date</label>
                      <input
                        type="date"
                        value={assignDueDate}
                        onChange={(e) => setAssignDueDate(e.target.value)}
                        required
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">Assignment Title</label>
                    <input
                      type="text"
                      value={assignTitle}
                      onChange={(e) => setAssignTitle(e.target.value)}
                      placeholder="e.g. Surah Al-Mulk Verses 1-10: Qalqalah Letters Drill"
                      required
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">Surah / Lesson Topic</label>
                      <input
                        type="text"
                        value={assignSurahLesson}
                        onChange={(e) => setAssignSurahLesson(e.target.value)}
                        placeholder="e.g. Surah Al-Mulk (67:1-10)"
                        required
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">Submission Type</label>
                      <select
                        value={assignSubmissionType}
                        onChange={(e) => setAssignSubmissionType(e.target.value as any)}
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-700"
                      >
                        <option value="completion_confirmation">Completion Confirmation & Practice Log</option>
                        <option value="recitation_audio">Recitation Practice Memo / Audio</option>
                        <option value="memorization_check">Hifz Memorization Self-Check</option>
                        <option value="written_exercise">Written Tajweed Exercise</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      Assignment Description & Recitation Instructions
                    </label>
                    <textarea
                      rows={4}
                      value={assignDescription}
                      onChange={(e) => setAssignDescription(e.target.value)}
                      placeholder="Specify recitation drill instructions, number of repetitions required, key Tajweed rules to watch out for (e.g. Qalqalah, Ghunnah), and how to verify with family..."
                      required
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      Reference Material / Authorized Book (Optional)
                    </label>
                    <input
                      type="text"
                      value={assignAttachment}
                      onChange={(e) => setAssignAttachment(e.target.value)}
                      placeholder="e.g. Noorani_Qaida_Lesson_9.pdf or Tajweed_Rules_CheatSheet"
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAssignModalOpen(false)}
                      className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Upload & Assign
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal 2: Grade Homework Dialog */}
          {gradingHw && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-800" />
                    <h3 className="text-base font-bold text-slate-900">Grade Homework</h3>
                  </div>
                  <button
                    onClick={() => setGradingHw(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <p className="font-semibold text-slate-900">{gradingHw.title}</p>
                    <p className="text-slate-500">Student: {gradingHw.studentName || 'Student'} · {gradingHw.surahOrLesson}</p>
                    {gradingHw.studentNotes && (
                      <div className="pt-2 border-t border-slate-200 mt-2">
                        <span className="font-semibold text-blue-900 block mb-0.5">Submitted Notes:</span>
                        <p className="italic text-slate-700">"{gradingHw.studentNotes}"</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">Select Grade</label>
                    <select
                      value={gradeInput}
                      onChange={(e) => setGradeInput(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-emerald-700"
                    >
                      <option value="Mumtaz (A+ - 98% / ممتاز)">Mumtaz (A+ - 98% / ممتاز)</option>
                      <option value="Jayyid Jiddan (A - 90% / جيد جداً)">Jayyid Jiddan (A - 90% / جيد جداً)</option>
                      <option value="Jayyid (B+ - 82% / جيد)">Jayyid (B+ - 82% / جيد)</option>
                      <option value="Maqbool (Needs Revision / مقبول)">Maqbool (Needs Revision / مقبول)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      Teacher Bua Qasim’s Feedback & Tajweed Guidance
                    </label>
                    <textarea
                      rows={3}
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      placeholder="Write constructive Islamic feedback, noting strong Makharij or points to review in the next class..."
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setGradingHw(null)}
                    className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveGrade}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Save Grade & Send Feedback
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
