          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">Watches</h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Desktop filters */}
              <form className="hidden lg:block">
                <h3 className="sr-only">Filters</h3>

                {/* Watch Type Filter */}
                <div className="border-b border-gray-200 py-6">
                  <h3 className="-my-3 flow-root">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                      aria-controls="filter-section-1"
                      aria-expanded="false"
                      onClick={() => document.getElementById('filter-section-1').classList.toggle('hidden')}
                    >
                      <span className="font-medium text-gray-900">Type</span>
                      <span className="ml-6 flex items-center">
                        <FiChevronDown className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </button>
                  </h3>
                  <div className="pt-6" id="filter-section-1">
                    <div className="space-y-4">
                      {['analog', 'digital', 'smartwatch', 'chronograph', 'diving'].map((type) => (
                        <div key={type} className="flex items-center">
                          <input
                            id={`type-${type}`}
                            name={`type-${type}`}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked={filters.type.includes(type)}
                            onChange={() => handleFilterChange('type', type)}
                          />
                          <label htmlFor={`type-${type}`} className="ml-3 text-sm text-gray-600">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="border-b border-gray-200 py-6">
                  <h3 className="-my-3 flow-root">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                      aria-controls="filter-section-2"
                      aria-expanded="false"
                      onClick={() => document.getElementById('filter-section-2').classList.toggle('hidden')}
                    >
                      <span className="font-medium text-gray-900">Brand</span>
                      <span className="ml-6 flex items-center">
                        <FiChevronDown className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </button>
                  </h3>
                  <div className="pt-6 hidden" id="filter-section-2">
                    <div className="space-y-4">
                      {['TimeMaster', 'LuxuryTime', 'Elegance', 'Precision', 'Vintage'].map((brand) => (
                        <div key={brand} className="flex items-center">
                          <input
                            id={`brand-${brand}`}
                            name={`brand-${brand}`}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked={filters.brand.includes(brand)}
                            onChange={() => handleFilterChange('brand', brand)}
                          />
                          <label htmlFor={`brand-${brand}`} className="ml-3 text-sm text-gray-600">
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Material Filter */}
                <div className="border-b border-gray-200 py-6">
                  <h3 className="-my-3 flow-root">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                      aria-controls="filter-section-3"
                      aria-expanded="false"
                      onClick={() => document.getElementById('filter-section-3').classList.toggle('hidden')}
                    >
                      <span className="font-medium text-gray-900">Material</span>
                      <span className="ml-6 flex items-center">
                        <FiChevronDown className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </button>
                  </h3>
                  <div className="pt-6 hidden" id="filter-section-3">
                    <div className="space-y-4">
                      {['stainless-steel', 'leather', 'silicone', 'titanium', 'ceramic'].map((material) => (
                        <div key={material} className="flex items-center">
                          <input
                            id={`material-${material}`}
                            name={`material-${material}`}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked={filters.material.includes(material)}
                            onChange={() => handleFilterChange('material', material)}
                          />
                          <label htmlFor={`material-${material}`} className="ml-3 text-sm text-gray-600">
                            {material.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="border-b border-gray-200 py-6">
                  <h3 className="-my-3 flow-root">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                      aria-controls="filter-section-4"
                      aria-expanded="false"
                      onClick={() => document.getElementById('filter-section-4').classList.toggle('hidden')}
                    >
                      <span className="font-medium text-gray-900">Price Range</span>
                      <span className="ml-6 flex items-center">
                        <FiChevronDown className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </button>
                  </h3>
                  <div className="pt-6" id="filter-section-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between space-x-4">
                        <div className="flex-1">
                          <label htmlFor="desktop-min-price" className="block text-sm font-medium text-gray-700">Min</label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              name="desktop-min-price"
                              id="desktop-min-price"
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                              value={filters.priceRange[0]}
                              onChange={(e) => handlePriceRangeChange(Number(e.target.value), filters.priceRange[1])}
                              min="0"
                              max={filters.priceRange[1]}
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <label htmlFor="desktop-max-price" className="block text-sm font-medium text-gray-700">Max</label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              name="desktop-max-price"
                              id="desktop-max-price"
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                              value={filters.priceRange[1]}
                              onChange={(e) => handlePriceRangeChange(filters.priceRange[0], Number(e.target.value))}
                              min={filters.priceRange[0]}
                              max="10000"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stock Status Filter */}
                <div className="border-b border-gray-200 py-6">
                  <div className="flex items-center">
                    <input
                      id="desktop-in-stock"
                      name="desktop-in-stock"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={filters.inStock}
                      onChange={() => setFilters(prev => ({ ...prev, inStock: !prev.inStock }))}
                    />
                    <label htmlFor="desktop-in-stock" className="ml-3 text-sm text-gray-600">In Stock Only</label>
                  </div>
                </div>

                {/* On Sale Filter */}
                <div className="border-b border-gray-200 py-6">
                  <div className="flex items-center">
                    <input
                      id="desktop-on-sale"
                      name="desktop-on-sale"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={filters.onSale}
                      onChange={() => setFilters(prev => ({ ...prev, onSale: !prev.onSale }))}
                    />
                    <label htmlFor="desktop-on-sale" className="ml-3 text-sm text-gray-600">On Sale</label>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => {
                      setFilters({
                        type: [],
                        brand: [],
                        material: [],
                        priceRange: [0, 1000],
                        inStock: false,
                        onSale: false
                      });
                      setCurrentPage(1);
                    }}
                  >
                    Clear all filters
                  </button>
                </div>
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                {/* Results count */}
                <div className="mb-4 text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastProduct, filteredProducts.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredProducts.length}</span> results
                </div>

                {currentProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                    {currentProducts.map((product) => (
                      <div key={product.id} className="group relative">
                        <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={300}
                            height={400}
                            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                          />
                          {product.isNew && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              New
                            </div>
                          )}
                          {product.isOnSale && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              Sale
                            </div>
                          )}
                        </div>
                        <div className="mt-4 flex justify-between">
                          <div>
                            <h3 className="text-sm text-gray-700">
                              <Link href={`/${locale}/products/${product.id}`}>
                                <span aria-hidden="true" className="absolute inset-0" />
                                {product.name}
                              </Link>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
                            <div className="mt-1 flex items-center">
                              {renderRating(product.rating)}
                              <span className="ml-2 text-xs text-gray-500">({product.reviewCount})</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
                            {product.originalPrice && (
                              <p className="text-xs text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={() => viewProductDetails(product)}
                            className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${currentPage === 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
                          <span className="font-medium">{Math.min(indexOfLastProduct, filteredProducts.length)}</span> of{' '}
                          <span className="font-medium">{filteredProducts.length}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${currentPage === 1 ? 'bg-gray-50' : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}`}
                          >
                            <span className="sr-only">Previous</span>
                            <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                          </button>
                          
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === pageNum 
                                  ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' 
                                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'}`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${currentPage === totalPages ? 'bg-gray-50' : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}`}
                          >
                            <span className="sr-only">Next</span>
                            <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Product Quick View Modal */}
          {isModalOpen && selectedProduct && (
            <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
              <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>

                <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

                <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <div className="mt-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                                {selectedProduct.name}
                              </h3>
                              <p className="text-sm text-gray-500">{selectedProduct.brand}</p>
                            </div>
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                              onClick={closeModal}
                            >
                              <span className="sr-only">Close</span>
                              <FiX className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                              <Image
                                src={selectedProduct.image}
                                alt={selectedProduct.name}
                                width={500}
                                height={500}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            
                            <div>
                              <div className="flex items-center">
                                {renderRating(selectedProduct.rating)}
                                <span className="ml-2 text-sm text-gray-500">
                                  ({selectedProduct.reviewCount} reviews)
                                </span>
                              </div>
                              
                              <p className="mt-4 text-2xl font-bold text-gray-900">
                                ${selectedProduct.price.toFixed(2)}
                                {selectedProduct.originalPrice && (
                                  <span className="ml-2 text-base font-normal text-gray-500 line-through">
                                    ${selectedProduct.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </p>
                              
                              <p className="mt-4 text-gray-700">
                                {selectedProduct.description || 'No description available.'}
                              </p>
                              
                              <div className="mt-6">
                                <h4 className="text-sm font-medium text-gray-900">Features</h4>
                                <ul className="mt-2 list-disc pl-5 space-y-1">
                                  {selectedProduct.features && selectedProduct.features.length > 0 ? (
                                    selectedProduct.features.map((feature, index) => (
                                      <li key={index} className="text-sm text-gray-600">
                                        {feature}
                                      </li>
                                    ))
                                  ) : (
                                    <li className="text-sm text-gray-600">No features listed.</li>
                                  )}
                                </ul>
                              </div>
                              
                              <div className="mt-6">
                                <h4 className="text-sm font-medium text-gray-900">Specifications</h4>
                                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                  {selectedProduct.specs && Object.entries(selectedProduct.specs).map(([key, value]) => (
                                    <div key={key} className="flex">
                                      <dt className="font-medium text-gray-700">
                                        {key.split(/(?=[A-Z])/).join(' ').replace(/^./, str => str.toUpperCase())}:
                                      </dt>
                                      <dd className="ml-2 text-gray-600">{value}</dd>
                                    </div>
                                  ))}
                                </dl>
                              </div>
                              
                              <div className="mt-6">
                                <button
                                  type="button"
                                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Add to cart
                                </button>
                                
                                <p className="mt-2 text-center text-sm text-gray-500">
                                  or{' '}
                                  <Link 
                                    href={`/${locale}/products/${selectedProduct.id}`}
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                    onClick={closeModal}
                                  >
                                    View full details
                                  </Link>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
