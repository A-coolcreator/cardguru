import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScaleIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cardApi, type CreditCard } from '../services/api';
import { toast } from 'react-hot-toast';

export default function ComparisonPage() {
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [showCardSelector, setShowCardSelector] = useState(false);

  // Get all cards for selection
  const { data: allCards, isLoading: isLoadingCards } = useQuery({
    queryKey: ['allCards'],
    queryFn: () => cardApi.getCards({ limit: 50 }),
  });

  // Compare selected cards
  const { data: comparison, isLoading: isComparing } = useQuery({
    queryKey: ['comparison', selectedCardIds],
    queryFn: () => cardApi.compare(selectedCardIds),
    enabled: selectedCardIds.length >= 2,
  });

  const addCard = (cardId: string) => {
    if (selectedCardIds.length >= 5) {
      toast.error('Maximum 5 cards can be compared');
      return;
    }
    if (!selectedCardIds.includes(cardId)) {
      setSelectedCardIds([...selectedCardIds, cardId]);
      toast.success('Card added to comparison');
    }
  };

  const removeCard = (cardId: string) => {
    setSelectedCardIds(selectedCardIds.filter(id => id !== cardId));
    toast.success('Card removed from comparison');
  };

  const selectedCards = comparison?.cards || [];
  const comparisonData = comparison?.comparison;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <ScaleIcon className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Compare Credit Cards</h1>
        </div>
        <p className="text-lg text-gray-600">
          Select 2-5 cards to compare their features side by side
        </p>
      </div>

      {/* Card Selection */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Selected Cards ({selectedCardIds.length}/5)
          </h2>
          <button
            onClick={() => setShowCardSelector(!showCardSelector)}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Cards</span>
          </button>
        </div>

        {/* Selected Cards Preview */}
        {selectedCardIds.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {selectedCards.map((card) => (
              <div key={card.id} className="flex items-center space-x-2 bg-primary-100 text-primary-800 px-3 py-2 rounded-lg">
                <span className="font-medium">{card.name}</span>
                <button
                  onClick={() => removeCard(card.id)}
                  className="text-primary-600 hover:text-primary-800"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Card Selector */}
        {showCardSelector && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Select Cards to Compare</h3>
            {isLoadingCards ? (
              <div className="text-center py-4">Loading cards...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCards?.data.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => addCard(card.id)}
                    disabled={selectedCardIds.includes(card.id)}
                    className={`p-4 text-left border rounded-lg hover:border-primary-300 transition-colors ${
                      selectedCardIds.includes(card.id)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{card.name}</div>
                    <div className="text-sm text-gray-600">{card.issuer}</div>
                    <div className="text-sm text-primary-600 mt-1">
                      ₹{card.annualFee.toLocaleString()} annual fee
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comparison Results */}
      {selectedCardIds.length >= 2 && (
        <div className="space-y-8">
          {/* Insights */}
          {comparisonData && (
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Comparison Insights
              </h3>
              <div className="space-y-2">
                {comparisonData.summary.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-blue-800">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Table */}
          {isComparing ? (
            <div className="text-center py-8">Loading comparison...</div>
          ) : selectedCards.length > 0 ? (
            <ComparisonTable cards={selectedCards} />
          ) : null}
        </div>
      )}

      {selectedCardIds.length === 0 && (
        <div className="text-center py-12">
          <ScaleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No cards selected
          </h3>
          <p className="text-gray-600">
            Choose at least 2 cards to start comparing
          </p>
        </div>
      )}
    </div>
  );
}

// Comparison Table Component
function ComparisonTable({ cards }: { cards: CreditCard[] }) {
  const features = [
    { key: 'name', label: 'Card Name' },
    { key: 'issuer', label: 'Bank' },
    { key: 'tier', label: 'Tier' },
    { key: 'annualFee', label: 'Annual Fee', format: (value: unknown) => `₹${(value as number).toLocaleString()}` },
    { key: 'eligibilityMinMonthlyIncome', label: 'Min Income', format: (value: unknown) => `₹${(value as number).toLocaleString()}` },
    { key: 'eligibilityMinCreditScore', label: 'Min Credit Score' },
    { key: 'loungeDomesticVisits', label: 'Lounge Visits', format: (value: unknown) => (value as number) ? `${value}/year` : 'None' },
    { key: 'welcomeOffer', label: 'Welcome Offer' },
    { key: 'feeWaiver', label: 'Fee Waiver', format: (value: unknown) => (value as boolean) ? 'Yes' : 'No' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                Feature
              </th>
              {cards.map((card) => (
                <th key={card.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">
                  {card.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {features.map((feature) => (
              <tr key={feature.key} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                  {feature.label}
                </td>
                {cards.map((card) => {
                  const value = (card as any)[feature.key];
                  const displayValue = feature.format ? feature.format(value) : value;
                  return (
                    <td key={card.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {displayValue || 'N/A'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
