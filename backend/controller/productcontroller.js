import fs from "fs";
import imagekit from "../config/imagekit.js";
import Property from "../models/propertymodel.js";
import { scheduleJob } from 'node-schedule';
import View from "../models/View.js";
const addproperty = async (req, res) => {
    try {
        const { title, location, price, beds, baths, sqft, type, availability, description, yearBuilt, floors, amenities, phone, user } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Upload images to ImageKit and delete after upload
        const imageUrls = await Promise.all(
            images.map(async (item) => {
                const result = await imagekit.upload({
                    file: fs.readFileSync(item.path),
                    fileName: item.originalname,
                    folder: "Property",
                });
                fs.unlink(item.path, (err) => {
                    if (err) console.log("Error deleting the file: ", err);
                });
                return result.url;
            })
        );

        // Create a new product
        const product = new Property({
            user,
            title,
            location,
            yearBuilt,
            floors,
            price,
            beds,
            baths,
            sqft,
            type,
            availability,
            description,
            amenities,
            image: imageUrls,
            phone
        });

        // Save the product to the database
        await product.save();

        res.json({ message: "Product added successfully", success: true });
    } catch (error) {
        console.log("Error adding product: ", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

const listproperty = async (req, res) => {
    try {
        const property = await Property.find();
        res.json({ property, success: true });
    } catch (error) {
        console.log("Error listing products: ", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

const removeproperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.body.id);
        if (!property) {
            return res.status(404).json({ message: "Property not found", success: false });
        }
        return res.json({ message: "Property removed successfully", success: true });
    } catch (error) {
        console.log("Error removing product: ", error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};

const rejectproperty = async (req, res) => {

    try {
        const { propertyId, rejectionReason } = req.body;
        console.log(propertyId)
        // Update property with rejection info
        const property = await Property.findByIdAndUpdate(
            propertyId,
            {
                approvalStatus: 'rejected',
                rejectionReason,
                scheduledForDeletion: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
            },
            { new: true }
        );

        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        // Schedule deletion after 24 hours
        scheduleJob(new Date(Date.now() + 24 * 60 * 60 * 1000), async () => {
            try {
                await Property.findByIdAndDelete(propertyId);
                console.log(`Property ${propertyId} deleted after rejection`);
            } catch (err) {
                console.error('Error deleting rejected property:', err);
            }
        });

        res.status(200).json({
            success: true,
            property,
            scheduledForDeletion: property.scheduledForDeletion
        });
    } catch (error) {
        console.error('Error rejecting property:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateProperty = async (req, res) => {
    try {
        // Log incoming files for debugging


        const { id, title, location, yearBuilt, floors, price, beds, baths,
            sqft, type, availability, description, amenities, phone } = req.body;

        // Validate required fields
        if (!id || !title || !location || !price) {
            return res.status(400).json({
                message: "Missing required fields",
                success: false
            });
        }

        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({
                message: "Property not found",
                success: false
            });
        }

        // Set status to pending for admin approval
        property.approvalStatus = "pending";
        property.title = title;
        property.location = location;
        property.yearBuilt = yearBuilt;
        property.floors = floors;
        property.price = price;
        property.beds = beds;
        property.baths = baths;
        property.sqft = sqft;
        property.type = type;
        property.availability = availability;
        property.description = description;
        property.phone = phone;

        // Handle amenities (can come as string or array)
        try {
            property.amenities = typeof amenities === 'string'
                ? JSON.parse(amenities)
                : amenities || [];
        } catch (e) {
            property.amenities = [];
        }

        // Handle image upload if files exist
        if (req.files) {
            const imageUrls = [];

            // Process each possible image field (image1, image2, etc.)
            for (let i = 1; i <= 4; i++) {
                const fieldName = `image${i}`;
                if (req.files[fieldName] && req.files[fieldName][0]) {
                    const file = req.files[fieldName][0];
                    try {
                        const result = await imagekit.upload({
                            file: fs.readFileSync(file.path),
                            fileName: file.originalname,
                            folder: "Property",
                        });
                        fs.unlinkSync(file.path); // Delete temp file
                        imageUrls.push(result.url);
                    } catch (uploadError) {
                        console.error(`Error uploading ${fieldName}:`, uploadError);
                    }
                }
            }

            // Only update images if new ones were uploaded
            if (imageUrls.length > 0) {
                property.image = imageUrls;
            }
        }

        await property.save();

        return res.json({
            message: "Property updated successfully - Status set to pending for admin approval",
            success: true,
            property
        });

    } catch (error) {
        console.error("Error updating property:", error);
        return res.status(500).json({
            message: error.message || "Server Error",
            success: false
        });
    }
};

const singleproperty = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({ message: "Property not found", success: false });
        }
        res.json({ property, success: true });
    } catch (error) {
        console.log("Error fetching property:", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};


// Get all Approved Properties  of a specific user
const getApprovedProperties = async (req, res) => {
    try {
        const { userId } = req.params;
        const properties = await Property.find({ user: userId, approvalStatus: "approved" });

        res.json({ properties });
    } catch (error) {
        console.error('Error fetching approved properties:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all Pending Properties  of a specific user
const getPendingProperties = async (req, res) => {
    try {
        const { userId } = req.params;
        const properties = await Property.find({ user: userId, approvalStatus: 'pending' });
        res.json({ properties });
    } catch (error) {
        console.error('Error fetching pending properties:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all Rejected Properties of a specific user
const getRejectedProperties = async (req, res) => {
    try {
        const { userId } = req.params;
        const properties = await Property.find({ user: userId, approvalStatus: 'rejected' });
        res.json({ properties });
    } catch (error) {
        console.error('Error fetching rejected properties:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Approve a Property
const approveProperty = async (req, res) => {
    try {
        const { propertyId } = req.body; // Get the propertyId from the request body
        console.log(propertyId);
        // Find the property by ID
        const property = await Property.findById(propertyId);
        console.log(property);
        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        // Update the property status to "approved"
        property.approvalStatus = 'approved'; // Assuming "status" is the field used for approval
        await property.save(); // Save the updated property

        return res.status(200).json({
            success: true,
            message: 'Property approved successfully',
        });
    } catch (error) {
        console.error('Error approving property:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to approve property',
        });
    }
};

// Delete Property
const deleteProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        await property.deleteOne();

        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

//get all pending properties Controller function
const getAllPendingProperties = async (req, res) => {
    try {
        const pendingProperties = await Property.find({
            approvalStatus: 'pending'
        });

        res.status(200).json({
            success: true,
            count: pendingProperties.length,
            data: pendingProperties
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

//get all active properties Controller function
const getAllActiveProperties = async (req, res) => {
    console.log()
    try {
        const ActiveProperties = await Property.find({
            approvalStatus: 'approved'
        });

        res.status(200).json({
            success: true,
            count: ActiveProperties.length,
            data: ActiveProperties
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }

};

//get all rejected properties Controller function
const getAllRejectedProperties = async (req, res) => {
    try {
        const pendingProperties = await Property.find({
            approvalStatus: 'rejected'
        });

        res.status(200).json({
            success: true,
            count: pendingProperties.length,
            data: pendingProperties
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Add this new controller function
 const incrementPropertyViews = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const userId = req.user._id;

    // Check if this user has already viewed this property
    const existingView = await View.findOne({
      property: propertyId,
      user: userId,
    });

    if (!existingView) {
      // Create a new view record
      await View.create({
        property: propertyId,
        user: userId,
      });

      // Increment the view count on the property
      await Property.findByIdAndUpdate(propertyId, {
        $inc: { views: 1 },
      });
    }

    // Get the updated view count
    const property = await Property.findById(propertyId);
    res.status(200).json({ views: property.views });
  } catch (error) {
    res.status(500).json({ message: "Error updating view count" });
  }
};

// Update your existing getSingleProperty controller
 const getSingleProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "user",
      "name phone"
    );
    
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: "Error fetching property" });
  }
};

export { addproperty, listproperty, removeproperty, updateProperty, singleproperty, getApprovedProperties, deleteProperty, approveProperty, getRejectedProperties, getPendingProperties, getAllPendingProperties, getAllActiveProperties, rejectproperty, getAllRejectedProperties, incrementPropertyViews, getSingleProperty};