import GradientButton from '@/components/elements/GradientButton';
import useColorScheme from '@/hooks/useColorScheme';
import { colors, fonts } from '@/theme';
import config from '@/utils/config';
import { windowWidth } from '@/utils/deviceInfo';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.openSan.bold,
    color: colors.common.black,
    marginTop: 16,
    marginBottom: 32,
    width: '100%',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.openSan.regular,
    width: '100%',
  },
  buttonTitle: {
    fontSize: 16,
    color: colors.common.white,
    textAlign: 'center',
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    width: windowWidth / 2,
    backgroundColor: colors.secondary.main,
    marginBottom: 40,
  },
  envContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  envTitle: {
    fontSize: 14,
    fontFamily: fonts.openSan.bold,
    color: colors.common.black,
  },
  envValue: {
    fontSize: 14,
    fontFamily: fonts.openSan.regular,
    color: colors.common.black,
  },
});

type WelcomeBottomSheetContentsProps = {
  onClose: () => void;
};

export default function BottomSheetContents({ onClose }: WelcomeBottomSheetContentsProps) {
  const { isDark } = useColorScheme();
  return (
      <View style={[styles.root, isDark && { backgroundColor: colors.common.black }]}>
      <Text style={[styles.title, isDark && { color: colors.text.secondary }]}>🎉 Congratulations! </Text>
      <Text style={[styles.subtitle, { marginBottom: 32 }, isDark && { color: colors.text.secondary }]}>
        You have successfully spin up the React Native Boilerplate project in the
        <Text style={{ fontFamily: fonts.openSan.bold }}>{` ${config.env} `}</Text>environment 🚀
      </Text>
      <Text style={[styles.subtitle, { marginBottom: 8 }, isDark && { color: colors.text.secondary }]}>
        Injected Environmental Variables:
      </Text>
      {Object.entries(config).map(([key, value]) => (
        <View key={key} style={styles.envContainer}>
          <Text style={[styles.envTitle, isDark && { color: colors.text.secondary }]}>{`✅ ${key}: `}</Text>
          <Text style={[styles.envValue, isDark && { color: colors.text.secondary }]}>{value}</Text>
        </View>
      ))}
      <Text style={[styles.subtitle, { marginVertical: 32 }, isDark && { color: colors.text.secondary }]}>
        {`Your foundational setup is now complete, paving the way for seamless development and innovation. \n\nHappy coding!`}
      </Text>
      <GradientButton
        title="OK"
        titleStyle={[styles.buttonTitle, isDark && { color: colors.common.white }]}
        style={styles.button}
        gradientBackgroundProps={{
          colors: [colors.primary.main, colors.secondary.main],
          start: { x: 0, y: 1 },
          end: { x: 0.8, y: 0 },
        }}
        onPress={onClose}
      />
    </View>
  );
}
