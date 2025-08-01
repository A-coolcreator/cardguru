import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { cardApi, type CreditCard } from '../services/api';
import { CreditCardIcon } from '@heroicons/react/24/outline';

export default function FeaturedCards() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['featuredCards'],
    queryFn: () => cardApi.getCards({ limit: 6 }),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load featured cards</p>
      </div>
    );
  }

  const cards = data?.data || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card: CreditCard) => (
        <Link 
          key={card.id} 
          to={`/card/${card.id}`}
          className="card-hover group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <CreditCardIcon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {card.name}
                </h3>
                <p className="text-sm text-gray-600">{card.issuer}</p>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              card.tier === 'PREMIUM' 
                ? 'bg-purple-100 text-purple-800'
                : card.tier === 'MID'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {card.tier}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {card.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900">
                ₹{card.annualFee.toLocaleString()}
              </span>
              <span className="text-sm text-gray-600 ml-1">annual fee</span>
            </div>
            
            {card.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {card.loungeDomesticVisits && card.loungeDomesticVisits > 0 && (
            <div className="mt-3 text-sm text-green-600">
              ✈️ {card.loungeDomesticVisits} lounge visits/year
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
