import useColorScheme from '@/hooks/useColorScheme';
import { colors } from '@/theme';
import { SimpleLineIcons } from '@expo/vector-icons';

export default function NavigationHeaderLeft({ onPress }: { onPress: () => void }) {
  const { isDark } = useColorScheme();
  return (
    <SimpleLineIcons.Button
      name="menu"
      size={24}
      color={isDark ? colors.common.white : colors.common.black}
      backgroundColor={colors.common.transparent}
      onPress={onPress}
    />
  );
}
