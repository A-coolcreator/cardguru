import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { cardApi } from '../services/api';
import SearchBar from '../components/SearchBar';
import CardGrid from '../components/CardGrid';
import FilterSidebar from '../components/FilterSidebar';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    issuer: '',
    tier: '',
    annualFeeMax: '',
    hasLoungeAccess: false,
  });

  // Handle semantic search
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => cardApi.search(searchQuery),
    enabled: searchQuery.length > 0,
  });

  // Handle filtered results
  const { data: filteredResults, isLoading: isFiltering } = useQuery({
    queryKey: ['cards', filters],
    queryFn: () => cardApi.getCards({
      issuer: filters.issuer || undefined,
      tier: filters.tier || undefined,
      annualFeeMax: filters.annualFeeMax ? parseInt(filters.annualFeeMax) : undefined,
      hasLoungeAccess: filters.hasLoungeAccess || undefined,
      limit: 20,
    }),
    enabled: !searchQuery,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchParams({ q: query });
  };

  const cards = searchQuery ? searchResults?.results : filteredResults?.data;
  const isLoading = searchQuery ? isSearching : isFiltering;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Search for credit cards using natural language..."
          showSuggestions={true}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <FilterSidebar 
            filters={filters} 
            onFiltersChange={setFilters}
            disabled={!!searchQuery}
          />
        </div>

        {/* Results */}
        <div className="lg:w-3/4">
          {searchQuery && searchResults && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">
                Search Results for "{searchQuery}"
              </h3>
              <p className="text-blue-700 text-sm">
                {searchResults.explanation}
              </p>
            </div>
          )}

          <CardGrid cards={cards || []} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
