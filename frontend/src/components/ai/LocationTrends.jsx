import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, TrendingUp, ArrowUp, DollarSign, BarChart3, Info, AlertCircle } from 'lucide-react';

const LocationTrends = ({ locations }) => {
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [activeTab, setActiveTab] = useState('table');
  
  // Process the location data to handle null values and format percentages
  const processedLocations = locations?.map(location => ({
    ...location,
    price_per_sqft: location.price_per_sqft || 0,
    percent_increase: location.percent_increase != null ? location.percent_increase : 0,
    rental_yield: location.rental_yield != null ? location.rental_yield : 0
  })) || [];
  
  if (!processedLocations || !Array.isArray(processedLocations) || processedLocations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center"
      >
        <div className="flex flex-col items-center justify-center py-8 sm:py-10">
          <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-3 sm:mb-4" />
          <p className="text-gray-500">No location data available</p>
          <p className="text-sm text-gray-400 mt-2">Try searching for a different city</p>
        </div>
      </motion.div>
    );
  }

  // Find best investment opportunities from valid data only
  const validRentalYields = processedLocations.filter(loc => loc.rental_yield > 0);
  const validAppreciations = processedLocations.filter(loc => loc.percent_increase > 0);
  
  const bestRentalYield = validRentalYields.length > 0 
    ? validRentalYields.sort((a, b) => b.rental_yield - a.rental_yield)[0] 
    : processedLocations[0];
    
  const bestAppreciation = validAppreciations.length > 0
    ? validAppreciations.sort((a, b) => b.percent_increase - a.percent_increase)[0]
    : processedLocations[0];

  // Format display values
  const formatValue = (value, suffix = '') => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'number') return `${value}${suffix}`;
    return `${value}${suffix}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-4 sm:p-6 rounded-lg shadow-md"
    >
      {/* Header - Stacked on mobile, side by side on larger screens */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Location Price Trends</h2>
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1 self-start sm:self-center">
          <button 
            className={`px-3 py-1 text-sm rounded-md transition-all ${activeTab === 'table' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('table')}
          >
            <span className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" /> Table
            </span>
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md transition-all ${activeTab === 'insights' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('insights')}
          >
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Insights
            </span>
          </button>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {activeTab === 'table' && (
          <motion.div
            key="table"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="overflow-x-auto -mx-4 sm:mx-0"
          >
            {/* Mobile Table View */}
            <div className="block sm:hidden">
              {processedLocations.map((location, index) => (
                <motion.div
                  key={index}
                  className="border-b border-gray-100 p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center mb-3">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    <h3 className="font-medium text-gray-900">{location.location}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 block mb-1">Price per sq.ft</span>
                      <span className="font-medium">
                        {location.price_per_sqft ? `₹${location.price_per_sqft.toLocaleString()}` : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">Annual Increase</span>
                      <div className="flex items-center">
                        {location.percent_increase != null ? (
                          <>
                            <span className="font-medium">{location.percent_increase}%</span>
                            {location.percent_increase >= 10 && (
                              <span className="ml-1.5 p-1 bg-green-100 rounded-full">
                                <ArrowUp className="w-3 h-3 text-green-600" />
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="font-medium text-gray-400">N/A</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">Rental Yield</span>
                      <div className="font-medium">
                        {location.rental_yield != null ? `${location.rental_yield}%` : 'N/A'}
                      </div>
                    </div>
                    <div>
                      {location.rental_yield != null && (
                        <div className="w-full mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${Math.min(100, location.rental_yield * 10)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden sm:block">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="py-3 px-4 text-left font-medium text-gray-700 rounded-tl-lg">Location</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Price per sq.ft (₹)</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Annual Increase (%)</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700 rounded-tr-lg">Rental Yield (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {processedLocations.map((location, index) => (
                    <motion.tr 
                      key={index} 
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} cursor-pointer transition-colors`}
                      onMouseEnter={() => setHighlightedRow(index)}
                      onMouseLeave={() => setHighlightedRow(null)}
                      animate={{ backgroundColor: highlightedRow === index ? '#f0f9ff' : index % 2 === 0 ? '#ffffff' : '#f9fafb' }}
                    >
                      <td className="py-3 px-4 font-medium">
                        <div className="flex items-center">
                          <MapPin className={`w-4 h-4 mr-2 ${highlightedRow === index ? 'text-blue-600' : 'text-gray-400'}`} />
                          {location.location}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {location.price_per_sqft ? `₹${location.price_per_sqft.toLocaleString()}` : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {location.percent_increase != null ? (
                            <>
                              {location.percent_increase}%
                              {location.percent_increase >= 10 && (
                                <span className="ml-1.5 p-1 bg-green-100 rounded-full">
                                  <ArrowUp className="w-3 h-3 text-green-600" />
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {location.rental_yield != null ? (
                            <>
                              {location.rental_yield}%
                              <div className="ml-2 w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-600 rounded-full"
                                  style={{ width: `${Math.min(100, location.rental_yield * 10)}%` }}
                                ></div>
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {validRentalYields.length === 0 || validAppreciations.length === 0 ? (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-700">
                    Some data is missing or incomplete. The insights shown may be limited.
                  </p>
                </div>
              </div>
            ) : null}
            
            {/* Responsive grid - 1 column on mobile, 2 on medium screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                  <h3 className="font-medium text-blue-800">Best Rental Yield</h3>
                </div>
                <div className="ml-7">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 break-words">
                    {bestRentalYield?.location || 'N/A'}
                  </div>
                  <div className="text-blue-700">
                    {bestRentalYield?.rental_yield != null ? `${bestRentalYield.rental_yield}% annual return` : 'Data not available'}
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <h3 className="font-medium text-green-800">Highest Appreciation</h3>
                </div>
                <div className="ml-7">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 break-words">
                    {bestAppreciation?.location || 'N/A'}
                  </div>
                  <div className="text-green-700">
                    {bestAppreciation?.percent_increase != null ? `${bestAppreciation.percent_increase}% annual growth` : 'Data not available'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 sm:p-5 rounded-lg border border-blue-100">
              <div className="flex items-center mb-4">
                <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                <h3 className="font-medium text-gray-800">Investment Insights</h3>
              </div>
              
              <ul className="space-y-4 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                {bestRentalYield?.rental_yield > 0 && (
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start"
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></span>
                    <span className="break-words">
                      <strong>{bestRentalYield.location}</strong> offers the highest rental yield at {bestRentalYield.rental_yield}%, making it ideal for income-focused investors.
                    </span>
                  </motion.li>
                )}
                
                {bestAppreciation?.percent_increase > 0 && (
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start"
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></span>
                    <span className="break-words">
                      <strong>{bestAppreciation.location}</strong> shows the strongest appreciation at {bestAppreciation.percent_increase}%, suggesting good potential for capital growth.
                    </span>
                  </motion.li>
                )}
                
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start"
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></span>
                  <span className="break-words">
                    Areas with rental yields above 4% and appreciation above 8% offer balanced investment opportunities for both income and growth.
                  </span>
                </motion.li>
                
                {processedLocations.some(loc => loc.rental_yield == null || loc.percent_increase == null) && (
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start text-amber-700 bg-amber-50 p-3 rounded-md"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                    <span>
                      Some locations have missing data. Consider this when making investment decisions or consult with a local real estate expert for more complete information.
                    </span>
                  </motion.li>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

LocationTrends.propTypes = {
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      location: PropTypes.string.isRequired,
      price_per_sqft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      percent_increase: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      rental_yield: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  )
};

export default LocationTrends;