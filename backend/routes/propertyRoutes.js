import express from 'express';
import { searchProperties, getLocationTrends } from '../controller/propertyController.js';

const router = express.Router();

// Route to search for properties
router.post('/search', searchProperties);

// Route to get location trends
router.get('/locations/:city/trends', getLocationTrends);

export default router;