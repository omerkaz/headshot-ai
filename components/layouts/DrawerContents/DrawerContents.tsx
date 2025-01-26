import useColorScheme from '@/hooks/useColorScheme';
import { colors } from '@/theme';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

export default function DrawerContents() {
  const { isDark } = useColorScheme();
  return (
    <SafeAreaView>
      <View style={[styles.root, isDark && { backgroundColor: colors.common.black }]}>
        <Text style={{ color: isDark ? colors.common.white : colors.common.black }}>
          Side Menu Contents
        </Text>
      </View>
    </SafeAreaView>
  );
}
