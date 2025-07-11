import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { LocaleProvider } from '@/context/locale-context';
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: 'SchoolMaker Mods',
  description: 'Create and configure mods for SchoolMaker',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Figtree:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background min-h-screen flex flex-col">
        <LocaleProvider>
          <div className="flex-grow">
            {children}
          </div>
          <Toaster />
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
