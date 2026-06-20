import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SofAi Hub',
  description: 'A clean, fast AI-powered communication platform for messaging, communities, and social feeds.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
