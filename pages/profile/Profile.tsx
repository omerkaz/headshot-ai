import useColorScheme from '@/hooks/useColorScheme';
import { supabase } from '@/services/initSupabase';
import { colors } from '@/theme';
import { typography } from '@/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    backgroundColor: colors.common.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  creditsCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  creditsCardInner: {
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
  },
  creditsTitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.semiBold,
    color: colors.grey[600],
    marginBottom: 8,
  },
  creditsAmount: {
    fontSize: typography.sizes['4xl'],
    fontFamily: typography.fonts.bold,
    color: colors.common.black,
    marginBottom: 8,
  },
  creditsSubtext: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.grey[600],
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: colors.common.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.semiBold,
    color: colors.grey[600],
    marginHorizontal: 16,
    marginBottom: 8,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey[100],
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brand.midBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingsText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.semiBold,
    color: colors.common.black,
    marginBottom: 4,
  },
  settingsSubtext: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.grey[600],
  },
  logoutButton: {
    marginTop: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.grey[100],
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
  },
  actionText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.medium,
    color: colors.common.black,
    marginBottom: 4,
  },
  dateText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.grey[600],
  },
  creditChange: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
  },
});
