/**
 * Device ID Manager
 * Generates and persists a unique device identifier for anonymous users
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = '@kitzur_device_id';

// Generate a unique device ID
function generateDeviceId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const random2 = Math.random().toString(36).substring(2, 15);
  return `device_${timestamp}_${random}${random2}`;
}

// Get or create device ID
export async function getDeviceId(): Promise<string> {
  try {
    // Try to get existing device ID
    const existingId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    
    if (existingId) {
      return existingId;
    }
    
    // Generate new device ID
    const newId = generateDeviceId();
    await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
    
    console.log('📱 Created new device ID:', newId);
    return newId;
  } catch (error) {
    console.error('Failed to get/create device ID:', error);
    // Fallback to session-only ID (won't persist)
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Reset device ID (for testing or user request)
export async function resetDeviceId(): Promise<string> {
  try {
    const newId = generateDeviceId();
    await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
    console.log('🔄 Reset device ID:', newId);
    return newId;
  } catch (error) {
    console.error('Failed to reset device ID:', error);
    return generateDeviceId();
  }
}
