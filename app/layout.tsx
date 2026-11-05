import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Taj White Pearl - Luxury Dental Hospital Agra',
  description: 'Agra\'s premier dental hospital inspired by the Taj Mahal. Offering world-class dentistry for local and foreign dental tourists, AI voice calling agent, automated WhatsApp/email reminders, and multi-doctor management.',
  openGraph: {
    title: 'Taj White Pearl - Luxury Dental Hospital Agra',
    description: 'Agra\'s premier dental hospital inspired by the Taj Mahal. Offering world-class dentistry for local and foreign dental tourists, AI voice calling agent, automated WhatsApp/email reminders, and multi-doctor management.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taj White Pearl - Luxury Dental Hospital Agra',
    description: 'Agra\'s premier dental hospital inspired by the Taj Mahal. Offering world-class dentistry for local and foreign dental tourists, AI voice calling agent, automated WhatsApp/email reminders, and multi-doctor management.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
