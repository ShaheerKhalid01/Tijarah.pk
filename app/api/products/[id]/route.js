import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';
import { getAllProducts } from '@/app/lib/product-data';

// Mock data for special offers (should match frontend or be moved to a shared config)
const specialOffers = {
    'offer-1': {
        id: 'offer-1',
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with advanced camera system',
        price: 999,
        originalPrice: 1099,
        discount: 9,
        image: 'https://images.unsplash.com/photo-1695639509828-d4260075e370?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGlwaG9uZSUyMDE1JTIwcHJvfGVufDB8fDB8fHww',
        images: [
            'https://images.unsplash.com/photo-1695639509828-d4260075e370?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGlwaG9uZSUyMDE1JTIwcHJvfGVufDB8fDB8fHww',
            'https://images.unsplash.com/photo-1710023038502-ba80a70a9f53?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXBob25lJTIwMTUlMjBwcm98ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1695619575474-9b45e37bc1e6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aXBob25lJTIwMTUlMjBwcm98ZW58MHx8MHx8fDA%3D'
        ],
        stock: 15,
        inStock: true,
        rating: 4.9,
        reviewCount: 128
    },
    'offer-2': {
        id: 'offer-2',
        name: 'Samsung Galaxy S24 Ultra',
        description: '200MP camera with advanced features',
        price: 1199,
        originalPrice: 1299,
        discount: 8,
        image: 'https://images.unsplash.com/photo-1705585174953-9b2aa8afc174?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Ftc3VuZyUyMGdhbGF4eSUyMHMyNCUyMHVsdHJhfGVufDB8fDB8fHww',
        images: [
            'https://images.unsplash.com/photo-1705585174953-9b2aa8afc174?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Ftc3VuZyUyMGdhbGF4eSUyMHMyNCUyMHVsdHJhfGVufDB8fDB8fHww',
            'https://images.unsplash.com/photo-1705585175110-d25f92c183aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2Ftc3VuZyUyMGdhbGF4eSUyMHMyNCUyMHVsdHJhfGVufDB8fDB8fHww',
            'https://images.unsplash.com/photo-1705530292519-ec81f2ace70d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2Ftc3VuZyUyMGdhbGF4eSUyMHMyNCUyMHVsdHJhfGVufDB8fDB8fHww'
        ],
        stock: 20,
        inStock: true,
        rating: 4.8,
        reviewCount: 95
    },
    'offer-3': {
        id: 'offer-3',
        name: 'MacBook Pro 16 inch',
        description: 'Professional laptop with M3 Pro',
        price: 2499,
        originalPrice: 2699,
        discount: 7,
        image: 'https://images.unsplash.com/photo-1639087595550-e9770a85f8c0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjYm9vayUyMHBybyUyMDE2fGVufDB8fDB8fHww',
        images: [
            'https://images.unsplash.com/photo-1639087595550-e9770a85f8c0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjYm9vayUyMHBybyUyMDE2fGVufDB8fDB8fHww',
            'https://images.unsplash.com/photo-1675868374786-3edd36dddf04?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFjYm9vayUyMHBybyUyMDE2fGVufDB8fDB8fHww',
            'https://images.unsplash.com/photo-1675868373607-556b8fed6464?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFjYm9vayUyMHBybyUyMDE2fGVufDB8fDB8fHww'
        ],
        stock: 12,
        inStock: true,
        rating: 4.9,
        reviewCount: 210
    },
    'offer-4': {
        id: 'offer-4',
        name: 'Sony WH-1000XM5',
        description: 'Premium noise cancelling headphones',
        price: 349,
        originalPrice: 399,
        discount: 13,
        image: 'https://images.unsplash.com/photo-1755719401541-d78b9bc9b514?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U29ueSUyMFdILTEwMDBYTTV8ZW58MHx8MHx8fDA%3D',
        images: [
            'https://images.unsplash.com/photo-1755719401541-d78b9bc9b514?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U29ueSUyMFdILTEwMDBYTTV8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1755719401938-35c1b24f6d15?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U29ueSUyMFdILTEwMDBYTTV8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1761005653849-74d20f95ecc2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8U29ueSUyMFdILTEwMDBYTTV8ZW58MHx8MHx8fDA%3D'
        ],
        stock: 30,
        inStock: true,
        rating: 4.7,
        reviewCount: 350
    },
    'headphones-1': {
        id: 'headphones-1',
        name: 'Sony WH-1000XM3',
        price: 249,
        originalPrice: 299,
        discount: 17,
        image: 'https://images.unsplash.com/photo-1586343797367-c8942268df67?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8U29ueSUyMFdILTEwMDBYTTN8ZW58MHx8MHx8fDA%3D',
        images: [
            'https://images.unsplash.com/photo-1586343797367-c8942268df67?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8U29ueSUyMFdILTEwMDBYTTN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1615433366992-1586f3b8fca5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U29ueSUyMFdILTEwMDBYTTN8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1595582693131-fd8df824174a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U29ueSUyMFdILTEwMDBYTTN8ZW58MHx8MHx8fDA%3D'
        ],
        stock: 15,
        inStock: true,
        rating: 4.8,
        reviewCount: 156
    },
    'smartphone-1': {
        id: 'smartphone-1',
        name: 'iPhone 15',
        price: 1199,
        originalPrice: 1399,
        discount: 14,
        image: 'https://images.unsplash.com/photo-1695048132832-b41495f12eb4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXBob25lJTIwMTV8ZW58MHx8MHx8fDA%3D',
        images: [
            'https://images.unsplash.com/photo-1695048132832-b41495f12eb4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXBob25lJTIwMTV8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1702184117235-56002cb13663?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aXBob25lJTIwMTV8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1703434123142-1b41a1b1055b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aXBob25lJTIwMTV8ZW58MHx8MHx8fDA%3D'
        ],
        stock: 20,
        inStock: true,
        rating: 4.9,
        reviewCount: 89
    },
    'laptop-1': {
        id: 'laptop-1',
        name: 'MacBook Pro',
        price: 1599,
        originalPrice: 1799,
        discount: 11,
        image: 'https://images.unsplash.com/photo-1567535343204-4b3f10787c4c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        images: [
            'https://images.unsplash.com/photo-1567535343204-4b3f10787c4c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjYm9vayUyMHByb3xlbnwwfHwwfHx8MA%3D%3D',
            'https://images.unsplash.com/photo-1569770218135-bea267ed7e84?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFjYm9vayUyMHByb3xlbnwwfHwwfHx8MA%3D%3D'
        ],
        stock: 10,
        inStock: true,
        rating: 4.8,
        reviewCount: 42
    },
    'smartwatch-1': {
        id: 'smartwatch-1',
        name: 'Apple Watch Ultra 3',
        price: 799,
        originalPrice: 899,
        discount: 11,
        image: 'https://images.unsplash.com/photo-1758348844371-dfbae2780bd3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        images: [
            'https://images.unsplash.com/photo-1758348844371-dfbae2780bd3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1708920325933-5988622fe361?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QXBwbGUlMjBXYXRjaCUyMFVsdHJhJTIwM3xlbnwwfHwwfHx8MA%3D%3D',
            'https://images.unsplash.com/photo-1648991680226-796783b22903?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QXBwbGUlMjBXYXRjaCUyMFVsdHJhJTIwM3xlbnwwfHwwfHx8MA%3D%3D'
        ],
        stock: 15,
        inStock: true,
        rating: 4.7,
        reviewCount: 34
    },
    'smartphone-pro': {
        id: 'smartphone-pro',
        name: 'Smartphone Pro',
        price: 899.99,
        rating: 4.5,
        reviewCount: 156,
        image: 'https://images.unsplash.com/photo-1652352545956-34c26af007da?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnRwaG9uZSUyMHByb3xlbnwwfHwwfHx8MA%3D%3D',
        images: [
            'https://images.unsplash.com/photo-1652352545956-34c26af007da?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnRwaG9uZSUyMHByb3xlbnwwfHwwfHx8MA%3D%3D'
        ],
        stock: 50,
        inStock: true,
        description: 'Advanced smartphone with professional camera'
    },
    'wireless-earbuds': {
        id: 'wireless-earbuds',
        name: 'Wireless Earbuds',
        price: 129.99,
        rating: 4.2,
        reviewCount: 89,
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww',
        images: [
            'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww'
        ],
        stock: 100,
        inStock: true,
        description: 'High-quality sound with long battery life'
    },
    'smart-watch': {
        id: 'smart-watch',
        name: 'Smart Watch',
        price: 249.99,
        rating: 4.7,
        reviewCount: 234,
        image: 'https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnR3YXRjaHxlbnwwfHwwfHx8MA%3D%3D',
        images: [
            'https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnR3YXRjaHxlbnwwfHwwfHx8MA%3D%3D'
        ],
        stock: 30,
        inStock: true,
        description: 'Monitor your health and stay connected'
    },
    'laptop-ultra': {
        id: 'laptop-ultra',
        name: 'Ultra Laptop',
        price: 1299.99,
        rating: 4.8,
        reviewCount: 67,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop'
        ],
        stock: 20,
        inStock: true,
        description: 'Powerful performance for power users'
    },
    'mens-shirt': {
        id: 'mens-shirt',
        name: "Men's Shirt",
        price: 39.99,
        rating: 4.3,
        reviewCount: 452,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop'
        ],
        stock: 150,
        inStock: true,
        description: 'Comfortable and stylish shirt for any occasion'
    },
    'womens-dress': {
        id: 'womens-dress',
        name: "Women's Dress",
        price: 59.99,
        rating: 4.5,
        reviewCount: 328,
        image: 'https://images.unsplash.com/photo-1522219406764-db207f1f7640?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHdvbWVuJ3MlMjBkcmVzcyUyMGlzbGFtaWN8ZW58MHx8MHx8fDA%3D',
        images: [
            'https://images.unsplash.com/photo-1522219406764-db207f1f7640?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHdvbWVuJ3MlMjBkcmVzcyUyMGlzbGFtaWN8ZW58MHx8MHx8fDA%3D'
        ],
        stock: 80,
        inStock: true,
        description: 'Elegant dress for a premium look'
    },
    'running-shoes': {
        id: 'running-shoes',
        name: 'Running Shoes',
        price: 89.99,
        rating: 4.7,
        reviewCount: 892,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop'
        ],
        stock: 120,
        inStock: true,
        description: 'High-performance shoes for professional runners'
    },
    'designer-handbag': {
        id: 'designer-handbag',
        name: 'Designer Handbag',
        price: 199.99,
        rating: 4.6,
        reviewCount: 145,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop'
        ],
        stock: 40,
        inStock: true,
        description: 'Luxury designer handbag for a stylish statement'
    },
    // Smartphones
    'iphone-15-pro-max': {
        id: 'iphone-15-pro-max',
        name: 'iPhone 15 Pro Max',
        price: 1199,
        image: 'https://images.unsplash.com/photo-1695822822491-d92cee704368?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.8,
        description: 'Latest iPhone with A17 Pro chip and advanced camera system',
        brand: 'Apple',
        inStock: true,
        stock: 15,
        reviewCount: 450,
        images: ['https://images.unsplash.com/photo-1695822822491-d92cee704368?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']
    },
    'samsung-s23-ultra': {
        id: 'samsung-s23-ultra',
        name: 'Samsung Galaxy S23 Ultra',
        price: 1199,
        image: 'https://images.unsplash.com/photo-1709744722656-9b850470293f?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.7,
        description: 'Powerful Android flagship with S Pen support',
        brand: 'Samsung',
        inStock: true,
        stock: 20,
        reviewCount: 380,
        images: ['https://images.unsplash.com/photo-1709744722656-9b850470293f?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']
    },
    'google-pixel-8-pro': {
        id: 'google-pixel-8-pro',
        name: 'Google Pixel 8 Pro',
        price: 999,
        image: 'https://images.unsplash.com/photo-1706412703794-d944cd3625b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8R29vZ2xlJTIwUGl4ZWwlMjA4JTIwUHJvfGVufDB8fDB8fHww',
        rating: 4.6,
        description: 'Best-in-class camera with Google AI features',
        brand: 'Google',
        inStock: true,
        stock: 25,
        reviewCount: 220,
        images: ['https://images.unsplash.com/photo-1706412703794-d944cd3625b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8R29vZ2xlJTIwUGl4ZWwlMjA4JTIwUHJvfGVufDB8fDB8fHww']
    },
    'xiaomi-13-pro': {
        id: 'xiaomi-13-pro',
        name: 'Xiaomi Mi 11 Ultra',
        price: 900,
        image: 'https://images.unsplash.com/photo-1619410766515-6263877c7bfe?q=80&w=1460&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.4,
        description: 'High-end specs at a competitive price',
        brand: 'Xiaomi',
        inStock: true,
        stock: 30,
        reviewCount: 150,
        images: ['https://images.unsplash.com/photo-1619410766515-6263877c7bfe?q=80&w=1460&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']
    },
    // Laptops
    'macbook-pro-16': {
        id: 'macbook-pro-16',
        name: 'Macbook M1 Max 16"',
        price: 2499,
        image: 'https://images.unsplash.com/photo-1639087595550-e9770a85f8c0?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.9,
        description: 'Powerful laptop with M2 Max chip and Liquid Retina XDR display',
        brand: 'Apple',
        inStock: true,
        stock: 12,
        reviewCount: 95,
        images: ['https://images.unsplash.com/photo-1639087595550-e9770a85f8c0?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']
    },
    'dell-xps-15': {
        id: 'dell-xps-15',
        name: 'Dell XPS 15',
        price: 349999,
        image: 'https://images.unsplash.com/photo-1593642702821-8bce43bdd383?w=500&auto=format&fit=crop&q=60',
        rating: 4.7,
        description: 'Premium Windows laptop with 4K OLED display',
        brand: 'Dell',
        inStock: true,
        stock: 8,
        reviewCount: 64,
        images: ['https://images.unsplash.com/photo-1593642702821-8bce43bdd383?w=500&auto=format&fit=crop&q=60']
    },
    'hp-spectre-x360': {
        id: 'hp-spectre-x360',
        name: 'HP Spectre x360',
        price: 299999,
        image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&auto=format&fit=crop&q=60',
        rating: 4.6,
        description: 'Convertible laptop with 13.5" 3K2K OLED display',
        brand: 'HP',
        inStock: true,
        stock: 10,
        reviewCount: 42,
        images: ['https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&auto=format&fit=crop&q=60']
    },
    'lenovo-thinkpad-x1': {
        id: 'lenovo-thinkpad-x1',
        name: 'Lenovo ThinkPad X1 Carbon',
        price: 279999,
        image: 'https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?w=500&auto=format&fit=crop&q=60',
        rating: 4.5,
        description: 'Business laptop with military-grade durability',
        brand: 'Lenovo',
        inStock: true,
        stock: 14,
        reviewCount: 38,
        images: ['https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?w=500&auto=format&fit=crop&q=60']
    },
    'asus-rog-zephyrus': {
        id: 'asus-rog-zephyrus',
        name: 'ASUS ROG Zephyrus G14',
        price: 329999,
        image: 'https://images.unsplash.com/photo-1593508512255-86ab42a0e621?w=500&auto=format&fit=crop&q=60',
        rating: 4.7,
        description: 'Gaming laptop with AMD Ryzen 9 and RTX 3080',
        brand: 'ASUS',
        inStock: true,
        stock: 6,
        reviewCount: 29,
        images: ['https://images.unsplash.com/photo-1593508512255-86ab42a0e621?w=500&auto=format&fit=crop&q=60']
    },
    'microsoft-surface-laptop': {
        id: 'microsoft-surface-laptop',
        name: 'Microsoft Surface Laptop 5',
        price: 269999,
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60',
        rating: 4.4,
        description: 'Sleek Windows laptop with PixelSense touch display',
        brand: 'Microsoft',
        inStock: true,
        stock: 9,
        reviewCount: 45,
        images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60']
    },
    // Fashion
    'dress-elegant-summer': {
        id: 'dress-elegant-summer',
        name: 'Elegant Summer Dress',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1595777712802-a3fb0ce012cb?w=500&auto=format&fit=crop&q=60',
        rating: 4.8,
        description: 'Lightweight and comfortable summer dress with floral pattern.',
        brand: 'ChicStyle',
        inStock: true,
        stock: 25,
        reviewCount: 112,
        images: ['https://images.unsplash.com/photo-1595777712802-a3fb0ce012cb?w=500&auto=format&fit=crop&q=60']
    },
    'shirt-classic-fit': {
        id: 'shirt-classic-fit',
        name: 'Classic Fit Shirt',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60',
        rating: 4.6,
        description: 'Premium cotton shirt for a perfect formal look.',
        brand: 'UrbanWear',
        inStock: true,
        stock: 40,
        reviewCount: 88,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60']
    },
    'watch-luxury-chronograph': {
        id: 'watch-luxury-chronograph',
        name: 'Luxury Chronograph Watch',
        price: 249.99,
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&auto=format&fit=crop&q=60',
        rating: 4.9,
        description: 'Elegant timepiece with precision movement.',
        brand: 'TimeMaster',
        inStock: true,
        stock: 12,
        reviewCount: 34,
        images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&auto=format&fit=crop&q=60']
    },
    'necklace-diamond-pendant': {
        id: 'necklace-diamond-pendant',
        name: 'Diamond Pendant Necklace',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&auto=format&fit=crop&q=60',
        rating: 4.7,
        description: 'Elegant diamond pendant on a delicate chain.',
        brand: 'GlamourGems',
        inStock: true,
        stock: 15,
        reviewCount: 22,
        images: ['https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&auto=format&fit=crop&q=60']
    },
    'handbag-leather': {
        id: 'handbag-designer-leather',
        name: 'Designer Leather Handbag',
        price: 179.99,
        image: 'https://images.unsplash.com/photo-1554342872-2c6603bdb4a3?w=500&auto=format&fit=crop&q=60',
        rating: 4.8,
        description: 'Luxurious leather handbag with multiple compartments.',
        brand: 'StyleIcon',
        inStock: true,
        stock: 18,
        reviewCount: 41,
        images: ['https://images.unsplash.com/photo-1554342872-2c6603bdb4a3?w=500&auto=format&fit=crop&q=60']
    },
    'perfume-eau-de-parfum': {
        id: 'perfume-eau-de-parfum',
        name: 'Eau de Parfum',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899fc37?w=500&auto=format&fit=crop&q=60',
        rating: 4.9,
        description: 'Luxury fragrance with long-lasting scent.',
        brand: 'ScentLux',
        inStock: true,
        stock: 20,
        reviewCount: 56,
        images: ['https://images.unsplash.com/photo-1523293182086-7651a899fc37?w=500&auto=format&fit=crop&q=60']
    },
    'jeans-premium-denim': {
        id: 'jeans-premium-denim',
        name: 'Premium Denim Jeans',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&auto=format&fit=crop&q=60',
        rating: 4.5,
        description: 'High-quality denim jeans with perfect fit.',
        brand: 'DenimCo',
        inStock: true,
        stock: 35,
        reviewCount: 124,
        images: ['https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&auto=format&fit=crop&q=60']
    },
    'jacket-leather-bomber': {
        id: 'jacket-leather-bomber',
        name: 'Leather Bomber Jacket',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&auto=format&fit=crop&q=60',
        rating: 4.7,
        description: 'Classic leather bomber jacket for any occasion.',
        brand: 'UrbanStyle',
        inStock: true,
        stock: 12,
        reviewCount: 31,
        images: ['https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&auto=format&fit=crop&q=60']
    },
    // Beauty
    'skincare-serum': {
        id: 'skincare-serum',
        name: 'Advanced Skincare Serum',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=60',
        rating: 4.8,
        description: 'Premium anti-aging serum with vitamin C',
        brand: 'LuxeSkin',
        inStock: true,
        stock: 25,
        reviewCount: 156,
        images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=60']
    },
    'moisturizer': {
        id: 'moisturizer',
        name: 'Hydrating Moisturizer',
        price: 999,
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
        rating: 4.7,
        description: 'Deep hydration for all skin types',
        brand: 'SkinEssence',
        inStock: true,
        stock: 30,
        reviewCount: 210,
        images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop']
    },
    'makeup-palette': {
        id: 'makeup-palette',
        name: 'Eye Shadow Palette',
        price: 1499,
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=60',
        rating: 4.9,
        description: '12-color professional makeup palette',
        brand: 'BeautyPro',
        inStock: true,
        stock: 15,
        reviewCount: 89,
        images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=60']
    },
    'shampoo': {
        id: 'shampoo',
        name: 'Premium Hair Shampoo',
        price: 749,
        image: 'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=600&auto=format&fit=crop&q=60',
        rating: 4.6,
        description: 'Nourishing shampoo for all hair types',
        brand: 'HairCare Plus',
        inStock: true,
        stock: 45,
        reviewCount: 320,
        images: ['https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=600&auto=format&fit=crop&q=60']
    },
    'perfume': {
        id: 'perfume',
        name: 'Elegant Perfume',
        price: 2499,
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899fc37?w=600&auto=format&fit=crop&q=60',
        rating: 4.8,
        description: 'Long-lasting fragrance for women',
        brand: 'FragranceHouse',
        inStock: true,
        stock: 20,
        reviewCount: 145,
        images: ['https://images.unsplash.com/photo-1523293182086-7651a899fc37?w=600&auto=format&fit=crop&q=60']
    },
    'face-wash': {
        id: 'face-wash',
        name: 'Gentle Face Cleanser',
        price: 599,
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=60',
        rating: 4.7,
        description: 'Mild cleansing formula for sensitive skin',
        brand: 'PureBeauty',
        inStock: true,
        stock: 50,
        reviewCount: 230,
        images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=60']
    },
    'lipstick': {
        id: 'lipstick',
        name: 'Matte Lipstick',
        price: 849,
        image: 'https://images.unsplash.com/photo-1571780933382-5dda18788291?w=600&auto=format&fit=crop&q=60',
        rating: 4.6,
        description: 'Long-wear matte finish lipstick',
        brand: 'BeautyPro',
        inStock: true,
        stock: 60,
        reviewCount: 180,
        images: ['https://images.unsplash.com/photo-1571780933382-5dda18788291?w=600&auto=format&fit=crop&q=60']
    },
    'conditioner': {
        id: 'conditioner',
        name: 'Hair Conditioner',
        price: 699,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=60',
        rating: 4.7,
        description: 'Moisturizing conditioner for soft hair',
        brand: 'HairCare Plus',
        inStock: true,
        stock: 40,
        reviewCount: 110,
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=60']
    },
    // Home & Kitchen
    'deluxe-blender': {
        id: 'deluxe-blender',
        name: 'Deluxe Kitchen Blender',
        price: 12999,
        image: 'https://images.unsplash.com/photo-1570222094114-d054a0be6070?w=600&auto=format&fit=crop&q=60',
        rating: 4.8,
        description: 'Powerful blender for smoothies and soups',
        brand: 'KitchenPro',
        inStock: true,
        stock: 15,
        reviewCount: 88,
        images: ['https://images.unsplash.com/photo-1570222094114-d054a0be6070?w=600&auto=format&fit=crop&q=60']
    },
    'coffee-maker': {
        id: 'coffee-maker',
        name: 'Automatic Coffee Maker',
        price: 8999,
        image: 'https://images.unsplash.com/photo-1559056169-641a0ac8b3f3?w=600&auto=format&fit=crop&q=60',
        rating: 4.6,
        description: 'Programmable coffee maker for perfect mornings',
        brand: 'BrewMaster',
        inStock: true,
        stock: 20,
        reviewCount: 124,
        images: ['https://images.unsplash.com/photo-1559056169-641a0ac8b3f3?w=600&auto=format&fit=crop&q=60']
    },
    'dining-table-set': {
        id: 'dining-table-set',
        name: 'Modern Dining Table Set',
        price: 34999,
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&auto=format&fit=crop&q=60',
        rating: 4.7,
        description: 'Elegant dining set for 6 people',
        brand: 'FurniturePlus',
        inStock: true,
        stock: 5,
        reviewCount: 32,
        images: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&auto=format&fit=crop&q=60']
    },
    'led-pendant-light': {
        id: 'led-pendant-light',
        name: 'LED Pendant Light',
        price: 5999,
        image: 'https://images.unsplash.com/photo-1565636192335-14f6b7ce9f60?w=600&auto=format&fit=crop&q=60',
        rating: 4.5,
        description: 'Modern LED pendant light for kitchen',
        brand: 'LightWorks',
        inStock: true,
        stock: 12,
        reviewCount: 45,
        images: ['https://images.unsplash.com/photo-1565636192335-14f6b7ce9f60?w=600&auto=format&fit=crop&q=60']
    },
    'luxury-bedding-set': {
        id: 'luxury-bedding-set',
        name: 'Luxury Bedding Set',
        price: 18999,
        image: 'https://images.unsplash.com/photo-1579656905535-cfe1ba36ec31?w=600&auto=format&fit=crop&q=60',
        rating: 4.9,
        description: 'Premium Egyptian cotton bedding',
        brand: 'ComfortHome',
        inStock: true,
        stock: 25,
        reviewCount: 67,
        images: ['https://images.unsplash.com/photo-1579656905535-cfe1ba36ec31?w=600&auto=format&fit=crop&q=60']
    },
    'food-storage-set': {
        id: 'food-storage-set',
        name: 'Airtight Food Storage Containers',
        price: 3999,
        image: 'https://images.unsplash.com/photo-1578507065211-a9c0b1c51201?w=600&auto=format&fit=crop&q=60',
        rating: 4.6,
        description: 'Set of 5 airtight containers for kitchen organization',
        brand: 'StoragePro',
        inStock: true,
        stock: 50,
        reviewCount: 156,
        images: ['https://images.unsplash.com/photo-1578507065211-a9c0b1c51201?w=600&auto=format&fit=crop&q=60']
    },
    'wall-mirror-decor': {
        id: 'wall-mirror-decor',
        name: 'Decorative Wall Mirror',
        price: 6999,
        image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=600&auto=format&fit=crop&q=60',
        rating: 4.7,
        description: 'Beautiful decorative wall mirror for living room',
        brand: 'DecorArt',
        inStock: true,
        stock: 10,
        reviewCount: 28,
        images: ['https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=600&auto=format&fit=crop&q=60']
    },
    'robot-vacuum': {
        id: 'robot-vacuum',
        name: 'Smart Robot Vacuum',
        price: 24999,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=60',
        rating: 4.8,
        description: 'Intelligent robot vacuum with app control',
        brand: 'SmartHome',
        inStock: true,
        stock: 12,
        reviewCount: 74,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=60']
    }
};

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        // Check if it's a special offer ID
        if (specialOffers[id]) {
            return NextResponse.json({ data: specialOffers[id] });
        }

        // Check centralized product data
        const allProducts = getAllProducts();
        const centralizedProduct = allProducts.find(p => p.id === id);
        if (centralizedProduct) {
            return NextResponse.json({ data: centralizedProduct });
        }

        await connectToDatabase();

        // Try to find in database (handles MongoDB ObjectID)
        let product;
        try {
            product = await Product.findById(id).populate('category').lean();
        } catch (e) {
            // Not a valid ObjectID, or other DB error
            console.log(`[Product API] Product ID ${id} not found in DB or invalid ObjectID`);
        }

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ data: product });
    } catch (error) {
        console.error('[Product ID API Error]:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
