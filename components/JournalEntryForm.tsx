'use client';

import { useState, useEffect } from 'react';

interface JournalEntryData {
  id?: number;
  journalDate: string;
  referenceDate: string;
  legalEntityCode: string;
  coa: string;
  coaDescription: string;
  businessUnit: string;
  debitAmount: string;
  creditAmount: string;
  netAmount: string;
  impact: string;
  adjustmentType: string;
  currencyCode: string;
  description: string;
}

interface LegalEntity {
  id: number;
  leCode: string;
  leName: string;
}

const IMPACT_OPTIONS = ['Balance Sheet', 'Income Statement', 'Cash Flow', 'Equity'] as const;
const ADJUSTMENT_TYPES = [
  'Elimination', 'Reclassification', 'Revaluation', 'Translation',
  'Consolidation', 'Intercompany', 'Tax', 'Manual', 'Other'
] as const;
const CURRENCY_CODES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY', 'SGD'] as const;

interface JournalEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  entry?: JournalEntryData | null;
  mode: 'create' | 'edit';
}

export default function JournalEntryForm({ isOpen, onClose, onSave, entry, mode }: JournalEntryFormProps) {
  const empty: JournalEntryData = {
    journalDate: new Date().toISOString().split('T')[0],
    referenceDate: '',
    legalEntityCode: '',
    coa: '',
    coaDescription: '',
    businessUnit: '',
    debitAmount: '0',
    creditAmount: '0',
    netAmount: '0',
    impact: '',
    adjustmentType: '',
    currencyCode: 'USD',
    description: '',
  };

  const [formData, setFormData] = useState<JournalEntryData>(empty);
  const [entryType, setEntryType] = useState<'debit' | 'credit'>('debit');
  const [amount, setAmount] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [legalEntities, setLegalEntities] = useState<LegalEntity[]>([]);
  const [loadingEntities, setLoadingEntities] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoadingEntities(true);
    fetch('/api/legal-entities')
      .then(r => r.json())
      .then(d => { if (d.success) setLegalEntities(d.legalEntities || []); })
      .catch(() => {})
      .finally(() => setLoadingEntities(false));
  }, [isOpen]);

  useEffect(() => {
    if (entry && mode === 'edit') {
      const debit = parseFloat(entry.debitAmount?.toString() || '0');
      const credit = parseFloat(entry.creditAmount?.toString() || '0');
      setFormData({
        ...entry,
        journalDate: entry.journalDate ? entry.journalDate.split('T')[0] : '',
        referenceDate: entry.referenceDate ? entry.referenceDate.split('T')[0] : '',
        debitAmount: entry.debitAmount?.toString() || '0',
        creditAmount: entry.creditAmount?.toString() || '0',
        netAmount: entry.netAmount?.toString() || '0',
      });
      if (debit > 0) { setEntryType('debit'); setAmount(debit.toString()); }
      else if (credit > 0) { setEntryType('credit'); setAmount(credit.toString()); }
      else { setEntryType('debit'); setAmount('0'); }
    } else {
      setFormData(empty);
      setEntryType('debit');
      setAmount('0');
    }
    setError(null);
  }, [entry, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEntryTypeChange = (type: 'debit' | 'credit') => {
    setEntryType(type);
    updateAmounts(amount, type);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    updateAmounts(e.target.value, entryType);
  };

  const updateAmounts = (val: string, type: 'debit' | 'credit') => {
    const n = parseFloat(val) || 0;
    setFormData(prev => ({
      ...prev,
      debitAmount: type === 'debit' ? n.toString() : '0',
      creditAmount: type === 'credit' ? n.toString() : '0',
      netAmount: type === 'debit' ? n.toString() : (-n).toString(),
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const url = mode === 'edit' ? `/api/journal-entries/${entry?.id}` : '/api/journal-entries';
      const method = mode === 'edit' ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.success) { onSave(); onClose(); }
      else { setError(data.error || 'Failed to save journal entry'); }
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="ml-auto relative z-10 w-full max-w-3xl h-full bg-white border-l border-gray-200 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{mode === 'edit' ? 'Edit Journal Entry' : 'New Journal Entry'}</h2>
            <p className="text-xs text-gray-500 mt-0.5">Fill in the details below</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* Dates & Entity */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Journal Details</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Journal Date <span className="text-red-500">*</span></label>
                    <input type="date" name="journalDate" value={formData.journalDate} onChange={handleChange} required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Reference Date</label>
                    <input type="date" name="referenceDate" value={formData.referenceDate} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Legal Entity Code <span className="text-red-500">*</span></label>
                    {loadingEntities ? (
                      <div className={inputClass + " flex items-center text-gray-400"}><div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400 mr-2"></div>Loading...</div>
                    ) : (
                      <select name="legalEntityCode" value={formData.legalEntityCode} onChange={handleChange} required className={inputClass}>
                        <option value="">Select...</option>
                        {legalEntities.map(e => <option key={e.id} value={e.leCode}>{e.leCode} - {e.leName}</option>)}
                      </select>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>COA <span className="text-red-500">*</span></label>
                    <input type="text" name="coa" value={formData.coa} onChange={handleChange} required placeholder="e.g., 11000" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>COA Description <span className="text-red-500">*</span></label>
                    <input type="text" name="coaDescription" value={formData.coaDescription} onChange={handleChange} required placeholder="Account description" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Business Unit <span className="text-red-500">*</span></label>
                    <input type="text" name="businessUnit" value={formData.businessUnit} onChange={handleChange} required placeholder="e.g., Corporate HQ" className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Entry */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Amount Entry</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Entry Type <span className="text-red-500">*</span></label>
                    <div className="flex gap-4 mt-1">
                      <label className="flex items-center cursor-pointer text-sm text-gray-700">
                        <input type="radio" checked={entryType === 'debit'} onChange={() => handleEntryTypeChange('debit')} className="w-3.5 h-3.5 text-emerald-600 border-gray-300 focus:ring-emerald-500 mr-1.5" />
                        Debit
                      </label>
                      <label className="flex items-center cursor-pointer text-sm text-gray-700">
                        <input type="radio" checked={entryType === 'credit'} onChange={() => handleEntryTypeChange('credit')} className="w-3.5 h-3.5 text-emerald-600 border-gray-300 focus:ring-emerald-500 mr-1.5" />
                        Credit
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Amount <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-400 text-sm">$</span>
                      <input type="number" step="0.01" min="0" value={amount} onChange={handleAmountChange} required placeholder="0.00" className={inputClass + " pl-7 font-mono"} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
                  <div className="bg-white border border-gray-200 rounded-md px-3 py-2">
                    <p className="text-[10px] font-medium text-gray-400 uppercase">Debit</p>
                    <p className="text-sm font-mono font-semibold text-emerald-600">${parseFloat(formData.debitAmount).toFixed(2)}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-md px-3 py-2">
                    <p className="text-[10px] font-medium text-gray-400 uppercase">Credit</p>
                    <p className="text-sm font-mono font-semibold text-red-600">${parseFloat(formData.creditAmount).toFixed(2)}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-md px-3 py-2">
                    <p className="text-[10px] font-medium text-gray-400 uppercase">Net</p>
                    <p className="text-sm font-mono font-semibold text-gray-900">${parseFloat(formData.netAmount).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Classification */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Classification</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Impact <span className="text-red-500">*</span></label>
                    <select name="impact" value={formData.impact} onChange={handleChange} required className={inputClass}>
                      <option value="">Select...</option>
                      {IMPACT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Adjustment Type <span className="text-red-500">*</span></label>
                    <select name="adjustmentType" value={formData.adjustmentType} onChange={handleChange} required className={inputClass}>
                      <option value="">Select...</option>
                      {ADJUSTMENT_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Currency Code <span className="text-red-500">*</span></label>
                    <select name="currencyCode" value={formData.currencyCode} onChange={handleChange} required className={inputClass}>
                      {CURRENCY_CODES.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Optional journal entry description..." className={inputClass + " resize-none"} />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-white flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => handleSubmit()} disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1.5">
            {loading ? (<><div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>Saving...</>) : (mode === 'edit' ? 'Update Entry' : 'Create Entry')}
          </button>
        </div>
      </div>
    </div>
  );
}

