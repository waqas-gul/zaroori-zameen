import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  // NEW FIELDS ADDED HERE
  yearBuilt: {
    type: Number,
    min: [1800, "Year built must be after 1800"],
    max: [new Date().getFullYear(), "Year built cannot be in the future"]
  },
  floors: {
    type: Number,
    min: [1, "Property must have at least 1 floor"],
    default: 1
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]
  },
  image: {
    type: [String],
    required: [true, "At least one image is required"],
  },
  beds: {
    type: Number,
    required: [true, "Number of bedrooms is required"],
    min: [0, "Bedrooms cannot be negative"]
  },
  baths: {
    type: Number,
    required: [true, "Number of bathrooms is required"],
    min: [0, "Bathrooms cannot be negative"]
  },
  sqft: {
    type: Number,
    required: [true, "Area is required"],
    min: [0, "Area cannot be negative"]
  },
  type: {
    type: String,
    required: [true, "Property type is required"],
  },
  availability: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    maxlength: [1000, "Description cannot exceed 1000 characters"]
  },
  amenities: {
    type: [String],
    required: [true, "Please add at least one amenity"],
    default: []
  },
  phone: {
    type: String,
    required: [true, "Contact phone is required"],
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',  // Default status is 'pending'
  },
  rejectionReason: {
    type: String,
    default: null
  },
  scheduledForDeletion: {
    type: Date,
    default: null
  },
  views: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt
});

const Property = mongoose.model("Property", propertySchema);

export default Property;
