import firecrawlService from '../services/firecrawlService.js';
import aiService from '../services/aiService.js';

export const searchProperties = async (req, res) => {
    try {
        const { city, maxPrice, propertyCategory, propertyType, limit = 6 } = req.body;

        // Step 1: Input Validation
        if (!city || !maxPrice) {
            return res.status(400).json({
                success: false,
                message: 'Both "city" and "maxPrice" are required fields.'
            });
        }

        console.log("🟡 Starting property search with params:", {
            city, maxPrice, propertyCategory, propertyType, limit
        });

        // Step 2: Try fetching from firecrawlService
        let propertiesData;
        try {
            propertiesData = await firecrawlService.findProperties(
                city,
                maxPrice,
                propertyCategory || 'Residential',
                propertyType || 'Flat',
                Math.min(limit, 6)
            );
        } catch (firecrawlError) {
            console.error("🔥 Error in firecrawlService.findProperties:", firecrawlError);
            return res.status(502).json({
                success: false,
                message: 'Failed to fetch properties from Firecrawl service.',
                error: firecrawlError.message
            });
        }

        if (!propertiesData || !propertiesData.properties || propertiesData.properties.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No properties found matching your criteria.'
            });
        }

        // Step 3: Try analyzing with AI
        let analysis;
        try {
            analysis = await aiService.analyzeProperties(
                propertiesData.properties,
                city,
                maxPrice,
                propertyCategory || 'Residential',
                propertyType || 'Flat'
            );
        } catch (aiError) {
            console.error("🔥 Error in aiService.analyzeProperties:", aiError);
            return res.status(500).json({
                success: false,
                message: 'Failed to analyze properties using AI.',
                error: aiError.message
            });
        }

        // Step 4: Success
        res.json({
            success: true,
            properties: propertiesData.properties,
            analysis
        });

    } catch (error) {
        console.error("🔥 Unexpected error in searchProperties:", error);
        res.status(500).json({
            success: false,
            message: 'Server encountered an unexpected error.',
            error: error.message
        });
    }
};


export const getLocationTrends = async (req, res) => {
    try {
        const { city } = req.params;
        const { limit = 5 } = req.query;

        if (!city) {
            return res.status(400).json({ success: false, message: 'City parameter is required' });
        }

        // Extract location trend data using Firecrawl, with limit
        const locationsData = await firecrawlService.getLocationTrends(city, Math.min(limit, 5));

        // Analyze the location trends using AI
        const analysis = await aiService.analyzeLocationTrends(
            locationsData.locations,
            city
        );

        res.json({
            success: true,
            locations: locationsData.locations,
            analysis
        });
    } catch (error) {
        console.error('Error getting location trends:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get location trends',
            error: error.message
        });
    }
};


