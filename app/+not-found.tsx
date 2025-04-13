import { colors } from '@/theme';
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grey[50],
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontFamily: 'NunitoBold',
    color: colors.grey[900],
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito',
    color: colors.grey[600],
    textAlign: 'center',
    marginBottom: 32,
  },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: colors.accent1,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  linkText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'NunitoSemiBold',
  },
});

export default function NotFoundScreen() {
  return (
    <View style={styles.root}>
      <Stack.Screen options={{ title: 'Page Not Found' }} />
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <Text style={styles.emoji}>🤔</Text>
      </Animated.View>
      <Animated.View style={styles.titleContainer} entering={FadeInDown.delay(200).springify()}>
        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.subtitle}>
          Oops! It seems like the page you're looking for doesn't exist.
        </Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(300).springify()}>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Back to Home</Text>
        </Link>
      </Animated.View>
    </View>
  );
}
