import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MapPin, ArrowRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Backendurl } from "../App";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";

import {
  IndianRupee,
  BedDouble,
  Bath,
  Heart,
  Layers,
  CalendarDays,
  Phone,
  Maximize,
  Share2,
  Loader,
  Eye,
} from "lucide-react";
// Sample featured properties for fallback
const sampleProperties = [
  {
    _id: "sample1",
    title: "Luxury Beachfront Villa",
    location: "Islamabad",
    price: 25000000,
    beds: 4,
    baths: 3,
    sqft: 2800,
    type: "Villa",
    availability: "Buy",
    image: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    ],
  },
  {
    _id: "sample2",
    title: "Modern Highrise Apartment",
    location: "Lahore",
    price: 18500000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    type: "Apartment",
    availability: "Rent",
    image: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    ],
  },
  {
    _id: "sample3",
    title: "Riverside Townhouse",
    location: "Peshawar",
    price: 12000000,
    beds: 3,
    baths: 2.5,
    sqft: 2200,
    type: "House",
    availability: "Buy",
    image: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    ],
  },
];

export const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleNavigate = () => {
    navigate(`/properties/single/${property._id}`);
  };

  // Check favorite status when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        if (!localStorage.getItem("token")) return;

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

    checkFavoriteStatus();
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

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.image.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.image.length - 1 : prev - 1
    );
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Image Slider */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={property.image[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {/* Navigation Arrows */}
        {property.image.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
        <div className="absolute top-3 left-3 bg-blue-900/30 backdrop-blur-sm px-2  rounded-full shadow-sm">
          <span className="font-normal text-sm text-white ">
            {property.type}
          </span>
        </div>
        {/* Price Tag */}
        <div className="absolute top-12 left-3 bg-blue-900/30 backdrop-blur-sm px-2  rounded-full shadow-sm">
          <span className="font-normal text-sm text-white ">
            PKR {Number(property.price).toLocaleString()}
          </span>
        </div>
        {/* Favorite Button */}

        <motion.button
          onClick={toggleFavorite}
          disabled={loading}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            isFavorite
              ? "text-red-500 bg-red-50 hover:bg-red-500 hover:text-red-50"
              : "text-gray-400 bg-white hover:text-red-500 hover:bg-gray-100"
          }`}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
            duration: 0.2,
          }}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div
              key={isFavorite ? "filled" : "outline"}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
              />
            </motion.div>
          )}
        </motion.button>
      </div>
      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 mb-1">
          {property.title}
        </h3>

        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1 text-blue-600" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        {/* 10-word Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description.split(" ").slice(0, 10).join(" ")}...
        </p>

        {/* View Details Button */}
        <button
          onClick={handleNavigate}
          className="mt-auto bg-indigo-600 border border-indigo-600 hover:bg-transparent  text-white py-2 px-4 rounded-lg text-sm font-medium hover:text-indigo-600  w-full transition-all duration-300 ease-in-out"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
};

const PropertiesShow = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const navigate = useNavigate();

  const categories = [
    { id: "all", label: "All Properties" },
    { id: "house", label: "Houses" },
    { id: "office", label: "Office" },
    { id: "apartment", label: "Apartments" },
    { id: "plot", label: "Plot" },
    { id: "commercial", label: "Commercial" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Backendurl}/api/products/approved`);

        if (response.data.success) {
          // Take only the first 6 properties for featured section
          const featuredProperties = response.data.data.slice(0, 6); // Changed from property to data
          setProperties(featuredProperties);
        } else {
          setError("Failed to fetch properties");
          // Fallback to sample data in case of API error
          setProperties(sampleProperties);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties. Using sample data instead.");
        // Fallback to sample data
        setProperties(sampleProperties);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties =
    activeCategory === "all"
      ? properties
      : properties.filter(
          (property) => property.type.toLowerCase() === activeCategory
        );

  const viewAllProperties = () => {
    navigate("/properties");
  };

  if (loading) {
    return (
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4 mx-auto mb-16"></div>

            <div className="h-10 bg-gray-100 rounded-lg w-full max-w-md mx-auto mb-8 flex justify-center gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-8 bg-gray-200 rounded-full w-24"
                ></div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-xl shadow h-96">
                  <div className="h-64 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
            Explore Properties
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
            Featured Properties
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties designed to
            match your lifestyle needs
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200
                ${
                  activeCategory === category.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "bg-white text-gray-700 hover:bg-blue-50 shadow-lg"
                }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-amber-700 bg-amber-50 p-4 rounded-lg border border-amber-200 mb-8 max-w-md mx-auto text-center"
          >
            <p className="font-medium mb-1">Note: {error}</p>
            <p className="text-sm">
              Showing sample properties for demonstration.
            </p>
          </motion.div>
        )}

        {properties.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProperties.map((property) => (
              <motion.div key={property._id} variants={itemVariants}>
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No properties available
            </h3>
            <p className="text-gray-600 mb-6">
              No properties found in this category.
            </p>
            <button
              onClick={() => setActiveCategory("all")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Properties
            </button>
          </div>
        )}

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button
            onClick={viewAllProperties}
            className="inline-flex items-center px-6 py-3 bg-blue-600 border border-blue-600 text-white rounded-lg hover:bg-transparent  hover:text-blue-600 shadow-lg shadow-blue-600/20 font-medium transition-all duration-300 ease-in-out"
          >
            Browse All Properties
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
          <p className="text-gray-600 mt-4 text-sm">
            Discover our complete collection of premium properties
          </p>
        </motion.div>
      </div>
    </section>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.object.isRequired,
};

export default PropertiesShow;
