import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  // Log environment variables (safely)
  console.log('Environment Config:', {
    SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL ? '**exists**' : '**missing**',
    SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? '**exists**' : '**missing**',
  });

  const expoProjectId = process.env.EXPO_PROJECT_ID ?? '4d0cbd3e-6b2d-47e4-87c3-abdad72484be';
  const expoConfig: ExpoConfig = {
    ...config,
    slug: process.env.EXPO_PUBLIC_APP_SLUG ?? 'headshotai', 
    name: process.env.EXPO_PUBLIC_APP_NAME ?? 'HeadshotAI',
    scheme: 'headshotai',
    ios: {
      ...config.ios,
      bundleIdentifier: process.env.EXPO_PUBLIC_IOS_BUNDLE_ID ?? 'omerkaz.headshotai',
    },
    android: {
      ...config.android,
      package: process.env.EXPO_PUBLIC_ANDROID_PACKAGE ?? 'com.omerkaz.headshotai',
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
