import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  MapPin,
  IndianRupee,
  BedDouble,
  Bath,
  Heart,
  Layers,
  CalendarDays,
  Phone,
  Maximize,
  Share2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import PropTypes from "prop-types";
import { Backendurl } from "../../App";
const PropertyCard = ({ property, viewType }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const [loading, setLoading] = useState(false);
  const [views, setViews] = useState(property.views || 0);
  const isGrid = viewType === "grid";
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showDetailsButton, setShowDetailsButton] = useState(false);
  const handleNavigateToDetails = async () => {
    try {
      // First track the view
      const response = await axios.post(
        `${Backendurl}/api/products/${property._id}/views`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the view count in the UI
      setViews(response.data.views);

      // Then navigate to the details page
      navigate(`/properties/single/${property._id}`);
    } catch (error) {
      // If there's an error (like no auth), still navigate but don't update views
      console.error("Error tracking view:", error);
      navigate(`/properties/single/${property._id}`);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleImageNavigation = (e, direction) => {
    e.stopPropagation();
    const imagesCount = property.image.length;
    if (direction === "next") {
      setCurrentImageIndex((prev) => (prev + 1) % imagesCount);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + imagesCount) % imagesCount);
    }
  };

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await axios.get(
          `${Backendurl}/api/favorites/${property._id}/check`,
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

    if (localStorage.getItem("token")) {
      checkFavoriteStatus();
    }
  }, [property._id]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();

    if (!localStorage.getItem("token")) {
      toast.error("Please login to add favorites");
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        // Remove from favorites
        await axios.delete(`${Backendurl}/api/favorites/${property._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
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
        toast.success("Added to favorites");
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error(
        error.response?.data?.message || "Failed to update favorites"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
      className={`group bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 relative
        ${isGrid ? "flex flex-col" : "flex flex-row gap-6"}`}
      onClick={handleNavigateToDetails}
      onMouseEnter={() => {
        setShowControls(true);
        setShowDetailsButton(true);
      }}
      onMouseLeave={() => {
        setShowControls(false);
        setShowDetailsButton(false);
      }}
    >
      {/* Image Carousel Section */}
      <div className={`relative ${isGrid ? "h-64" : "w-96"}`}>
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={property.image[currentImageIndex]}
            alt={property.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover rounded-t-xl rounded-b-none"
          />
        </AnimatePresence>

        {/* Image Navigation Controls */}
        {showControls && property.image.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              onClick={(e) => handleImageNavigation(e, "prev")}
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              onClick={(e) => handleImageNavigation(e, "next")}
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </motion.button>
          </div>
        )}

        {/* Image Indicators */}
        {property.image.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {property.image.map((_, index) => (
              <motion.div
                key={index}
                initial={{ width: 6 }}
                animate={{ width: index === currentImageIndex ? 16 : 6 }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? "bg-white" : "bg-white/60"
                }`}
              />
            ))}
          </div>
        )}

        {/* Top Right Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-blue-50 transition-colors shadow-lg"
          >
            <Share2 className="w-4 h-4 text-gray-700" />
          </motion.button>
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

        {/* Property Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
          >
            {property.type}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`bg-gradient-to-r text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
              property.availability === "Rent"
                ? "from-green-600 to-green-500"
                : "from-purple-600 to-purple-500"
            }`}
          >
            {property.availability}
          </motion.span>
        </div>
      </div>

      {/* Content Section */}
      <div
        className={`flex-1 p-6 ${
          isGrid ? "" : "flex flex-col justify-between"
        }`}
      >
        <div className="space-y-4">
          {/* Location and Views */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-4 h-4 mr-2 text-blue-500" />
              <span className="line-clamp-1">{property.location}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Eye className="w-4 h-4" />
              <span>{views}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2">
            {property.description
              ? property.description.split(" ").slice(0, 10).join(" ") + "..."
              : "Modern amenities in prime location with great views..."}
          </p>

          {/* Price Section */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Price</p>
              <div className="flex items-center gap-1">
                <p className="text-lg font-medium text-blue-600">PKR</p>
                <span className="text-xl font-bold text-blue-600">
                  {Number(property.price).toLocaleString("en-IN")}
                </span>
                {property.availability === "Rent" && (
                  <span className="text-sm text-gray-500 ml-1">/month</span>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex gap-2">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`https://wa.me/${property.phone}?text=Hi, I'm interested in ${property.title} at ${property.location}`}
                onClick={(e) => e.stopPropagation()}
                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`tel:${property.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md"
              >
                <Phone className="w-4 h-4" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Property Features */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="flex flex-col items-center gap-1 bg-blue-50/80 hover:bg-blue-100 p-2 rounded-lg transition-colors">
            <BedDouble className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">
              {property.beds} {property.beds > 1 ? "Beds" : "Bed"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 bg-blue-50/80 hover:bg-blue-100 p-2 rounded-lg transition-colors">
            <Bath className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">
              {property.baths} {property.baths > 1 ? "Baths" : "Bath"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 bg-blue-50/80 hover:bg-blue-100 p-2 rounded-lg transition-colors">
            <Maximize className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">
              {property.sqft} sqft
            </span>
          </div>
        </div>
      </div>

      {/* Improved Floating View Details Button */}
      {showDetailsButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            handleNavigateToDetails();
          }}
          className="absolute bottom-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 
          bg-blue-600 hover:bg-blue-50 text-white hover:text-blue-600 py-2.5 px-6 rounded-lg 
          transition-all duration-200 border-2 border-blue-200 shadow-xl font-medium z-10
          flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </motion.button>
      )}
    </motion.div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.object.isRequired,
  viewType: PropTypes.string.isRequired,
};

export default PropertyCard;
