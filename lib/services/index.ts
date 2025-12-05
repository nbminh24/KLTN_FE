// ========== MAIN API SERVICE EXPORTS ==========
// This file exports all API services for easy importing throughout the application

// API Client
export { default as apiClient, createFormDataClient } from './apiClient';

// Customer Services
export { default as authService } from './authService';
export { default as accountService } from './accountService';
export { default as addressService } from './addressService';
export { default as userService } from './userService';
export { default as productService } from './productService';
export { default as categoryService } from './categoryService';
export { default as cartService } from './cartService';
export { default as checkoutService } from './checkoutService';
export { default as orderService } from './orderService';
export { default as reviewService } from './reviewService';
export { default as wishlistService } from './wishlistService';
export { default as promotionService } from './promotionService';
export { default as supportService } from './supportService';
export { default as pageService } from './pageService';
export { default as aiService } from './aiService';
export { default as chatService } from './chatService';
export { default as consultantService } from './consultantService';
export { default as filterService } from './filterService';

// Admin Services
export { default as adminAuthService } from './adminAuthService';
export { default as adminDashboardService } from './adminDashboardService';
export { default as adminProductService } from './adminProductService';
export { default as adminOrderService } from './adminOrderService';
export { default as adminCustomerService } from './adminCustomerService';
export { default as adminCategoryService } from './adminCategoryService';
export { default as adminColorService } from './adminColorService';
export { default as adminSizeService } from './adminSizeService';
export { default as adminPromotionService } from './adminPromotionService';
export { default as adminReviewService } from './adminReviewService';
export { default as adminPageService } from './adminPageService';
export { default as adminAnalyticsService } from './adminAnalyticsService';
export { default as adminSupportService } from './adminSupportService';
export { default as adminInventoryService } from './adminInventoryService';
export { default as adminChatbotService } from './adminChatbotService';

// Internal/Rasa Services
export { default as internalService } from './internalService';

// Re-export specific types from services that export them
export type {
    // Auth types
    RegisterData,
    LoginData,
    AuthResponse,
    GoogleAuthData,
    RefreshTokenData,
    ForgotPasswordData,
    VerifyResetTokenData,
    ResetPasswordData,
    ActivateAccountData,
} from './authService';

export type {
    // Chat types
    CreateSessionPayload,
    ChatSession,
    CreateSessionResponse,
    ChatMessage,
    ChatHistoryResponse,
    SendMessagePayload,
    SendMessageResponse,
    MergeSessionPayload,
    MergeSessionResponse,
} from './chatService';

export type {
    // Consultant types
    StylingConsultPayload,
    ProductRecommendation,
    StylingConsultResponse,
    SizingConsultPayload,
    SizingConsultResponse,
    CompareProductsPayload,
    ComparedProduct,
    CompareProductsResponse,
} from './consultantService';

export type {
    // Filter types
    Color,
    Size,
    Category,
} from './filterService';

export type {
    // AI types
    ImageSearchResult,
    ImageSearchResponse,
} from './aiService';

// Note: Most types are imported from @/lib/types/backend
// Import specific types from service files only when they are exported
