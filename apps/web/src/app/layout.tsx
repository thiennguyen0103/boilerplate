import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Web Starter',
  description: 'Reusable full-stack starter',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
