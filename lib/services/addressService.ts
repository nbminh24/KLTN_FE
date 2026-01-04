import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface Address {
    id?: number;
    recipient_name: string;
    phone: string;
    address_line: string;
    city: string;
    district: string;
    ward: string;
    is_default: boolean;
}

export interface Province {
    code: string;
    name: string;
    englishName?: string;
    administrativeLevel: string;
    decree?: string;
}

export interface Ward {
    code: string;
    name: string;
    englishName?: string;
    administrativeLevel: string;
    provinceCode: string;
    provinceName: string;
    decree?: string;
}

export interface ReverseGeocodeResponse {
    province: string;
    district: string | null;
    ward: string;
    street_address: string;
    display_name: string;
}

export interface TrackAsiaConvertRequest {
    text: string;
    migrate_type: 'old_to_new' | 'new_to_old';
    latlng?: string;
}

export interface TrackAsiaConvertResponse {
    status: string;
    results?: Array<{
        formatted_address: string;
        address_components: Array<{
            long_name: string;
            short_name: string;
            types: string[];
        }>;
        migrate_type: string;
    }>;
    plus_code?: {
        global_code: string;
    };
    error_message?: string;
}

// ========== ADDRESS SERVICE ==========

const addressService = {
    /**
     * Get all addresses for logged-in user
     * GET /addresses
     */
    getAll: async (): Promise<AxiosResponse<{ addresses: Address[] }>> => {
        return apiClient.get('/addresses');
    },

    /**
     * Create new shipping address
     * POST /addresses
     */
    create: async (data: Address): Promise<AxiosResponse> => {
        return apiClient.post('/addresses', data);
    },

    /**
     * Update existing address
     * PUT /addresses/:id
     */
    update: async (id: number, data: Address): Promise<AxiosResponse> => {
        return apiClient.put(`/addresses/${id}`, data);
    },

    /**
     * Delete address
     * DELETE /addresses/:id
     */
    delete: async (id: number): Promise<AxiosResponse> => {
        return apiClient.delete(`/addresses/${id}`);
    },

    // ========== NEW ADDRESS APIs (Post-merger 7/2025) ==========

    /**
     * Get all provinces/cities
     * GET /api/v1/address/provinces
     */
    getProvinces: async (): Promise<AxiosResponse<Province[]>> => {
        return apiClient.get('/api/v1/address/provinces?effectiveDate=latest');
    },

    /**
     * Get wards by province (post-merger structure, no districts)
     * GET /api/v1/address/wards?province_code={code}
     */
    getWardsByProvince: async (provinceCode: string): Promise<AxiosResponse<Ward[]>> => {
        return apiClient.get(`/api/v1/address/wards?province_code=${provinceCode}&effectiveDate=latest`);
    },

    /**
     * Reverse geocoding: GPS coordinates -> Address
     * POST /api/v1/address/reverse-geocode
     */
    reverseGeocode: async (latitude: number, longitude: number): Promise<AxiosResponse<ReverseGeocodeResponse>> => {
        return apiClient.post('/api/v1/address/reverse-geocode', { latitude, longitude });
    },

    /**
     * Convert address between old and new administrative formats
     * GET https://maps.track-asia.com/api/v2/place/convert/json
     */
    convertAddress: async (text: string, latlng?: string): Promise<TrackAsiaConvertResponse> => {
        const params = new URLSearchParams({
            text,
            migrate_type: 'old_to_new',
            key: 'public_key',
        });

        if (latlng) {
            params.append('latlng', latlng);
        }

        const response = await fetch(`https://maps.track-asia.com/api/v2/place/convert/json?${params.toString()}`);
        return response.json();
    },
};

export default addressService;
