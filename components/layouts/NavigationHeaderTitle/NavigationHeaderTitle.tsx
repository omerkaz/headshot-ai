import { colors } from '@/theme';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.common.transparent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.common.transparent,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.common.black,
  },
});

export default   function NavigationHeaderTitle() {
  const route = useRoute();
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{route.name}</Text>
    </View>
  );
}
