import {
  AcademySettings,
  AttendanceRecord,
  BookItem,
  ClassSession,
  Course,
  DemoRequest,
  DuaItem,
  Enrollment,
  HadithItem,
  Homework,
  PaymentInvoice,
  ReviewItem,
  SEOSettings,
  ShopProduct,
  StudentProgress,
  User,
  UserRole,
} from '../types';
import {
  ALL_COURSES,
  AUTHENTIC_DUAS,
  AUTHENTIC_HADITHS,
  DOWNLOADABLE_BOOKS,
  INITIAL_SETTINGS,
  SEED_ATTENDANCE,
  SEED_CLASS_SESSIONS,
  SEED_DEMO_REQUESTS,
  SEED_ENROLLMENTS,
  SEED_HOMEWORK,
  SEED_INVOICES,
  SEED_PROGRESS,
  SEED_USERS,
  SHOP_PRODUCTS,
  VERIFIED_REVIEWS,
} from '../data/seedData';

// Storage keys
const STORAGE_PREFIX = 'quran_academy_';
const KEYS = {
  USERS: `${STORAGE_PREFIX}users`,
  CURRENT_USER: `${STORAGE_PREFIX}current_user`,
  SETTINGS: `${STORAGE_PREFIX}settings`,
  COURSES: `${STORAGE_PREFIX}courses`,
  DEMO_REQUESTS: `${STORAGE_PREFIX}demos`,
  ENROLLMENTS: `${STORAGE_PREFIX}enrollments`,
  CLASSES: `${STORAGE_PREFIX}classes`,
  ATTENDANCE: `${STORAGE_PREFIX}attendance`,
  HOMEWORK: `${STORAGE_PREFIX}homework`,
  PROGRESS: `${STORAGE_PREFIX}progress`,
  INVOICES: `${STORAGE_PREFIX}invoices`,
  REVIEWS: `${STORAGE_PREFIX}reviews`,
  LESSON_PROGRESS: `${STORAGE_PREFIX}lesson_progress`, // Record<string, string[]> -> "studentId:courseId": [lessonId, ...]
  AUDIT_LOGS: `${STORAGE_PREFIX}audit_logs`,
  GATEWAY_CONFIG: `${STORAGE_PREFIX}gateway_config`,
  SEO_SETTINGS: `${STORAGE_PREFIX}seo_settings`,
};

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Error loading from ${key}:`, e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving to ${key}:`, e);
  }
}

export interface PaymentGatewayConfig {
  mode: 'sandbox' | 'live';
  stripePublishableKey: string;
  paypalClientId: string;
  currency: string;
  enableCardPayments: boolean;
  enablePayPal: boolean;
  enableBankTransfer: boolean;
  enableEasypaisaJazzcash: boolean;
}

const DEFAULT_GATEWAY_CONFIG: PaymentGatewayConfig = {
  mode: 'sandbox',
  stripePublishableKey: 'pk_test_sample_quran_academy_key_51NxYz',
  paypalClientId: 'sb_client_id_sandbox_demo_academy',
  currency: 'USD',
  enableCardPayments: true,
  enablePayPal: true,
  enableBankTransfer: true,
  enableEasypaisaJazzcash: true,
};

export const DEFAULT_SEO_SETTINGS: SEOSettings = {
  metaTitle: 'Online Quran Academy — Teacher Bua Qasim Shigry | 16 Years Experience',
  metaDescription: 'Learn Holy Quran with Tajweed, Nazira, Hifz, and Islamic studies online with Teacher Bua Qasim Shigry. 16 years teaching experience, 500+ satisfied students worldwide. Book a free demo class today.',
  metaKeywords: 'online quran academy, learn quran online, quran teacher bua qasim shigry, quran tajweed classes, noorani qaida, hifz online, namaz guide, islamic classes uk usa pakistan',
  canonicalUrl: typeof window !== 'undefined' ? window.location.origin : 'https://quranacademy.example.com',
  ogTitle: 'Online Quran Academy — Teacher Bua Qasim Shigry',
  ogDescription: 'Personalized 1-on-1 online Quran classes for children and adults taught with 16 years experience. Register for a free trial class today.',
  ogImage: '/src/assets/images/hero_quran_academy_1792917817098.jpg',
  ogType: 'website',
  ogSiteName: 'Online Quran Academy',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Online Quran Academy — Teacher Bua Qasim Shigry',
  twitterDescription: 'Personalized 1-on-1 online Quran classes for children and adults taught with 16 years experience. Register for a free trial class today.',
  twitterImage: '/src/assets/images/hero_quran_academy_1792917817098.jpg',
  structuredDataJson: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Online Quran Academy — Teacher Bua Qasim Shigry",
    "description": "Online Quran Academy offering Nazira, Tajweed, Hifz, and Islamic studies led by Teacher Bua Qasim Shigry with 16 years of teaching experience.",
    "url": typeof window !== 'undefined' ? window.location.origin : "https://quranacademy.example.com",
    "founder": {
      "@type": "Person",
      "name": "Teacher Bua Qasim Shigry",
      "jobTitle": "Lead Quran Instructor",
      "knowsAbout": ["Quran Recitation", "Tajweed Rules", "Hifz", "Islamic Studies"]
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "35",
      "highPrice": "80"
    }
  }, null, 2),
};

class DatabaseService {
  constructor() {
    this.initIfEmpty();
    this.applySEOMetadata(this.getSEOSettings());
  }

  private initIfEmpty() {
    if (!localStorage.getItem(KEYS.USERS)) {
      setStored(KEYS.USERS, SEED_USERS);
    }
    if (!localStorage.getItem(KEYS.CURRENT_USER)) {
      setStored(KEYS.CURRENT_USER, SEED_USERS[2]); // Default as student Aisha Khan
    }
    if (!localStorage.getItem(KEYS.SETTINGS)) {
      setStored(KEYS.SETTINGS, INITIAL_SETTINGS);
    }
    if (!localStorage.getItem(KEYS.COURSES)) {
      setStored(KEYS.COURSES, ALL_COURSES);
    }
    if (!localStorage.getItem(KEYS.DEMO_REQUESTS)) {
      setStored(KEYS.DEMO_REQUESTS, SEED_DEMO_REQUESTS);
    }
    if (!localStorage.getItem(KEYS.ENROLLMENTS)) {
      setStored(KEYS.ENROLLMENTS, SEED_ENROLLMENTS);
    }
    if (!localStorage.getItem(KEYS.CLASSES)) {
      setStored(KEYS.CLASSES, SEED_CLASS_SESSIONS);
    }
    if (!localStorage.getItem(KEYS.ATTENDANCE)) {
      setStored(KEYS.ATTENDANCE, SEED_ATTENDANCE);
    }
    if (!localStorage.getItem(KEYS.HOMEWORK)) {
      setStored(KEYS.HOMEWORK, SEED_HOMEWORK);
    }
    if (!localStorage.getItem(KEYS.PROGRESS)) {
      setStored(KEYS.PROGRESS, SEED_PROGRESS);
    }
    if (!localStorage.getItem(KEYS.INVOICES)) {
      setStored(KEYS.INVOICES, SEED_INVOICES);
    }
    if (!localStorage.getItem(KEYS.REVIEWS)) {
      setStored(KEYS.REVIEWS, VERIFIED_REVIEWS);
    }
    if (!localStorage.getItem(KEYS.GATEWAY_CONFIG)) {
      setStored(KEYS.GATEWAY_CONFIG, DEFAULT_GATEWAY_CONFIG);
    }
    if (!localStorage.getItem(KEYS.SEO_SETTINGS)) {
      setStored(KEYS.SEO_SETTINGS, DEFAULT_SEO_SETTINGS);
    }
    if (!localStorage.getItem(KEYS.LESSON_PROGRESS)) {
      // Seed initial completed lesson keys
      const initialMap: Record<string, string[]> = {
        'user_student_1:c3': ['c3_w1_t0', 'c3_w1_t1', 'c3_w1_t2', 'c3_w2_t0'],
        'user_student_2:c2': ['c2_w1_t0', 'c2_w1_t1'],
      };
      setStored(KEYS.LESSON_PROGRESS, initialMap);
    }
    if (!localStorage.getItem(KEYS.AUDIT_LOGS)) {
      setStored(KEYS.AUDIT_LOGS, [
        {
          id: 'log_1',
          timestamp: new Date().toISOString(),
          actor: 'System Initialization',
          action: 'Database Bootstrapped',
          details: 'Online Quran Academy platform ready with Teacher Bua Qasim Shigry verified data.',
        },
      ]);
    }
  }

  // --- Audit Logging ---
  public logAction(actor: string, action: string, details: string) {
    const logs = getStored<any[]>(KEYS.AUDIT_LOGS, []);
    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      actor,
      action,
      details,
    };
    logs.unshift(newLog);
    setStored(KEYS.AUDIT_LOGS, logs.slice(0, 100)); // Keep latest 100 logs
  }

  public getAuditLogs() {
    return getStored<any[]>(KEYS.AUDIT_LOGS, []);
  }

  // --- Auth & Users ---
  public getCurrentUser(): User {
    const u = getStored<User | null>(KEYS.CURRENT_USER, null);
    if (!u) return SEED_USERS[2];
    return u;
  }

  public setCurrentUser(user: User): void {
    setStored(KEYS.CURRENT_USER, user);
    this.logAction(user.name, 'Switched User Session', `Logged in as ${user.name} (${user.role})`);
  }

  public getUsers(): User[] {
    return getStored<User[]>(KEYS.USERS, SEED_USERS);
  }

  public registerStudent(data: Partial<User> & { name: string; email: string }): User {
    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      this.setCurrentUser(existing);
      return existing;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'student',
      phone: data.phone || '',
      whatsapp: data.whatsapp || data.phone || '',
      country: data.country || 'Pakistan',
      city: data.city || '',
      timeZone: data.timeZone || 'Asia/Karachi',
      parentName: data.parentName,
      parentContact: data.parentContact,
      studentAgeRange: data.studentAgeRange || 'Child (5-12)',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    setStored(KEYS.USERS, users);
    this.setCurrentUser(newUser);
    this.logAction(newUser.name, 'Student Registered', `New student account created: ${newUser.email}`);
    return newUser;
  }

  public switchRole(role: UserRole): User {
    const users = this.getUsers();
    const target = users.find((u) => u.role === role) || users[0];
    this.setCurrentUser(target);
    return target;
  }

  // --- Settings ---
  public getSettings(): AcademySettings {
    return getStored<AcademySettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  public updateSettings(newSettings: Partial<AcademySettings>): AcademySettings {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    setStored(KEYS.SETTINGS, updated);
    this.logAction('Admin', 'Settings Updated', 'Academy branding and contact settings modified');
    return updated;
  }

  // --- Courses ---
  public getCourses(): Course[] {
    return getStored<Course[]>(KEYS.COURSES, ALL_COURSES);
  }

  public getCourseBySlug(slug: string): Course | undefined {
    return this.getCourses().find((c) => c.slug === slug || c.id === slug);
  }

  public updateCourse(id: string, updates: Partial<Course>): Course {
    const courses = this.getCourses();
    const index = courses.findIndex((c) => c.id === id);
    if (index !== -1) {
      courses[index] = { ...courses[index], ...updates };
      setStored(KEYS.COURSES, courses);
      this.logAction('Admin', 'Course Updated', `Updated course: ${courses[index].title}`);
      return courses[index];
    }
    throw new Error('Course not found');
  }

  public addCourse(course: Omit<Course, 'id' | 'totalEnrolled'>): Course {
    const courses = this.getCourses();
    const newCourse: Course = {
      ...course,
      id: `c_${Date.now()}`,
      totalEnrolled: 0,
    };
    courses.push(newCourse);
    setStored(KEYS.COURSES, courses);
    this.logAction('Admin', 'Course Created', `Added new course: ${newCourse.title}`);
    return newCourse;
  }

  // --- Student Progress & Lesson Completion Tracking ---
  public getCompletedLessons(studentId: string, courseId: string): string[] {
    const allProgress = getStored<Record<string, string[]>>(KEYS.LESSON_PROGRESS, {});
    const key = `${studentId}:${courseId}`;
    return allProgress[key] || [];
  }

  public toggleLessonCompletion(studentId: string, courseId: string, lessonId: string): { completed: boolean; progressPercent: number } {
    const allProgress = getStored<Record<string, string[]>>(KEYS.LESSON_PROGRESS, {});
    const key = `${studentId}:${courseId}`;
    let list = allProgress[key] || [];
    const isCompleted = list.includes(lessonId);

    if (isCompleted) {
      list = list.filter((id) => id !== lessonId);
    } else {
      list.push(lessonId);
    }

    allProgress[key] = list;
    setStored(KEYS.LESSON_PROGRESS, allProgress);

    // Calculate course percentage based on total syllabus topics
    const course = this.getCourses().find((c) => c.id === courseId);
    let totalTopics = 12; // default
    if (course && course.syllabusWeeks) {
      totalTopics = course.syllabusWeeks.reduce((acc, w) => acc + (w.topics?.length || 1), 0);
    }
    const percent = Math.min(100, Math.round((list.length / Math.max(1, totalTopics)) * 100));

    // Update enrollment progress
    this.updateEnrollmentProgress(studentId, courseId, percent);

    this.logAction(
      'Student',
      isCompleted ? 'Lesson Marked Incomplete' : 'Lesson Completed',
      `Student ${studentId} updated lesson ${lessonId} in ${course?.title || courseId} (${percent}%)`
    );

    return { completed: !isCompleted, progressPercent: percent };
  }

  public updateEnrollmentProgress(studentId: string, courseId: string, percent: number) {
    const enrollments = this.getEnrollments();
    const enr = enrollments.find((e) => e.studentId === studentId && e.courseId === courseId);
    if (enr) {
      enr.progressPercent = percent;
      setStored(KEYS.ENROLLMENTS, enrollments);
    }
  }

  // --- Demo Requests ---
  public getDemoRequests(): DemoRequest[] {
    return getStored<DemoRequest[]>(KEYS.DEMO_REQUESTS, SEED_DEMO_REQUESTS);
  }

  public createDemoRequest(data: Omit<DemoRequest, 'id' | 'referenceCode' | 'status' | 'createdAt' | 'assignedTeacher'>): DemoRequest {
    const requests = this.getDemoRequests();
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const newDemo: DemoRequest = {
      ...data,
      id: `demo_${Date.now()}`,
      referenceCode: `QRN-DEMO-${randomCode}`,
      status: 'pending',
      assignedTeacher: 'Bua Qasim Shigry',
      createdAt: new Date().toISOString(),
    };

    requests.unshift(newDemo);
    setStored(KEYS.DEMO_REQUESTS, requests);
    this.logAction(newDemo.studentName, 'Booked Free Demo Class', `Reference: ${newDemo.referenceCode} for ${newDemo.courseTitle}`);
    return newDemo;
  }

  public updateDemoStatus(id: string, status: DemoRequest['status'], scheduledDateTime?: string, meetingLink?: string): DemoRequest {
    const requests = this.getDemoRequests();
    const index = requests.findIndex((r) => r.id === id);
    if (index !== -1) {
      requests[index].status = status;
      if (scheduledDateTime) requests[index].scheduledDateTime = scheduledDateTime;
      if (meetingLink) requests[index].meetingLink = meetingLink;
      setStored(KEYS.DEMO_REQUESTS, requests);
      this.logAction('Admin / Teacher', `Demo Request ${status.toUpperCase()}`, `Reference: ${requests[index].referenceCode}`);
      return requests[index];
    }
    throw new Error('Demo request not found');
  }

  // --- Enrollments ---
  public getEnrollments(): Enrollment[] {
    return getStored<Enrollment[]>(KEYS.ENROLLMENTS, SEED_ENROLLMENTS);
  }

  public createEnrollment(data: {
    studentId: string;
    studentName: string;
    courseId: string;
    courseTitle: string;
    packageName: string;
    frequency: string;
    monthlyFee: number;
    currency: string;
  }): Enrollment {
    const enrollments = this.getEnrollments();
    const newEnr: Enrollment = {
      id: `enr_${Date.now()}`,
      studentId: data.studentId,
      studentName: data.studentName,
      courseId: data.courseId,
      courseTitle: data.courseTitle,
      packageId: 'pkg_custom',
      packageName: data.packageName,
      frequency: data.frequency,
      timeSlot: 'Flexible (Arranged with Teacher)',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      progressPercent: 0,
      completedClasses: 0,
      totalClasses: 36,
      monthlyFee: data.monthlyFee,
      currency: data.currency,
      teacherName: 'Bua Qasim Shigry',
    };

    enrollments.unshift(newEnr);
    setStored(KEYS.ENROLLMENTS, enrollments);

    // Increment course totalEnrolled
    const courses = this.getCourses();
    const c = courses.find((x) => x.id === data.courseId);
    if (c) {
      c.totalEnrolled = (c.totalEnrolled || 0) + 1;
      setStored(KEYS.COURSES, courses);
    }

    this.logAction(data.studentName, 'Enrolled in Course', `Enrolled in ${data.courseTitle} (${data.packageName})`);
    return newEnr;
  }

  // --- Classes & Timetable ---
  public getClasses(): ClassSession[] {
    return getStored<ClassSession[]>(KEYS.CLASSES, SEED_CLASS_SESSIONS);
  }

  public createClassSession(session: Omit<ClassSession, 'id'>): ClassSession {
    const classes = this.getClasses();
    const newSession: ClassSession = {
      ...session,
      id: `cls_${Date.now()}`,
    };
    classes.unshift(newSession);
    setStored(KEYS.CLASSES, classes);
    this.logAction(session.teacherName, 'Class Scheduled', `${session.courseTitle} for ${session.studentName} on ${session.date}`);
    return newSession;
  }

  public updateClassStatus(classId: string, status: ClassSession['status'], teacherNotes?: string): ClassSession {
    const classes = this.getClasses();
    const item = classes.find((c) => c.id === classId);
    if (item) {
      item.status = status;
      if (teacherNotes) item.teacherNotes = teacherNotes;
      setStored(KEYS.CLASSES, classes);
      return item;
    }
    throw new Error('Class session not found');
  }

  // --- Attendance ---
  public getAttendance(): AttendanceRecord[] {
    return getStored<AttendanceRecord[]>(KEYS.ATTENDANCE, SEED_ATTENDANCE);
  }

  public markAttendance(record: Omit<AttendanceRecord, 'id'>): AttendanceRecord {
    const records = this.getAttendance();
    const newRec: AttendanceRecord = {
      ...record,
      id: `att_${Date.now()}`,
    };
    records.unshift(newRec);
    setStored(KEYS.ATTENDANCE, records);
    this.logAction('Teacher Bua Qasim', 'Attendance Marked', `${record.studentName}: ${record.status} on ${record.date}`);
    return newRec;
  }

  // --- Homework ---
  public getHomework(): Homework[] {
    return getStored<Homework[]>(KEYS.HOMEWORK, SEED_HOMEWORK);
  }

  public submitHomework(
    id: string,
    submissionOrNotes: string | { studentNotes: string; submissionType?: Homework['submissionType']; attachmentName?: string }
  ): Homework {
    const list = this.getHomework();
    const item = list.find((h) => h.id === id);
    if (item) {
      item.status = 'submitted';
      if (typeof submissionOrNotes === 'string') {
        item.studentNotes = submissionOrNotes;
      } else {
        item.studentNotes = submissionOrNotes.studentNotes;
        if (submissionOrNotes.submissionType) item.submissionType = submissionOrNotes.submissionType;
        if (submissionOrNotes.attachmentName) item.attachmentName = submissionOrNotes.attachmentName;
      }
      item.submittedAt = new Date().toISOString();
      setStored(KEYS.HOMEWORK, list);
      this.logAction(item.studentName || 'Student', 'Homework Submitted', `Submitted: ${item.title}`);
      return item;
    }
    throw new Error('Homework item not found');
  }

  public gradeHomework(id: string, grade: string, feedback: string): Homework {
    const list = this.getHomework();
    const item = list.find((h) => h.id === id);
    if (item) {
      item.status = 'graded';
      item.grade = grade;
      item.teacherFeedback = feedback;
      item.gradedAt = new Date().toISOString();
      setStored(KEYS.HOMEWORK, list);
      this.logAction('Teacher Bua Qasim', 'Homework Graded', `Graded ${item.title} with ${grade}`);
      return item;
    }
    throw new Error('Homework item not found');
  }

  public assignHomework(data: Omit<Homework, 'id' | 'status'>): Homework {
    const list = this.getHomework();
    const newHw: Homework = {
      ...data,
      id: `hw_${Date.now()}`,
      status: 'pending',
      assignedDate: data.assignedDate || new Date().toISOString().split('T')[0],
    };
    list.unshift(newHw);
    setStored(KEYS.HOMEWORK, list);
    this.logAction('Teacher Bua Qasim', 'Homework Assigned', `Assigned: ${newHw.title} to ${newHw.studentName || newHw.studentId}`);
    return newHw;
  }

  // --- Student Progress Record ---
  public getStudentProgress(studentId: string): StudentProgress | undefined {
    const records = getStored<StudentProgress[]>(KEYS.PROGRESS, SEED_PROGRESS);
    return records.find((p) => p.studentId === studentId);
  }

  public updateStudentProgress(studentId: string, updates: Partial<StudentProgress>): StudentProgress {
    const records = getStored<StudentProgress[]>(KEYS.PROGRESS, SEED_PROGRESS);
    let item = records.find((p) => p.studentId === studentId);
    if (item) {
      Object.assign(item, updates);
      item.lastUpdated = new Date().toISOString().split('T')[0];
    } else {
      item = {
        id: `prog_${Date.now()}`,
        studentId,
        currentSurah: updates.currentSurah || 'Juz Amma',
        currentAyah: updates.currentAyah || 'Ayah 1',
        currentParaOrJuz: updates.currentParaOrJuz || 30,
        tajweedMasteryScore: updates.tajweedMasteryScore || 80,
        hifzMemorizedPages: updates.hifzMemorizedPages || 1,
        fluencyRating: updates.fluencyRating || 'Good',
        lastUpdated: new Date().toISOString().split('T')[0],
        teacherNotes: updates.teacherNotes || 'Consistently advancing.',
      };
      records.push(item);
    }
    setStored(KEYS.PROGRESS, records);
    this.logAction('Teacher Bua Qasim', 'Progress Updated', `Updated progress metrics for student ${studentId}`);
    return item;
  }

  // --- Payment Invoices & Gateway ---
  public getInvoices(): PaymentInvoice[] {
    return getStored<PaymentInvoice[]>(KEYS.INVOICES, SEED_INVOICES);
  }

  public getGatewayConfig(): PaymentGatewayConfig {
    return getStored<PaymentGatewayConfig>(KEYS.GATEWAY_CONFIG, DEFAULT_GATEWAY_CONFIG);
  }

  public updateGatewayConfig(config: Partial<PaymentGatewayConfig>): PaymentGatewayConfig {
    const current = this.getGatewayConfig();
    const updated = { ...current, ...config };
    setStored(KEYS.GATEWAY_CONFIG, updated);
    this.logAction('Admin', 'Payment Gateway Configured', `Mode set to: ${updated.mode}`);
    return updated;
  }

  public processPayment(data: {
    studentId: string;
    studentName: string;
    courseTitle: string;
    packageName: string;
    amount: number;
    currency: string;
    method: 'stripe_card' | 'paypal' | 'bank_transfer' | 'easypaisa_jazzcash';
    isRecurring: boolean;
    cardNumberMock?: string;
  }): { success: boolean; invoice: PaymentInvoice; message: string; transactionId: string } {
    const invoices = this.getInvoices();
    const txnCode = `TXN-${data.currency}-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const invNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Simulate payment verification based on sandbox mode
    const gateway = this.getGatewayConfig();
    const isSuccess = data.cardNumberMock !== '4000000000000002'; // allow specific fail test card

    const newInvoice: PaymentInvoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: invNumber,
      studentId: data.studentId,
      studentName: data.studentName,
      courseTitle: data.courseTitle,
      packageName: `${data.packageName} (${data.isRecurring ? 'Monthly Auto-Renew' : 'One-Time'})`,
      amount: data.amount,
      currency: data.currency,
      status: isSuccess ? 'paid' : 'overdue',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      paidDate: isSuccess ? new Date().toISOString().split('T')[0] : undefined,
      paymentMethod:
        data.method === 'stripe_card'
          ? `Stripe Card (${gateway.mode.toUpperCase()})`
          : data.method === 'paypal'
          ? `PayPal Secure Checkout (${gateway.mode.toUpperCase()})`
          : data.method === 'easypaisa_jazzcash'
          ? 'Easypaisa / JazzCash Mobile'
          : 'Direct Bank Wire Transfer',
      transactionReference: isSuccess ? txnCode : undefined,
      notes: isSuccess
        ? `Payment verified via ${gateway.mode} gateway. Enrollment confirmed.`
        : 'Payment declined by test simulator.',
    };

    invoices.unshift(newInvoice);
    setStored(KEYS.INVOICES, invoices);

    this.logAction(
      data.studentName,
      isSuccess ? 'Payment Succeeded' : 'Payment Failed',
      `Invoice: ${invNumber} | Amount: ${data.currency} ${data.amount} via ${data.method}`
    );

    return {
      success: isSuccess,
      invoice: newInvoice,
      message: isSuccess
        ? 'Payment authorized successfully! Your official receipt is ready and classes are activated.'
        : 'Payment authorization declined. Please check card credentials or try another method.',
      transactionId: txnCode,
    };
  }

  // --- Reviews ---
  public getReviews(): ReviewItem[] {
    return getStored<ReviewItem[]>(KEYS.REVIEWS, VERIFIED_REVIEWS);
  }

  public addReview(review: Omit<ReviewItem, 'id' | 'verified' | 'date'>): ReviewItem {
    const list = this.getReviews();
    const newRev: ReviewItem = {
      ...review,
      id: `rev_${Date.now()}`,
      verified: true, // Auto-marked as verified for authentic submissions
      date: 'Just now',
    };
    list.unshift(newRev);
    setStored(KEYS.REVIEWS, list);
    this.logAction(review.studentName, 'Review Submitted', `Rating: ${review.rating} Stars for ${review.course}`);
    return newRev;
  }

  // --- SEO Settings ---
  public getSEOSettings(): SEOSettings {
    return getStored<SEOSettings>(KEYS.SEO_SETTINGS, DEFAULT_SEO_SETTINGS);
  }

  public updateSEOSettings(newSettings: Partial<SEOSettings>): SEOSettings {
    const current = this.getSEOSettings();
    const updated = { ...current, ...newSettings };
    setStored(KEYS.SEO_SETTINGS, updated);
    this.applySEOMetadata(updated);
    this.logAction('Admin', 'SEO Settings Updated', `Updated site title: "${updated.metaTitle}"`);
    return updated;
  }

  public applySEOMetadata(seo: SEOSettings): void {
    if (typeof document === 'undefined') return;

    // 1. Page Title
    if (seo.metaTitle) {
      document.title = seo.metaTitle;
    }

    // Helper for meta tags
    const updateOrCreateMeta = (attrName: string, attrVal: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    // Standard Meta
    updateOrCreateMeta('name', 'description', seo.metaDescription);
    if (seo.metaKeywords) {
      updateOrCreateMeta('name', 'keywords', seo.metaKeywords);
    }

    // OpenGraph Meta
    updateOrCreateMeta('property', 'og:title', seo.ogTitle || seo.metaTitle);
    updateOrCreateMeta('property', 'og:description', seo.ogDescription || seo.metaDescription);
    updateOrCreateMeta('property', 'og:type', seo.ogType || 'website');
    updateOrCreateMeta('property', 'og:site_name', seo.ogSiteName || 'Online Quran Academy');
    if (seo.ogImage) {
      updateOrCreateMeta('property', 'og:image', seo.ogImage);
    }
    if (seo.canonicalUrl) {
      updateOrCreateMeta('property', 'og:url', seo.canonicalUrl);
    }

    // Twitter Card Meta
    updateOrCreateMeta('name', 'twitter:card', seo.twitterCard || 'summary_large_image');
    updateOrCreateMeta('name', 'twitter:title', seo.twitterTitle || seo.ogTitle || seo.metaTitle);
    updateOrCreateMeta('name', 'twitter:description', seo.twitterDescription || seo.ogDescription || seo.metaDescription);
    if (seo.twitterImage || seo.ogImage) {
      updateOrCreateMeta('name', 'twitter:image', seo.twitterImage || seo.ogImage);
    }

    // Canonical link
    if (seo.canonicalUrl) {
      let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canon) {
        canon = document.createElement('link');
        canon.rel = 'canonical';
        document.head.appendChild(canon);
      }
      canon.href = seo.canonicalUrl;
    }

    // Schema.org Structured Data (JSON-LD)
    if (seo.structuredDataJson) {
      let script = document.getElementById('seo-structured-data') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = 'seo-structured-data';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = seo.structuredDataJson;
    }
  }
}

export const db = new DatabaseService();

