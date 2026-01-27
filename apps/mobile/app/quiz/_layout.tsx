// apps/mobile/app/quiz/_layout.tsx

import { Stack } from 'expo-router';

export default function QuizLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: false, // Prevent swipe back during quiz
      }}
    >
      {/* Review screen allows swipe back */}
      <Stack.Screen
        name="review"
        options={{
          gestureEnabled: true,
        }}
      />
      {/* Summary screen allows swipe back */}
      <Stack.Screen
        name="summary"
        options={{
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}
