import express from 'express';
import {
    addproperty, listproperty, removeproperty, updateProperty, singleproperty, getApprovedProperties, getPendingProperties, getRejectedProperties, approveProperty, deleteProperty, getAllPendingProperties, getAllActiveProperties, rejectproperty, getAllRejectedProperties,getSingleProperty,incrementPropertyViews
} from '../controller/productcontroller.js';
import upload from '../middleware/multer.js';
import { protect } from '../middleware/authmiddleware.js';
const propertyrouter = express.Router();

propertyrouter.post('/add', upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
]), addproperty);
propertyrouter.get('/list', listproperty);
propertyrouter.post('/remove', removeproperty);
propertyrouter.post('/reject', rejectproperty);


propertyrouter.post('/update', upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
]), updateProperty);

propertyrouter.get('/single/:id', singleproperty);

// Get approved properties of a user
propertyrouter.get('/approved/:userId', getApprovedProperties);

// Get pending properties of a user
propertyrouter.get('/pending/:userId', getPendingProperties);

// Get rejected properties of a user
propertyrouter.get('/rejected/:userId', getRejectedProperties);

// Approve a property
propertyrouter.post('/approve', approveProperty);

// Delete a property
propertyrouter.delete('/:propertyId', deleteProperty);

// Route: GET ALL pending properties /api/properties/pending
propertyrouter.get('/pending', getAllPendingProperties);

// Route: GET ALL active properties /api/properties/approved
propertyrouter.get('/approved', getAllActiveProperties);
// Route: GET ALL rejected properties /api/properties/rejected
propertyrouter.get('/rejected', getAllRejectedProperties);


// Add this new route for view tracking
propertyrouter.post("/:id/views", protect, incrementPropertyViews);

// Keep your existing routes
propertyrouter.get("/single/:id", getSingleProperty);

export default propertyrouter;