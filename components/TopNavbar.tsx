'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

const pageTitles: Record<string, string> = {
  '/': 'Home',
  '/legal-entities': 'Legal Entities',
  '/trial-balance': 'Trial Balance',
  '/journal-entries': 'Journal Entries',
  '/configuration': 'Configuration',
  '/about': 'About',
  '/contact': 'Contact',
};

export default function TopNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Don't show on auth pages
  if (pathname?.startsWith('/auth')) return null;

  const currentPage = pageTitles[pathname || '/'] || 'Page';

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <header className="h-12 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left: Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
          Consolidation Tool
        </Link>
        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-gray-900 font-medium">{currentPage}</span>
      </div>

      {/* Right: Search + User */}
      <div className="flex items-center space-x-3">
        {/* Search */}
        <button className="flex items-center space-x-2 px-3 py-1.5 text-xs text-gray-500 bg-white border border-gray-200 rounded-md hover:border-gray-300 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <span>Search...</span>
          <kbd className="ml-4 px-1.5 py-0.5 text-[10px] font-mono bg-gray-100 border border-gray-200 rounded text-gray-400">⌘K</kbd>
        </button>

        {/* Notification bell */}
        <button className="relative w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          {/* Badge dot */}
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-2 ring-gray-100"></span>
        </button>

        {/* User menu */}
        {session?.user ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center hover:ring-2 hover:ring-gray-300 transition-all"
            >
              <span className="text-white text-xs font-semibold">
                {session.user.companyName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </button>

            {isUserMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{session.user.companyName}</p>
                    <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}

