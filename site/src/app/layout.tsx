import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Provider } from '@/components/provider';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: { default: 'Dev Essentials', template: '%s | Dev Essentials' },
  description: 'Visual lessons with worked examples, quizzes and progress tracking: data structures and algorithms, and AI engineering.',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <a href="#nd-page" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-fd-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg">Skip to content</a>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
