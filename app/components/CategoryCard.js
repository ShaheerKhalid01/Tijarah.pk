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
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col overflow-hidden border border-gray-100 hover:border-gray-200">
      <div className="p-6 border-b border-gray-100 bg-linear-to-r from-blue-50 to-indigo-50">
        <h3 
          className="text-2xl font-bold text-gray-900 tracking-tight"
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 700,
            letterSpacing: '-0.01em'
          }}
        >
          {title}
        </h3>
      </div>
      <div className="flex-1 p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 h-full">
          {items.slice(0, 4).map((item, index) => {
            const content = (
              <div 
                className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl hover:bg-linear-to-br hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 text-center hover:scale-[1.03] transform w-full h-full"
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
              <div 
                className="mb-3 p-3 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1"
                style={{
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              >
                <Image 
                  className="h-14 w-14 sm:h-16 sm:w-16 object-contain" 
                  src={item.image} 
                  alt={item.alt || item.label}
                  width={64}
                  height={64}
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))'
                  }}
                />
              </div>
              <span 
                className="text-sm sm:text-base font-medium text-gray-800 group-hover:text-blue-700 transition-colors"
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 500,
                  lineHeight: '1.4',
                  transition: 'color 0.2s ease-in-out'
                }}
              >
                {item.label}
              </span>
            </div>
            );
            
            return item.href ? (
              <Link 
                key={index}
                href={item.href}
                className="block w-full h-full"
              >
                {content}
              </Link>
            ) : (
              <div key={index} className="w-full h-full">
                {content}
              </div>
            );
          })}
        </div>
      </div>
<div className="border-t border-gray-100 px-6 py-4 bg-gradient-to-r from-gray-50/80 to-blue-50/80">
        <div className="text-center">
          {footerHref ? (
            <Link 
              href={footerHref}
              className="inline-flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors group"
            >
              {footerLabel}
              <svg 
                className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <span className="text-sm font-medium text-gray-500">
              {footerLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
