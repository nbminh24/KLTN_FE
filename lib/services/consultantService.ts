import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface StylingConsultPayload {
    occasion: 'wedding' | 'work' | 'casual' | 'party' | 'sport';
    style: 'minimalist' | 'street' | 'vintage' | 'elegant';
    gender: 'male' | 'female' | 'unisex';
    weather?: 'summer' | 'winter' | 'spring' | 'fall';
}

export interface ProductRecommendation {
    id: number;
    name: string;
    slug: string;
    price: number;
    thumbnail: string;
    category: string;
    rating: number;
    attributes?: Record<string, any>;
}

export interface StylingConsultResponse {
    success: boolean;
    occasion: string;
    style: string;
    recommended_products: ProductRecommendation[];
    styling_tip: string;
}

export interface SizingConsultPayload {
    height: number;        // cm, min: 100
    weight: number;        // kg, min: 30
    product_id?: number;   // Optional
    category_slug?: string; // Optional
}

export interface SizingConsultResponse {
    recommended_size: string;
    fit_type: string;
    advice: string;
    is_available: boolean;
    product?: {
        id: number;
        name: string;
        slug: string;
    };
    variant_info?: {
        size: string;
        available_stock: number;
        price: number;
    };
}

export interface CompareProductsPayload {
    product_names: string[]; // Array of product names or IDs (2-3 items)
}

export interface ComparedProduct {
    id: number;
    name: string;
    price: number;
    rating: number;
    total_reviews: number;
    material: string;
    origin: string;
    style: string;
}

export interface CompareProductsResponse {
    products: ComparedProduct[];
    summary: string;
}

// ========== CONSULTANT SERVICE (AI-POWERED) ==========

const consultantService = {
    /**
     * Get styling recommendations based on occasion and preferences
     * POST /api/v1/consultant/styling
     * 
     * No authentication required.
     * Query database for products matching occasion/style instead of using AI.
     */
    getStylingAdvice: async (data: StylingConsultPayload): Promise<AxiosResponse<StylingConsultResponse>> => {
        return apiClient.post('/consultant/styling', data);
    },

    /**
     * Get size recommendation based on height/weight
     * POST /api/v1/consultant/sizing
     * 
     * No authentication required.
     * Calculates BMI and maps to size chart. Checks product fit type and stock availability.
     */
    getSizingAdvice: async (data: SizingConsultPayload): Promise<AxiosResponse<SizingConsultResponse>> => {
        return apiClient.post('/consultant/sizing', data);
    },

    /**
     * Compare 2-3 products by price, material, rating
     * POST /api/v1/consultant/compare
     * 
     * No authentication required.
     * Supports search by product names or IDs.
     */
    compareProducts: async (data: CompareProductsPayload): Promise<AxiosResponse<CompareProductsResponse>> => {
        return apiClient.post('/consultant/compare', data);
    },
};

export default consultantService;
