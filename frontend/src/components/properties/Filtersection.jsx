import { Home, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { LuCurrency } from "react-icons/lu";
const propertyTypes = ["House", "Apartment", "Villa", "Office"];
const availabilityTypes = ["Rent", "Buy", "Lease"];
const priceRanges = [
  { min: 0, max: 5000000, label: "Under Rs 50L" },
  { min: 5000000, max: 10000000, label: "Rs 50L  - Rs 1Cr" },
  { min: 10000000, max: 20000000, label: "Rs 1Cr - Rs 2Cr" },
  { min: 20000000, max: Number.MAX_SAFE_INTEGER, label: "Above Rs 2Cr" },
];

const FilterSection = ({ filters, setFilters, onApplyFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceRangeChange = (min, max) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [min, max],
    }));
  };

  const handleReset = () => {
    setFilters({
      propertyType: "",
      priceRange: [0, Number.MAX_SAFE_INTEGER],
      bedrooms: "0",
      bathrooms: "0",
      availability: "",
      searchQuery: "",
      sortBy: "",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white p-4 rounded-xl shadow-lg"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <button
          onClick={handleReset}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-6">
        {/* Property Type */}
        <div className="filter-group">
          <label className="filter-label">
            <Home className="w-4 h-4 mr-2" />
            Property Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() =>
                  handleChange({
                    target: { name: "propertyType", value: type.toLowerCase() },
                  })
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    filters.propertyType === type.toLowerCase()
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="filter-group">
          <label className="filter-label">
            <LuCurrency className="w-4 h-4 mr-2" />
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            {priceRanges.map(({ min, max, label }) => (
              <button
                key={label}
                onClick={() => handlePriceRangeChange(min, max)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    filters.priceRange[0] === min &&
                    filters.priceRange[1] === max
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Rest of your existing filter groups */}
        {/* ... */}

        <div className="flex space-x-4 mt-8">
          <button
            onClick={() => onApplyFilters(filters)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 
              transition-colors font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterSection;
