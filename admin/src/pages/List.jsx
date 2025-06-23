import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { MdAutoDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { FcApproval } from "react-icons/fc";
import { GrInProgress } from "react-icons/gr";
import { ImCross } from "react-icons/im";
import { FaStepBackward } from "react-icons/fa";
import {
  Trash2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Layers,
  Plus,
  Home,
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  Building,
  Loader,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { backendurl } from "../App";

const PropertyListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [remainingTimes, setRemainingTimes] = useState({});
  const navigate = useNavigate();

  const calculateRemainingTime = (timestamp) => {
    if (!timestamp) return "";
    const now = new Date();
    const deletionTime = new Date(timestamp);
    const diff = deletionTime - now;

    if (diff <= 0) return "Soon";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newRemainingTimes = {};

      properties.forEach((property) => {
        if (
          property.approvalStatus === "rejected" &&
          property.scheduledForDeletion
        ) {
          newRemainingTimes[property._id] = calculateRemainingTime(
            property.scheduledForDeletion
          );
        }
      });

      setRemainingTimes(newRemainingTimes);
    }, 1000);

    return () => clearInterval(interval);
  }, [properties]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendurl}/api/products/list`);
      if (response.data.success) {
        const parsedProperties = response.data.property.map((property) => ({
          ...property,
          amenities: parseAmenities(property.amenities),
          currentImageIndex: 0,
        }));
        setProperties(parsedProperties);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const handleNextImage = (propertyId) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
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
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
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
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property._id === propertyId
          ? { ...property, currentImageIndex: index }
          : property
      )
    );
  };

  const handleApproveProperty = async (propertyId, propertyTitle) => {
    try {
      const result = await Swal.fire({
        title: "Approve Property?",
        text: `Are you sure you want to approve "${propertyTitle}"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, approve it!",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Approving...",
        html: "Please wait while we update the property status",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(`${backendurl}/api/products/approve`, {
        propertyId: propertyId,
      });

      if (response.data.success) {
        setProperties((prevProperties) =>
          prevProperties.map((property) =>
            property._id === propertyId
              ? { ...property, approvalStatus: "approved" }
              : property
          )
        );

        Swal.fire({
          title: "Approved!",
          text: "The property has been approved.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      } else {
        throw new Error(response.data.message || "Failed to approve property");
      }
    } catch (error) {
      console.error("Error approving property:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to approve property",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
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

  const handleEditProperty = (id) => {
    navigate(`/update/${id}`);
  };

  const handleRejectProperty = async (propertyId, propertyTitle) => {
    try {
      const { value: reason, isConfirmed } = await Swal.fire({
        title: `Reject Property "${propertyTitle}"?`,
        html: `
          <p>Please provide the reason for rejection:</p>
          <textarea id="rejectionReason" class="swal2-textarea" placeholder="Enter rejection reason..." required></textarea>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Reject",
        cancelButtonText: "Cancel",
        preConfirm: () => {
          const reason = document
            .getElementById("rejectionReason")
            ?.value?.trim();
          if (!reason) {
            Swal.showValidationMessage("Please enter a rejection reason");
            return false;
          }
          return reason;
        },
      });

      if (!isConfirmed || !reason) return;

      const loadingSwal = Swal.fire({
        title: "Processing...",
        html: "Please wait while we update the property status",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(`${backendurl}/api/products/reject`, {
        propertyId,
        rejectionReason: reason,
      });

      await loadingSwal.close();

      if (response.data?.success) {
        setProperties((prev) =>
          prev.map((property) =>
            property._id === propertyId
              ? {
                  ...property,
                  approvalStatus: "rejected",
                  rejectionReason: reason,
                  scheduledForDeletion: response.data.scheduledForDeletion,
                }
              : property
          )
        );

        Swal.fire({
          title: "Rejected",
          text: "Property will be deleted in 24 hours.",
          icon: "success",
        });
      } else {
        throw new Error(response.data?.message || "Rejection failed");
      }
    } catch (error) {
      console.error("Reject Error:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
        icon: "error",
      });
    }
  };

  const getRemainingTime = (timestamp) => {
    if (!timestamp) return "";
    const now = new Date();
    const deletionTime = new Date(timestamp);
    const diff = deletionTime - now;

    if (diff <= 0) return "Soon";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <button
              className="flex items-center justify-center gap-2 bg-indigo-600 py-2 px-4 my-3 rounded-lg text-white hover:bg-indigo-700"
              onClick={() => navigate("/dashboard")}
            >
              <FaStepBackward />
              Go Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Total Property Listings
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
                <option value="status">By Status</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {filteredProperties.map((property) => {
              const remainingTime =
                property.approvalStatus === "rejected" &&
                property.scheduledForDeletion
                  ? getRemainingTime(property.scheduledForDeletion)
                  : "";

              return (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48">
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

                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex gap-2">
                        {property.approvalStatus === "pending" && (
                          <button
                            onClick={() =>
                              handleApproveProperty(
                                property._id,
                                property.title
                              )
                            }
                            className="flex items-center justify-center gap-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                          >
                            <FcApproval />
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleEditProperty(property._id)}
                          className="flex items-center justify-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          <FiEdit />
                          Edit
                        </button>
                        {property.approvalStatus !== "rejected" && (
                          <button
                            onClick={() =>
                              handleRejectProperty(property._id, property.title)
                            }
                            className="flex items-center justify-center gap-2 px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
                          >
                            <ImCross />
                            Reject
                          </button>
                        )}

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

                      <div className="mt-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            property.approvalStatus === "approved"
                              ? "bg-green-100 text-green-800"
                              : property.approvalStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          } flex flex-col items-start space-y-1`}
                        >
                          <span className="flex items-center gap-2">
                            <p>Status:</p>
                            {property.approvalStatus === "approved" ? (
                              <FcApproval />
                            ) : (
                              <GrInProgress />
                            )}
                            {property.approvalStatus.charAt(0).toUpperCase() +
                              property.approvalStatus.slice(1)}
                          </span>
                          {remainingTime && (
                            <span className="text-[10px] text-red-600">
                              Deleting in :{" "}
                              {remainingTimes[property._id] ||
                                calculateRemainingTime(
                                  property.scheduledForDeletion
                                )}
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between items-start my-2">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {property.title}
                        </h2>
                      </div>

                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        {property.location}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-600 text-sm mb-4">
                        {property.description || "No description available"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <p className="text-2xl font-bold text-blue-600">
                        PKR {property.price.toLocaleString()}
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

                    <div className="border-t pt-4 mb-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Contact
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <a
                          href={`https://wa.me/${property.phone?.replace(
                            /\D/g,
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 flex items-center justify-center px-3 py-2 rounded transition-colors ${
                            property.phone
                              ? "bg-green-100 text-green-600 hover:bg-green-200"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                          onClick={
                            !property.phone
                              ? (e) => e.preventDefault()
                              : undefined
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-2"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29-3.03c.545 1.37 1.776 4.1 2.156 4.1.384 0 3.243-2.11 3.44-2.33.198-.217.198-.41.099-.615-.099-.198-.434-.31-.816-.542-.384-.232-2.224-1.09-2.53-1.215-.307-.124-.53-.185-.757.186-.227.372-.881 1.232-1.085 1.482-.204.25-.408.291-.757.097-.35-.198-1.472-.54-2.804-1.722-1.035-.938-1.733-2.097-1.936-2.453-.204-.355-.022-.547.153-.73.167-.173.372-.434.558-.65.186-.217.248-.372.372-.62.124-.248.062-.465-.031-.65-.093-.186-.838-2.005-1.147-2.73-.31-.724-.62-.624-.838-.634-.217-.01-.465-.012-.715-.012-.25 0-.656.093-.997.326-.341.232-.715.726-.715 1.323 0 .597.558 1.704.744 2.28.186.577.92 3.447 2.26 5.16 1.34 1.714 2.42 2.364 4.235 3.12.93.385 1.654.492 2.225.492.57 0 .915-.072 1.045-.124.13-.052.372-.167.43-.325.058-.157.058-.29.04-.36-.02-.07-.24-.175-.5-.293" />
                          </svg>
                          WhatsApp
                          {!property.phone && (
                            <span className="text-xs ml-1">
                              (not available)
                            </span>
                          )}
                        </a>

                        <a
                          href={`tel:${property.phone?.replace(/\D/g, "")}`}
                          className={`flex-1 flex items-center justify-center px-3 py-2 rounded transition-colors ${
                            property.phone
                              ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                          onClick={
                            !property.phone
                              ? (e) => e.preventDefault()
                              : undefined
                          }
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                          {!property.phone && (
                            <span className="text-xs ml-1">
                              (not available)
                            </span>
                          )}
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
              No properties found
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

export default PropertyListings;
