import type { Metadata } from 'next';
import './globals.css';
import DemoNavbar from '@/components/navigation/DemoNavbar';

export const metadata: Metadata = {
  title: 'BizOS | Multi-Tenant Free-Tier SaaS Backend & Demo Platform',
  description:
    'Single shared backend powering Salon Bookings, E-Commerce Store RAG, and CloudPulse SOC Operations on Supabase pgvector & Next.js.',
  keywords: ['Multi-Tenant SaaS', 'Next.js', 'Supabase pgvector', 'RAG Agent', 'Groq', 'SOC Threat Hunting'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <DemoNavbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
