export const electronicsProducts = [
    {
        id: 'iphone-15-pro-max',
        name: 'iPhone 15 Pro Max',
        price: 799,
        originalPrice: 899,
        discount: 11,
        image: 'https://images.unsplash.com/photo-1695048132832-b41495f12eb4?w=600&h=600&fit=crop&q=75',
        rating: 4.8,
        reviewCount: 145,
        brand: 'apple',
        category: 'smartphones',
        inStock: true,
        isNew: true,
        isHot: true,
        stock: 25,
        description: 'Latest iPhone with advanced A17 Pro chip, stunning display, and professional camera system.'
    },
    {
        id: 'macbook-pro-16',
        name: 'MacBook Pro 16"',
        price: 2499,
        originalPrice: 2699,
        discount: 7,
        image: 'https://images.unsplash.com/photo-1639087595550-e9770a85f8c0?w=600&h=600&fit=crop&q=75',
        rating: 4.9,
        reviewCount: 234,
        brand: 'apple',
        category: 'laptops',
        inStock: true,
        isNew: true,
        isHot: true,
        stock: 18,
        description: 'Powerful MacBook Pro with M3 Max chip for professionals.'
    },
    {
        id: 'headphones-1',
        name: 'Sony WH-1000XM5',
        price: 349,
        originalPrice: 399,
        discount: 13,
        image: 'https://images.unsplash.com/photo-1755719401541-d78b9bc9b514?w=600&h=600&fit=crop&q=75',
        rating: 4.7,
        reviewCount: 312,
        brand: 'sony',
        category: 'audio',
        inStock: true,
        isNew: false,
        isHot: true,
        stock: 32,
        description: 'Premium noise-cancelling headphones with exceptional sound quality.'
    },
    {
        id: 'smartphone-2',
        name: 'Samsung Galaxy S24 Ultra',
        price: 1199,
        originalPrice: 1299,
        discount: 8,
        image: 'https://images.unsplash.com/photo-1705585174953-9b2aa8afc174?w=600&h=600&fit=crop&q=75',
        rating: 4.6,
        reviewCount: 189,
        brand: 'samsung',
        category: 'smartphones',
        inStock: true,
        isNew: true,
        isHot: false,
        stock: 22,
        description: 'Flagship Samsung phone with advanced AI features and stunning camera.'
    },
    {
        id: 'ipad-air',
        name: 'iPad Air',
        price: 599,
        originalPrice: 699,
        discount: 14,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop&q=75',
        rating: 4.8,
        reviewCount: 267,
        brand: 'apple',
        category: 'tablets',
        inStock: true,
        isNew: true,
        isHot: false,
        stock: 19,
        description: 'Versatile iPad with M1 chip and stunning Liquid Retina display.'
    },
    {
        id: 'smartwatch-1',
        name: 'Apple Watch Series 9',
        price: 399,
        originalPrice: 449,
        discount: 11,
        image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&h=600&fit=crop&q=75',
        rating: 4.5,
        reviewCount: 198,
        brand: 'apple',
        category: 'smartwatches',
        inStock: true,
        isNew: false,
        isHot: false,
        stock: 28,
        description: 'Advanced smartwatch with fitness tracking and health monitoring.'
    }
];

export const hotDeals = [
    {
        id: 'offer-1',
        price: 999,
        originalPrice: 1199,
        discount: 17,
        image: 'https://images.unsplash.com/photo-1695048132832-b41495f12eb4?w=600&auto=format&fit=crop&q=75',
        brand: 'apple',
        category: 'smartphones',
        stock: 20,
        rating: 4.8,
        reviews: 1250,
        dealEnds: new Date(Date.now() + 86400000).toISOString(),
        sold: 45,
        total: 100,
    },
    {
        id: 'offer-2',
        price: 999,
        originalPrice: 1199,
        discount: 17,
        image: 'https://images.unsplash.com/photo-1705585174953-9b2aa8afc174?w=600&auto=format&fit=crop&q=75',
        brand: 'samsung',
        category: 'smartphones',
        stock: 15,
        rating: 4.7,
        reviews: 892,
        dealEnds: new Date(Date.now() + 172800000).toISOString(),
        sold: 78,
        total: 100,
    },
    {
        id: 'offer-3',
        price: 1499,
        originalPrice: 1699,
        discount: 12,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=75',
        brand: 'apple',
        category: 'laptops',
        stock: 10,
        rating: 4.9,
        reviews: 567,
        dealEnds: new Date(Date.now() + 259200000).toISOString(),
        sold: 32,
        total: 50,
    },
    {
        id: 'offer-4',
        price: 349,
        originalPrice: 449,
        discount: 22,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=75',
        brand: 'sony',
        category: 'audio',
        stock: 25,
        rating: 4.9,
        reviews: 2145,
        dealEnds: new Date(Date.now() + 129600000).toISOString(),
        sold: 92,
        total: 150,
    }
];

export const mockDeals = [
    {
        id: 1,
        name: 'Wireless Headphones Pro',
        price: 99.99,
        originalPrice: 149.99,
        discount: 33,
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop'
        ],
        rating: 4.5,
        reviewCount: 128,
        sold: 245,
        brand: 'AudioTech'
    },
    {
        id: 2,
        name: 'Smartphone X Pro Max',
        price: 899.99,
        originalPrice: 999.99,
        discount: 10,
        images: [
            'https://images.unsplash.com/photo-1694878981789-130374dde465?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnRwaG9uZSUyMHglMjBwcm8lMjBtYXh8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1517946565246-7aaad1b552d4?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1512941691920-25bda36dc643?w=600&h=600&fit=crop'
        ],
        rating: 4.7,
        reviewCount: 342,
        sold: 189,
        brand: 'TechBrand'
    },
    {
        id: 3,
        name: 'Smart Watch Series 5',
        price: 249.99,
        originalPrice: 349.99,
        discount: 28,
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=faces',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=entropy'
        ],
        rating: 4.6,
        reviewCount: 215,
        sold: 456,
        brand: 'SmartTech'
    },
    {
        id: 4,
        name: 'Laptop Pro 15"',
        price: 1299.99,
        originalPrice: 1499.99,
        discount: 13,
        images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop'
        ],
        rating: 4.8,
        reviewCount: 189,
        sold: 78,
        brand: 'CompuTech'
    },
    {
        id: 5,
        name: 'Wireless Speaker Bluetooth',
        price: 79.99,
        originalPrice: 129.99,
        discount: 38,
        images: [
            'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1588183657521-41a854e5b66f?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&h=600&fit=crop'
        ],
        rating: 4.4,
        reviewCount: 276,
        sold: 623,
        brand: 'SoundMax'
    },
    {
        id: 6,
        name: 'Tablet Pro 11 Inch',
        price: 599.99,
        originalPrice: 749.99,
        discount: 20,
        images: [
            'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop'
        ],
        rating: 4.7,
        reviewCount: 198,
        sold: 234,
        brand: 'TechPlus'
    },
    {
        id: 7,
        name: 'Mirrorless Camera 4K',
        price: 1799.99,
        originalPrice: 2099.99,
        discount: 14,
        images: [
            'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=600&h=600&fit=crop&crop=faces'
        ],
        rating: 4.9,
        reviewCount: 145,
        sold: 89,
        brand: 'PhotoPro'
    },
    {
        id: 8,
        name: 'Portable SSD 1TB',
        price: 149.99,
        originalPrice: 199.99,
        discount: 25,
        images: [
            'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=600&fit=crop&crop=entropy'
        ],
        rating: 4.6,
        reviewCount: 324,
        sold: 512,
        brand: 'StorageTech'
    },
    {
        id: 10,
        name: 'Wireless Mouse Pro',
        price: 59.99,
        originalPrice: 89.99,
        discount: 33,
        images: [
            'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=600&fit=crop&crop=faces',
            'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=600&fit=crop&crop=entropy'
        ],
        rating: 4.4,
        reviewCount: 401,
        sold: 678,
        brand: 'TechCare'
    },
    {
        id: 11,
        name: 'USB-C Hub Multiport',
        price: 39.99,
        originalPrice: 59.99,
        discount: 33,
        images: [
            'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1587829191301-6d0c10fb325e?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1602992811492-409aa5e6932d?w=600&h=600&fit=crop'
        ],
        rating: 4.3,
        reviewCount: 189,
        sold: 834,
        brand: 'ConnectTech'
    },
    {
        id: 12,
        name: 'Phone Stand Adjustable',
        price: 19.99,
        originalPrice: 34.99,
        discount: 43,
        images: [
            'https://images.unsplash.com/photo-1601220363009-f7e66d095649?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UGhvbmUlMjBTdGFuZCUyMEFkanVzdGFibGV8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop'
        ],
        rating: 4.6,
        reviewCount: 512,
        sold: 1205,
        brand: 'AccessoryPro'
    }
];

export const newArrivals = [
    {
        id: 'headphones-1',
        price: 249,
        originalPrice: 299,
        discount: 17,
        image: 'https://images.unsplash.com/photo-1586343797367-c8942268df67?w=600&auto=format&fit=crop&q=75',
        isNew: true,
        isHot: true,
        brand: 'sony',
        category: 'audio',
        stock: 15
    },
    {
        id: 'smartphone-1',
        price: 1199,
        originalPrice: 1399,
        discount: 14,
        image: 'https://images.unsplash.com/photo-1695048132832-b41495f12eb4?w=600&auto=format&fit=crop&q=75',
        isNew: true,
        isHot: true,
        brand: 'apple',
        category: 'smartphones',
        stock: 20
    },
    {
        id: 'laptop-1',
        price: 1599,
        originalPrice: 1799,
        discount: 11,
        image: 'https://images.unsplash.com/photo-1567535343204-4b3f10787c4c?q=80&w=600&auto=format&fit=crop',
        isNew: true,
        isHot: true,
        brand: 'apple',
        category: 'laptops',
        stock: 10
    },
    {
        id: 'smartwatch-1',
        price: 799,
        originalPrice: 899,
        discount: 11,
        image: 'https://images.unsplash.com/photo-1758348844371-dfbae2780bd3?q=80&w=600&auto=format&fit=crop',
        isNew: true,
        isHot: false,
        brand: 'apple',
        category: 'smartwatches',
        stock: 15
    }
];

export const specialOffers = [
    {
        id: 'offer-1',
        price: 999,
        originalPrice: 1099,
        discount: 9,
        image: 'https://images.unsplash.com/photo-1695639509828-d4260075e370?w=600&auto=format&fit=crop&q=75',
        isNew: true,
        isHot: true,
        brand: 'apple',
        category: 'smartphones',
        stock: 15
    },
    {
        id: 'offer-2',
        price: 1199,
        originalPrice: 1299,
        discount: 8,
        image: 'https://images.unsplash.com/photo-1705585174953-9b2aa8afc174?w=600&auto=format&fit=crop&q=75',
        isNew: true,
        isHot: true,
        brand: 'samsung',
        category: 'smartphones',
        stock: 20
    },
    {
        id: 'offer-3',
        price: 2499,
        originalPrice: 2699,
        discount: 7,
        image: 'https://images.unsplash.com/photo-1639087595550-e9770a85f8c0?w=600&auto=format&fit=crop&q=75',
        isNew: true,
        isHot: false,
        brand: 'apple',
        category: 'laptops',
        stock: 12
    },
    {
        id: 'offer-4',
        price: 349,
        originalPrice: 399,
        discount: 13,
        image: 'https://images.unsplash.com/photo-1755719401541-d78b9bc9b514?w=600&auto=format&fit=crop&q=75',
        isNew: false,
        isHot: true,
        brand: 'sony',
        category: 'audio',
        stock: 30
    }
];

export const getAllProducts = () => {
    return [
        ...electronicsProducts,
        ...hotDeals,
        ...newArrivals,
        ...specialOffers,
        ...mockDeals
    ];
};
