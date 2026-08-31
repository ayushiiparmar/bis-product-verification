import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NexVision - AI Powered Image Analysis',
  description: 'Upload an image and let NexVision analyze it with precision, intelligence, and standard compliance verification.',
  keywords: ['AI Image Analysis', 'Product Detection', 'Computer Vision', 'Quality Verification'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#f8fafc] text-on-surface antialiased selection:bg-primary-container selection:text-white">
        {children}
      </body>
    </html>
  );
}
