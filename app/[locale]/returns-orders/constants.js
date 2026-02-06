export const APP_NAME = 'Tijarah.pk';

export const OrderStatus = {
  PENDING: 'pending',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Mock electronics products for the catalog
// Note: These are sample products. In a real app, this would come from an API or database
export const ELECTRONICS_PRODUCTS = [
  {
    id: 'elec-1',
    name: 'Wireless Headphones',
    brand: 'Sony',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Audio',
    inStock: true,
    isNew: true,
    isHot: false,
    rating: 4.5,
    reviewCount: 120,
    description: 'Premium wireless headphones with noise cancellation',
    stock: 50
  },
  {
    id: 'elec-2',
    name: 'Smart Watch',
    brand: 'Apple',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Wearables',
    inStock: true,
    isNew: false,
    isHot: true,
    rating: 4.8,
    reviewCount: 250,
    description: 'Latest smartwatch with health tracking features',
    stock: 30
  },
  {
    id: 'elec-3',
    name: 'Laptop',
    brand: 'Dell',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
    category: 'Computers',
    inStock: true,
    isNew: true,
    isHot: true,
    rating: 4.6,
    reviewCount: 180,
    description: 'High-performance laptop for professionals',
    stock: 20
  }
];
