import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SSDC — Modern Dental Clinic & Smile Care, Agra',
  description:
    'SSDC Agra: Modern painless implantology, instant laser teeth whitening, handcrafted porcelain veneers, and friendly dental care opposite the Taj Mahal.',
  openGraph: {
    title: 'SSDC — Modern Dental Clinic & Smile Care, Agra',
    description:
      'SSDC Agra: Modern painless implantology, instant laser teeth whitening, handcrafted porcelain veneers, and friendly dental care opposite the Taj Mahal.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SSDC — Modern Dental Clinic & Smile Care, Agra',
    description:
      'SSDC Agra: Modern painless implantology, instant laser teeth whitening, handcrafted porcelain veneers, and friendly dental care opposite the Taj Mahal.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Syne:wght@700;800&family=Urbanist:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-white text-stone-900 antialiased selection:bg-[#7B1123] selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
