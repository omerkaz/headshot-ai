import useColorScheme from '@/hooks/useColorScheme';
import { supabase } from '@/services/initSupabase';
import { colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Animated,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
interface CreditHistory {
  id: string;
  action: string;
  credits: number;
  date: string;
}

interface SettingItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  route: string;
}

export default function Profile() {
  const router = useRouter();
  const { isDark } = useColorScheme();
  const [credits] = useState(100);
  const [loading, setLoading] = useState(false);
  const [history] = useState<CreditHistory[]>([
    {
      id: '1',
      action: 'Generated Headshot',
      credits: -10,
      date: '2024-03-20',
    },
    {
      id: '2',
      action: 'Purchased Credits',
      credits: 50,
      date: '2024-03-19',
    },
    {
      id: '3',
      action: 'Welcome Bonus',
      credits: 20,
      date: '2024-03-18',
    },
  ]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        alert(error.message);
      } else {
        router.replace('/(auth)/login');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: colors.background }]}>
      <View style={[styles.container, isDark && { backgroundColor: colors.background }]}>
        <Animated.ScrollView
          contentContainerStyle={[styles.scrollContent]}
          scrollEventThrottle={16}>
          <View style={styles.creditsCard}>
            <BlurView
              intensity={isDark ? 60 : 80}
              tint={isDark ? 'dark' : 'light'}
              style={[
                styles.creditsCardInner,
                isDark && { backgroundColor: 'rgba(9, 72, 74, 0.7)' },
              ]}>
              <Text style={[styles.creditsTitle, isDark && { color: colors.grey[500] }]}>
                AVAILABLE CREDITS
              </Text>
              <Text style={[styles.creditsAmount, isDark && { color: colors.text }]}>
                {credits}
              </Text>
              <Text style={[styles.creditsSubtext, isDark && { color: colors.grey[500] }]}>
                Use credits to generate professional headshots
              </Text>
            </BlurView>
          </View>
          <View style={[styles.content, isDark && { backgroundColor: colors.background }]}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDark && { color: colors.grey[500] }]}>
                SETTINGS
              </Text>
              {(
                [
                  {
                    icon: 'card-outline',
                    title: 'Purchase Credits',
                    subtitle: 'Buy more credits to generate headshots',
                    route: '/profile/purchase-credits',
                  },
                  {
                    icon: 'settings-outline',
                    title: 'Preferences',
                    subtitle: 'Customize your app experience',
                    route: '/profile/preferences',
                  },
                  {
                    icon: 'help-circle-outline',
                    title: 'Help & Support',
                    subtitle: 'Get assistance and FAQs',
                    route: '/profile/help',
                  },
                ] as SettingItem[]
              ).map(setting => (
                <TouchableOpacity
                  key={setting.route}
                  style={[styles.settingsButton, isDark && { backgroundColor: colors.accent1 }]}
                  onPress={() => router.push(setting.route)}>
                  <View style={styles.settingsIcon}>
                    <Ionicons name={setting.icon} size={24} color={colors.text} />
                  </View>
                  <View>
                    <Text style={[styles.settingsText, isDark && { color: colors.text }]}>
                      {setting.title}
                    </Text>
                    <Text style={[styles.settingsSubtext, isDark && { color: colors.grey[500] }]}>
                      {setting.subtitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[
                  styles.settingsButton,
                  isDark && { backgroundColor: colors.accent1 },
                  styles.logoutButton,
                ]}
                onPress={handleLogout}
                disabled={loading}>
                <View style={[styles.settingsIcon, { backgroundColor: colors.status.error }]}>
                  <Ionicons name="log-out-outline" size={24} color={colors.common.white} />
                </View>
                <View>
                  <Text style={[styles.settingsText, isDark && { color: colors.text }]}>
                    {loading ? 'Logging out...' : 'Logout'}
                  </Text>
                  <Text style={[styles.settingsSubtext, isDark && { color: colors.grey[500] }]}>
                    Sign out of your account
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDark && { color: colors.grey[500] }]}>
                CREDIT HISTORY
              </Text>
              {history.map(item => (
                <View
                  key={item.id}
                  style={[styles.historyItem, isDark && { backgroundColor: colors.accent1 }]}>
                  <View>
                    <Text style={[styles.actionText, isDark && { color: colors.text }]}>
                      {item.action}
                    </Text>
                    <Text style={[styles.dateText, isDark && { color: colors.grey[500] }]}>
                      {item.date}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.creditChange,
                      { color: item.credits > 0 ? colors.status.success : colors.status.error },
                    ]}>
                    {item.credits > 0 ? '+' : ''}
                    {item.credits}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 16,
  },
  creditsCard: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.accent2,
    backgroundColor: colors.accent1,
  },
  creditsCardInner: {
    padding: 25,
    backgroundColor: colors.accent1,
    borderRadius: 12,
  },
  creditsTitle: {
    fontSize: 18,
    color: colors.grey[500],
    marginBottom: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  creditsAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 5,
    letterSpacing: -1,
  },
  creditsSubtext: {
    fontSize: 14,
    color: colors.grey[500],
    letterSpacing: 0.2,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: colors.common.white,
    borderRadius: 15,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.common.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  dateText: {
    fontSize: 14,
    color: colors.grey[500],
    letterSpacing: 0.1,
  },
  creditChange: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: colors.common.white,
    borderRadius: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.common.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.accent1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  settingsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: 0.2,
  },
  settingsSubtext: {
    fontSize: 14,
    color: colors.grey[500],
    marginTop: 2,
    letterSpacing: 0.1,
  },
  logoutButton: {
    marginTop: 20,
  },
});
