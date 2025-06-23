import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { MdAutoDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { FcApproval } from "react-icons/fc";
import { GrInProgress } from "react-icons/gr";
import { FaStepBackward } from "react-icons/fa";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Phone,
  Plus,
  Home,
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  Building,
  Loader,
  Layers,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { backendurl } from "../App";

const RejectedListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentTime, setCurrentTime] = useState(Date.now());
  const navigate = useNavigate();

  // Update current time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateRemainingTime = (timestamp) => {
    if (!timestamp) return "";
    const deletionTime = new Date(timestamp).getTime();
    const diff = deletionTime - currentTime;

    if (diff <= 0) return "Deleting soon";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendurl}/api/products/rejected`);

      if (response.data?.success) {
        const propertiesArray = response.data.data || [];
        const parsedProperties = propertiesArray.map((property) => ({
          ...property,
          amenities: parseAmenities(property.amenities),
          currentImageIndex: 0,
        }));
        setProperties(parsedProperties);
      } else {
        toast.error(response.data?.error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to fetch properties");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const parseAmenities = (amenities) => {
    if (!amenities || !Array.isArray(amenities)) return [];
    try {
      if (typeof amenities[0] === "string") {
        const firstAmenity = amenities[0].replace(/'/g, '"');
        if (firstAmenity.startsWith("[") && firstAmenity.endsWith("]")) {
          return JSON.parse(firstAmenity);
        }
        return amenities;
      }
      return amenities;
    } catch (error) {
      console.error("Error parsing amenities:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleNextImage = (propertyId) => {
    setProperties((prev) =>
      prev.map((property) =>
        property._id === propertyId
          ? {
              ...property,
              currentImageIndex:
                (property.currentImageIndex + 1) % property.image.length,
            }
          : property
      )
    );
  };

  const handlePrevImage = (propertyId) => {
    setProperties((prev) =>
      prev.map((property) =>
        property._id === propertyId
          ? {
              ...property,
              currentImageIndex:
                (property.currentImageIndex - 1 + property.image.length) %
                property.image.length,
            }
          : property
      )
    );
  };

  const handleImageChange = (propertyId, index) => {
    setProperties((prev) =>
      prev.map((property) =>
        property._id === propertyId
          ? { ...property, currentImageIndex: index }
          : property
      )
    );
  };

  const handleEditProperty = (id) => {
    navigate(`/update/${id}`);
  };

  const handleDeleteProperty = async (propertyId, propertyTitle) => {
    const result = await Swal.fire({
      title: `Are you sure you want to remove "${propertyTitle}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(`${backendurl}/api/products/remove`, {
          id: propertyId,
        });

        if (response.data.success) {
          toast.success("Property removed successfully");
          await fetchProperties();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error removing property:", error);
        toast.error("Failed to remove property");
      }
    }
  };

  const filteredProperties = properties
    .filter((property) => {
      const matchesSearch =
        !searchTerm ||
        [property.title, property.location, property.type].some((field) =>
          field.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesType =
        filterType === "all" ||
        property.type.toLowerCase() === filterType.toLowerCase();

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <button
              className="flex items-center justify-center gap-2 bg-indigo-600 py-2 px-4 rounded-lg text-white hover:bg-indigo-700"
              onClick={() => navigate("/dashboard")}
            >
              <FaStepBackward />
              Go Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Rejected Properties
            </h1>
            <p className="text-gray-600">
              {filteredProperties.length} Properties Found
            </p>
          </div>

          <Link
            to="/add"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Property
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-4 h-4" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="house">Houses</option>
                  <option value="apartment">Apartments</option>
                  <option value="villa">Villas</option>
                  <option value="office">Offices</option>
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {filteredProperties.map((property) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Property Image Slider */}
                <div className="relative h-48">
                  {/* Property Type Label */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                      {property.type || "Property"}
                    </span>
                  </div>

                  <div className="relative h-full w-full overflow-hidden">
                    <div
                      className="flex h-full transition-transform duration-300 ease-in-out"
                      style={{
                        transform: `translateX(-${
                          property.currentImageIndex * 100
                        }%)`,
                      }}
                    >
                      {property.image.map((img, index) => (
                        <div
                          key={index}
                          className="w-full h-full flex-shrink-0"
                        >
                          <img
                            src={img || "/placeholder.jpg"}
                            alt={`${property.title} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  {property.image.length > 1 && (
                    <>
                      <button
                        onClick={() => handlePrevImage(property._id)}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleNextImage(property._id)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {property.image.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageChange(property._id, index)}
                        className={`w-2 h-2 rounded-full ${
                          property.currentImageIndex === index
                            ? "bg-white"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProperty(property._id)}
                          className="flex items-center justify-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          <FiEdit />
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteProperty(property._id, property.title)
                          }
                          className="flex items-center justify-center gap-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                        >
                          <MdAutoDelete />
                          Delete
                        </button>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 pb-2">
                        {property.title}
                      </h2>
                    </div>

                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      {property.location}
                    </div>

                    {/* Status Badge */}
                    <div className="mb-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          property.approvalStatus === "approved"
                            ? "bg-green-100 text-green-800"
                            : property.approvalStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        } flex flex-col items-start space-y-1`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <p>Status:</p>
                          {property.approvalStatus === "approved" ? (
                            <FcApproval />
                          ) : (
                            <GrInProgress />
                          )}
                          {property.approvalStatus.charAt(0).toUpperCase() +
                            property.approvalStatus.slice(1)}
                        </span>
                        {property.approvalStatus === "rejected" && (
                          <span className="text-[10px] text-red-600">
                            Deleting in:{" "}
                            {calculateRemainingTime(
                              property.scheduledForDeletion
                            )}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600 text-sm mb-4">
                      {property.description || "No description available"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <p className="text-2xl font-bold text-blue-600">
                      Rs {property.price.toLocaleString()}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        property.availability === "rent"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      For {property.availability}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                      <BedDouble className="w-5 h-5 text-gray-400 mb-1" />
                      <span className="text-sm text-gray-600">
                        {property.beds} Beds
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                      <Bath className="w-5 h-5 text-gray-400 mb-1" />
                      <span className="text-sm text-gray-600">
                        {property.baths} Baths
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                      <Maximize className="w-5 h-5 text-gray-400 mb-1" />
                      <span className="text-sm text-gray-600">
                        {property.sqft} sqft
                      </span>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="border-t pt-4 mb-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Details
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Layers className="w-4 h-4 mr-2 text-gray-400" />
                        Floors: {property.floors || "N/A"}
                      </div>
                      <div className="flex items-center">
                        <Home className="w-4 h-4 mr-2 text-gray-400" />
                        Type: {property.type || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  {property.amenities.length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Amenities
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {property.amenities
                          .slice(0, 3)
                          .map((amenity, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              <Building className="w-3 h-3 mr-1" />
                              {amenity}
                            </span>
                          ))}
                        {property.amenities.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{property.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProperties.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-lg shadow-sm"
          >
            <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No rejected properties found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RejectedListings;
