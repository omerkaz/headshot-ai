import Button from '@/components/elements/Button';
import useColorScheme from '@/hooks/useColorScheme';
import { colors } from '@/theme';
import { useRouter } from 'expo-router';
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
    backgroundColor: colors.secondary.main,
    height: 44,
    width: '50%',
  },
});

export default function Home() {
  const router = useRouter();
  const { isDark } = useColorScheme();
  return (
    <View style={[styles.root, isDark && { backgroundColor: colors.common.black }]}>
      <Text style={[styles.title, isDark && { color: colors.text.secondary }]}>Home</Text>
      <Button
        title="Go to Details"
        titleStyle={[styles.buttonTitle, isDark && { color: colors.common.white }]}
        style={styles.button}
        onPress={() =>
          router.push({ pathname: '(main)/(tabs)/home/details', params: { from: 'Home' } })
        }
      />
    </View>
  );
}
