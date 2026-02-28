'use client';

import { useState, useEffect } from 'react';

interface TrialBalance {
  id?: number;
  legalEntityCode: string;
  entityType: string;
  localGlAccount: string;
  localAccountDescription: string;
  businessUnit: string;
  debitAmount: string;
  creditAmount: string;
  netAmount: string;
  groupCoa: string;
  groupDescription: string;
  fsliDetailLowestLevel: string;
  fsliGroupCategory: string;
  fsliClassification: string;
  fsCategory: string;
  fsliLevel5: string;
}

const ENTITY_TYPES = ['Parent', 'Subsidiary', 'JV', 'Associate', 'Sub'] as const;

interface LegalEntity {
  id: number;
  leCode: string;
  leName: string;
  country: string;
}

interface TrialBalanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  trialBalance?: TrialBalance | null;
  mode: 'create' | 'edit';
}

export default function TrialBalanceForm({ isOpen, onClose, onSave, trialBalance, mode }: TrialBalanceFormProps) {
  const [formData, setFormData] = useState<TrialBalance>({
    legalEntityCode: '', entityType: '', localGlAccount: '', localAccountDescription: '',
    businessUnit: '', debitAmount: '0', creditAmount: '0', netAmount: '0',
    groupCoa: '', groupDescription: '', fsliDetailLowestLevel: '', fsliGroupCategory: '',
    fsliClassification: '', fsCategory: '', fsliLevel5: '',
  });

  const [entryType, setEntryType] = useState<'debit' | 'credit'>('debit');
  const [amount, setAmount] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [legalEntities, setLegalEntities] = useState<LegalEntity[]>([]);
  const [loadingEntities, setLoadingEntities] = useState(false);

  useEffect(() => {
    const fetchLegalEntities = async () => {
      if (!isOpen) return;
      setLoadingEntities(true);
      try {
        const response = await fetch('/api/legal-entities');
        const data = await response.json();
        if (data.success) setLegalEntities(data.legalEntities || []);
      } catch (err) { console.error('Error fetching legal entities:', err); }
      finally { setLoadingEntities(false); }
    };
    fetchLegalEntities();
  }, [isOpen]);

  useEffect(() => {
    if (trialBalance && mode === 'edit') {
      const debit = parseFloat(trialBalance.debitAmount?.toString() || '0');
      const credit = parseFloat(trialBalance.creditAmount?.toString() || '0');
      setFormData({
        ...trialBalance,
        debitAmount: trialBalance.debitAmount?.toString() || '0',
        creditAmount: trialBalance.creditAmount?.toString() || '0',
        netAmount: trialBalance.netAmount?.toString() || '0',
      });
      if (debit > 0 && credit === 0) { setEntryType('debit'); setAmount(debit.toString()); }
      else if (credit > 0 && debit === 0) { setEntryType('credit'); setAmount(credit.toString()); }
      else { setEntryType('debit'); setAmount('0'); }
    } else {
      setFormData({
        legalEntityCode: '', entityType: '', localGlAccount: '', localAccountDescription: '',
        businessUnit: '', debitAmount: '0', creditAmount: '0', netAmount: '0',
        groupCoa: '', groupDescription: '', fsliDetailLowestLevel: '', fsliGroupCategory: '',
        fsliClassification: '', fsCategory: '', fsliLevel5: '',
      });
      setEntryType('debit'); setAmount('0');
    }
    setError(null);
  }, [trialBalance, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEntryTypeChange = (type: 'debit' | 'credit') => { setEntryType(type); updateAmounts(amount, type); };
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => { const v = e.target.value; setAmount(v); updateAmounts(v, entryType); };

  const updateAmounts = (amountValue: string, type: 'debit' | 'credit') => {
    const n = parseFloat(amountValue) || 0;
    setFormData(prev => ({
      ...prev,
      debitAmount: type === 'debit' ? n.toString() : '0',
      creditAmount: type === 'credit' ? n.toString() : '0',
      netAmount: type === 'debit' ? n.toString() : (-n).toString(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const url = mode === 'edit' ? `/api/trial-balance/${trialBalance?.id}` : '/api/trial-balance';
      const method = mode === 'edit' ? 'PUT' : 'POST';
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await response.json();
      if (data.success) { onSave(); onClose(); }
      else { setError(data.error || 'Failed to save trial balance entry'); }
    } catch (err) { setError('Network error: Unable to save trial balance entry'); }
    finally { setLoading(false); }
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors";
  const selectClass = inputClass;
  const labelClass = "block text-xs font-medium text-gray-500 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />

      {/* Side Panel */}
      <div className="ml-auto relative z-10 w-full max-w-3xl h-full bg-white border-l border-gray-200 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {mode === 'edit' ? 'Edit Trial Balance Entry' : 'New Trial Balance Entry'}
            </h2>
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
            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* Section: Basic Information */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Basic Information</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Legal Entity Code <span className="text-red-500">*</span></label>
                    {loadingEntities ? (
                      <div className={inputClass + " flex items-center text-gray-400"}><div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400 mr-2"></div>Loading...</div>
                    ) : (
                      <select name="legalEntityCode" value={formData.legalEntityCode} onChange={handleChange} required className={selectClass}>
                        <option value="">Select...</option>
                        {legalEntities.map(e => <option key={e.id} value={e.leCode}>{e.leCode} - {e.leName}</option>)}
                      </select>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Entity Type <span className="text-red-500">*</span></label>
                    <select name="entityType" value={formData.entityType} onChange={handleChange} required className={selectClass}>
                      <option value="">Select...</option>
                      {ENTITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Local GL Account <span className="text-red-500">*</span></label>
                    <input type="text" name="localGlAccount" value={formData.localGlAccount} onChange={handleChange} required placeholder="e.g., 11000" className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Business Unit <span className="text-red-500">*</span></label>
                    <input type="text" name="businessUnit" value={formData.businessUnit} onChange={handleChange} required placeholder="e.g., North America" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Account Description <span className="text-red-500">*</span></label>
                    <input type="text" name="localAccountDescription" value={formData.localAccountDescription} onChange={handleChange} required placeholder="Brief description" className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Amount Entry */}
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
                {/* Computed row */}
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

            {/* Section: Group COA Mapping */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Group COA Mapping</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Group COA <span className="text-red-500">*</span></label>
                    <input type="text" name="groupCoa" value={formData.groupCoa} onChange={handleChange} required placeholder="e.g., 100002" className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Group Description <span className="text-red-500">*</span></label>
                    <input type="text" name="groupDescription" value={formData.groupDescription} onChange={handleChange} required placeholder="e.g., Cash at Bank" className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: FSLI Classification */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">FSLI Classification</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>FSLI Detail (Lowest Level) <span className="text-red-500">*</span></label>
                    <input type="text" name="fsliDetailLowestLevel" value={formData.fsliDetailLowestLevel} onChange={handleChange} required placeholder="e.g., Cash and Cash Equivalents" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>FSLI Group Category <span className="text-red-500">*</span></label>
                    <input type="text" name="fsliGroupCategory" value={formData.fsliGroupCategory} onChange={handleChange} required placeholder="e.g., Cash and Cash Equivalents" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>FSLI Classification <span className="text-red-500">*</span></label>
                    <select name="fsliClassification" value={formData.fsliClassification} onChange={handleChange} required className={selectClass}>
                      <option value="">Select...</option>
                      <option value="Current Assets">Current Assets</option>
                      <option value="Non-Current Assets">Non-Current Assets</option>
                      <option value="Current Liabilities">Current Liabilities</option>
                      <option value="Non-Current Liabilities">Non-Current Liabilities</option>
                      <option value="Equity">Equity</option>
                      <option value="Revenue">Revenue</option>
                      <option value="Cost of Sales">Cost of Sales</option>
                      <option value="Operating Expenses">Operating Expenses</option>
                      <option value="Other Income">Other Income</option>
                      <option value="Other Expenses">Other Expenses</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>FS Category <span className="text-red-500">*</span></label>
                    <select name="fsCategory" value={formData.fsCategory} onChange={handleChange} required className={selectClass}>
                      <option value="">Select...</option>
                      <option value="Assets">Assets</option>
                      <option value="Liabilities">Liabilities</option>
                      <option value="Equity">Equity</option>
                      <option value="Income">Income</option>
                      <option value="Expenses">Expenses</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>FSLI Level 5 <span className="text-red-500">*</span></label>
                    <select name="fsliLevel5" value={formData.fsliLevel5} onChange={handleChange} required className={selectClass}>
                      <option value="">Select...</option>
                      <option value="Balance Sheet">Balance Sheet</option>
                      <option value="Income Statement">Income Statement</option>
                      <option value="Cash Flow Statement">Cash Flow Statement</option>
                      <option value="Statement of Changes in Equity">Statement of Changes in Equity</option>
                    </select>
                  </div>
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
          <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1.5">
            {loading ? (
              <><div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>Saving...</>
            ) : (
              <>{mode === 'edit' ? 'Update Entry' : 'Create Entry'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
