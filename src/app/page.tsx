// app/page.tsx
import { Suspense } from 'react';
import AppClient from '../components/AppClient';

export default function Home() {
  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 sm:p-8">
      {/* Royal Background Elements */}
      <div className="absolute inset-0 bg-[#0a0b10] -z-20" />
      <div 
        className="absolute inset-0 opacity-10 -z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0a0b10]/80 to-[#0a0b10] -z-10" />

      <Suspense fallback={<div className="text-[#d4af37] font-playfair animate-pulse">Loading Evently...</div>}>
        <AppClient />
      </Suspense>
    </main>
  );
}
