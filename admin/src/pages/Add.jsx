import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { backendurl } from "../App";
import { Upload, X } from "lucide-react";
import { FaStepBackward } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const PROPERTY_TYPES = ["House", "Office", "Plot", "Commercial", "Apartment"];
const AVAILABILITY_TYPES = ["For Sale", "For Rent"];
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

const PropertyForm = () => {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");

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
      alert("Maximum 4 images allowed");
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
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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
    const userId = localStorage.getItem("userId");
    try {
      const formdata = new FormData();
      formdata.append("title", formData.title);
      formdata.append("type", formData.type);
      formdata.append("price", formData.price);
      formdata.append("location", formData.location);
      formdata.append("yearBuilt", formData.yearBuilt);
      formdata.append("floors", formData.floors);
      formdata.append("description", formData.description);
      formdata.append("beds", formData.beds);
      formdata.append("baths", formData.baths);
      formdata.append("sqft", formData.sqft);
      formdata.append("phone", formData.phone);
      formdata.append("availability", formData.availability);
      formData.amenities.forEach((amenity, index) => {
        formdata.append(`amenities[${index}]`, amenity);
      });

      const adminId = localStorage.getItem("adminId");
      if (adminId) {
        formdata.append("user", adminId);
      } else {
        console.error(" ID not found in localStorage");
      }
      formData.images.forEach((image, index) => {
        formdata.append(`image${index + 1}`, image);
      });

      const response = await axios.post(
        `${backendurl}/api/products/add`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
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
        setPreviewUrls([]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding property:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50">
      <div className="flex flex-col max-w-3xl mx-auto">
        <button
          className="flex items-center justify-center gap-2 bg-indigo-600 py-2 px-6 my-4 rounded-lg text-white hover:bg-indigo-700 transition-colors duration-200 w-fit"
          onClick={() => navigate("/dashboard")}
        >
          <FaStepBackward />
          Go Back
        </button>

        <div className="w-full rounded-lg shadow-xl bg-white p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Add New Property
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
                    min="2000"
                    max={new Date().getFullYear()}
                    value={formData.yearBuilt}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g. 2010"
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
                    placeholder="e.g. 2"
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
                {loading ? "Submitting..." : "Submit Property"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
