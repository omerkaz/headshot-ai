import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  // Log environment variables (safely)
  console.log('Environment Config:', {
    SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL ? '**exists**' : '**missing**',
    SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? '**exists**' : '**missing**',
    GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ? '**exists**' : '**missing**',
    BACKEND_API_URL: process.env.EXPO_PUBLIC_BACKEND_API_URL ? '**exists**' : '**missing**',
    REVENUECAT_API_KEY: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ? '**exists**' : '**missing**',
  });

  const expoProjectId = process.env.EXPO_PROJECT_ID ?? '4d0cbd3e-6b2d-47e4-87c3-abdad72484be';
  const expoConfig: ExpoConfig = {
    ...config,
    slug: process.env.EXPO_PUBLIC_APP_SLUG ?? 'headshotai', 
    name: process.env.EXPO_PUBLIC_APP_NAME ?? 'HeadshotAI',
    scheme: 'headshotai',
    ios: {
      ...config.ios,
      bundleIdentifier: process.env.EXPO_PUBLIC_IOS_BUNDLE_ID ?? 'com.withouteffort.headshotai',
    },
    android: {
      ...config.android,
      package: process.env.EXPO_PUBLIC_ANDROID_PACKAGE ?? 'com.withouteffort.headshotai',
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
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      // Google
      EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      // Backend
      EXPO_PUBLIC_BACKEND_API_URL: process.env.EXPO_PUBLIC_BACKEND_API_URL,
      // RevenueCat
      EXPO_PUBLIC_REVENUECAT_API_KEY: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY,
    },
    plugins: [
      'expo-router',
      'expo-asset',
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.944022490155-ergkv14r7tt585kvvjmg4d3b6sucagp7"
        }
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#101212',
          },
          image: './assets/images/logo-lg.png',
          imageWidth: 400,
          imageHeight: 400,
          resizeMode: 'contain',
        },
      ],
    ],
  };
  // console.log('[##] expo config', expoConfig);
  return expoConfig;
};
