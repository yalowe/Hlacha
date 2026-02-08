/**
 * Admin Testing Screen
 * דף בדיקה למערכת הרשאות
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getDeviceId } from '@/utils/deviceId';
import {
  getUserProfile,
  getUserPermissions,
  createUserProfile,
  grantRole,
  initializeFirstSuperAdmin,
  getAuditLogs,
  getPlatformStats
} from '@/utils/adminManager';
import type { UserProfile, UserPermissions, UserRole } from '@/types/questions';

export default function AdminTestingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const deviceId = await getDeviceId();
      setUserId(deviceId);
      
      // טען פרופיל
      const userProfile = await getUserProfile(deviceId);
      setProfile(userProfile);
      
      // טען הרשאות
      const userPerms = await getUserPermissions(deviceId);
      setPermissions(userPerms);
      
      // טען סטטיסטיקות
      const platformStats = await getPlatformStats();
      setStats(platformStats);
      
      // טען logs
      const logs = await getAuditLogs({ limit: 10 });
      setAuditLogs(logs);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleInitializeAdmin() {
    if (!userId) return;
    
    Alert.alert(
      '🔐 אתחול SuperAdmin',
      'האם להגדיר את המשתמש הנוכחי כ-SuperAdmin?\n(רק לבדיקות!)',
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'אישור',
          style: 'destructive',
          onPress: async () => {
            try {
              await initializeFirstSuperAdmin(
                userId,
                'מפתח ראשי',
                'dev@test.com'
              );
              Alert.alert('✅ הצלחה', 'אתה עכשיו SuperAdmin!');
              await loadData();
            } catch (error: any) {
              Alert.alert('❌ שגיאה', error.message);
            }
          }
        }
      ]
    );
  }

  async function handleCreateProfile() {
    if (!userId) return;
    
    try {
      await createUserProfile(userId, 'משתמש בדיקה', 'test@example.com', 'registered');
      Alert.alert('✅ הצלחה', 'פרופיל נוצר בהצלחה');
      await loadData();
    } catch (error: any) {
      Alert.alert('❌ שגיאה', error.message);
    }
  }

  async function handleChangeRole(newRole: UserRole) {
    if (!userId || !profile) return;
    
    Alert.alert(
      '🔄 שינוי תפקיד',
      `להעלות את ${profile.displayName} ל-${newRole}?`,
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'אישור',
          onPress: async () => {
            try {
              await grantRole(userId, userId, newRole, 'בדיקה');
              Alert.alert('✅ הצלחה', `התפקיד שונה ל-${newRole}`);
              await loadData();
            } catch (error: any) {
              Alert.alert('❌ שגיאה', error.message);
            }
          }
        }
      ]
    );
  }

  if (loading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background.base }]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-forward" size={24} color={colors.text.primary} />
          </Pressable>
          <ThemedText style={[styles.title, { color: colors.text.primary }]}>
            🔐 מערכת הרשאות - בדיקה
          </ThemedText>
        </View>

        {/* Device ID */}
        <View style={[styles.card, { backgroundColor: colors.surface.card }]}>
          <ThemedText style={[styles.cardTitle, { color: colors.text.primary }]}>
            🆔 זיהוי מכשיר
          </ThemedText>
          <ThemedText style={[styles.deviceId, { color: colors.text.secondary }]}>
            {userId || 'טוען...'}
          </ThemedText>
        </View>

        {/* Current Profile */}
        {profile ? (
          <View style={[styles.card, { backgroundColor: colors.surface.card }]}>
            <ThemedText style={[styles.cardTitle, { color: colors.text.primary }]}>
              👤 פרופיל משתמש
            </ThemedText>
            <View style={styles.profileInfo}>
              <InfoRow label="שם" value={profile.displayName} colors={colors} />
              <InfoRow label="אימייל" value={profile.email || 'לא הוגדר'} colors={colors} />
              <InfoRow 
                label="תפקיד" 
                value={profile.role} 
                colors={colors}
                badge={getRoleBadge(profile.role)}
              />
              <InfoRow label="רמת אישור" value={profile.approvalLevel} colors={colors} />
              <InfoRow label="מאומת" value={profile.isVerified ? '✅ כן' : '❌ לא'} colors={colors} />
            </View>

            {/* Role Quick Actions */}
            <View style={styles.roleActions}>
              <ThemedText style={[styles.sectionLabel, { color: colors.text.secondary }]}>
                החלף תפקיד (בדיקה):
              </ThemedText>
              <View style={styles.roleButtons}>
                {(['registered', 'trusted', 'scholar', 'rabbi', 'moderator', 'superadmin'] as UserRole[]).map(role => (
                  <Pressable
                    key={role}
                    onPress={() => handleChangeRole(role)}
                    style={[
                      styles.roleButton,
                      { 
                        backgroundColor: profile.role === role 
                          ? colors.primary.main 
                          : colors.surface.card 
                      }
                    ]}
                  >
                    <ThemedText style={[
                      styles.roleButtonText,
                      { color: profile.role === role ? '#FFFFFF' : colors.text.primary }
                    ]}>
                      {getRoleLabel(role)}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: colors.surface.card }]}>
            <ThemedText style={[styles.cardTitle, { color: colors.text.primary }]}>
              ⚠️ אין פרופיל
            </ThemedText>
            <ThemedText style={[styles.description, { color: colors.text.secondary }]}>
              משתמש זה עדיין לא נרשם במערכת
            </ThemedText>
            <Pressable
              onPress={handleCreateProfile}
              style={[styles.button, { backgroundColor: colors.primary.main }]}
            >
              <ThemedText style={styles.buttonText}>צור פרופיל</ThemedText>
            </Pressable>
          </View>
        )}

        {/* Permissions */}
        {permissions && (
          <View style={[styles.card, { backgroundColor: colors.surface.card }]}>
            <ThemedText style={[styles.cardTitle, { color: colors.text.primary }]}>
              🔓 הרשאות
            </ThemedText>
            <View style={styles.permissionsList}>
              <PermissionRow 
                icon="chatbubble" 
                label="שאילת שאלות" 
                value={permissions.canAskQuestions} 
                colors={colors}
              />
              <PermissionRow 
                icon="create" 
                label="מתן תשובות" 
                value={permissions.canAnswerQuestions} 
                colors={colors}
              />
              <PermissionRow 
                icon="checkmark-circle" 
                label="אישור תשובות" 
                value={permissions.canApproveAnswers} 
                colors={colors}
              />
              <PermissionRow 
                icon="pencil" 
                label="עריכת תשובות" 
                value={permissions.canEditAnswers} 
                colors={colors}
              />
              <PermissionRow 
                icon="trash" 
                label="מחיקת תוכן" 
                value={permissions.canDeleteContent} 
                colors={colors}
              />
              <PermissionRow 
                icon="people" 
                label="ניהול משתמשים" 
                value={permissions.canManageUsers} 
                colors={colors}
              />
              <PermissionRow 
                icon="shield-checkmark" 
                label="מינוי SuperAdmin" 
                value={permissions.canGrantSuperAdmin} 
                colors={colors}
              />
              <PermissionRow 
                icon="stats-chart" 
                label="צפייה בסטטיסטיקות" 
                value={permissions.canViewAnalytics} 
                colors={colors}
              />
              <View style={styles.weightBadge}>
                <ThemedText style={[styles.weightLabel, { color: colors.text.secondary }]}>
                  משקל אישור:
                </ThemedText>
                <ThemedText style={[styles.weightValue, { color: colors.primary.main }]}>
                  {permissions.approvalWeight}
                </ThemedText>
              </View>
            </View>
          </View>
        )}

        {/* Platform Stats */}
        {stats && (
          <View style={[styles.card, { backgroundColor: colors.surface.card }]}>
            <ThemedText style={[styles.cardTitle, { color: colors.text.primary }]}>
              📊 סטטיסטיקות מערכת
            </ThemedText>
            <InfoRow label="סה'כ משתמשים" value={stats.totalUsers.toString()} colors={colors} />
            <ThemedText style={[styles.sectionLabel, { color: colors.text.secondary, marginTop: 12 }]}>
              לפי תפקיד:
            </ThemedText>
            {Object.entries(stats.usersByRole).map(([role, count]: [string, any]) => (
              count > 0 && (
                <InfoRow 
                  key={role} 
                  label={getRoleLabel(role as UserRole)} 
                  value={count.toString()} 
                  colors={colors}
                  small
                />
              )
            ))}
          </View>
        )}

        {/* Audit Log */}
        {auditLogs.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.surface.card }]}>
            <ThemedText style={[styles.cardTitle, { color: colors.text.primary }]}>
              📝 יומן ביקורת (אחרונים)
            </ThemedText>
            {auditLogs.map((log) => (
              <View key={log.id} style={[styles.logItem, { borderBottomColor: colors.border.default }]}>
                <View style={styles.logHeader}>
                  <ThemedText style={[styles.logAction, { color: colors.primary.main }]}>
                    {getActionLabel(log.action)}
                  </ThemedText>
                  <ThemedText style={[styles.logTime, { color: colors.text.secondary }]}>
                    {new Date(log.timestamp).toLocaleTimeString('he-IL')}
                  </ThemedText>
                </View>
                <ThemedText style={[styles.logDetail, { color: colors.text.secondary }]}>
                  {log.performedByName} ({log.performedByRole})
                </ThemedText>
                {log.reason && (
                  <ThemedText style={[styles.logReason, { color: colors.text.secondary }]}>
                    סיבה: {log.reason}
                  </ThemedText>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={[styles.card, { backgroundColor: colors.surface.card }]}>
          <ThemedText style={[styles.cardTitle, { color: colors.text.primary }]}>
            ⚡ פעולות מהירות
          </ThemedText>
          
          {!profile && (
            <Pressable
              onPress={handleCreateProfile}
              style={[styles.actionButton, { backgroundColor: colors.primary.light }]}
            >
              <Ionicons name="person-add" size={20} color={colors.primary.dark} />
              <ThemedText style={[styles.actionButtonText, { color: colors.primary.dark }]}>
                צור פרופיל
              </ThemedText>
            </Pressable>
          )}
          
          <Pressable
            onPress={handleInitializeAdmin}
            style={[styles.actionButton, { backgroundColor: colors.semantic.warning + '20' }]}
          >
            <Ionicons name="shield-checkmark" size={20} color={colors.semantic.warning} />
            <ThemedText style={[styles.actionButtonText, { color: colors.semantic.warning }]}>
              הגדר כ-SuperAdmin
            </ThemedText>
          </Pressable>
          
          <Pressable
            onPress={loadData}
            style={[styles.actionButton, { backgroundColor: colors.accent.bronze + '20' }]}
          >
            <Ionicons name="refresh" size={20} color={colors.accent.bronze} />
            <ThemedText style={[styles.actionButtonText, { color: colors.accent.bronze }]}>
              רענן נתונים
            </ThemedText>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

// Helper Components
function InfoRow({ 
  label, 
  value, 
  colors, 
  badge,
  small = false 
}: { 
  label: string; 
  value: string; 
  colors: any; 
  badge?: string;
  small?: boolean;
}) {
  return (
    <View style={[styles.infoRow, small && styles.infoRowSmall]}>
      <ThemedText style={[styles.infoLabel, { color: colors.text.secondary }, small && styles.smallText]}>
        {label}:
      </ThemedText>
      <View style={styles.infoValueContainer}>
        <ThemedText style={[styles.infoValue, { color: colors.text.primary }, small && styles.smallText]}>
          {value}
        </ThemedText>
        {badge && (
          <View style={[styles.badge, { backgroundColor: colors.primary.light }]}>
            <ThemedText style={[styles.badgeText, { color: colors.primary.dark }]}>
              {badge}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

function PermissionRow({ 
  icon, 
  label, 
  value, 
  colors 
}: { 
  icon: any; 
  label: string; 
  value: boolean; 
  colors: any;
}) {
  return (
    <View style={styles.permissionRow}>
      <View style={styles.permissionLeft}>
        <Ionicons name={icon} size={18} color={colors.text.secondary} />
        <ThemedText style={[styles.permissionLabel, { color: colors.text.primary }]}>
          {label}
        </ThemedText>
      </View>
      <Ionicons 
        name={value ? 'checkmark-circle' : 'close-circle'} 
        size={24} 
        color={value ? colors.semantic.success : colors.text.disabled} 
      />
    </View>
  );
}

// Helper Functions
function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    anonymous: 'אנונימי',
    registered: 'רשום',
    trusted: 'אמין',
    scholar: 'ת"ח',
    rabbi: 'רב',
    moderator: 'מנהל',
    superadmin: 'מנהל על'
  };
  return labels[role];
}

function getRoleBadge(role: UserRole): string {
  const badges: Record<UserRole, string> = {
    anonymous: '0',
    registered: '1',
    trusted: '2',
    scholar: '3',
    rabbi: '4',
    moderator: '5',
    superadmin: '6'
  };
  return badges[role];
}

function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    create: '🆕 יצירה',
    edit: '✏️ עריכה',
    delete: '🗑️ מחיקה',
    approve: '✅ אישור',
    reject: '❌ דחייה',
    role_change: '🔄 שינוי תפקיד'
  };
  return labels[action] || action;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  card: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  deviceId: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  profileInfo: {
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  infoRowSmall: {
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoValueContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoValue: {
    fontSize: 14,
  },
  smallText: {
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginBottom: spacing.md,
  },
  button: {
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  roleActions: {
    marginTop: spacing.lg,
  },
  sectionLabel: {
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  roleButtons: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  roleButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  permissionsList: {
    gap: spacing.sm,
  },
  permissionRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  permissionLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.sm,
  },
  permissionLabel: {
    fontSize: 14,
  },
  weightBadge: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  weightLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  weightValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    marginBottom: spacing.sm,
  },
  logHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  logAction: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  logTime: {
    fontSize: 12,
  },
  logDetail: {
    fontSize: 12,
    marginBottom: 2,
  },
  logReason: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  actionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
