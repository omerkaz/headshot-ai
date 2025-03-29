import { Redirect } from 'expo-router';

// This component now only runs if the user is authenticated (checked by _layout.tsx)
export default function TabsIndexScreen() {
  // Redirect to the default screen within the tabs group
  return <Redirect href="(main)/(tabs)/dashboard" />;
  // Note: Ensure your actual dashboard screen is correctly mapped to this route
  // (e.g., using a file like app/(main)/(tabs)/dashboard.tsx or configuring it elsewhere)
  // If your dashboard file is pages/dashboard/Dashboard.tsx, Expo Router might not automatically
  // link it to this route. You might need an actual app/(main)/(tabs)/dashboard.tsx file
  // that imports and renders your pages/dashboard/Dashboard.tsx component.
}
