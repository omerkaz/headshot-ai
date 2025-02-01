import { Stack } from 'expo-router';

export default function ForgetPasswordStackLayout() {
  return (
    <Stack
      >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
