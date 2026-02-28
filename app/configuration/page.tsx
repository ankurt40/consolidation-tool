'use client';

import { useState, useEffect } from 'react';

// ==================== ENUM OPTIONS ====================

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'SGD', 'HKD', 'CNY', 'BRL', 'ZAR'] as const;
const GAAP_OPTIONS = ['US GAAP', 'IFRS', 'Local GAAP'] as const;
const EPS_CALC_OPTIONS = ['Basic', 'Both (Basic & Diluted)'] as const;
const NUMBER_FORMAT_OPTIONS = ['1,234,567.89', '1.234.567,89', '1 234 567.89'] as const;
const DECIMAL_PLACES_OPTIONS = [0, 1, 2, 3, 4] as const;
const THOUSAND_SEP_OPTIONS = [',', '.', ' '] as const;
const DECIMAL_SEP_OPTIONS = ['.', ','] as const;
const SCALE_OPTIONS = ['Absolute', 'Thousands (K)', 'Millions (M)', 'Billions (B)', 'Lakhs', 'Crores'] as const;
const NEGATIVE_FORMAT_OPTIONS = ['(1,000)', '-1,000', '1,000 CR', '1,000-'] as const;
const ZERO_DISPLAY_OPTIONS = ['0.00', '0', '-', 'blank'] as const;
const LANGUAGE_OPTIONS = ['English'] as const;
const PRESENTATION_OPTIONS = ['Thousands (K)', 'Millions (M)', 'Billions (B)', 'Lakhs', 'Crores', 'Absolute'] as const;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const;
const PERIOD_OPTIONS = [1, 2, 3, 4, 6, 12, 13, 24, 52, 53] as const;
const COMPARATIVE_BS_OPTIONS = ['1', '2', '3'] as const;
const FISCAL_YEAR_TYPE_OPTIONS = ['Calendar Year', 'Fixed Fiscal Year', '52-53 Week Fiscal Year'] as const;
const YEAR_END_RULE_OPTIONS = ['Saturday nearest January 31', 'Last Friday of January', 'Custom rule…'] as const;

// ==================== INTERFACES ====================

interface SystemConfig {
  groupReportingCurrency: string;
  gaap: string;
  epsCalc: string;
  numberFormat: string;
  decimalPlaces: number;
  thousandSeparator: string;
  decimalSeparator: string;
  scale: string;
  scaleShowIn: string;
  scaleSuffix: string;
  presentation: string;
  negativeNumberFormat: string;
  plugBs: string;
  plugPl: string;
  zeroDisplay: string;
  language: string;
}

interface PeriodConfig {
  currentYearDate: string;
  previousYearDate: string;
  priorPeriodYearDate: string;
  fyStart: string;
  numberOfPeriods: number;
  comparativePeriodsBs: string;
  fiscalYearType: string;
  yearEndRule: string;
}

interface FSTitlesConfig {
  balanceSheetTitle: string;
  profitAndLossTitle: string;
  cashFlowTitle: string;
  socieTitle: string;
  notesTitle: string;
}

// ==================== COMPONENT ====================

export default function ConfigurationPage() {
  const [activeTab, setActiveTab] = useState<'system' | 'period' | 'fsTitles'>('system');

  // System Config state
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    groupReportingCurrency: 'USD',
    gaap: 'IFRS',
    epsCalc: 'Basic',
    numberFormat: '1,234,567.89',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.',
    scale: 'Thousands (K)',
    scaleShowIn: "000's",
    scaleSuffix: 'K',
    presentation: 'Thousands (K)',
    negativeNumberFormat: '(1,000)',
    plugBs: 'Retained Earnings',
    plugPl: 'OCI',
    zeroDisplay: '0.00',
    language: 'English',
  });

  // Period Config state
  const [periodConfig, setPeriodConfig] = useState<PeriodConfig>({
    currentYearDate: '',
    previousYearDate: '',
    priorPeriodYearDate: '',
    fyStart: 'January',
    numberOfPeriods: 12,
    comparativePeriodsBs: '1',
    fiscalYearType: 'Calendar Year',
    yearEndRule: '',
  });

  // Financial Statement Titles state
  const [fsTitles, setFsTitles] = useState<FSTitlesConfig>({
    balanceSheetTitle: 'Statement of Financial Position for the year/period ended December 31, 2026',
    profitAndLossTitle: 'Statement of Profit and Loss for the period ended December 31, 2026',
    cashFlowTitle: 'Statement of Cash Flows',
    socieTitle: 'Statement of Changes in Equity',
    notesTitle: 'Notes to the Financial Statements',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch configurations on mount
  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    setLoading(true);
    try {
      const [sysRes, periodRes, fsTitlesRes] = await Promise.all([
        fetch('/api/configuration/system'),
        fetch('/api/configuration/period'),
        fetch('/api/configuration/fs-titles'),
      ]);
      const sysData = await sysRes.json();
      const periodData = await periodRes.json();
      const fsTitlesData = await fsTitlesRes.json();

      if (sysData.success && sysData.config) {
        setSystemConfig({
          groupReportingCurrency: sysData.config.groupReportingCurrency || 'USD',
          gaap: sysData.config.gaap || 'IFRS',
          epsCalc: sysData.config.epsCalc || 'Basic',
          numberFormat: sysData.config.numberFormat || '1,234,567.89',
          decimalPlaces: sysData.config.decimalPlaces ?? 2,
          thousandSeparator: sysData.config.thousandSeparator || ',',
          decimalSeparator: sysData.config.decimalSeparator || '.',
          scale: sysData.config.scale || 'Thousands (K)',
          scaleShowIn: sysData.config.scaleShowIn || '',
          scaleSuffix: sysData.config.scaleSuffix || '',
          presentation: sysData.config.presentation || 'Thousands (K)',
          negativeNumberFormat: sysData.config.negativeNumberFormat || '(1,000)',
          plugBs: sysData.config.plugBs || 'Retained Earnings',
          plugPl: sysData.config.plugPl || 'OCI',
          zeroDisplay: sysData.config.zeroDisplay || '0.00',
          language: sysData.config.language || 'English',
        });
      }

      if (periodData.success && periodData.config) {
        setPeriodConfig({
          currentYearDate: periodData.config.currentYearDate?.split('T')[0] || '',
          previousYearDate: periodData.config.previousYearDate?.split('T')[0] || '',
          priorPeriodYearDate: periodData.config.priorPeriodYearDate?.split('T')[0] || '',
          fyStart: periodData.config.fyStart || 'January',
          numberOfPeriods: periodData.config.numberOfPeriods ?? 12,
          comparativePeriodsBs: periodData.config.comparativePeriodsBs || '1',
          fiscalYearType: periodData.config.fiscalYearType || 'Calendar Year',
          yearEndRule: periodData.config.yearEndRule || '',
        });
      }

      if (fsTitlesData.success && fsTitlesData.config) {
        setFsTitles({
          balanceSheetTitle: fsTitlesData.config.balanceSheetTitle || '',
          profitAndLossTitle: fsTitlesData.config.profitAndLossTitle || '',
          cashFlowTitle: fsTitlesData.config.cashFlowTitle || '',
          socieTitle: fsTitlesData.config.socieTitle || '',
          notesTitle: fsTitlesData.config.notesTitle || '',
        });
      }
    } catch (err) {
      console.error('Error fetching configurations:', err);
      setError('Failed to load configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleSystemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSystemConfig((prev) => ({ ...prev, [name]: value }));
    setSuccess(null);
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPeriodConfig((prev) => ({ ...prev, [name]: value }));
    setSuccess(null);
  };

  const saveSystemConfig = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/configuration/system', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(systemConfig),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('System configuration saved successfully!');
      } else {
        setError(data.error || 'Failed to save system configuration');
      }
    } catch (err) {
      setError('Network error: Unable to save system configuration');
    } finally {
      setSaving(false);
    }
  };

  const savePeriodConfig = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/configuration/period', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(periodConfig),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Period configuration saved successfully!');
      } else {
        setError(data.error || 'Failed to save period configuration');
      }
    } catch (err) {
      setError('Network error: Unable to save period configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleFsTitlesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFsTitles((prev) => ({ ...prev, [name]: value }));
    setSuccess(null);
  };

  const saveFsTitles = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/configuration/fs-titles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fsTitles),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Financial statement titles saved successfully!');
      } else {
        setError(data.error || 'Failed to save financial statement titles');
      }
    } catch (err) {
      setError('Network error: Unable to save financial statement titles');
    } finally {
      setSaving(false);
    }
  };

  // Helper: Dropdown field
  const SelectField = ({
    label,
    name,
    value,
    options,
    onChange,
    required = false,
  }: {
    label: string;
    name: string;
    value: string | number;
    options: readonly (string | number)[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
  }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={String(opt)} value={opt}>
            {String(opt)}
          </option>
        ))}
      </select>
    </div>
  );

  // Helper: Text input
  const TextField = ({
    label,
    name,
    value,
    onChange,
    placeholder = '',
    required = false,
  }: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
  }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
      />
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white border-y border-gray-200 p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto"></div>
        <p className="mt-3 text-sm text-gray-500">Loading configurations...</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>
          {/* Header */}
          <div className="px-4 mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Configuration</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage system configuration and reporting parameters for your account.
            </p>
          </div>

          {/* Success / Error Banners */}
          {success && (
            <div className="mx-4 mb-4 bg-emerald-50 border border-emerald-200 rounded-md p-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-emerald-700">{success}</span>
            </div>
          )}
          {error && (
            <div className="mx-4 mb-4 bg-red-50 border border-red-200 rounded-md p-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Tabs */}
          <div className="px-4 mb-4 flex gap-1 border-b border-gray-200">
            <button
              onClick={() => { setActiveTab('system'); setError(null); setSuccess(null); }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === 'system'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              System Config
            </button>
            <button
              onClick={() => { setActiveTab('period'); setError(null); setSuccess(null); }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === 'period'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Period Config
            </button>
            <button
              onClick={() => { setActiveTab('fsTitles'); setError(null); setSuccess(null); }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === 'fsTitles'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              FS Titles
            </button>
          </div>

          {/* ==================== SYSTEM CONFIGURATION TAB ==================== */}
          {activeTab === 'system' && (
            <div className="bg-white border-y border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900">System Configuration and Reporting Parameters</h2>
                <p className="text-xs text-gray-500 mt-0.5">One configuration per account — changes apply globally.</p>
              </div>

              <div className="px-6 py-5 space-y-6">

                {/* Row 1: Currency, GAAP, EPS */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">General</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectField label="Group Reporting Currency" name="groupReportingCurrency" value={systemConfig.groupReportingCurrency} options={CURRENCIES} onChange={handleSystemChange} required />
                    <SelectField label="GAAP" name="gaap" value={systemConfig.gaap} options={GAAP_OPTIONS} onChange={handleSystemChange} required />
                    <SelectField label="EPS Calc" name="epsCalc" value={systemConfig.epsCalc} options={EPS_CALC_OPTIONS} onChange={handleSystemChange} required />
                  </div>
                </div>

                {/* Row 2: Number Format */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Number Format</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SelectField label="Number Format" name="numberFormat" value={systemConfig.numberFormat} options={NUMBER_FORMAT_OPTIONS} onChange={handleSystemChange} required />
                    <SelectField label="Decimal Places" name="decimalPlaces" value={systemConfig.decimalPlaces} options={DECIMAL_PLACES_OPTIONS} onChange={handleSystemChange} required />
                    <SelectField label="Thousand Separator" name="thousandSeparator" value={systemConfig.thousandSeparator} options={THOUSAND_SEP_OPTIONS} onChange={handleSystemChange} required />
                    <SelectField label="Decimal Separator" name="decimalSeparator" value={systemConfig.decimalSeparator} options={DECIMAL_SEP_OPTIONS} onChange={handleSystemChange} required />
                  </div>
                </div>

                {/* Row 3: Scale & Presentation */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Scale & Presentation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SelectField label="Scale" name="scale" value={systemConfig.scale} options={SCALE_OPTIONS} onChange={handleSystemChange} required />
                    <TextField label="Show In" name="scaleShowIn" value={systemConfig.scaleShowIn} onChange={handleSystemChange} placeholder="e.g. 000's" />
                    <TextField label="Suffix" name="scaleSuffix" value={systemConfig.scaleSuffix} onChange={handleSystemChange} placeholder="e.g. K, M" />
                    <SelectField label="Presentation" name="presentation" value={systemConfig.presentation} options={PRESENTATION_OPTIONS} onChange={handleSystemChange} required />
                  </div>
                </div>

                {/* Row 4: Negative, Plug, Zero, Language */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Display & Plug Accounts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SelectField label="Negative Number Format" name="negativeNumberFormat" value={systemConfig.negativeNumberFormat} options={NEGATIVE_FORMAT_OPTIONS} onChange={handleSystemChange} required />
                    <TextField label="Plug (BS)" name="plugBs" value={systemConfig.plugBs} onChange={handleSystemChange} placeholder="Retained Earnings" required />
                    <TextField label="Plug (P&L)" name="plugPl" value={systemConfig.plugPl} onChange={handleSystemChange} placeholder="OCI" required />
                    <SelectField label="Zero Display" name="zeroDisplay" value={systemConfig.zeroDisplay} options={ZERO_DISPLAY_OPTIONS} onChange={handleSystemChange} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <SelectField label="Language" name="language" value={systemConfig.language} options={LANGUAGE_OPTIONS} onChange={handleSystemChange} required />
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Preview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-gray-500">Sample Positive:</span>
                      <p className="font-mono font-semibold text-sm text-emerald-700">
                        {systemConfig.groupReportingCurrency} 1{systemConfig.thousandSeparator}234{systemConfig.thousandSeparator}567{systemConfig.decimalSeparator}{'0'.repeat(systemConfig.decimalPlaces)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Sample Negative:</span>
                      <p className="font-mono font-semibold text-sm text-red-700">{systemConfig.negativeNumberFormat}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Zero:</span>
                      <p className="font-mono font-semibold text-sm text-gray-700">{systemConfig.zeroDisplay === 'blank' ? '(blank)' : systemConfig.zeroDisplay}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Scale:</span>
                      <p className="font-mono font-semibold text-sm text-gray-700">{systemConfig.scale} {systemConfig.scaleSuffix && `(${systemConfig.scaleSuffix})`}</p>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button onClick={saveSystemConfig} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1.5">
                    {saving ? (<><div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>Saving...</>) : 'Save System Configuration'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== PERIOD CONFIGURATION TAB ==================== */}
          {activeTab === 'period' && (
            <div className="bg-white border-y border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900">Period Configuration</h2>
                <p className="text-xs text-gray-500 mt-0.5">Define fiscal year dates, periods and comparative settings.</p>
              </div>

              <div className="px-6 py-5 space-y-6">

                {/* Row 1: Year Dates */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Year Dates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Current Year <span className="text-red-500">*</span></label>
                      <input type="date" name="currentYearDate" value={periodConfig.currentYearDate} onChange={handlePeriodChange} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Previous Year <span className="text-red-500">*</span></label>
                      <input type="date" name="previousYearDate" value={periodConfig.previousYearDate} onChange={handlePeriodChange} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Prior Period Year</label>
                      <input type="date" name="priorPeriodYearDate" value={periodConfig.priorPeriodYearDate} onChange={handlePeriodChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" />
                    </div>
                  </div>
                </div>

                {/* Row 2: FY Start, Periods, Comparative */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Period Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectField label="FY Start" name="fyStart" value={periodConfig.fyStart} options={MONTHS} onChange={handlePeriodChange} required />
                    <SelectField label="Number of Periods" name="numberOfPeriods" value={periodConfig.numberOfPeriods} options={PERIOD_OPTIONS} onChange={handlePeriodChange} required />
                    <SelectField label="Comparative Periods (BS)" name="comparativePeriodsBs" value={periodConfig.comparativePeriodsBs} options={COMPARATIVE_BS_OPTIONS} onChange={handlePeriodChange} required />
                  </div>
                </div>

                {/* Row 3: Fiscal Year Type */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Fiscal Year Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField label="Fiscal Year Type" name="fiscalYearType" value={periodConfig.fiscalYearType} options={FISCAL_YEAR_TYPE_OPTIONS} onChange={handlePeriodChange} required />
                    {periodConfig.fiscalYearType === '52-53 Week Fiscal Year' && (
                      <SelectField label="Year End Rule" name="yearEndRule" value={periodConfig.yearEndRule} options={YEAR_END_RULE_OPTIONS} onChange={handlePeriodChange} required />
                    )}
                  </div>
                </div>

                {/* Period Summary Preview */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Period Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><span className="text-xs text-gray-500">Current Year:</span><p className="text-sm font-medium text-gray-900">{periodConfig.currentYearDate || 'Not set'}</p></div>
                    <div><span className="text-xs text-gray-500">Previous Year:</span><p className="text-sm font-medium text-gray-900">{periodConfig.previousYearDate || 'Not set'}</p></div>
                    <div><span className="text-xs text-gray-500">Fiscal Year:</span><p className="text-sm font-medium text-gray-900">{periodConfig.fyStart} – {periodConfig.numberOfPeriods} periods</p></div>
                    <div><span className="text-xs text-gray-500">Type:</span><p className="text-sm font-medium text-gray-900">{periodConfig.fiscalYearType}{periodConfig.yearEndRule && ` (${periodConfig.yearEndRule})`}</p></div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button onClick={savePeriodConfig} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1.5">
                    {saving ? (<><div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>Saving...</>) : 'Save Period Configuration'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== FINANCIAL STATEMENT TITLES TAB ==================== */}
          {activeTab === 'fsTitles' && (
            <div className="bg-white border-y border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900">Financial Statement Titles</h2>
                <p className="text-xs text-gray-500 mt-0.5">Edit the title text templates for each financial statement.</p>
              </div>

              <div className="px-6 py-5">
                {/* Table-style layout */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Statement</th>
                        <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: 'balanceSheetTitle', label: 'Balance Sheet', color: 'text-emerald-700' },
                        { name: 'profitAndLossTitle', label: 'Statement of P&L', color: 'text-blue-700' },
                        { name: 'cashFlowTitle', label: 'Cash Flow', color: 'text-purple-700' },
                        { name: 'socieTitle', label: 'SOCIE', color: 'text-amber-700' },
                        { name: 'notesTitle', label: 'Notes', color: 'text-gray-700' },
                      ].map(item => (
                        <tr key={item.name} className="hover:bg-gray-50/50">
                          <td className="py-3 px-4">
                            <span className={`text-sm font-medium ${item.color}`}>{item.label}</span>
                          </td>
                          <td className="py-3 px-4">
                            <textarea
                              name={item.name}
                              value={(fsTitles as any)[item.name]}
                              onChange={handleFsTitlesChange}
                              rows={2}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-5 pt-4 border-t border-gray-200">
                  <button onClick={saveFsTitles} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1.5">
                    {saving ? (<><div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>Saving...</>) : 'Save Financial Statement Titles'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

