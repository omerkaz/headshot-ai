import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const expoProjectId = process.env.EXPO_PROJECT_ID ?? '18adc0d0-eb1d-11e9-8009-d524ed5cc4a7';
  const expoConfig: ExpoConfig = {
    ...config,
    slug: process.env.EXPO_PUBLIC_APP_SLUG ?? 'professional-headshot-generator',
    name: process.env.EXPO_PUBLIC_APP_NAME ?? 'Professional Headshot Generator',
    ios: {
      ...config.ios,
      bundleIdentifier: process.env.EXPO_PUBLIC_IOS_BUNDLE_ID ?? 'omerkaz.headshot',
    },
    android: {
      ...config.android,
      package: process.env.EXPO_PUBLIC_ANDROID_PACKAGE ?? 'com.omerkaz.headshot',
    },
    web: {
      ...config.web,
    },
    updates: {
      url: `https://u.expo.dev/${expoProjectId}`,
    },
    extra: {
      ...config.extra,
      eas: { projectId: expoProjectId },
      env: process.env.NODE_ENV ?? 'development',
      // Supabase
      SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      // Fal.ai
      FAL_API_KEY: process.env.EXPO_PUBLIC_FAL_API_KEY,
    },
    plugins: [
      'expo-router',
      'expo-asset',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#101212',
          },
          image: './assets/images/logo-lg.png',
          imageWidth: 200,
          resizeMode: 'contain',
        },
      ],
      [
        'expo-font',
        {
          fonts: [
            './assets/fonts/OpenSans-Bold.ttf',
            './assets/fonts/OpenSans-BoldItalic.ttf',
            './assets/fonts/OpenSans-Italic.ttf',
            './assets/fonts/OpenSans-Regular.ttf',
            './assets/fonts/OpenSans-Semibold.ttf',
            './assets/fonts/OpenSans-SemiboldItalic.ttf',
          ],
        },
      ],
    ],
  };
  // console.log('[##] expo config', expoConfig);
  return expoConfig;
};
