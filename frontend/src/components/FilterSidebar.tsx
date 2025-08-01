import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface Filters {
  issuer: string;
  tier: string;
  annualFeeMax: string;
  hasLoungeAccess: boolean;
}

interface FilterSidebarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  disabled?: boolean;
}

const issuers = ['HDFC', 'AXIS', 'ICICI', 'SBI', 'KOTAK'];
const tiers = ['ENTRY', 'MID', 'PREMIUM'];
const feeRanges = [
  { label: 'Free (₹0)', value: '0' },
  { label: 'Under ₹1,000', value: '1000' },
  { label: 'Under ₹5,000', value: '5000' },
  { label: 'Under ₹10,000', value: '10000' },
];

export default function FilterSidebar({ filters, onFiltersChange, disabled = false }: FilterSidebarProps) {
  const updateFilter = (key: keyof Filters, value: string | boolean) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      issuer: '',
      tier: '',
      annualFeeMax: '',
      hasLoungeAccess: false,
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== false
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            disabled={disabled}
            className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
          >
            Clear all
          </button>
        )}
      </div>

      {disabled && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Filters are disabled during search. Clear your search to use filters.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Bank/Issuer Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Bank
          </label>
          <div className="space-y-2">
            {issuers.map((issuer) => (
              <label key={issuer} className="flex items-center">
                <input
                  type="radio"
                  name="issuer"
                  value={issuer}
                  checked={filters.issuer === issuer}
                  onChange={(e) => updateFilter('issuer', e.target.value)}
                  disabled={disabled}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">{issuer}</span>
              </label>
            ))}
            <label className="flex items-center">
              <input
                type="radio"
                name="issuer"
                value=""
                checked={filters.issuer === ''}
                onChange={(e) => updateFilter('issuer', e.target.value)}
                disabled={disabled}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 disabled:opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">All Banks</span>
            </label>
          </div>
        </div>

        {/* Card Tier Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Card Tier
          </label>
          <div className="space-y-2">
            {tiers.map((tier) => (
              <label key={tier} className="flex items-center">
                <input
                  type="radio"
                  name="tier"
                  value={tier}
                  checked={filters.tier === tier}
                  onChange={(e) => updateFilter('tier', e.target.value)}
                  disabled={disabled}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {tier.toLowerCase()}
                </span>
              </label>
            ))}
            <label className="flex items-center">
              <input
                type="radio"
                name="tier"
                value=""
                checked={filters.tier === ''}
                onChange={(e) => updateFilter('tier', e.target.value)}
                disabled={disabled}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 disabled:opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">All Tiers</span>
            </label>
          </div>
        </div>

        {/* Annual Fee Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Annual Fee
          </label>
          <div className="space-y-2">
            {feeRanges.map((range) => (
              <label key={range.value} className="flex items-center">
                <input
                  type="radio"
                  name="annualFeeMax"
                  value={range.value}
                  checked={filters.annualFeeMax === range.value}
                  onChange={(e) => updateFilter('annualFeeMax', e.target.value)}
                  disabled={disabled}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
            <label className="flex items-center">
              <input
                type="radio"
                name="annualFeeMax"
                value=""
                checked={filters.annualFeeMax === ''}
                onChange={(e) => updateFilter('annualFeeMax', e.target.value)}
                disabled={disabled}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 disabled:opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Any Fee</span>
            </label>
          </div>
        </div>

        {/* Benefits Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Benefits
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasLoungeAccess}
                onChange={(e) => updateFilter('hasLoungeAccess', e.target.checked)}
                disabled={disabled}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded disabled:opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Lounge Access</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
