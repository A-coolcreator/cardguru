import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, CreditCardIcon, CheckCircleIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { cardApi } from '../services/api';

export default function CardDetailsPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: card, isLoading, error } = useQuery({
    queryKey: ['card', id],
    queryFn: () => cardApi.getCard(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Card not found</h3>
          <p className="text-gray-600 mb-4">The credit card you're looking for doesn't exist.</p>
          <Link to="/search" className="btn-primary">
            Browse All Cards
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        to="/search"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <span>Back to Search</span>
      </Link>

      {/* Card Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
              <CreditCardIcon className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{card.name}</h1>
              <p className="text-lg text-gray-600">{card.issuer} • {card.network}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  card.tier === 'PREMIUM' 
                    ? 'bg-purple-100 text-purple-800'
                    : card.tier === 'MID'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {card.tier} TIER
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              ₹{card.annualFee.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Annual Fee</div>
            {card.feeWaiver && (
              <div className="text-sm text-green-600 mt-1">
                <CheckCircleIcon className="inline w-4 h-4 mr-1" />
                Fee waiver available
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {card.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {card.tags.map((tag) => (
            <span 
              key={tag}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Key Features */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
          <div className="space-y-4">
            <div>
              <div className="font-medium text-gray-900">Rewards Rate</div>
              <div className="text-sm text-gray-600 space-y-1">
                {Object.entries(card.rewardsRates).map(([category, rate]) => (
                  <div key={category} className="flex justify-between">
                    <span className="capitalize">{category}:</span>
                    <span className="font-medium">{rate}%</span>
                  </div>
                ))}
              </div>
            </div>

            {card.loungeDomesticVisits && card.loungeDomesticVisits > 0 && (
              <div>
                <div className="font-medium text-gray-900">Lounge Access</div>
                <div className="text-sm text-gray-600">
                  {card.loungeDomesticVisits} domestic visits per year
                  {card.loungeInternationalVisits && card.loungeInternationalVisits > 0 && 
                    `, ${card.loungeInternationalVisits} international visits`
                  }
                </div>
              </div>
            )}

            {card.fuelSurchargePercentage && (
              <div>
                <div className="font-medium text-gray-900">Fuel Surcharge Waiver</div>
                <div className="text-sm text-gray-600">
                  {card.fuelSurchargePercentage}% waiver 
                  {card.fuelSurchargeMaxCap && ` (up to ₹${card.fuelSurchargeMaxCap})`}
                </div>
              </div>
            )}

            {card.welcomeOffer && (
              <div>
                <div className="font-medium text-gray-900">Welcome Offer</div>
                <div className="text-sm text-gray-600">{card.welcomeOffer}</div>
              </div>
            )}
          </div>
        </div>

        {/* Eligibility & Requirements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Eligibility Requirements</h2>
          <div className="space-y-4">
            <div>
              <div className="font-medium text-gray-900">Minimum Monthly Income</div>
              <div className="text-sm text-gray-600">
                ₹{card.eligibilityMinMonthlyIncome.toLocaleString()}
              </div>
            </div>

            <div>
              <div className="font-medium text-gray-900">Minimum Credit Score</div>
              <div className="text-sm text-gray-600">{card.eligibilityMinCreditScore}</div>
            </div>

            <div>
              <div className="font-medium text-gray-900">NRI Eligible</div>
              <div className="text-sm text-gray-600">
                {card.eligibilityNri ? 'Yes' : 'No'}
              </div>
            </div>

            {card.feeWaiverThreshold && (
              <div>
                <div className="font-medium text-gray-900">Fee Waiver Condition</div>
                <div className="text-sm text-gray-600">
                  Spend ₹{card.feeWaiverThreshold.toLocaleString()} annually
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Perks */}
        {card.additionalPerks.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Perks</h2>
            <div className="space-y-2">
              {card.additionalPerks.map((perk, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{perk}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apply Button */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ready to Apply?</h2>
          <p className="text-gray-600 mb-4">
            Click below to visit the official application page for {card.name}.
          </p>
          <a
            href={card.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full inline-flex items-center justify-center space-x-2"
          >
            <span>Apply Now</span>
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
