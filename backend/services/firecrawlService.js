// backend/services/firecrawlService.js
import FirecrawlApp from "@mendable/firecrawl-js";
import { config } from '../config/config.js';

class FirecrawlService {
    constructor() {
        this.firecrawl = new FirecrawlApp({
            apiKey: config.firecrawlApiKey
        });
    }

    async findProperties(city, maxPrice, propertyCategory = "Residential", propertyType = "House", limit = 6) {
        try {
            const formattedCity = city.toLowerCase().replace(/\s+/g, '-');

            // Use Pakistan-specific real estate site
            const urls = [
                `https://www.zameen.com/${propertyType}_for_sale/${formattedCity}.html`
            ];

            const propertySchema = {
                type: "object",
                properties: {
                    properties: {
                        type: "array",
                        description: "List of property details",
                        items: {
                            type: "object",
                            properties: {
                                building_name: { type: "string", description: "Name of the property" },
                                property_type: { type: "string" },
                                location_address: { type: "string" },
                                price: { type: "string" },
                                description: { type: "string" },
                                amenities: { type: "array", items: { type: "string" } },
                                area_sqft: { type: "string" }
                            },
                            required: ["building_name", "property_type", "location_address", "price"]
                        }
                    }
                },
                required: ["properties"]
            };

            const prompt = `Extract ${limit} different ${propertyCategory} ${propertyType} listings from ${city}, Pakistan under ${maxPrice} crore PKR.
        Return for each:
        - building_name
        - location_address
        - price (PKR)
        - area_sqft
        - amenities (list)
        - short description (under 100 words)`;

            const extractResult = await this.firecrawl.extract(urls, {
                prompt,
                schema: propertySchema,
                enableWebSearch: true
            });

            if (!extractResult.success) {
                throw new Error(`Firecrawl extraction failed: ${extractResult.error || 'Unknown error'}`);
            }

            console.log('✅ Extracted properties:', extractResult.data.properties.length);
            return extractResult.data;
        } catch (error) {
            console.error('❌ Error in findProperties:', error.message);
            throw error;
        }
    }

    async getLocationTrends(city, limit = 5) {
        try {
            const formattedCity = city.toLowerCase().replace(/\s+/g, '-');
            const url = `https://www.zameen.com/Property_Rates/${formattedCity}.html`;

            const locationSchema = {
                type: "object",
                properties: {
                    locations: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                location: { type: "string" },
                                price_per_sqft: { type: "number" },
                                percent_increase: { type: "number" },
                                rental_yield: { type: "number" }
                            },
                            required: ["location", "price_per_sqft", "percent_increase", "rental_yield"]
                        }
                    }
                },
                required: ["locations"]
            };

            const extractResult = await this.firecrawl.extract([url], {
                prompt: `Extract ${limit} locality trends in ${city}, Pakistan including name, price_per_sqft, percent_increase, and rental_yield`,
                schema: locationSchema,
                enableWebSearch: true
            });

            if (!extractResult.success) {
                throw new Error(`Failed to extract location data: ${extractResult.error || 'Unknown error'}`);
            }

            console.log('✅ Extracted location trends:', extractResult.data.locations.length);
            return extractResult.data;
        } catch (error) {
            console.error('❌ Error in getLocationTrends:', error.message);
            throw error;
        }
    }
}

export default new FirecrawlService();
