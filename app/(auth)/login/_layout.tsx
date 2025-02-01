import { Stack } from 'expo-router';

export default function LoginStackLayout() {
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
