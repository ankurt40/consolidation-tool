'use client';

import { useEffect, useState } from 'react';
import TrialBalanceForm from '@/components/TrialBalanceForm';

interface TrialBalance {
  id: number;
  legalEntityCode: string;
  localGlAccount: string;
  localAccountDescription: string;
  businessUnit: string;
  debitAmount: number;
  creditAmount: number;
  netAmount: number;
  groupCoa: string;
  groupDescription: string;
  fsliDetailLowestLevel: string;
  fsliGroupCategory: string;
  fsliClassification: string;
  fsCategory: string;
  fsliLevel5: string;
}

export default function TrialBalancePage() {
  const [trialBalances, setTrialBalances] = useState<TrialBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTrialBalance, setSelectedTrialBalance] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLeCode, setFilterLeCode] = useState('');
  const [filterFsli, setFilterFsli] = useState('');
  const [filterBusinessUnit, setFilterBusinessUnit] = useState('');
  const [filterFsCategory, setFilterFsCategory] = useState('');

  useEffect(() => {
    fetchTrialBalances();
  }, []);

  const fetchTrialBalances = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/trial-balance');
      const data = await response.json();

      if (data.success) {
        setTrialBalances(data.trialBalances);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch trial balances');
      }
    } catch (err) {
      setError('Network error: Unable to fetch trial balances');
      console.error('Error fetching trial balances:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedTrialBalance(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (trialBalance: TrialBalance) => {
    const formTrialBalance = {
      ...trialBalance,
      debitAmount: trialBalance.debitAmount?.toString() || '0',
      creditAmount: trialBalance.creditAmount?.toString() || '0',
      netAmount: trialBalance.netAmount?.toString() || '0',
    };
    setSelectedTrialBalance(formTrialBalance as any);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/trial-balance/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        fetchTrialBalances();
        setDeleteConfirm(null);
      } else {
        setError(data.error || 'Failed to delete trial balance entry');
      }
    } catch (err) {
      setError('Network error: Unable to delete trial balance entry');
      console.error('Error deleting trial balance:', err);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedTrialBalance(null);
  };

  const handleFormSave = () => {
    fetchTrialBalances();
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadResult(null);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      const response = await fetch('/api/trial-balance/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (data.success) {
        setUploadResult({ success: true, message: data.message });
        fetchTrialBalances();
        setTimeout(() => { setIsUploadOpen(false); setUploadFile(null); setUploadResult(null); }, 2000);
      } else {
        setUploadResult({ success: false, message: data.error || 'Upload failed' });
      }
    } catch (err) {
      setUploadResult({ success: false, message: 'Network error: Unable to upload file' });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadSample = () => {
    window.open('/api/trial-balance/sample', '_blank');
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Compute unique values for filters
  const leCodes = [...new Set(trialBalances.map(t => t.legalEntityCode).filter(Boolean))];
  const fsliClassifications = [...new Set(trialBalances.map(t => t.fsliClassification).filter(Boolean))];
  const businessUnits = [...new Set(trialBalances.map(t => t.businessUnit).filter(Boolean))];
  const fsCategories = [...new Set(trialBalances.map(t => t.fsCategory).filter(Boolean))];

  const filteredBalances = trialBalances.filter(tb => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || tb.localGlAccount.toLowerCase().includes(q) || tb.localAccountDescription.toLowerCase().includes(q) || tb.groupCoa.toLowerCase().includes(q) || tb.legalEntityCode.toLowerCase().includes(q);
    const matchesLe = !filterLeCode || tb.legalEntityCode === filterLeCode;
    const matchesFsli = !filterFsli || tb.fsliClassification === filterFsli;
    const matchesBu = !filterBusinessUnit || tb.businessUnit === filterBusinessUnit;
    const matchesFsCat = !filterFsCategory || tb.fsCategory === filterFsCategory;
    return matchesSearch && matchesLe && matchesFsli && matchesBu && matchesFsCat;
  });

  const hasActiveFilters = searchQuery || filterLeCode || filterFsli || filterBusinessUnit || filterFsCategory;

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterLeCode('');
    setFilterFsli('');
    setFilterBusinessUnit('');
    setFilterFsCategory('');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Trial Balance</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and view trial balance entries for all legal entities</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadSample}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Sample
          </button>
          <button
            onClick={() => { setIsUploadOpen(true); setUploadFile(null); setUploadResult(null); }}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Upload Excel
          </button>
          <button
            onClick={handleCreate}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New Entry
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-4 px-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search GL account, description, COA..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <select value={filterLeCode} onChange={(e) => setFilterLeCode(e.target.value)} className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">All Entities</option>
              {leCodes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterBusinessUnit} onChange={(e) => setFilterBusinessUnit(e.target.value)} className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">All Business Units</option>
              {businessUnits.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={filterFsli} onChange={(e) => setFilterFsli(e.target.value)} className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">All FSLI</option>
              {fsliClassifications.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <select value={filterFsCategory} onChange={(e) => setFilterFsCategory(e.target.value)} className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">All FS Categories</option>
              {fsCategories.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
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
            <button onClick={fetchTrialBalances} className="text-xs font-medium text-red-600 hover:text-red-800">Retry</button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white border-y border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-500">Loading trial balances...</p>
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
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">GL Account</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Business Unit</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Group COA</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">FSLI</th>
                  <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBalances.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center">
                      {trialBalances.length === 0 ? (
                        <>
                          <h3 className="text-sm font-medium text-gray-900">No trial balance entries</h3>
                          <p className="mt-1 text-xs text-gray-500">Get started by creating your first trial balance entry.</p>
                          <button onClick={handleCreate} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            Add First Entry
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
                filteredBalances.map((tb) => (
                  <tr key={tb.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-emerald-700">{tb.legalEntityCode}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-mono">{tb.localGlAccount}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-[200px] truncate">{tb.localAccountDescription}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-[160px] truncate">{tb.businessUnit}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-700 font-mono">{formatAmount(tb.debitAmount)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-700 font-mono">{formatAmount(tb.creditAmount)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span className={`text-sm font-mono font-medium ${
                        tb.netAmount > 0 ? 'text-emerald-600' : tb.netAmount < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {formatAmount(tb.netAmount)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">{tb.groupCoa}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-[140px] truncate">{tb.fsliClassification}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {deleteConfirm === tb.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleDelete(tb.id)} className="text-xs font-medium text-red-600 hover:text-red-800">Confirm</button>
                          <span className="text-gray-300">|</span>
                          <button onClick={() => setDeleteConfirm(null)} className="text-xs font-medium text-gray-500 hover:text-gray-700">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(tb)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(tb.id)}
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
              {filteredBalances.length} of {trialBalances.length} row{trialBalances.length !== 1 ? 's' : ''}
              {hasActiveFilters && <span className="ml-1 text-emerald-600">(filtered)</span>}
            </p>
          </div>
        </div>
      )}

      {/* Upload Panel */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/20" onClick={() => setIsUploadOpen(false)} />
          <div className="ml-auto relative z-10 w-full max-w-md h-full bg-white border-l border-gray-200 shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Upload Trial Balance</h2>
                <p className="text-xs text-gray-500 mt-0.5">Upload an Excel (.xlsx) file</p>
              </div>
              <button onClick={() => setIsUploadOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 py-5 space-y-5">
              {/* Result Banner */}
              {uploadResult && (
                <div className={`border rounded-md p-3 flex items-center gap-2 ${uploadResult.success ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <svg className={`w-4 h-4 shrink-0 ${uploadResult.success ? 'text-emerald-500' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                    {uploadResult.success ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    )}
                  </svg>
                  <span className={`text-sm whitespace-pre-line ${uploadResult.success ? 'text-emerald-700' : 'text-red-700'}`}>{uploadResult.message}</span>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Instructions</h3>
                <ul className="text-xs text-gray-600 space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 mt-0.5">1.</span>
                    Download the sample file to see the required format.
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 mt-0.5">2.</span>
                    Fill in your trial balance data with matching column names.
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 mt-0.5">3.</span>
                    Upload the file — entries will be added to existing data.
                  </li>
                </ul>
              </div>

              {/* Download Sample */}
              <button
                onClick={handleDownloadSample}
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Sample Template
              </button>

              {/* File Drop Zone */}
              <label className="block cursor-pointer">
                <div className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${uploadFile ? 'border-emerald-300 bg-emerald-50' : 'border-gray-300 hover:border-gray-400'}`}>
                  {uploadFile ? (
                    <div>
                      <svg className="w-8 h-8 text-emerald-500 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium text-gray-900">{uploadFile.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{(uploadFile.size / 1024).toFixed(1)} KB</p>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setUploadFile(null); setUploadResult(null); }}
                        className="mt-2 text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <p className="text-sm text-gray-600">Click to select an Excel file</p>
                      <p className="text-xs text-gray-400 mt-0.5">.xlsx files only</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={(e) => { setUploadFile(e.target.files?.[0] || null); setUploadResult(null); }}
                />
              </label>

              {/* Required Columns Reference */}
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Required Columns</h3>
                <div className="flex flex-wrap gap-1">
                  {['legalEntityCode', 'entityType', 'localGlAccount', 'localAccountDescription', 'businessUnit', 'debitAmount', 'creditAmount', 'netAmount', 'groupCoa', 'groupDescription', 'fsliDetailLowestLevel', 'fsliGroupCategory', 'fsliClassification', 'fsCategory', 'fsliLevel5'].map(col => (
                    <span key={col} className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono text-gray-600">{col}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="px-6 py-3 border-t border-gray-200 bg-white flex items-center justify-end gap-2">
              <button onClick={() => setIsUploadOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!uploadFile || uploading}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {uploading ? (
                  <><div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>Uploading...</>
                ) : (
                  'Upload'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <TrialBalanceForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSave={handleFormSave}
        trialBalance={selectedTrialBalance}
        mode={formMode}
      />
    </div>
  );
}
