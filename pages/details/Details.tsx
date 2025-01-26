import GradientButton from '@/components/elements/GradientButton';
import useColorScheme from '@/hooks/useColorScheme';
import { colors } from '@/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.common.white,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonTitle: {
    fontSize: 16,
    color: colors.common.white,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
    height: 44,
    width: '50%',
  },
});

export default function Details() {
  const router = useRouter();
  const { isDark } = useColorScheme();
  const { from } = useLocalSearchParams();
  return (
    <View style={[styles.root, isDark && { backgroundColor: colors.common.black }]}>
      <Text
        style={[styles.title, isDark && { color: colors.text.secondary }]}>{`Details (from ${from})`}</Text>
      <GradientButton
        title="Go back to Home"
          titleStyle={[styles.buttonTitle, isDark && { color: colors.common.white }]}
        style={styles.button}
        gradientBackgroundProps={{
          colors: [colors.primary.main, colors.secondary.main],
          start: { x: 0, y: 1 },
          end: { x: 0.8, y: 0 },
        }}
        onPress={() => router.back()}
      />
    </View>
  );
}
