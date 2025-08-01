import { Link } from 'react-router-dom';
import { type CreditCard } from '../services/api';
import { CreditCardIcon, StarIcon } from '@heroicons/react/24/outline';

interface CardGridProps {
  cards: CreditCard[];
  isLoading: boolean;
}

export default function CardGrid({ cards, isLoading }: CardGridProps) {
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

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No cards found</h3>
        <p className="text-gray-600">Try adjusting your search terms or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          {cards.length} card{cards.length !== 1 ? 's' : ''} found
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <Link 
            key={card.id} 
            to={`/card/${card.id}`}
            className="card-hover group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <CreditCardIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {card.name}
                  </h3>
                  <p className="text-sm text-gray-600">{card.issuer} • {card.network}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {card.similarity && (
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {(card.similarity * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
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
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {card.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xl font-bold text-gray-900">
                  ₹{card.annualFee.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600 ml-1">annual fee</span>
              </div>
              
              {card.feeWaiver && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Fee waiver available
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {card.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              {card.loungeDomesticVisits && card.loungeDomesticVisits > 0 && (
                <div className="flex items-center text-green-600">
                  <span>✈️ {card.loungeDomesticVisits} lounge visits/year</span>
                </div>
              )}
              
              {Object.entries(card.rewardsRates).slice(0, 2).map(([category, rate]) => (
                <div key={category} className="flex items-center text-blue-600">
                  <span>💰 {rate}% on {category}</span>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
