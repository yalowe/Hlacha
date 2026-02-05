/**
 * Admin Authentication System
 * Simple PIN-based admin access for MVP
 * 
 * Flow:
 * 1. User enters secret admin code
 * 2. If correct, their Device ID is added to SuperAdmin list
 * 3. They can now grant roles to others
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDeviceId } from './deviceId';

const STORAGE_KEYS = {
  SUPERADMIN_LIST: '@kitzur_superadmin_list',
  ADMIN_CODE: '@kitzur_admin_secret_code'
};

// ⚠️ CHANGE THIS to your own secret code!
// In production, this should be in environment variables
const DEFAULT_ADMIN_CODE = 'KITZUR2026';

/**
 * Verify admin code and grant SuperAdmin access
 */
export async function verifyAdminCode(code: string): Promise<boolean> {
  try {
    // Check against stored code or default
    const storedCode = await AsyncStorage.getItem(STORAGE_KEYS.ADMIN_CODE);
    const validCode = storedCode || DEFAULT_ADMIN_CODE;
    
    if (code !== validCode) {
      return false;
    }
    
    // Add current device to SuperAdmin list
    const deviceId = await getDeviceId();
    await addSuperAdmin(deviceId);
    
    console.log('✅ SuperAdmin access granted for device:', deviceId);
    return true;
  } catch (error) {
    console.error('Failed to verify admin code:', error);
    return false;
  }
}

/**
 * Add device ID to SuperAdmin list
 */
async function addSuperAdmin(deviceId: string): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.SUPERADMIN_LIST);
    const list: string[] = stored ? JSON.parse(stored) : [];
    
    if (!list.includes(deviceId)) {
      list.push(deviceId);
      await AsyncStorage.setItem(STORAGE_KEYS.SUPERADMIN_LIST, JSON.stringify(list));
    }
  } catch (error) {
    console.error('Failed to add SuperAdmin:', error);
    throw error;
  }
}

/**
 * Check if current device is SuperAdmin
 */
export async function isSuperAdmin(): Promise<boolean> {
  try {
    const deviceId = await getDeviceId();
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.SUPERADMIN_LIST);
    const list: string[] = stored ? JSON.parse(stored) : [];
    
    return list.includes(deviceId);
  } catch (error) {
    console.error('Failed to check SuperAdmin status:', error);
    return false;
  }
}

/**
 * Get all SuperAdmin device IDs
 */
export async function getAllSuperAdmins(): Promise<string[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.SUPERADMIN_LIST);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get SuperAdmins:', error);
    return [];
  }
}

/**
 * Remove SuperAdmin access (for device)
 */
export async function removeSuperAdmin(deviceId: string): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.SUPERADMIN_LIST);
    const list: string[] = stored ? JSON.parse(stored) : [];
    
    const filtered = list.filter(id => id !== deviceId);
    await AsyncStorage.setItem(STORAGE_KEYS.SUPERADMIN_LIST, JSON.stringify(filtered));
    
    console.log('✅ SuperAdmin access revoked for device:', deviceId);
  } catch (error) {
    console.error('Failed to remove SuperAdmin:', error);
    throw error;
  }
}

/**
 * Change admin code (only SuperAdmins can do this)
 */
export async function changeAdminCode(
  currentCode: string,
  newCode: string
): Promise<boolean> {
  try {
    // Verify current code
    const storedCode = await AsyncStorage.getItem(STORAGE_KEYS.ADMIN_CODE);
    const validCode = storedCode || DEFAULT_ADMIN_CODE;
    
    if (currentCode !== validCode) {
      return false;
    }
    
    // Verify caller is SuperAdmin
    const isAdmin = await isSuperAdmin();
    if (!isAdmin) {
      throw new Error('רק SuperAdmin יכול לשנות את הקוד');
    }
    
    // Set new code
    await AsyncStorage.setItem(STORAGE_KEYS.ADMIN_CODE, newCode);
    console.log('✅ Admin code changed successfully');
    return true;
  } catch (error) {
    console.error('Failed to change admin code:', error);
    return false;
  }
}

/**
 * Reset everything (for testing)
 */
export async function resetAdminSystem(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.SUPERADMIN_LIST);
  await AsyncStorage.removeItem(STORAGE_KEYS.ADMIN_CODE);
  console.log('⚠️ Admin system reset');
}
