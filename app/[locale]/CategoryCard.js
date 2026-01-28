'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const CategoryCard = ({ 
  title = 'Shop by Category', 
  items = [], 
  footerLabel = 'See more', 
  footerHref = '#' 
}) => {
  const params = useParams();
  const locale = params?.locale || 'en';
  
  // Ensure we have valid items and take the first 4
  const displayItems = Array.isArray(items) ? items.slice(0, 4) : [];

  // Function to generate the correct product URL
  const getProductUrl = (item) => {
    if (!item) return '#';
    // If item has an href, use it directly
    if (item.href) return item.href;
    // Otherwise construct from ID and locale
    const itemId = item.id || item.productId || item._id;
    return `/${locale}/products/${encodeURIComponent(itemId)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="relative px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600">
        <h3 className="text-xl font-bold text-white tracking-wide">
          {title}
          <span className="absolute bottom-0 left-0 h-1 w-16 bg-yellow-400 rounded-full"></span>
        </h3>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {displayItems.map((item, index) => {
            const productUrl = getProductUrl(item);
            const productName = item.name || item.title || `Product ${index + 1}`;
            const productAlt = item.alt || productName;
            const imageUrl = item.image || 
                           item.imageUrl || 
                           item.thumbnail || 
                           'https://via.placeholder.com/300x300?text=No+Image';

            return (
              <div key={item.id || index} className="group relative">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200">
                  <Link href={productUrl} className="block">
                    <Image
                      src={imageUrl}
                      alt={productAlt}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                  </Link>
                </div>
                <div className="mt-2 text-center">
                  <h3 className="text-sm text-gray-700">
                    <Link href={productUrl}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {productName}
                    </Link>
                  </h3>
                  {item.price && (
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      ${parseFloat(item.price).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {footerLabel && (
        <div className="bg-gray-50 px-4 py-3 text-center border-t border-gray-200">
          <Link 
            href={footerHref} 
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            {footerLabel}
            <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;