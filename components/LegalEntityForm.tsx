'use client';

import { useState, useEffect } from 'react';

const ENTITY_TYPES = ['Parent', 'Subsidiary', 'JV', 'Associate', 'Sub'] as const;
const GAAP_TYPES = ['US GAAP', 'IFRS', 'Local GAAP'] as const;

interface LegalEntity {
  id?: number;
  leCode: string;
  leName: string;
  parentEntity: string | null;
  entityType: string;
  country: string;
  ownershipPercentDirect: string | null;
  ownershipPercentIndirect: string | null;
  totalOwnershipPercent: string | null;
  nciPercent: string | null;
  votingRightsPercent: string | null;
  controlIndicator: string | null;
  consolidationPercent: string | null;
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

interface LegalEntityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  entity?: LegalEntity | null;
  mode: 'create' | 'edit';
}

export default function LegalEntityForm({ isOpen, onClose, onSave, entity, mode }: LegalEntityFormProps) {
  const empty: LegalEntity = {
    leCode: '', leName: '', parentEntity: '', entityType: '', country: '',
    ownershipPercentDirect: '', ownershipPercentIndirect: '', totalOwnershipPercent: '',
    nciPercent: '', votingRightsPercent: '', controlIndicator: '', consolidationPercent: '',
    consolidationMethod: '', consolidationStructure: '', localCurrency: '', functionalCurrency: '',
    intermediateCurrency: '', entityClassification: '', fiscalYearEnd: '', primaryGAAP: '',
    secondaryGAAP: '', acquisitionDate: '', disposalDate: '', entityJurisdiction: '', taxId: '', legalForm: '',
  };

  const [formData, setFormData] = useState<LegalEntity>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (entity && mode === 'edit') {
      setFormData({
        ...entity,
        parentEntity: entity.parentEntity || '',
        ownershipPercentDirect: entity.ownershipPercentDirect?.toString() || '',
        ownershipPercentIndirect: entity.ownershipPercentIndirect?.toString() || '',
        totalOwnershipPercent: entity.totalOwnershipPercent?.toString() || '',
        nciPercent: entity.nciPercent?.toString() || '',
        votingRightsPercent: entity.votingRightsPercent?.toString() || '',
        controlIndicator: entity.controlIndicator || '',
        consolidationPercent: entity.consolidationPercent?.toString() || '',
        consolidationMethod: entity.consolidationMethod || '',
        consolidationStructure: entity.consolidationStructure || '',
        intermediateCurrency: entity.intermediateCurrency || '',
        secondaryGAAP: entity.secondaryGAAP || '',
        acquisitionDate: entity.acquisitionDate || '',
        disposalDate: entity.disposalDate || '',
        taxId: entity.taxId || '',
        legalForm: entity.legalForm || '',
      });
    } else {
      setFormData(empty);
    }
  }, [entity, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const url = mode === 'edit' ? `/api/legal-entities/${entity?.id}` : '/api/legal-entities';
      const method = mode === 'edit' ? 'PUT' : 'POST';
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await response.json();
      if (data.success) { onSave(); onClose(); }
      else { setError(data.error || 'Failed to save entity'); }
    } catch (err) { setError('Network error: Unable to save entity'); }
    finally { setLoading(false); }
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors";
  const selectClass = inputClass;
  const labelClass = "block text-xs font-medium text-gray-500 mb-1.5";
  const disabledClass = inputClass + " bg-gray-100 text-gray-500 cursor-not-allowed";

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
              {mode === 'edit' ? 'Edit Legal Entity' : 'New Legal Entity'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Fill in the entity details below</p>
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
                    <label className={labelClass}>LE Code <span className="text-red-500">*</span></label>
                    <input type="text" name="leCode" value={formData.leCode} onChange={handleChange} required disabled={mode === 'edit'} className={mode === 'edit' ? disabledClass : inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>LE Name <span className="text-red-500">*</span></label>
                    <input type="text" name="leName" value={formData.leName} onChange={handleChange} required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Parent Entity</label>
                    <input type="text" name="parentEntity" value={formData.parentEntity || ''} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Entity Type <span className="text-red-500">*</span></label>
                    <select name="entityType" value={formData.entityType} onChange={handleChange} required className={selectClass}>
                      <option value="">Select...</option>
                      {ENTITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Country <span className="text-red-500">*</span></label>
                    <input type="text" name="country" value={formData.country} onChange={handleChange} required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Entity Jurisdiction <span className="text-red-500">*</span></label>
                    <input type="text" name="entityJurisdiction" value={formData.entityJurisdiction} onChange={handleChange} required className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Entity Classification <span className="text-red-500">*</span></label>
                    <input type="text" name="entityClassification" value={formData.entityClassification} onChange={handleChange} required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Tax ID</label>
                    <input type="text" name="taxId" value={formData.taxId || ''} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Legal Form</label>
                    <input type="text" name="legalForm" value={formData.legalForm || ''} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Ownership & Control */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ownership & Control</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Ownership % Direct</label>
                    <input type="number" step="0.01" name="ownershipPercentDirect" value={formData.ownershipPercentDirect || ''} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Ownership % Indirect</label>
                    <input type="number" step="0.01" name="ownershipPercentIndirect" value={formData.ownershipPercentIndirect || ''} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Total Ownership %</label>
                    <input type="number" step="0.01" name="totalOwnershipPercent" value={formData.totalOwnershipPercent || ''} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>NCI %</label>
                    <input type="number" step="0.01" name="nciPercent" value={formData.nciPercent || ''} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Voting Rights %</label>
                    <input type="number" step="0.01" name="votingRightsPercent" value={formData.votingRightsPercent || ''} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Control Indicator</label>
                    <input type="text" name="controlIndicator" value={formData.controlIndicator || ''} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Consolidation */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Consolidation</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Consolidation %</label>
                    <input type="number" step="0.01" name="consolidationPercent" value={formData.consolidationPercent || ''} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Consolidation Method</label>
                    <input type="text" name="consolidationMethod" value={formData.consolidationMethod || ''} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Consolidation Structure</label>
                    <input type="text" name="consolidationStructure" value={formData.consolidationStructure || ''} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Currency & GAAP */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Currency & GAAP</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Local Currency <span className="text-red-500">*</span></label>
                    <input type="text" name="localCurrency" value={formData.localCurrency} onChange={handleChange} required maxLength={10} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Functional Currency <span className="text-red-500">*</span></label>
                    <input type="text" name="functionalCurrency" value={formData.functionalCurrency} onChange={handleChange} required maxLength={10} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Intermediate Currency</label>
                    <input type="text" name="intermediateCurrency" value={formData.intermediateCurrency || ''} onChange={handleChange} maxLength={10} className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Fiscal Year End <span className="text-red-500">*</span></label>
                    <input type="text" name="fiscalYearEnd" value={formData.fiscalYearEnd} onChange={handleChange} required placeholder="e.g., December 31" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Primary GAAP <span className="text-red-500">*</span></label>
                    <select name="primaryGAAP" value={formData.primaryGAAP} onChange={handleChange} required className={selectClass}>
                      <option value="">Select...</option>
                      {GAAP_TYPES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Secondary GAAP</label>
                    <select name="secondaryGAAP" value={formData.secondaryGAAP || ''} onChange={handleChange} className={selectClass}>
                      <option value="">Optional</option>
                      {GAAP_TYPES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Dates */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Dates</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Acquisition Date</label>
                    <input type="date" name="acquisitionDate" value={formData.acquisitionDate || ''} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Disposal Date</label>
                    <input type="date" name="disposalDate" value={formData.disposalDate || ''} onChange={handleChange} className={inputClass} />
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
              <>{mode === 'edit' ? 'Update Entity' : 'Create Entity'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
