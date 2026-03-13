'use client';

import { useEffect, useState } from 'react';
import LegalEntityForm from '@/components/LegalEntityForm';

interface LegalEntity {
  id: number;
  leCode: string;
  leName: string;
  parentEntity: string | null;
  entityType: string;
  country: string;
  ownershipPercentDirect: number | null;
  ownershipPercentIndirect: number | null;
  totalOwnershipPercent: number | null;
  nciPercent: number | null;
  votingRightsPercent: number | null;
  controlIndicator: string | null;
  consolidationPercent: number | null;
  consolidationMethod: string | null;
  consolidationStructure: string | null;
  localCurrency: string;
  functionalCurrency: string;
  intermediateCurrency: string | null;
  entityClassification: string;
  fiscalYearEnd: string;
  primaryGAAP: string;
  secondaryGAAP: string | null;
  acquisitionDate: string | null;
  disposalDate: string | null;
  entityJurisdiction: string;
  taxId: string | null;
  legalForm: string | null;
}

export default function LegalEntitiesPage() {
  const [legalEntities, setLegalEntities] = useState<LegalEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEntityType, setFilterEntityType] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterControl, setFilterControl] = useState('');
  const [filterConsolMethod, setFilterConsolMethod] = useState('');

  useEffect(() => {
    fetchLegalEntities();
  }, []);

  const fetchLegalEntities = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/legal-entities');
      const data = await response.json();

      if (data.success) {
        setLegalEntities(data.legalEntities);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch legal entities');
      }
    } catch (err) {
      setError('Network error: Unable to fetch legal entities');
      console.error('Error fetching legal entities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedEntity(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (entity: LegalEntity) => {
    // Convert entity to match form interface
    const formEntity = {
      ...entity,
      ownershipPercentDirect: entity.ownershipPercentDirect?.toString() || null,
      ownershipPercentIndirect: entity.ownershipPercentIndirect?.toString() || null,
      totalOwnershipPercent: entity.totalOwnershipPercent?.toString() || null,
      nciPercent: entity.nciPercent?.toString() || null,
      votingRightsPercent: entity.votingRightsPercent?.toString() || null,
      consolidationPercent: entity.consolidationPercent?.toString() || null,
    };
    setSelectedEntity(formEntity as any);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/legal-entities/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        fetchLegalEntities();
        setDeleteConfirm(null);
      } else {
        setError(data.error || 'Failed to delete entity');
      }
    } catch (err) {
      setError('Network error: Unable to delete entity');
      console.error('Error deleting entity:', err);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedEntity(null);
  };

  const handleFormSave = () => {
    fetchLegalEntities();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPercent = (value: number | null) => {
    if (value === null) return '-';
    return `${value}%`;
  };

  // Compute unique values for filters
  const entityTypes = [...new Set(legalEntities.map(e => e.entityType).filter(Boolean))];
  const countries = [...new Set(legalEntities.map(e => e.country).filter(Boolean))];
  const controlIndicators = [...new Set(legalEntities.map(e => e.controlIndicator).filter(Boolean) as string[])];
  const consolMethods = [...new Set(legalEntities.map(e => e.consolidationMethod).filter(Boolean) as string[])];

  // Filter logic
  const filteredEntities = legalEntities.filter(entity => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || entity.leCode.toLowerCase().includes(q) || entity.leName.toLowerCase().includes(q) || entity.country.toLowerCase().includes(q);
    const matchesType = !filterEntityType || entity.entityType === filterEntityType;
    const matchesCountry = !filterCountry || entity.country === filterCountry;
    const matchesControl = !filterControl || entity.controlIndicator === filterControl;
    const matchesConsol = !filterConsolMethod || entity.consolidationMethod === filterConsolMethod;
    return matchesSearch && matchesType && matchesCountry && matchesControl && matchesConsol;
  });

  const hasActiveFilters = searchQuery || filterEntityType || filterCountry || filterControl || filterConsolMethod;

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterEntityType('');
    setFilterCountry('');
    setFilterControl('');
    setFilterConsolMethod('');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Legal Entity Master</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and view all legal entities in the consolidation structure</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add New Entity
        </button>
      </div>

      {/* Filter Bar */}
      <div className="mb-4 px-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by code, name, or country..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            {/* Entity Type */}
            <select value={filterEntityType} onChange={(e) => setFilterEntityType(e.target.value)} className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">All Types</option>
              {entityTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {/* Country */}
            <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {/* Control */}
            <select value={filterControl} onChange={(e) => setFilterControl(e.target.value)} className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">All Controls</option>
              {controlIndicators.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {/* Consolidation Method */}
            <select value={filterConsolMethod} onChange={(e) => setFilterConsolMethod(e.target.value)} className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">All Methods</option>
              {consolMethods.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            {/* Clear */}
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 px-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-red-700">{error}</span>
            </div>
            <button onClick={fetchLegalEntities} className="text-xs font-medium text-red-600 hover:text-red-800">Retry</button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white border-y border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-500">Loading legal entities...</p>
        </div>
      )}

      {/* Table Card */}
      {!loading && !error && (
        <div className="bg-white border-y border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">LE Code</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Ownership %</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Control</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Consol. Method</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Local Ccy</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Func. Ccy</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">GAAP</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">FY End</th>
                  <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEntities.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-4 py-12 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                        </svg>
                      </div>
                      {legalEntities.length === 0 ? (
                        <>
                          <h3 className="text-sm font-medium text-gray-900">No legal entities found</h3>
                          <p className="mt-1 text-xs text-gray-500">Get started by adding your first legal entity.</p>
                          <button onClick={handleCreate} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            Add Legal Entity
                          </button>
                        </>
                      ) : (
                        <>
                          <h3 className="text-sm font-medium text-gray-900">No matching results</h3>
                          <p className="mt-1 text-xs text-gray-500">Try adjusting your search or filter criteria.</p>
                          <button onClick={clearAllFilters} className="mt-3 text-xs font-medium text-emerald-600 hover:text-emerald-700">Clear all filters</button>
                        </>
                      )}
                    </td>
                  </tr>
                ) : (
                filteredEntities.map((entity) => (
                  <tr key={entity.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-emerald-700">{entity.leCode}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{entity.leName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{entity.parentEntity || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{entity.entityType}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{entity.country}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-mono">{formatPercent(entity.ownershipPercentDirect)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        entity.controlIndicator === 'Full Control'
                          ? 'bg-emerald-50 text-emerald-700'
                          : entity.controlIndicator === 'Joint Control'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {entity.controlIndicator || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{entity.consolidationMethod || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">{entity.localCurrency}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">{entity.functionalCurrency}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{entity.primaryGAAP}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{entity.fiscalYearEnd}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {deleteConfirm === entity.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleDelete(entity.id)} className="text-xs font-medium text-red-600 hover:text-red-800">Confirm</button>
                          <span className="text-gray-300">|</span>
                          <button onClick={() => setDeleteConfirm(null)} className="text-xs font-medium text-gray-500 hover:text-gray-700">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(entity)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(entity.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/30">
            <p className="text-xs text-gray-500">
              {filteredEntities.length} of {legalEntities.length} row{legalEntities.length !== 1 ? 's' : ''}
              {hasActiveFilters && <span className="ml-1 text-emerald-600">(filtered)</span>}
            </p>
          </div>
        </div>
      )}


      {/* Form Modal */}
      <LegalEntityForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSave={handleFormSave}
        entity={selectedEntity}
        mode={formMode}
      />
    </div>
  );
}

