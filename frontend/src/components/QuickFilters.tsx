interface QuickFiltersProps {
  onFilterClick: (filter: string) => void;
}

const quickFilters = [
  { label: 'No Annual Fee', value: 'no-fee', color: 'bg-green-100 text-green-800' },
  { label: 'Premium Cards', value: 'premium', color: 'bg-purple-100 text-purple-800' },
  { label: 'Travel Rewards', value: 'travel', color: 'bg-blue-100 text-blue-800' },
  { label: 'Cashback', value: 'cashback', color: 'bg-orange-100 text-orange-800' },
  { label: 'Lounge Access', value: 'lounge', color: 'bg-indigo-100 text-indigo-800' },
  { label: 'Fuel Benefits', value: 'fuel', color: 'bg-red-100 text-red-800' },
];

export default function QuickFilters({ onFilterClick }: QuickFiltersProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {quickFilters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterClick(filter.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${filter.color}`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
