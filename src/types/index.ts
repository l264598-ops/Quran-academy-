export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  whatsapp?: string;
  country: string;
  city?: string;
  timeZone: string;
  avatar?: string;
  parentName?: string;
  parentContact?: string;
  studentAgeRange?: string;
  createdAt: string;
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
export type CourseCategory = 
  | 'Quran Reading & Nazira'
  | 'Tajweed & Tarteel'
  | 'Hifz & Memorization'
  | 'Translation & Tafseer'
  | 'Islamic Education'
  | 'Languages & Urdu'
  | 'Specialized Programs';

export interface Course {
  id: string;
  slug: string;
  title: string;
  arabicTitle: string;
  shortDesc: string;
  fullDesc: string;
  category: CourseCategory;
  level: CourseLevel;
  durationMonths: number;
  classesPerWeek: number;
  classDurationMins: number;
  suitableFor: string;
  language: string;
  objectives: string[];
  syllabusWeeks: { week: number; title: string; topics: string[] }[];
  teacherId: string;
  teacherName: string;
  published: boolean;
  featured: boolean;
  image: string;
  pricePerMonthUSD: number;
  pricePerMonthPKR: number;
  pricePerMonthGBP: number;
  totalEnrolled: number;
}

export type DemoRequestStatus = 'pending' | 'approved' | 'completed' | 'cancelled';

export interface DemoRequest {
  id: string;
  referenceCode: string;
  studentName: string;
  parentName?: string;
  email: string;
  whatsapp: string;
  country: string;
  ageRange: string;
  courseId: string;
  courseTitle: string;
  currentLevel: string;
  timeZone: string;
  preferredDays: string[];
  preferredTimeSlot: string;
  learningGoals: string;
  notes?: string;
  status: DemoRequestStatus;
  scheduledDateTime?: string;
  meetingLink?: string;
  assignedTeacher: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  packageId: string;
  packageName: string;
  frequency: string;
  timeSlot: string;
  status: 'active' | 'pending' | 'completed' | 'paused';
  startDate: string;
  progressPercent: number;
  completedClasses: number;
  totalClasses: number;
  monthlyFee: number;
  currency: string;
  teacherName: string;
}

export interface ClassSession {
  id: string;
  title: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  date: string;
  startTime: string;
  durationMins: number;
  meetingUrl: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'live';
  lessonTopic: string;
  surahOrAyah?: string;
  homeworkAssigned?: string;
  teacherNotes?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  courseTitle: string;
  date: string;
  status: 'present' | 'absent' | 'excused';
  punctuality: 'on-time' | 'late' | 'n/a';
  remarks?: string;
}

export interface Homework {
  id: string;
  studentId: string;
  studentName?: string;
  courseTitle: string;
  title: string;
  description: string;
  surahOrLesson: string;
  assignedDate: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'reviewed';
  submissionType?: 'recitation_audio' | 'written_exercise' | 'memorization_check' | 'completion_confirmation';
  studentNotes?: string;
  submittedAt?: string;
  attachmentName?: string;
  teacherFeedback?: string;
  grade?: string; // e.g. "Mumtaz (A+)", "Jayyid (A)", "Good"
  gradedAt?: string;
}

export interface StudentProgress {
  id: string;
  studentId: string;
  currentSurah: string;
  currentAyah: string;
  currentParaOrJuz: number;
  tajweedMasteryScore: number; // 0-100
  hifzMemorizedPages: number;
  fluencyRating: string;
  lastUpdated: string;
  teacherNotes: string;
}

export interface PaymentInvoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  courseTitle: string;
  packageName: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  transactionReference?: string;
  notes?: string;
}

export interface DuaItem {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translationEn: string;
  translationUrdu: string;
  benefit: string;
  reference: string;
  category: 'Daily Life' | 'Morning & Evening' | 'Prayer & Salah' | 'Hardship & Protection' | 'Parents & Family' | 'Knowledge';
}

export interface HadithItem {
  id: string;
  number: number;
  book: string;
  narrator: string;
  arabic: string;
  translationEn: string;
  translationUrdu: string;
  explanation: string;
  theme: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  language: string;
  category: string;
  description: string;
  fileSize: string;
  pages: number;
  freeDownload: boolean;
  coverImage?: string;
  downloadUrl: string;
}

export interface ShopProduct {
  id: string;
  title: string;
  price: number;
  currency: string;
  category: string;
  description: string;
  inStock: boolean;
  image: string;
  isDigital: boolean;
}

export interface ReviewItem {
  id: string;
  studentName: string;
  country: string;
  flag: string;
  rating: number;
  course: string;
  date: string;
  content: string;
  verified: boolean;
}

export interface AcademySettings {
  academyName: string;
  teacherName: string;
  experienceYears: number;
  studentsCount: number;
  announcementText: string;
  announcementActive: boolean;
  whatsappNumber: string;
  contactEmail: string;
  phone: string;
  address: string;
  zoomOrMeetLinkDefault: string;
  currencyDefault: string;
  bankAccountDetails: string;
  easypaisaDetails: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogSiteName: string;
  twitterCard: 'summary' | 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  structuredDataJson: string;
}
