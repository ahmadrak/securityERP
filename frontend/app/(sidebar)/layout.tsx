'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from '@/components/Sidebare';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
          <Sidebar />

      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
            {children}
      </main>
      </div>
    </SidebarProvider>
  );
}