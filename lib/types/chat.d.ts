// Chat Custom Data Types for Rich Content Rendering

export type MessageType = 'text' | 'products' | 'buttons' | 'size_selector' | 'color_selector' | 'order_status' | 'ticket_created' | 'image' | 'product_actions';

export interface BaseCustomData {
    type: MessageType;
}

export interface ProductData {
    product_id: number;
    name: string;
    slug: string;
    price: number;
    thumbnail: string;
    rating?: number;
    reviews?: number;
    category?: string;
    in_stock: boolean;
    variants?: ProductVariant[];
}

export interface ProductVariant {
    variant_id: number;
    size: string;
    color: string;
    stock: number;
    price?: number;
}

export interface ProductsCustomData extends BaseCustomData {
    type: 'products';
    products: ProductData[];
    total?: number;
}

export interface ActionButton {
    text: string;
    action: string;
    payload?: any;
    variant?: 'primary' | 'secondary' | 'outline';
}

export interface ButtonsCustomData extends BaseCustomData {
    type: 'buttons';
    buttons: ActionButton[];
}

export interface SizeSelectorCustomData extends BaseCustomData {
    type: 'size_selector';
    options: string[];
    selected?: string;
    product_id?: number;
}

export interface ColorOption {
    name: string;
    hex?: string;
    available: boolean;
}

export interface ColorSelectorCustomData extends BaseCustomData {
    type: 'color_selector';
    options: ColorOption[];
    selected?: string;
    product_id?: number;
}

export interface OrderStatusStep {
    status: string;
    label: string;
    date?: string;
    completed: boolean;
    current: boolean;
}

export interface OrderStatusCustomData extends BaseCustomData {
    type: 'order_status';
    order_id: number;
    order_code: string;
    steps: OrderStatusStep[];
    tracking_url?: string;
}

export interface TicketCreatedCustomData extends BaseCustomData {
    type: 'ticket_created';
    ticket_code: string;
    ticket_id: number;
    subject: string;
    priority: string;
    estimated_response_time: string;
}

export interface ImageCustomData extends BaseCustomData {
    type: 'image';
    url: string;
    alt?: string;
    caption?: string;
}

export interface ColorOptionWithId {
    id: number;
    name: string;
    hex?: string;
}

export interface SizeOptionWithId {
    id: number;
    name: string;
}

export interface ProductActionsCustomData extends BaseCustomData {
    type: 'product_actions';
    product_id: number;
    product_name: string;
    product_price?: number;
    product_thumbnail?: string;
    available_colors: ColorOptionWithId[];
    available_sizes: SizeOptionWithId[];
    actions?: {
        type: string;
        label: string;
        requires?: string[];
    }[];
}

export type CustomData =
    | ProductsCustomData
    | ButtonsCustomData
    | SizeSelectorCustomData
    | ColorSelectorCustomData
    | OrderStatusCustomData
    | TicketCreatedCustomData
    | ImageCustomData
    | ProductActionsCustomData;

export interface RasaButton {
    title: string;
    payload: string;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    image?: string;
    custom?: CustomData;
    buttons?: RasaButton[];
    buttons_disabled?: boolean;
}

export interface ChatSession {
    id: number;
    customer_id?: number;
    visitor_id?: string;
    created_at: string;
    updated_at: string;
}
