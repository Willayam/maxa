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
    />
  );
}
