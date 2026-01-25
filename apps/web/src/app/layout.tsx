import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { ConvexClientProvider } from '@/components/convex-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Maxa - Högskoleprovet Prep',
  description: 'Plugga smart för Högskoleprovet med Maxa. Gamifierad träning och AI-coach.',
  keywords: ['högskoleprovet', 'HP', 'plugga', 'träning', 'AI', 'studier'],
  openGraph: {
    title: 'Maxa - Högskoleprovet Prep',
    description: 'Plugga smart för Högskoleprovet med Maxa',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <ConvexClientProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
