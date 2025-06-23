import { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Search, Home, MapPin, IndianRupee, Building } from "lucide-react";

const SearchForm = ({ onSearch, isLoading }) => {
  const [searchParams, setSearchParams] = useState({
    city: "",
    maxPrice: 3,
    propertyCategory: "Residential",
    propertyType: "Flat",
  });

  const [activeField, setActiveField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: name === "maxPrice" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const popularCities = [
    "Islamabad",
    "Peshawar",
    "Karachi",
    "Lahore",
    "Quetta",
    "Multan",
  ];

  const handleCitySelect = (city) => {
    setSearchParams((prev) => ({
      ...prev,
      city,
    }));
    setActiveField(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg border border-gray-100"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div className="p-2 bg-blue-100 rounded-lg mr-3 w-10 h-10 flex items-center justify-center">
          <Search className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Find Your Dream Property
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* City Field with Suggestions */}
        <div className="relative">
          <label
            htmlFor="city"
            className="flex items-center text-sm font-medium text-gray-700 mb-1.5"
          >
            <MapPin className="w-4 h-4 mr-1.5 text-blue-600" />
            City
          </label>
          <div className="relative">
            <input
              type="text"
              id="city"
              name="city"
              value={searchParams.city}
              onChange={handleChange}
              onFocus={() => setActiveField("city")}
              onBlur={() => setTimeout(() => setActiveField(null), 100)}
              placeholder="Enter city name (e.g., Islamabad)"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow text-sm sm:text-base"
              required
            />
            {activeField === "city" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2"
              >
                <p className="px-3 py-1 text-xs font-medium text-gray-500">
                  Popular Cities
                </p>
                <div className="mt-1 max-h-48 overflow-y-auto">
                  {popularCities.map((city) => (
                    <div
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-700 flex items-center"
                    >
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {city}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Price Field */}
          <div>
            <label
              htmlFor="maxPrice"
              className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1.5"
            >
              <p className="text-xl text-blue-600">Rs </p>
              Maximum Price (in Crores)
            </label>
            <div className="relative">
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                min="0.5"
                max="50"
                step="0.1"
                value={searchParams.maxPrice}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow text-sm sm:text-base"
                required
              />
              <span className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                Cr
              </span>
            </div>
          </div>

          {/* Property Type Field */}
          <div>
            <label
              htmlFor="propertyType"
              className="flex items-center text-sm font-medium text-gray-700 mb-1.5"
            >
              <Home className="w-4 h-4 mr-1.5 text-blue-600" />
              Property Type
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={searchParams.propertyType}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow appearance-none text-sm sm:text-base"
            >
              <option value="Individual House">Individual House</option>
              <option value="Office">Office</option>
              <option value="Plot">Plot</option>
              <option value="Commercial">Commercial</option>
              <option value="Flat">Flat</option>
            </select>
          </div>

          {/* Property Category Field */}
          <div>
            <label
              htmlFor="propertyCategory"
              className="flex items-center text-sm font-medium text-gray-700 mb-1.5"
            >
              <Building className="w-4 h-4 mr-1.5 text-blue-600" />
              Property Category
            </label>
            <select
              id="propertyCategory"
              name="propertyCategory"
              value={searchParams.propertyCategory}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow appearance-none text-sm sm:text-base"
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          {/* Price Range Selector */}
          <div>
            <label className="flex items-center gap-1  text-sm font-medium text-gray-700 mb-2 sm:mb-4">
              <p className=" text-blue-600 text-lg">Rs</p>
              Price Range: Rs{searchParams.maxPrice} Cr
            </label>
            <input
              type="range"
              min="0.5"
              max="50"
              step="0.5"
              value={searchParams.maxPrice}
              onChange={(e) =>
                handleChange({
                  target: { name: "maxPrice", value: e.target.value },
                })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Rs 50L</span>
              <span>Rs 50Cr</span>
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          disabled={isLoading}
          className="w-full mt-2 sm:mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 font-medium shadow-lg disabled:opacity-70"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-sm sm:text-base">
                Searching for Properties...
              </span>
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">Find Properties</span>
            </span>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

SearchForm.propTypes = {
  onSearch: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default SearchForm;
