import express from 'express';
import {
    addToFavorites,
    removeFromFavorites,
    getUserFavorites,
    checkFavoriteStatus, getFavoriteProperties
} from '../controller/favoritesController.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getUserFavorites);

router.route('/:propertyId')
    .post(protect, addToFavorites)
    .delete(protect, removeFromFavorites);

router.route('/:propertyId/check')
    .get(protect, checkFavoriteStatus);
router.get('/properties', protect, getFavoriteProperties);
export default router;