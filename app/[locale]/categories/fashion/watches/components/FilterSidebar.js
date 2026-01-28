'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';

export default function FilterSidebar({
  filters,
  filterOptions,
  onToggleFilter,
  onPriceInputChange,
  onClearAllFilters,
  hasActiveFilters,
  getFilterCount,
  onMobileFiltersClose,
  isMobile = false,
  onFilterApply
}) {
  const [openSections, setOpenSections] = useState({
    type: false,
    brand: false,
    price: false,
    availability: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderFilterSection = (title, section, options, isCheckbox = true) => (
    <div className="border-b border-gray-200 py-6">
      <h3 className="-mx-2 -my-3 flow-root">
        <button
          type="button"
          className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
          onClick={() => toggleSection(section)}
        >
          <span className="font-medium text-gray-900">{title}</span>
          <span className="ml-6 flex items-center">
            {openSections[section] ? (
              <FiChevronUp className="h-5 w-5" aria-hidden="true" />
            ) : (
              <FiChevronDown className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
        </button>
      </h3>
      {openSections[section] && (
        <div className="pt-6">
          <div className="space-y-6">
            {options.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  id={`filter-${section}-${option}`}
                  name={`${section}-${option}`}
                  type={isCheckbox ? 'checkbox' : 'radio'}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={filters[section].includes(option)}
                  onChange={() => onToggleFilter(section, option)}
                />
                <label
                  htmlFor={`filter-${section}-${option}`}
                  className="ml-3 text-sm text-gray-600"
                >
                  {typeof option === 'string' 
                    ? option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')
                    : option}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPriceFilter = () => (
    <div className="border-b border-gray-200 py-6">
      <h3 className="-mx-2 -my-3 flow-root">
        <button
          type="button"
          className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
          onClick={() => toggleSection('price')}
        >
          <span className="font-medium text-gray-900">Price</span>
          <span className="ml-6 flex items-center">
            {openSections.price ? (
              <FiChevronUp className="h-5 w-5" aria-hidden="true" />
            ) : (
              <FiChevronDown className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
        </button>
      </h3>
      {openSections.price && (
        <div className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label htmlFor="min-price" className="block text-sm font-medium text-gray-700">
                  Min
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="min-price"
                    id="min-price"
                    className="block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    value={filters.priceRange[0]}
                    onChange={(e) => onPriceInputChange(e, 0)}
                    min="0"
                    max={filters.priceRange[1] - 1}
                  />
                </div>
              </div>
              <div className="flex-1 ml-4">
                <label htmlFor="max-price" className="block text-sm font-medium text-gray-700">
                  Max
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="max-price"
                    id="max-price"
                    className="block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    value={filters.priceRange[1]}
                    onChange={(e) => onPriceInputChange(e, 1)}
                    min={filters.priceRange[0] + 1}
                    max="1000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={isMobile ? 'lg:hidden' : 'hidden lg:block'}>
      {isMobile && (
        <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          <button
            type="button"
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50"
            onClick={onMobileFiltersClose}
          >
            <span className="sr-only">Close menu</span>
            <FiX className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      )}

      <form className={isMobile ? 'p-4' : ''}>
        {renderFilterSection('Type', 'type', filterOptions.type)}
        {renderFilterSection('Brand', 'brand', filterOptions.brand)}
        {renderPriceFilter()}
        {renderFilterSection('Material', 'material', filterOptions.material)}
        
        <div className="border-t border-gray-200 py-6">
          <h3 className="-mx-2 -my-3 flow-root">
            <button
              type="button"
              className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
              onClick={() => toggleSection('availability')}
            >
              <span className="font-medium text-gray-900">Availability</span>
              <span className="ml-6 flex items-center">
                {openSections.availability ? (
                  <FiChevronUp className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <FiChevronDown className="h-5 w-5" aria-hidden="true" />
                )}
              </span>
            </button>
          </h3>
          {openSections.availability && (
            <div className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center">
                  <input
                    id="in-stock"
                    name="in-stock"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={filters.inStock}
                    onChange={(e) => onToggleFilter('inStock', e.target.checked)}
                  />
                  <label htmlFor="in-stock" className="ml-3 text-sm text-gray-600">
                    In Stock
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="on-sale"
                    name="on-sale"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={filters.onSale}
                    onChange={(e) => onToggleFilter('onSale', e.target.checked)}
                  />
                  <label htmlFor="on-sale" className="ml-3 text-sm text-gray-600">
                    On Sale
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {isMobile ? (
          <div className="border-t border-gray-200 py-6">
            <button
              type="button"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onFilterApply}
            >
              Apply Filters
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                className="mt-3 w-full bg-white text-blue-600 py-2 px-4 border border-blue-600 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={onClearAllFilters}
              >
                Clear All
              </button>
            )}
          </div>
        ) : hasActiveFilters ? (
          <div className="pt-6">
            <button
              type="button"
              className="w-full bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClearAllFilters}
            >
              Clear all filters
            </button>
          </div>
        ) : null}
      </form>
    </div>
  );
}
