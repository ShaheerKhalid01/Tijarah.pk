'use client';

import Image from 'next/image';
import Link from 'next/link';

const CategoryCard = ({ 
  title = 'Shop by Category', 
  items = [], 
  footerLabel = 'See more', 
  footerHref = '#' 
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {items.map((item, index) => (
            <li key={index}>
              <Link href={item.href} className="block hover:bg-gray-50">
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="flex-shrink-0">
                    <Image 
                      className="h-10 w-10 rounded-full" 
                      src={item.image} 
                      alt={item.alt || item.label}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <div className="text-sm">
          <Link href={footerHref} className="font-medium text-blue-600 hover:text-blue-500">
            {footerLabel}
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
