import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  BedDouble,
  Layers,
  CalendarDays,
  Check,
  Heart,
  Bath,
  Maximize,
  ArrowLeft,
  Phone,
  Calendar,
  MapPin,
  Loader,
  Building,
  Share2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Compass,
} from "lucide-react";
import { Backendurl } from "../../App.jsx";
import ScheduleViewing from "./ScheduleViewing";
// Add this function to handle favorite toggling

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Add toggle function
  const toggleFavorite = async () => {
    if (!localStorage.getItem("token")) {
      toast.error("Please login to add favorites");
      return;
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        await axios.delete(`${Backendurl}/api/favorites/${property._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        // Add to favorites
        await axios.post(
          `${Backendurl}/api/favorites/${property._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error(
        error.response?.data?.message || "Failed to update favorites"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        if (!localStorage.getItem("token")) return;

        const response = await axios.get(
          `${Backendurl}/api/favorites/${id}/check`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsFavorite(response.data.isFavorite);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [id]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${Backendurl}/api/products/single/${id}`
        );

        if (response.data.success) {
          const propertyData = response.data.property;
          setProperty({
            ...propertyData,
            amenities: parseAmenities(propertyData.amenities),
          });

          setError(null);
        } else {
          setError(response.data.message || "Failed to load property details.");
        }
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Failed to load property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    // Reset scroll position and active image when component mounts
    window.scrollTo(0, 0);
    setActiveImage(0);
  }, [id]);

  const parseAmenities = (amenities) => {
    if (!amenities) return [];

    try {
      // If already an array, return as-is
      if (Array.isArray(amenities)) {
        return amenities;
      }

      // Handle string cases
      if (typeof amenities === "string") {
        // Try to parse as JSON first
        try {
          return JSON.parse(amenities.replace(/'/g, '"'));
        } catch (jsonError) {
          // If JSON parsing fails, try to split by comma
          if (amenities.includes(",")) {
            return amenities.split(",").map((item) => item.trim());
          }
          // If it's a single string value, wrap in array
          return [amenities.trim()];
        }
      }

      // For any other case, return empty array
      return [];
    } catch (error) {
      console.error("Error parsing amenities:", error);
      return [];
    }
  };

  const handleKeyNavigation = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") {
        setActiveImage((prev) =>
          prev === 0 ? property.image.length - 1 : prev - 1
        );
      } else if (e.key === "ArrowRight") {
        setActiveImage((prev) =>
          prev === property.image.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === "Escape" && showSchedule) {
        setShowSchedule(false);
      }
    },
    [property?.image?.length, showSchedule]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyNavigation);
    return () => window.removeEventListener("keydown", handleKeyNavigation);
  }, [handleKeyNavigation]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Check out this ${property.type}: ${property.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="w-32 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Main Content Skeleton */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Image Gallery Skeleton */}
            <div className="relative h-[500px] bg-gray-200 rounded-xl mb-8 animate-pulse">
              {/* Image Navigation Buttons */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 rounded-full"></div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 rounded-full"></div>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-black/20 rounded-full"></div>
            </div>

            {/* Content Skeleton */}
            <div className="p-8">
              {/* Title and Location */}
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-3 w-full max-w-md">
                  <div className="h-10 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Price Box */}
                  <div className="h-28 bg-blue-50/50 rounded-lg animate-pulse"></div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-24 bg-gray-100 rounded-lg animate-pulse"
                      ></div>
                    ))}
                  </div>

                  {/* Contact */}
                  <div className="space-y-2">
                    <div className="h-7 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>
                  </div>

                  {/* Button */}
                  <div className="h-12 bg-blue-200 rounded-lg animate-pulse"></div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Description */}
                  <div className="space-y-2">
                    <div className="h-7 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse mt-2"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-4/5 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-2">
                    <div className="h-7 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-6 bg-gray-200 rounded-lg animate-pulse"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Location Skeleton */}
          <div className="mt-8 p-6 bg-blue-50/50 rounded-xl animate-pulse">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
              <div className="h-7 bg-gray-300 rounded-lg w-1/6"></div>
            </div>
            <div className="h-5 bg-gray-300 rounded-lg w-4/5 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded-lg w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            to="/properties"
            className="text-blue-600 hover:underline flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-8">
          <Link
            to="/properties"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Properties
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
              hover:bg-gray-100 transition-colors relative"
          >
            {copySuccess ? (
              <span className="text-green-600">
                <Copy className="w-5 h-5" />
                Copied!
              </span>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                Share
              </>
            )}
          </button>
        </nav>
        {/* card  */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
          {/* Image Gallery */}
          <div className="relative h-[350px] md:h-[450px] bg-gray-100 rounded-xl overflow-hidden mb-4">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={property.image[activeImage]}
                alt={`${property.title} - View ${activeImage + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Image Navigation */}
            {property.image.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage((prev) =>
                      prev === 0 ? property.image.length - 1 : prev - 1
                    );
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full
          bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200
          shadow-sm hover:shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage((prev) =>
                      prev === property.image.length - 1 ? 0 : prev + 1
                    );
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full
          bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200
          shadow-sm hover:shadow-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 
      bg-black/50 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-xs
      transition-all duration-200 hover:bg-black/60"
            >
              {activeImage + 1} / {property.image.length}
            </div>
          </div>

          <div className="p-5 md:p-6">
            <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 mr-1.5 text-blue-500" />
                  <span>{property.location}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-full  shadow-lg  hover:bg-gray-100 transition-colors"
                  title="Share property"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleFavorite}
                  disabled={loading}
                  className={`p-2 rounded-full shadow-lg transition-colors ${
                    isFavorite
                      ? "bg-red-100 text-red-500 hover:bg-red-200"
                      : "bg-white/90 hover:bg-gray-100 text-gray-700"
                  }`}
                  aria-label={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <Heart
                    className="w-4 h-4"
                    fill={isFavorite ? "currentColor" : "none"}
                  />
                  {loading && <span className="sr-only">Loading...</span>}
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                {/* Price Box */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
                  <p className="text-xl md:text-2xl font-bold text-blue-600">
                    Rs {Number(property.price).toLocaleString("en-IN")}
                  </p>
                  <p className="text-gray-500 text-sm">
                    <span className="font-medium">{property.availability}</span>
                    {property.availability === "Rent" ? " per month" : ""}
                  </p>
                </div>

                {/* Property Features */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-gray-50 p-2 rounded-lg text-center border border-gray-100">
                    <BedDouble className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">
                      {property.beds} {property.beds > 1 ? "Beds" : "Bed"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center border border-gray-100">
                    <Bath className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">
                      {property.baths} {property.baths > 1 ? "Baths" : "Bath"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center border border-gray-100">
                    <Maximize className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">
                      {property.sqft} sqft
                    </p>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Contact Owner</h2>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Phone className="w-4 h-4 mr-1.5 text-blue-500" />
                      <span>{property.phone}</span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`https://wa.me/${property.phone}?text=Hi, I'm interested in ${property.title} at ${property.location} (${Backendurl}/properties/${property._id})`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-lg
                hover:bg-green-600 transition-colors w-full justify-center text-sm"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp
                      </a>
                      <a
                        href={`tel:${property.phone}`}
                        className="flex items-center gap-1.5 bg-blue-500 text-white px-3 py-1.5 rounded-lg
                hover:bg-blue-600 transition-colors w-full justify-center text-sm"
                      >
                        <Phone className="w-4 h-4" />
                        Call Now
                      </a>
                    </div>
                  </div>
                </div>

                {/* Schedule Viewing */}
                <button
                  onClick={() => setShowSchedule(true)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg 
          hover:bg-blue-700 transition-colors flex items-center 
          justify-center gap-1.5 shadow-sm hover:shadow-md text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Viewing
                </button>
              </div>

              {/* Right Column */}
              <div>
                {/* Description */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Description</h2>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Amenities</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {property.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100 text-sm"
                      >
                        <Check className="w-3.5 h-3.5 mr-1.5 text-green-500 flex-shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-1.5 text-sm">
                    Property Details
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center text-gray-600">
                      <Building className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                      <span>Type: {property.type}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Layers className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                      <span>Floors: {property.floors || "N/A"}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                      <span>Year Built: {property.yearBuilt || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Map Location */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-2 text-blue-600 mb-4">
            <Compass className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Location</h3>
          </div>
          <p className="text-gray-600 mb-4">{property.location}</p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(
              property.location
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <MapPin className="w-4 h-4" />
            View on Google Maps
          </a>
        </div>

        {/* Viewing Modal */}
        <AnimatePresence>
          {showSchedule && (
            <ScheduleViewing
              propertyId={property._id}
              onClose={() => setShowSchedule(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PropertyDetails;
