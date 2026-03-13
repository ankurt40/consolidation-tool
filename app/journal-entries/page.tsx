'use client';

import { useEffect, useState } from 'react';
import JournalEntryForm from '@/components/JournalEntryForm';

interface JournalEntry {
  id: number;
  journalDate: string;
  referenceDate: string | null;
  legalEntityCode: string;
  coa: string;
  coaDescription: string;
  businessUnit: string;
  debitAmount: number;
  creditAmount: number;
  netAmount: number;
  impact: string;
  adjustmentType: string;
  currencyCode: string;
  description: string | null;
}

export default function JournalEntriesPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLeCode, setFilterLeCode] = useState('');
  const [filterImpact, setFilterImpact] = useState('');
  const [filterAdjType, setFilterAdjType] = useState('');
  const [filterCurrency, setFilterCurrency] = useState('');

  useEffect(() => { fetchEntries(); }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/journal-entries');
      const data = await res.json();
      if (data.success) { setEntries(data.journalEntries); setError(null); }
      else { setError(data.error || 'Failed to fetch'); }
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  const handleCreate = () => { setSelectedEntry(null); setFormMode('create'); setIsFormOpen(true); };
  const handleEdit = (entry: JournalEntry) => { setSelectedEntry(entry); setFormMode('edit'); setIsFormOpen(true); };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/journal-entries/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { fetchEntries(); }
      else { setError(data.error || 'Failed to delete'); }
    } catch { setError('Network error'); }
    finally { setDeleteConfirm(null); }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadResult(null);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      const res = await fetch('/api/journal-entries/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setUploadResult({ success: true, message: data.message });
        fetchEntries();
        setTimeout(() => { setIsUploadOpen(false); setUploadFile(null); setUploadResult(null); }, 2000);
      } else {
        setUploadResult({ success: false, message: data.error || 'Upload failed' });
      }
    } catch {
      setUploadResult({ success: false, message: 'Network error: Unable to upload file' });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadSample = () => {
    window.open('/api/journal-entries/sample', '_blank');
  };

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Compute unique values for filters
  const leCodes = [...new Set(entries.map(e => e.legalEntityCode).filter(Boolean))];
  const impacts = [...new Set(entries.map(e => e.impact).filter(Boolean))];
  const adjTypes = [...new Set(entries.map(e => e.adjustmentType).filter(Boolean))];
  const currencies = [...new Set(entries.map(e => e.currencyCode).filter(Boolean))];

  const filteredEntries = entries.filter(entry => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || entry.coa.toLowerCase().includes(q) || entry.coaDescription.toLowerCase().includes(q) || entry.legalEntityCode.toLowerCase().includes(q) || entry.businessUnit.toLowerCase().includes(q) || (entry.description || '').toLowerCase().includes(q);
    const matchesLe = !filterLeCode || entry.legalEntityCode === filterLeCode;
    const matchesImpact = !filterImpact || entry.impact === filterImpact;
    const matchesAdj = !filterAdjType || entry.adjustmentType === filterAdjType;
    const matchesCcy = !filterCurrency || entry.currencyCode === filterCurrency;
    return matchesSearch && matchesLe && matchesImpact && matchesAdj && matchesCcy;
  });

  const hasActiveFilters = searchQuery || filterLeCode || filterImpact || filterAdjType || filterCurrency;

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterLeCode('');
    setFilterImpact('');
    setFilterAdjType('');
    setFilterCurrency('');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Journal Entries</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage consolidation adjustments and journal entries</p>
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
                placeholder="Search COA, description, entity, BU..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <select value={filterLeCode} onChange={(e) => setFilterLeCode(e.target.value)} className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">All Entities</option>
              {leCodes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterImpact} onChange={(e) => setFilterImpact(e.target.value)} className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">All Impacts</option>
              {impacts.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <select value={filterAdjType} onChange={(e) => setFilterAdjType(e.target.value)} className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">All Adj Types</option>
              {adjTypes.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select value={filterCurrency} onChange={(e) => setFilterCurrency(e.target.value)} className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">All Currencies</option>
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
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
        <div className="mx-4 mb-4 bg-red-50 border border-red-200 rounded-md p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-red-700">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white border-y border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-500">Loading journal entries...</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white border-y border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Journal Date</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref Date</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LEC</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COA</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COA Description</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Unit</th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adj Type</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CCY</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="px-4 py-12 text-center">
                      {entries.length === 0 ? (
                        <>
                          <h3 className="text-sm font-medium text-gray-900">No journal entries</h3>
                          <p className="text-xs text-gray-500 mt-1">Create your first journal entry to get started.</p>
                          <button onClick={handleCreate} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            Add New Entry
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
                filteredEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-gray-500">{entry.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{formatDate(entry.journalDate)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDate(entry.referenceDate)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.legalEntityCode}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-700">{entry.coa}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-40 truncate">{entry.coaDescription}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-32 truncate">{entry.businessUnit}</td>
                    <td className="px-4 py-3 text-sm font-mono text-right text-emerald-700">{Number(entry.debitAmount) > 0 ? formatAmount(Number(entry.debitAmount)) : '—'}</td>
                    <td className="px-4 py-3 text-sm font-mono text-right text-red-600">{Number(entry.creditAmount) > 0 ? formatAmount(Number(entry.creditAmount)) : '—'}</td>
                    <td className="px-4 py-3 text-sm font-mono text-right font-semibold text-gray-900">{formatAmount(Number(entry.netAmount))}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{entry.impact}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">{entry.adjustmentType}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-500">{entry.currencyCode}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-32 truncate">{entry.description || '—'}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(entry)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        {deleteConfirm === entry.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(entry.id)} className="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700">Yes</button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(entry.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/30">
            <p className="text-xs text-gray-500">
              {filteredEntries.length} of {entries.length} row{entries.length !== 1 ? 's' : ''}
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
                <h2 className="text-lg font-semibold text-gray-900">Upload Journal Entries</h2>
                <p className="text-xs text-gray-500 mt-0.5">Upload an Excel (.xlsx) file</p>
              </div>
              <button onClick={() => setIsUploadOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 py-5 space-y-5 overflow-y-auto">
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
                  <li className="flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">1.</span>Download the sample file to see the required format.</li>
                  <li className="flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">2.</span>Fill in your journal entries with matching column names.</li>
                  <li className="flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">3.</span>Upload the file — entries will be added to existing data.</li>
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
                      <button type="button" onClick={(e) => { e.preventDefault(); setUploadFile(null); setUploadResult(null); }} className="mt-2 text-xs text-red-600 hover:text-red-800 font-medium">Remove</button>
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
                <input type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => { setUploadFile(e.target.files?.[0] || null); setUploadResult(null); }} />
              </label>

              {/* Required Columns Reference */}
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Required Columns</h3>
                <div className="flex flex-wrap gap-1">
                  {['journalDate', 'legalEntityCode', 'coa', 'coaDescription', 'businessUnit', 'debitAmount', 'creditAmount', 'netAmount', 'impact', 'adjustmentType', 'currencyCode'].map(col => (
                    <span key={col} className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono text-gray-600">{col}</span>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Optional: referenceDate, description</p>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="px-6 py-3 border-t border-gray-200 bg-white flex items-center justify-end gap-2">
              <button onClick={() => setIsUploadOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleUpload} disabled={!uploadFile || uploading} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1.5">
                {uploading ? (<><div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>Uploading...</>) : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <JournalEntryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={fetchEntries}
        entry={selectedEntry}
        mode={formMode}
      />
    </div>
  );
}

