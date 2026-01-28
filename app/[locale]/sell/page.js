'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const SellPage = () => {
  const t = useTranslations('Sell');
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    condition: 'new',
    price: '',
    quantity: 1,
    images: [],
    location: '',
    shippingOptions: {
      localPickup: false,
      freeShipping: false,
      calculatedShipping: false,
      shippingCost: ''
    },
    returnPolicy: '7days',
    paymentMethods: []
  });

  // Mock categories - in a real app, these would come from your API
  useEffect(() => {
    // Simulate API call
    const fetchCategories = async () => {
      try {
        // This would be an actual API call in production
        const mockCategories = [
          { id: 'electronics', name: 'Electronics' },
          { id: 'fashion', name: 'Fashion' },
          { id: 'home', name: 'Home & Garden' },
          { id: 'sports', name: 'Sports & Outdoors' },
          { id: 'toys', name: 'Toys & Games' },
          { id: 'books', name: 'Books & Media' },
          { id: 'vehicles', name: 'Vehicles' },
          { id: 'property', name: 'Property' },
          { id: 'services', name: 'Services' },
          { id: 'pets', name: 'Pets' },
          { id: 'furniture', name: 'Furniture' },
          { id: 'jobs', name: 'Jobs' },
          { id: 'business', name: 'Business & Industrial' },
          { id: 'hobbies', name: 'Hobbies & Leisure' },
          { id: 'other', name: 'Other' }
        ];
        setCategories(mockCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error(t('errors.fetchCategories'));
      }
    };

    fetchCategories();
  }, [t]);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      if (name.startsWith('shippingOptions.')) {
        const shippingOption = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          shippingOptions: {
            ...prev.shippingOptions,
            [shippingOption]: checked
          }
        }));
      } else if (name === 'paymentMethods') {
        setFormData(prev => {
          const paymentMethods = checked
            ? [...prev.paymentMethods, value]
            : prev.paymentMethods.filter(method => method !== value);
          return { ...prev, paymentMethods };
        });
      }
    } else if (type === 'file') {
      // Handle file uploads
      const newImages = Array.from(files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 10) // Limit to 10 images
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error(t('validation.titleRequired'));
      return false;
    }
    if (!formData.description.trim()) {
      toast.error(t('validation.descriptionRequired'));
      return false;
    }
    if (!formData.category) {
      toast.error(t('validation.categoryRequired'));
      return false;
    }
    if (formData.price <= 0) {
      toast.error(t('validation.validPrice'));
      return false;
    }
    if (formData.quantity < 1) {
      toast.error(t('validation.validQuantity'));
      return false;
    }
    if (formData.images.length === 0) {
      toast.error(t('validation.atLeastOneImage'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare form data for submission
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          formData.images.forEach((image, index) => {
            formDataToSend.append(`images[${index}]`, image.file);
          });
        } else if (key === 'shippingOptions' || key === 'paymentMethods') {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });
      
      // In a real app, you would send this to your API
      // const response = await fetch('/api/listings', {
      //   method: 'POST',
      //   body: formDataToSend
      // });
      // const data = await response.json();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      toast.success(t('successMessage'));
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        subcategory: '',
        condition: 'new',
        price: '',
        quantity: 1,
        images: [],
        location: '',
        shippingOptions: {
          localPickup: false,
          freeShipping: false,
          calculatedShipping: false,
          shippingCost: ''
        },
        returnPolicy: '7days',
        paymentMethods: []
      });
      
      // Redirect to the listing or dashboard
      // router.push('/seller/dashboard');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t('errors.submissionError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-2 text-lg text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">
                  {t('sections.basicInfo')}
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      {t('form.title')} *
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={t('form.titlePlaceholder')}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      {t('form.description')} *
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder={t('form.descriptionPlaceholder')}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {t('form.descriptionHelp')}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      {t('form.category')} *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">{t('form.selectCategory')}</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                      {t('form.subcategory')}
                    </label>
                    <select
                      id="subcategory"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      disabled={!formData.category}
                    >
                      <option value="">{t('form.selectSubcategory')}</option>
                      {/* Subcategories would be populated based on selected category */}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                      {t('form.condition')} *
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="new">{t('conditions.new')}</option>
                      <option value="likeNew">{t('conditions.likeNew')}</option>
                      <option value="good">{t('conditions.good')}</option>
                      <option value="fair">{t('conditions.fair')}</option>
                      <option value="poor">{t('conditions.poor')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Price & Quantity */}
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">
                  {t('sections.priceQuantity')}
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      {t('form.price')} *
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">PKR</span>
                      </div>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-16 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                      {t('form.quantity')} *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">
                  {t('sections.photos')}
                </h2>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>{t('form.uploadPhoto')}</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleInputChange}
                          accept="image/*"
                          multiple
                        />
                      </label>
                      <p className="pl-1">{t('form.orDragDrop')}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {t('form.photoRequirements')}
                    </p>
                  </div>
                </div>

                {/* Preview uploaded images */}
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title={t('form.removeImage')}
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {t('form.imagesUploaded', { count: formData.images.length })}
                    </p>
                  </div>
                )}
              </div>

              {/* Shipping Options */}
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">
                  {t('sections.shipping')}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="local-pickup"
                        name="shippingOptions.localPickup"
                        type="checkbox"
                        checked={formData.shippingOptions.localPickup}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="local-pickup" className="font-medium text-gray-700">
                        {t('form.localPickup')}
                      </label>
                      <p className="text-gray-500">{t('form.localPickupHelp')}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="free-shipping"
                        name="shippingOptions.freeShipping"
                        type="checkbox"
                        checked={formData.shippingOptions.freeShipping}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="free-shipping" className="font-medium text-gray-700">
                        {t('form.freeShipping')}
                      </label>
                      <p className="text-gray-500">{t('form.freeShippingHelp')}</p>
                    </div>
                  </div>

                  {!formData.shippingOptions.freeShipping && (
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="calculated-shipping"
                          name="shippingOptions.calculatedShipping"
                          type="checkbox"
                          checked={formData.shippingOptions.calculatedShipping}
                          onChange={handleInputChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="calculated-shipping" className="font-medium text-gray-700">
                          {t('form.calculatedShipping')}
                        </label>
                        <p className="text-gray-500">{t('form.calculatedShippingHelp')}</p>
                      </div>
                    </div>
                  )}

                  {!formData.shippingOptions.freeShipping && !formData.shippingOptions.calculatedShipping && (
                    <div className="mt-4">
                      <label htmlFor="shipping-cost" className="block text-sm font-medium text-gray-700">
                        {t('form.shippingCost')}
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">PKR</span>
                        </div>
                        <input
                          type="number"
                          name="shippingCost"
                          id="shipping-cost"
                          value={formData.shippingOptions.shippingCost}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              shippingOptions: {
                                ...prev.shippingOptions,
                                shippingCost: value
                              }
                            }));
                          }}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-16 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Return Policy */}
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">
                  {t('sections.returnPolicy')}
                </h2>
                <div className="space-y-4">
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                      <input
                        id="return-7days"
                        name="returnPolicy"
                        type="radio"
                        value="7days"
                        checked={formData.returnPolicy === '7days'}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <label htmlFor="return-7days" className="ml-3 block text-sm font-medium text-gray-700">
                        {t('returnPolicies.7days')}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="return-14days"
                        name="returnPolicy"
                        type="radio"
                        value="14days"
                        checked={formData.returnPolicy === '14days'}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <label htmlFor="return-14days" className="ml-3 block text-sm font-medium text-gray-700">
                        {t('returnPolicies.14days')}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="return-30days"
                        name="returnPolicy"
                        type="radio"
                        value="30days"
                        checked={formData.returnPolicy === '30days'}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <label htmlFor="return-30days" className="ml-3 block text-sm font-medium text-gray-700">
                        {t('returnPolicies.30days')}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="return-no-returns"
                        name="returnPolicy"
                        type="radio"
                        value="noReturns"
                        checked={formData.returnPolicy === 'noReturns'}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <label htmlFor="return-no-returns" className="ml-3 block text-sm font-medium text-gray-700">
                        {t('returnPolicies.noReturns')}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">
                  {t('sections.paymentMethods')}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="cash-on-delivery"
                        name="paymentMethods"
                        type="checkbox"
                        value="cashOnDelivery"
                        checked={formData.paymentMethods.includes('cashOnDelivery')}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="cash-on-delivery" className="font-medium text-gray-700">
                        {t('paymentMethods.cashOnDelivery')}
                      </label>
                      <p className="text-gray-500">{t('paymentMethods.cashOnDeliveryHelp')}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="bank-transfer"
                        name="paymentMethods"
                        type="checkbox"
                        value="bankTransfer"
                        checked={formData.paymentMethods.includes('bankTransfer')}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="bank-transfer" className="font-medium text-gray-700">
                        {t('paymentMethods.bankTransfer')}
                      </label>
                      <p className="text-gray-500">{t('paymentMethods.bankTransferHelp')}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="credit-card"
                        name="paymentMethods"
                        type="checkbox"
                        value="creditCard"
                        checked={formData.paymentMethods.includes('creditCard')}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="credit-card" className="font-medium text-gray-700">
                        {t('paymentMethods.creditCard')}
                      </label>
                      <p className="text-gray-500">{t('paymentMethods.creditCardHelp')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">
                  {t('sections.location')}
                </h2>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    {t('form.location')}
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={t('form.locationPlaceholder')}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {t('form.locationHelp')}
                  </p>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="pt-5">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                      {t('form.agreeToTerms')}
                    </label>
                    <p className="text-gray-500">
                      {t('form.termsAndConditions')} <a href="/terms" className="text-blue-600 hover:text-blue-500">{t('form.termsOfService')}</a> {t('form.and')} <a href="/privacy" className="text-blue-600 hover:text-blue-500">{t('form.privacyPolicy')}</a>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {t('form.saveDraft')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('form.submitting')}
                      </>
                    ) : (
                      t('form.publishListing')
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellPage;
