import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your consolidation workspace</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</p>
          <div className="mt-2 flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-lg font-semibold text-gray-900">Healthy</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Platform</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">Next.js + Prisma</p>
          <p className="text-xs text-gray-400 mt-0.5">PostgreSQL Backend</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Architecture</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">Multi-Tenant</p>
          <p className="text-xs text-gray-400 mt-0.5">Complete data isolation</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/legal-entities" className="group bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Legal Entities</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Manage organizational structure with legal entity master data and consolidation details.</p>
            <span className="inline-flex items-center mt-3 text-xs font-medium text-blue-600 group-hover:text-blue-700">
              Open
              <svg className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </Link>

          <Link href="/trial-balance" className="group bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Trial Balance</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Track trial balance entries with detailed account mapping and FSLI classifications.</p>
            <span className="inline-flex items-center mt-3 text-xs font-medium text-emerald-600 group-hover:text-emerald-700">
              Open
              <svg className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </Link>

          <Link href="/configuration" className="group bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Configuration</h3>
            <p className="text-xs text-gray-500 leading-relaxed">System settings, period configuration, and financial statement title templates.</p>
            <span className="inline-flex items-center mt-3 text-xs font-medium text-purple-600 group-hover:text-purple-700">
              Open
              <svg className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Getting Started</h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Set up Legal Entities</p>
                <p className="text-xs text-gray-500 mt-0.5">Add your parent and subsidiary entities with ownership details.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Import Trial Balance</p>
                <p className="text-xs text-gray-500 mt-0.5">Enter GL accounts with debit/credit amounts and FSLI mapping.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-gray-500">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Configure System</p>
                <p className="text-xs text-gray-500 mt-0.5">Set reporting currency, GAAP standard, and number formatting.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-gray-500">4</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Review & Consolidate</p>
                <p className="text-xs text-gray-500 mt-0.5">Generate consolidated financial statements across entities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
