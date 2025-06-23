import User from '../models/Usermodel.js';
import Property from '../models/propertymodel.js';
import asyncHandler from 'express-async-handler';


// @desc    Add property to favorites
// @route   POST /api/favorites/:propertyId
// @access  Private
export const addToFavorites = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.propertyId);
    if (!property) {
        res.status(404);
        throw new Error('Property not found');
    }

    const user = await User.findById(req.user.id);

    if (user.favorites.includes(req.params.propertyId)) {
        res.status(400);
        throw new Error('Property already in favorites');
    }

    user.favorites.push(req.params.propertyId);
    await user.save();

    res.status(200).json({
        success: true,
        data: user.favorites,
        message: 'Property added to favorites'
    });
});

// @desc    Remove property from favorites
// @route   DELETE /api/favorites/:propertyId
// @access  Private
export const removeFromFavorites = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user.favorites.includes(req.params.propertyId)) {
        res.status(400);
        throw new Error('Property not in favorites');
    }

    user.favorites = user.favorites.filter(
        fav => fav.toString() !== req.params.propertyId
    );

    await user.save();

    res.status(200).json({
        success: true,
        data: user.favorites,
        message: 'Property removed from favorites'
    });
});

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
export const getUserFavorites = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
        .populate({
            path: 'favorites',
            populate: {
                path: 'user',
                select: 'name email'
            }
        });

    res.status(200).json({
        success: true,
        count: user.favorites.length,
        data: user.favorites
    });
});

// @desc    Check if property is in favorites
// @route   GET /api/favorites/:propertyId/check
// @access  Private
export const checkFavoriteStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const isFavorite = user.favorites.includes(req.params.propertyId);

    res.status(200).json({
        success: true,
        isFavorite
    });
});


// @desc    Get user's favorite properties with full details
// @route   GET /api/favorites/properties
// @access  Private
export const getFavoriteProperties = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate({
        path: 'favorites',
        model: 'Property',
        populate: {
            path: 'user',
            select: 'name email'
        }
    });

    res.status(200).json({
        success: true,
        count: user.favorites.length,
        data: user.favorites
    });
});