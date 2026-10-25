import { User, UserRole } from '../types';

export type Permission =
  // Student permissions
  | 'VIEW_STUDENT_DASHBOARD'
  | 'VIEW_OWN_COURSES'
  | 'MARK_LESSON_PROGRESS'
  | 'SUBMIT_HOMEWORK'
  | 'VIEW_OWN_INVOICES'
  | 'JOIN_CLASSROOM'
  | 'WRITE_FEEDBACK'
  // Teacher permissions
  | 'VIEW_TEACHER_DASHBOARD'
  | 'MANAGE_ASSIGNED_STUDENTS'
  | 'MARK_ATTENDANCE'
  | 'GRADE_HOMEWORK'
  | 'UPDATE_STUDENT_PROGRESS'
  | 'MANAGE_AVAILABILITY'
  | 'APPROVE_DEMO_REQUESTS'
  // Admin permissions
  | 'VIEW_ADMIN_DASHBOARD'
  | 'MANAGE_ALL_STUDENTS'
  | 'MANAGE_ALL_TEACHERS'
  | 'MANAGE_COURSES'
  | 'MANAGE_PAYMENTS'
  | 'MANAGE_ACADEMY_SETTINGS'
  | 'VIEW_AUDIT_LOGS'
  | 'CONFIGURE_GATEWAY';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  student: [
    'VIEW_STUDENT_DASHBOARD',
    'VIEW_OWN_COURSES',
    'MARK_LESSON_PROGRESS',
    'SUBMIT_HOMEWORK',
    'VIEW_OWN_INVOICES',
    'JOIN_CLASSROOM',
    'WRITE_FEEDBACK',
  ],
  teacher: [
    'VIEW_TEACHER_DASHBOARD',
    'MANAGE_ASSIGNED_STUDENTS',
    'MARK_ATTENDANCE',
    'GRADE_HOMEWORK',
    'UPDATE_STUDENT_PROGRESS',
    'MANAGE_AVAILABILITY',
    'APPROVE_DEMO_REQUESTS',
    'JOIN_CLASSROOM',
  ],
  admin: [
    // Admin has universal global permissions
    'VIEW_STUDENT_DASHBOARD',
    'VIEW_OWN_COURSES',
    'MARK_LESSON_PROGRESS',
    'SUBMIT_HOMEWORK',
    'VIEW_OWN_INVOICES',
    'JOIN_CLASSROOM',
    'WRITE_FEEDBACK',
    'VIEW_TEACHER_DASHBOARD',
    'MANAGE_ASSIGNED_STUDENTS',
    'MARK_ATTENDANCE',
    'GRADE_HOMEWORK',
    'UPDATE_STUDENT_PROGRESS',
    'MANAGE_AVAILABILITY',
    'APPROVE_DEMO_REQUESTS',
    'VIEW_ADMIN_DASHBOARD',
    'MANAGE_ALL_STUDENTS',
    'MANAGE_ALL_TEACHERS',
    'MANAGE_COURSES',
    'MANAGE_PAYMENTS',
    'MANAGE_ACADEMY_SETTINGS',
    'VIEW_AUDIT_LOGS',
    'CONFIGURE_GATEWAY',
  ],
};

export class RBACService {
  public static hasPermission(user: User | null | undefined, permission: Permission): boolean {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  }

  public static canAccessStudentData(currentUser: User, studentId: string): boolean {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'teacher') return true; // Teacher manages assigned students
    return currentUser.id === studentId;
  }

  public static canAccessTeacherData(currentUser: User, teacherId: string): boolean {
    if (currentUser.role === 'admin') return true;
    return currentUser.id === teacherId;
  }

  public static validateRouteAccess(user: User, view: string): { allowed: boolean; reason?: string } {
    if (view === 'student-dashboard') {
      if (this.hasPermission(user, 'VIEW_STUDENT_DASHBOARD')) return { allowed: true };
      return { allowed: false, reason: 'Requires Student or Admin privileges to access the Student Learning Portal.' };
    }

    if (view === 'teacher-dashboard') {
      if (this.hasPermission(user, 'VIEW_TEACHER_DASHBOARD')) return { allowed: true };
      return { allowed: false, reason: 'Restricted to Teacher Bua Qasim Shigry and authorized faculty members.' };
    }

    if (view === 'admin-dashboard') {
      if (this.hasPermission(user, 'VIEW_ADMIN_DASHBOARD')) return { allowed: true };
      return { allowed: false, reason: 'Restricted to Academy Administrators only.' };
    }

    // Public routes (home, about, courses, course-detail, pricing, resources, library, contact, reviews, etc.)
    return { allowed: true };
  }
}
