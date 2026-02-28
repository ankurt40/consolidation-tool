export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">About Consolidation Tool</h1>
        <p className="text-sm text-gray-500 mt-0.5">Enterprise-grade financial consolidation platform for multi-entity organizations</p>
      </div>

      <div className="space-y-0">
        {/* Mission */}
        <div className="bg-white border-y border-gray-200 px-6 py-5">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Our Mission</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            To empower finance teams with a comprehensive, cloud-based consolidation platform that simplifies complex financial processes across multiple legal entities, currencies, and jurisdictions. We enable CFOs and financial controllers to achieve faster month-end close, ensure regulatory compliance, and gain real-time visibility into their organization's financial performance.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Built for modern finance teams, our multi-tenant architecture ensures complete data isolation, enterprise-grade security, and the scalability needed to support growing organizations with complex ownership structures.
          </p>
        </div>

        {/* Core Capabilities */}
        <div className="bg-white border-b border-gray-200 px-6 py-5">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Core Financial Capabilities</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Legal Entity Management', desc: 'Master data management for complex organizational structures with ownership hierarchies', color: 'text-emerald-600 bg-emerald-50' },
              { title: 'Trial Balance Processing', desc: 'Import, map, and manage trial balances with FSLI classification and account mapping', color: 'text-blue-600 bg-blue-50' },
              { title: 'Multi-Currency Support', desc: 'Handle local, functional, and reporting currencies with exchange rate management', color: 'text-amber-600 bg-amber-50' },
              { title: 'Ownership Tracking', desc: 'Direct, indirect, and NCI calculations with consolidation percentage management', color: 'text-purple-600 bg-purple-50' },
              { title: 'GAAP Compliance', desc: 'Support for US GAAP, IFRS, and local accounting standards', color: 'text-rose-600 bg-rose-50' },
              { title: 'Multi-Tenant Architecture', desc: 'Complete data isolation for multiple customers with enterprise security', color: 'text-gray-600 bg-gray-100' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-3 rounded-md border border-gray-100 hover:border-gray-200 transition-colors">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${item.color}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white border-b border-gray-200 px-6 py-5">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Technology Stack</h2>
          <div className="flex flex-wrap gap-2">
            {['Next.js 16', 'Prisma ORM', 'Supabase / PostgreSQL', 'Tailwind CSS', 'TypeScript', 'Docker', 'NextAuth.js'].map(tech => (
              <span key={tech} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs font-medium text-gray-700">{tech}</span>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white border-b border-gray-200 px-6 py-5">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-2.5">
            {[
              'Consolidation Methods', 'Intercompany Eliminations', 'Chart of Accounts Mapping', 'Currency Translation',
              'Audit Trail', 'Financial Reporting', 'Period-End Close Workflow', 'Role-Based Access Control'
            ].map(f => (
              <div key={f} className="flex items-center gap-2 py-1">
                <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-700">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ideal For */}
        <div className="bg-white border-b border-gray-200 px-6 py-5">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Ideal For</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Multi-National Corporations', desc: 'Consolidate financials across subsidiaries in multiple countries.' },
              { title: 'Private Equity Firms', desc: 'Manage portfolio companies with complex ownership structures.' },
              { title: 'Holding Companies', desc: 'Track direct/indirect ownership with automated NCI calculations.' },
              { title: 'Joint Ventures', desc: 'Apply equity method accounting and proportionate consolidation.' },
            ].map(item => (
              <div key={item.title} className="border-l-2 border-emerald-400 pl-3">
                <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
