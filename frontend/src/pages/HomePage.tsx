import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, SparklesIcon, ScaleIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import SearchBar from '../components/SearchBar';
import QuickFilters from '../components/QuickFilters';
import FeaturedCards from '../components/FeaturedCards';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const features = [
    {
      name: 'AI-Powered Search',
      description: 'Find cards using natural language like "best card for travel rewards"',
      icon: SparklesIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Smart Comparison',
      description: 'Compare multiple cards side-by-side with intelligent insights',
      icon: ScaleIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Comprehensive Database',
      description: '12+ cards from top Indian banks with detailed information',
      icon: CreditCardIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect
              <span className="text-primary-600 block">Credit Card</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover and compare Indian credit cards using AI-powered search.
              Get personalized recommendations based on your spending patterns.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                placeholder="Try: 'best card for online shopping' or 'premium travel card'"
                showSuggestions={true}
              />
            </div>

            {/* Quick Filters */}
            <QuickFilters onFilterClick={(filter) => navigate(`/search?filter=${filter}`)} />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose CardGuru?
            </h2>
            <p className="text-lg text-gray-600">
              Advanced technology meets financial expertise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.name} className="text-center">
                  <div className={`${feature.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured Cards Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Credit Cards
            </h2>
            <p className="text-lg text-gray-600">
              Most searched and compared cards this month
            </p>
          </div>
          
          <FeaturedCards />
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Ideal Card?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Start exploring our comprehensive database of Indian credit cards
          </p>
          <button
            onClick={() => navigate('/search')}
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
            <span>Start Searching</span>
          </button>
        </div>
      </div>
    </div>
  );
}
