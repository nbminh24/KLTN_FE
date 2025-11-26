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

// Re-export specific types to avoid conflicts
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
    // Product types
    Product,
    ProductVariant,
    ProductsResponse,
    ProductFilters,
} from './productService';

export type {
    // Cart types
    CartItem,
    CartResponse,
    AddToCartData,
    UpdateCartItemData,
    ApplyCouponData,
} from './cartService';

export type {
    // Order types
    Order,
    OrderItem,
    OrdersResponse,
    OrderFilters,
    OrderStatusHistory,
} from './orderService';

export type {
    // Checkout types
    CreateOrderData,
    CreateOrderResponse,
    CreatePaymentUrlData,
    CreatePaymentUrlResponse,
} from './checkoutService';

// Note: Import specific types from service files when needed to avoid conflicts
