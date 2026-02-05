/**
 * Admin & Permissions Management System
 * מערכת ניהול הרשאות מתקדמת לאפליקציה הלכתית
 * 
 * Features:
 * - 7 רמות הרשאות (Anonymous → SuperAdmin)
 * - מערכת אישורים מרובים (5+ אישורים חובה)
 * - Audit Log מלא
 * - SuperAdmin יכול לתת הרשאות לאחרים
 * - עריכת תשובות עם היסטוריה מלאה
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { 
  UserRole, 
  UserProfile, 
  UserPermissions,
  AuditLog,
  Answer
} from '@/types/questions';

// TODO: After Firebase setup, uncomment:
// import { db } from '@/config/firebase';
// import { 
//   collection, 
//   doc, 
//   getDoc,
//   setDoc,
//   updateDoc,
//   query,
//   where,
//   getDocs,
//   addDoc,
//   Timestamp,
//   increment
// } from 'firebase/firestore';

const STORAGE_KEYS = {
  USER_PROFILES: '@kitzur_user_profiles',
  AUDIT_LOG: '@kitzur_audit_log',
  PENDING_APPROVALS: '@kitzur_pending_approvals'
};

// ============================================
// USER PROFILE MANAGEMENT
// ============================================

/**
 * Get user profile and permissions
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILES);
    if (!stored) return null;
    
    const profiles: Record<string, UserProfile> = JSON.parse(stored);
    return profiles[userId] || null;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
}

/**
 * Get user permissions based on role
 */
export async function getUserPermissions(userId: string): Promise<UserPermissions> {
  const profile = await getUserProfile(userId);
  
  if (!profile) {
    // Anonymous user - basic permissions
    const { ROLE_PERMISSIONS } = await import('@/types/questions');
    return ROLE_PERMISSIONS.anonymous;
  }
  
  const { ROLE_PERMISSIONS } = await import('@/types/questions');
  return ROLE_PERMISSIONS[profile.role];
}

/**
 * Check if user has specific permission
 */
export async function hasPermission(
  userId: string,
  permission: keyof UserPermissions
): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return permissions[permission] as boolean;
}

/**
 * Create or update user profile
 */
export async function createUserProfile(
  userId: string,
  displayName: string,
  email?: string,
  initialRole: UserRole = 'registered'
): Promise<UserProfile> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILES);
    const profiles: Record<string, UserProfile> = stored ? JSON.parse(stored) : {};
    
    const profile: UserProfile = {
      userId,
      displayName,
      email,
      role: initialRole,
      approvalLevel: 'user',
      createdAt: Date.now(),
      stats: {
        questionsAsked: 0,
        answersGiven: 0,
        approvalsGiven: 0,
        helpfulVotes: 0
      },
      isVerified: false
    };
    
    profiles[userId] = profile;
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(profiles));
    
    // Log creation
    await logAudit({
      action: 'create',
      performedBy: userId,
      performedByName: displayName,
      performedByRole: initialRole,
      targetType: 'user',
      targetId: userId,
      timestamp: Date.now()
    });
    
    return profile;
  } catch (error) {
    console.error('Failed to create user profile:', error);
    throw error;
  }
}

// ============================================
// ROLE & PERMISSION MANAGEMENT
// ============================================

/**
 * Grant role to user
 * Only SuperAdmin can grant roles
 */
export async function grantRole(
  adminUserId: string,
  targetUserId: string,
  newRole: UserRole,
  reason?: string
): Promise<void> {
  // Check if admin has permission
  const canManage = await hasPermission(adminUserId, 'canManageUsers');
  if (!canManage) {
    throw new Error('אין לך הרשאה לנהל משתמשים');
  }
  
  // If granting SuperAdmin, need special permission
  if (newRole === 'superadmin') {
    const canGrantSuperAdmin = await hasPermission(adminUserId, 'canGrantSuperAdmin');
    if (!canGrantSuperAdmin) {
      throw new Error('רק SuperAdmin יכול לתת הרשאות SuperAdmin');
    }
  }
  
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILES);
    if (!stored) throw new Error('User profiles not found');
    
    const profiles: Record<string, UserProfile> = JSON.parse(stored);
    const targetProfile = profiles[targetUserId];
    const adminProfile = profiles[adminUserId];
    
    if (!targetProfile) {
      throw new Error('משתמש היעד לא נמצא');
    }
    
    const previousRole = targetProfile.role;
    
    // Update role
    targetProfile.role = newRole;
    targetProfile.grantedBy = adminUserId;
    targetProfile.grantedAt = Date.now();
    targetProfile.isVerified = true;
    
    // Update approval level based on role
    if (newRole === 'scholar' || newRole === 'rabbi') {
      targetProfile.approvalLevel = 'scholar';
    } else if (newRole === 'moderator' || newRole === 'superadmin') {
      targetProfile.approvalLevel = 'rabbi';
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(profiles));
    
    // Log the change
    await logAudit({
      action: 'role_change',
      performedBy: adminUserId,
      performedByName: adminProfile?.displayName || 'Unknown',
      performedByRole: adminProfile?.role || 'superadmin',
      targetType: 'user',
      targetId: targetUserId,
      timestamp: Date.now(),
      changes: {
        previousRole,
        newRole,
        grantedBy: adminUserId
      },
      reason
    });
    
    console.log(`✅ Role granted: ${targetProfile.displayName} → ${newRole}`);
  } catch (error) {
    console.error('Failed to grant role:', error);
    throw error;
  }
}

/**
 * Revoke role (downgrade to registered)
 */
export async function revokeRole(
  adminUserId: string,
  targetUserId: string,
  reason: string
): Promise<void> {
  await grantRole(adminUserId, targetUserId, 'registered', reason);
}

/**
 * Get all users with specific role
 */
export async function getUsersByRole(role: UserRole): Promise<UserProfile[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILES);
    if (!stored) return [];
    
    const profiles: Record<string, UserProfile> = JSON.parse(stored);
    return Object.values(profiles).filter(p => p.role === role);
  } catch (error) {
    console.error('Failed to get users by role:', error);
    return [];
  }
}

// ============================================
// APPROVAL SYSTEM
// ============================================

/**
 * Add approval to answer
 * Checks minimum required approvals
 */
export async function addApproval(
  questionId: string,
  userId: string,
  _comment?: string  // Reserved for future use
): Promise<{ approved: boolean; totalWeight: number; message: string }> {
  const canApprove = await hasPermission(userId, 'canApproveAnswers');
  
  if (!canApprove) {
    throw new Error('אין לך הרשאה לאשר תשובות');
  }
  
  const profile = await getUserProfile(userId);
  if (!profile) {
    throw new Error('משתמש לא נמצא');
  }
  
  const permissions = await getUserPermissions(userId);
  const weight = permissions.approvalWeight;
  
  // TODO: Add to actual question's approvals list when Firebase is ready
  console.log(`Approval added to question ${questionId} by ${userId} with weight ${weight}`);
  
  return {
    approved: true,
    totalWeight: weight,
    message: `אישור נוסף (משקל: ${weight})`
  };
}

/**
 * Check if answer has enough approvals
 */
export function hasEnoughApprovals(
  answer: Answer,
  minimumRequired: number = 5
): boolean {
  const totalWeight = answer.totalApprovalWeight || 0;
  const approvalCount = answer.approvals.length;
  
  // Need at least X approvals OR high enough weight
  return approvalCount >= minimumRequired || totalWeight >= 100;
}

/**
 * Calculate approval status
 */
export function getApprovalStatus(answer: Answer): {
  count: number;
  totalWeight: number;
  isApproved: boolean;
  progress: number;
} {
  const count = answer.approvals.length;
  const totalWeight = answer.totalApprovalWeight || 0;
  const isApproved = hasEnoughApprovals(answer);
  const progress = Math.min((count / 5) * 100, 100);
  
  return { count, totalWeight, isApproved, progress };
}

// ============================================
// ANSWER EDITING (SuperAdmin/Moderator only)
// ============================================

/**
 * Edit answer text
 * Only moderators and superadmins can edit
 */
export async function editAnswer(
  questionId: string,
  editorUserId: string,
  newText: string,
  reason?: string
): Promise<void> {
  const canEdit = await hasPermission(editorUserId, 'canEditAnswers');
  
  if (!canEdit) {
    throw new Error('אין לך הרשאה לערוך תשובות');
  }
  
  const profile = await getUserProfile(editorUserId);
  if (!profile) {
    throw new Error('משתמש לא נמצא');
  }
  
  // TODO: Get actual question and update
  // For now, just log
  
  await logAudit({
    action: 'edit',
    performedBy: editorUserId,
    performedByName: profile.displayName,
    performedByRole: profile.role,
    targetType: 'answer',
    targetId: questionId,
    timestamp: Date.now(),
    changes: {
      newText,
      editedBy: editorUserId
    },
    reason
  });
  
  console.log(`✅ Answer edited by ${profile.displayName} (${profile.role})`);
}

// ============================================
// AUDIT LOG
// ============================================

/**
 * Log action to audit trail
 */
async function logAudit(log: Omit<AuditLog, 'id'>): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.AUDIT_LOG);
    const logs: AuditLog[] = stored ? JSON.parse(stored) : [];
    
    const newLog: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...log
    };
    
    logs.unshift(newLog);
    
    // Keep only last 1000 logs
    if (logs.length > 1000) {
      logs.splice(1000);
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to log audit:', error);
  }
}

/**
 * Get audit logs for specific user/target
 */
export async function getAuditLogs(
  filters?: {
    performedBy?: string;
    targetId?: string;
    action?: AuditLog['action'];
    limit?: number;
  }
): Promise<AuditLog[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.AUDIT_LOG);
    if (!stored) return [];
    
    let logs: AuditLog[] = JSON.parse(stored);
    
    // Apply filters
    if (filters?.performedBy) {
      logs = logs.filter(l => l.performedBy === filters.performedBy);
    }
    if (filters?.targetId) {
      logs = logs.filter(l => l.targetId === filters.targetId);
    }
    if (filters?.action) {
      logs = logs.filter(l => l.action === filters.action);
    }
    
    // Limit results
    if (filters?.limit) {
      logs = logs.slice(0, filters.limit);
    }
    
    return logs;
  } catch (error) {
    console.error('Failed to get audit logs:', error);
    return [];
  }
}

// ============================================
// STATISTICS & ANALYTICS
// ============================================

/**
 * Get platform statistics (for admins)
 */
export async function getPlatformStats(): Promise<{
  totalUsers: number;
  usersByRole: Record<UserRole, number>;
  totalQuestions: number;
  totalAnswers: number;
  pendingApprovals: number;
}> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILES);
    const profiles: Record<string, UserProfile> = stored ? JSON.parse(stored) : {};
    
    const usersByRole: Record<UserRole, number> = {
      anonymous: 0,
      registered: 0,
      trusted: 0,
      scholar: 0,
      rabbi: 0,
      moderator: 0,
      superadmin: 0
    };
    
    Object.values(profiles).forEach(profile => {
      usersByRole[profile.role]++;
    });
    
    return {
      totalUsers: Object.keys(profiles).length,
      usersByRole,
      totalQuestions: 0, // TODO: Get from questions collection
      totalAnswers: 0,
      pendingApprovals: 0
    };
  } catch (error) {
    console.error('Failed to get platform stats:', error);
    throw error;
  }
}

/**
 * Initialize first SuperAdmin
 * Run this once when setting up the app
 */
export async function initializeFirstSuperAdmin(
  userId: string,
  displayName: string,
  email?: string
): Promise<UserProfile> {
  console.log('🔐 Initializing first SuperAdmin...');
  
  const profile = await createUserProfile(userId, displayName, email, 'superadmin');
  profile.approvalLevel = 'chief_rabbi';
  profile.isVerified = true;
  profile.credentials = ['מייסד האפליקציה'];
  
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILES);
  const profiles: Record<string, UserProfile> = stored ? JSON.parse(stored) : {};
  profiles[userId] = profile;
  await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(profiles));
  
  console.log(`✅ SuperAdmin created: ${displayName}`);
  return profile;
}

// ============================================
// FIREBASE FUNCTIONS (for future)
// ============================================

/*
// Set custom claims for user (Firebase Auth)
export async function setUserClaims(
  adminUserId: string,
  targetUserId: string,
  role: UserRole
): Promise<void> {
  const canManage = await hasPermission(adminUserId, 'canManageUsers');
  if (!canManage) {
    throw new Error('No permission to manage users');
  }
  
  // This requires Firebase Admin SDK (server-side)
  // Call Cloud Function to set custom claims:
  const { ROLE_PERMISSIONS } = await import('@/types/questions');
  const permissions = ROLE_PERMISSIONS[role];
  
  // Cloud Function will set:
  // await admin.auth().setCustomUserClaims(targetUserId, {
  //   role,
  //   permissions
  // });
  
  console.log(`Custom claims set for user: ${targetUserId}`);
}
*/
