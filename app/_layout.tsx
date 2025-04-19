import { queryClient } from '@/services/queryClient';
import config from '@/utils/config';
import {
  Nunito_200ExtraLight,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  useFonts,
} from '@expo-google-fonts/nunito';
import { QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Initialize RevenueCat outside of the component
const initializeRevenueCat = () => {
  Purchases.setLogLevel('VERBOSE' as LOG_LEVEL);

  if (Platform.OS === 'ios') {
    Purchases.configure({ apiKey: config.revenuecat.apiKey });
  } else if (Platform.OS === 'android') {
    //  Purchases.configure({apiKey: <revenuecat_project_google_api_key>});
    // // OR: if building for Amazon, be sure to follow the installation instructions then:
    //  Purchases.configure({ apiKey: <revenuecat_project_amazon_api_key>, useAmazon: true });
    console.log('ANDROID');
  }
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    NunitoExtraLight: Nunito_200ExtraLight,
    NunitoLight: Nunito_300Light,
    Nunito: Nunito_400Regular,
    NunitoMedium: Nunito_500Medium,
    NunitoSemiBold: Nunito_600SemiBold,
    NunitoBold: Nunito_700Bold,
    NunitoExtraBold: Nunito_800ExtraBold,
    NunitoBlack: Nunito_900Black,
  });

  useEffect(() => {
    // Initialize RevenueCat only once when the component mounts
    initializeRevenueCat();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash screen once fonts are loaded or if there's an error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't render anything until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
