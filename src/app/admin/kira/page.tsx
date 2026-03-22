'use client';

import dynamic from 'next/dynamic';
import { Bot } from 'lucide-react';

const KiraAdminContent = dynamic(() => import('./KiraAdminContent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-32">
      <div className="flex items-center gap-3 text-text-secondary">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading Kira dashboard…</span>
      </div>
    </div>
  ),
});

export default function KiraAdminPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-[0_4px_16px_rgba(13,115,119,0.25)]">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-text-primary">Kira Admin</h1>
            <p className="text-text-secondary text-sm mt-0.5">Manage AI assistant, patients, appointments & advice</p>
          </div>
          <span className="ml-auto flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Kira is online
          </span>
        </div>
        <KiraAdminContent />
      </div>
    </div>
  );
}
