'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopNavbar from '@/components/TopNavbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Auth pages get a clean layout without sidebar/topnav
  if (pathname?.startsWith('/auth')) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col ml-14">
        {/* Top Navbar */}
        <TopNavbar />

        {/* Page Content with dotted grid background */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="py-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

