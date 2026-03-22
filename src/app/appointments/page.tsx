'use client';

import dynamic from 'next/dynamic';

const AppointmentsContent = dynamic(() => import('./AppointmentsContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
      <div className="flex items-center gap-3 text-text-secondary">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading appointments…</span>
      </div>
    </div>
  ),
});

export default function AppointmentsPage() {
  return <AppointmentsContent />;
}
