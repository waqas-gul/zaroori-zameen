import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { backendurl } from "../App";
import { X, Upload } from "lucide-react";
import Swal from "sweetalert2";
const PROPERTY_TYPES = ["House", "Apartment", "Office", "Villa"];
const AVAILABILITY_TYPES = ["rent", "buy"];
const AMENITIES = [
  "Lake View",
  "Fireplace",
  "Central heating and air conditioning",
  "Dock",
  "Pool",
  "Garage",
  "Garden",
  "Gym",
  "Security system",
  "Master bathroom",
  "Guest bathroom",
  "Home theater",
  "Exercise room/gym",
  "Covered parking",
  "High-speed internet ready",
];

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Initialize all form fields with empty strings to avoid uncontrolled inputs
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    price: "",
    location: "",
    yearBuilt: "",
    floors: "",
    description: "",
    beds: "",
    baths: "",
    sqft: "",
    phone: "",
    availability: "",
    amenities: [],
    images: [],
  });

  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(
          `${backendurl}/api/products/single/${id}`
        );
        if (response.data.success) {
          const property = response.data.property;
          setFormData({
            title: property.title || "",
            type: property.type || "",
            price: property.price || "",
            location: property.location || "",
            yearBuilt: property.yearBuilt || "",
            floors: property.floors || "",
            description: property.description || "",
            beds: property.beds || "",
            baths: property.baths || "",
            sqft: property.sqft || "",
            phone: property.phone || "",
            availability: property.availability || "",
            amenities: property.amenities || [],
            images: property.image || [],
          });
          setExistingImages(property.image || []);
          setPreviewUrls(property.image || []);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to load property data");
      }
    };

    fetchProperty();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewUrls.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index) => {
    const isExistingImage = index < existingImages.length;
    if (isExistingImage) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter(
          (_, i) => i !== index - existingImages.length
        ),
      }));
    }
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAmenity = () => {
    if (newAmenity && !formData.amenities.includes(newAmenity)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity],
      }));
      setNewAmenity("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.location || !formData.price) {
        throw new Error("Title, location, and price are required fields");
      }

      const formDataToSend = new FormData();

      // Append all non-file fields
      formDataToSend.append("id", id);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("yearBuilt", formData.yearBuilt);
      formDataToSend.append("floors", formData.floors);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("beds", formData.beds);
      formDataToSend.append("baths", formData.baths);
      formDataToSend.append("sqft", formData.sqft);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("availability", formData.availability);
      formDataToSend.append("amenities", JSON.stringify(formData.amenities));
      formDataToSend.append("existingImages", JSON.stringify(existingImages));

      // Append new images with proper field names
      formData.images.forEach((image, index) => {
        formDataToSend.append(`image${index + 1}`, image);
      });

      // Show loading alert
      Swal.fire({
        title: "Updating Property",
        html: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        `${backendurl}/api/products/update`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Close loading alert
      Swal.close();

      if (response.data.success) {
        await Swal.fire({
          title: "Success!",
          text: "Property updated successfully",
          icon: "success",
          confirmButtonColor: "#6366f1",
        });
        navigate("/dashboard");
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      await Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Failed to update property",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto rounded-lg shadow-xl bg-white p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Update Property
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Property Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Property Type
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Type</option>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="availability"
                  className="block text-sm font-medium text-gray-700"
                >
                  Availability
                </label>
                <select
                  id="availability"
                  name="availability"
                  required
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Availability</option>
                  {AVAILABILITY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Year Built */}
              <div>
                <label
                  htmlFor="yearBuilt"
                  className="block text-sm font-medium text-gray-700"
                >
                  Year Built
                </label>
                <input
                  type="number"
                  id="yearBuilt"
                  name="yearBuilt"
                  min="1800"
                  max={new Date().getFullYear()}
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Floors */}
              <div>
                <label
                  htmlFor="floors"
                  className="block text-sm font-medium text-gray-700"
                >
                  Floors
                </label>
                <input
                  type="number"
                  id="floors"
                  name="floors"
                  min="1"
                  value={formData.floors}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="beds"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bedrooms
                </label>
                <input
                  type="number"
                  id="beds"
                  name="beds"
                  required
                  min="0"
                  value={formData.beds}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="baths"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bathrooms
                </label>
                <input
                  type="number"
                  id="baths"
                  name="baths"
                  required
                  min="0"
                  value={formData.baths}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="sqft"
                  className="block text-sm font-medium text-gray-700"
                >
                  Square Feet
                </label>
                <input
                  type="number"
                  id="sqft"
                  name="sqft"
                  required
                  min="0"
                  value={formData.sqft}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Contact Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amenities
            </label>
            <div className="flex flex-wrap gap-3">
              {AMENITIES.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    formData.amenities.includes(amenity)
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>

            {/* Custom Amenity Input */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add custom amenity"
                className="flex-1 mt-1 block rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="mt-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>

            {/* Selected Amenities */}
            {formData.amenities.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Selected Amenities:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Property Images (Max 4)
            </label>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-40 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            {previewUrls.length < 4 && (
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload images</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;
