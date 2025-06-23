import { useState, useEffect, useRef } from "react";
import SearchForm from "../components/ai/SearchForm";
import PropertyCard from "../components/ai/PropertyCard";
import LocationTrends from "../components/ai/LocationTrends";
import AnalysisDisplay from "../components/ai/AnalysisDisplay";
import { searchProperties, getLocationTrends } from "../services/api";
import {
  Building,
  MapPin,
  TrendingUp,
  Brain,
  AlertCircle,
  Github,
  Download,
} from "lucide-react";
import PropTypes from "prop-types";
import AiHubSEO from "../components/SEO/AiHubSEO";
import StructuredData from "../components/SEO/StructuredData";

const AIPropertyHub = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [loadingTime, setLoadingTime] = useState(0);
  const [properties, setProperties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [propertyAnalysis, setPropertyAnalysis] = useState("");
  const [locationAnalysis, setLocationAnalysis] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isDeployedVersion, setIsDeployedVersion] = useState(false);
  const contentRef = useRef(null);

  // Timer for loading state
  useEffect(() => {
    // Check if we're running in a deployed environment (not localhost)
    const isDeployed =
      window.location.hostname !== "localhost" &&
      !window.location.hostname.startsWith("192.168") &&
      !window.location.hostname.startsWith("127.0.0.1");
    setIsDeployedVersion(isDeployed);

    document.title =
      "AI Property Hub | Zaroori Zameen - Real Estate Market Analysis";
  }, []);

  // Timer for loading state
  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setLoadingTime(0);
      setLoadingStage("");

      // Scroll to results when loading completes and results are available
      if (searchPerformed && contentRef.current) {
        setTimeout(() => {
          contentRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
    return () => clearInterval(interval);
  }, [isLoading, searchPerformed]);

  const handleSearch = async (searchParams) => {
    if (isDeployedVersion) {
      setSearchError(
        "AI features are only available in the local development environment. Please download the repository to use this feature."
      );
      return;
    }

    setIsLoading(true);
    setSearchError("");
    setSearchPerformed(true);
    setLoadingTime(0);

    try {
      // Fetch property data
      setLoadingStage("properties");
      const propertyResponse = await searchProperties(searchParams);
      console.log("Property Response:", propertyResponse); // Debug log
      setProperties(propertyResponse.properties || []);
      setPropertyAnalysis(propertyResponse.analysis || "");

      // Fetch location trends for the same city
      setLoadingStage("locations");
      const locationResponse = await getLocationTrends(searchParams.city);
      console.log("Location Response:", locationResponse); // Debug log
      setLocations(locationResponse.locations || []);
      setLocationAnalysis(locationResponse.analysis || "");
    } catch (error) {
      console.error("Error during search:", error);
      setSearchError("Failed to fetch property data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced loading indicator component
  const renderLoadingIndicator = () => {
    const getLoadingMessage = () => {
      if (loadingTime < 5) {
        return "Extracting property data from various sources...";
      } else if (loadingTime < 15) {
        return "Loading AI model for comprehensive analysis...";
      } else if (loadingTime < 30) {
        return "AI is analyzing property details and market conditions...";
      } else {
        return "Finalizing results and generating insights for you...";
      }
    };

    const getProgressWidth = () => {
      // Calculate progress percentage (max 95% so it doesn't look complete)
      const progress = Math.min(95, (loadingTime / 45) * 100);
      return `${progress}%`;
    };

    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12">
        {/* Loading animation with property icon - adjusted for better mobile view */}
        <div className="relative mb-8 sm:mb-12 pt-12 sm:pt-16">
          {/* Main circle - smaller on mobile */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center relative shadow-lg shadow-blue-500/30">
            {loadingStage === "properties" ? (
              <Building className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse" />
            ) : (
              <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse" />
            )}
          </div>

          {/* Responsive pulse circle */}
          <div className="absolute bottom-0 top-10 -right-4 sm:-right-6 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-blue-500 opacity-30 pulse-animation"></div>

          {/* Responsive orbiting dots */}
          <div className="absolute top-12 sm:top-16 left-1/2 w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-white shadow-md shadow-blue-300 orbit-animation"></div>
          <div className="absolute top-1/2 right-0 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-blue-200 orbit-animation-reverse"></div>
          <div className="absolute bottom-0 left-1/2 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-indigo-200 orbit-animation-slow"></div>
        </div>

        {/* Custom animations */}
        <style jsx global>{`
          @keyframes orbit {
            0% {
              transform: rotate(0deg) translateX(35px) rotate(0deg);
            }
            100% {
              transform: rotate(360deg) translateX(35px) rotate(-360deg);
            }
          }

          @keyframes orbit-reverse {
            0% {
              transform: rotate(0deg) translateX(40px) rotate(0deg);
            }
            100% {
              transform: rotate(-360deg) translateX(40px) rotate(-360deg);
            }
          }

          @keyframes orbit-slow {
            0% {
              transform: rotate(180deg) translateX(40px) rotate(-180deg);
            }
            100% {
              transform: rotate(-180deg) translateX(40px) rotate(180deg);
            }
          }

          @keyframes pulse {
            0% {
              transform: scale(0.8);
              opacity: 0.3;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.2;
            }
            100% {
              transform: scale(0.8);
              opacity: 0.3;
            }
          }

          .orbit-animation {
            transform: translateX(-50%);
            animation: orbit 3s linear infinite;
          }

          .orbit-animation-reverse {
            transform: translateX(50%);
            animation: orbit-reverse 4s linear infinite;
          }

          .orbit-animation-slow {
            transform: translateX(-50%) translateY(50%);
            animation: orbit-slow 5s linear infinite;
          }

          .pulse-animation {
            animation: pulse 2s ease-in-out infinite;
          }

          @media (max-width: 640px) {
            @keyframes orbit {
              0% {
                transform: rotate(0deg) translateX(25px) rotate(0deg);
              }
              100% {
                transform: rotate(360deg) translateX(25px) rotate(-360deg);
              }
            }
            @keyframes orbit-reverse {
              0% {
                transform: rotate(0deg) translateX(30px) rotate(0deg);
              }
              100% {
                transform: rotate(-360deg) translateX(30px) rotate(-360deg);
              }
            }
            @keyframes orbit-slow {
              0% {
                transform: rotate(180deg) translateX(30px) rotate(-180deg);
              }
              100% {
                transform: rotate(-180deg) translateX(30px) rotate(180deg);
              }
            }
          }
        `}</style>

        <div className="text-center mb-6 max-w-lg px-4">
          <h3 className="text-xl sm:text-2xl font-medium text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {loadingStage === "properties"
              ? "Finding Ideal Properties"
              : "Analyzing Market Trends"}
          </h3>
          <p className="text-gray-600 text-base sm:text-lg">
            {getLoadingMessage()}
          </p>
        </div>

        {/* Responsive progress bar */}
        <div className="w-full max-w-xs sm:max-w-md h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden mb-6 shadow-inner px-4 sm:px-0">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: getProgressWidth() }}
          ></div>
        </div>

        {/* Loading context message */}
        <div className="bg-blue-50 border border-blue-100 p-4 sm:p-5 rounded-lg max-w-xs sm:max-w-md shadow-md mx-4 sm:mx-0">
          <div className="flex items-center mb-3">
            <div className="mr-3">
              {loadingTime < 15 ? (
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              ) : (
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              )}
            </div>
            <h4 className="font-medium text-blue-800 text-sm sm:text-base">
              AI Processing
            </h4>
          </div>

          <p className="text-blue-700 text-xs sm:text-sm">
            {loadingTime < 20
              ? "Our AI is searching for properties that match your exact requirements and analyzing local market data."
              : "We're using advanced algorithms to evaluate property quality, value for money, and investment potential."}
          </p>

          {loadingTime > 15 && (
            <div className="mt-3 pt-3 border-t border-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <p className="text-xs text-blue-600 font-medium">
                  Deep analysis takes time for quality insights
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 pb-8 sm:pb-12">
      <AiHubSEO />
      <StructuredData type="aiHub" />
      <div className="container mx-auto px-4">
        {/* Hero section with gradient background - responsive padding */}
        <div className="mb-8 sm:mb-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-lg sm:shadow-xl">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
              AI Property Hub | Real Estate Analysis Tool
            </h1>
            <p className="text-blue-100 text-lg sm:text-xl mb-6 sm:mb-8">
              Discover your perfect property with AI-powered insights and market
              analysis
            </p>

            {isDeployedVersion ? (
              <div className="bg-white/95 backdrop-blur rounded-lg sm:rounded-xl p-5 sm:p-6 shadow-md sm:shadow-lg">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      AI Features Limited Online
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Due to API limitations, AI property features are only
                      available in local development environment.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span>View on GitHub</span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Repository</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md sm:shadow-lg">
                <SearchForm onSearch={handleSearch} isLoading={isLoading} />
              </div>
            )}
          </div>
        </div>

        {searchError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 sm:mb-8 max-w-4xl mx-auto border border-red-100 shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <p className="text-sm sm:text-base">{searchError}</p>
            </div>
          </div>
        )}

        {isLoading && renderLoadingIndicator()}

        <div ref={contentRef}>
          {!isLoading && searchPerformed && (
            <div className="space-y-8 sm:space-y-12">
              {/* Property Results Section */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center">
                  <Building className="mr-2 text-blue-600 flex-shrink-0" />
                  <span className="break-words">Property Results</span>
                </h2>

                {properties.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {properties.slice(0, 6).map((property, index) => (
                      <PropertyCard key={index} property={property} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <p className="text-sm sm:text-base text-yellow-700">
                      No properties found matching your criteria. Try adjusting
                      your search parameters.
                    </p>
                  </div>
                )}

                {propertyAnalysis && (
                  <div className="mt-6 sm:mt-8">
                    <AnalysisDisplay analysis={propertyAnalysis} />
                  </div>
                )}
              </div>

              {/* Location Trends Section */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center">
                  <TrendingUp className="mr-2 text-blue-600 flex-shrink-0" />
                  <span className="break-words">Location Insights</span>
                </h2>
                <LocationTrends locations={locations} />

                {locationAnalysis && (
                  <div className="mt-6 sm:mt-8">
                    <AnalysisDisplay analysis={locationAnalysis} />
                  </div>
                )}
              </div>
            </div>
          )}

          {(!isLoading && !searchPerformed) || isDeployedVersion ? (
            <div className="bg-white p-5 sm:p-8 rounded-lg sm:rounded-xl shadow-md max-w-4xl mx-auto text-center">
              <div className="mb-5 sm:mb-6">
                <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Brain className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  Welcome to AI Property Hub
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Our advanced AI analyzes real estate data to help you make
                  better property decisions
                </p>

                {isDeployedVersion && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
                    <p>
                      <strong>Note:</strong> AI features are currently only
                      available in the local development environment due to API
                      key restrictions.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
                <FeatureCard
                  icon={<Building className="w-5 h-5 sm:w-6 sm:h-6" />}
                  title="Property Analysis"
                  description="Discover properties matching your requirements with detailed AI insights"
                />
                <FeatureCard
                  icon={<MapPin className="w-5 h-5 sm:w-6 sm:h-6" />}
                  title="Location Trends"
                  description="Evaluate neighborhood growth, rental yields, and price appreciation"
                />
                <FeatureCard
                  icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />}
                  title="Investment Insights"
                  description="Get expert recommendations on property investment potential"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-100">
    <div className="text-blue-600 mb-2 sm:mb-3">{icon}</div>
    <h3 className="font-semibold text-gray-800 mb-1.5 sm:mb-2 text-sm sm:text-base">
      {title}
    </h3>
    <p className="text-gray-600 text-xs sm:text-sm">{description}</p>
  </div>
);

FeatureCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default AIPropertyHub;
