'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const CustomerServicePage = () => {
  const t = useTranslations('CustomerService');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('faq');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderId: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('form.validation.required');
    }
    
    if (!formData.email) {
      newErrors.email = t('form.validation.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('form.validation.invalidEmail');
    }
    
    if (!formData.subject) {
      newErrors.subject = t('form.validation.required');
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t('form.validation.required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send the form data to your backend
      console.log('Form submitted:', formData);
      
      // Show success message
      toast.success(t('form.success'));
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        orderId: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t('form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    if (!trackingId.trim()) {
      toast.error(t('trackOrder.validation.required'));
      return;
    }
    
    setIsTracking(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would fetch order status from your backend
      const mockTrackingData = {
        id: trackingId,
        status: 'shipped',
        estimatedDelivery: '2025-02-05',
        carrier: 'Tijarah Express',
        trackingNumber: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        history: [
          { status: 'ordered', date: '2025-01-25T10:30:00', location: 'Karachi, Pakistan' },
          { status: 'processing', date: '2025-01-26T09:15:00', location: 'Karachi, Pakistan' },
          { status: 'shipped', date: '2025-01-27T14:20:00', location: 'Lahore, Pakistan' },
        ]
      };
      
      setTrackingResult(mockTrackingData);
      
    } catch (error) {
      console.error('Error tracking order:', error);
      toast.error(t('trackOrder.error'));
      setTrackingResult(null);
    } finally {
      setIsTracking(false);
    }
  };

  const faqs = [
    {
      id: 'faq1',
      question: t('faq1.question'),
      answer: t('faq1.answer')
    },
    {
      id: 'faq2',
      question: t('faq2.question'),
      answer: t('faq2.answer')
    },
    {
      id: 'faq3',
      question: t('faq3.question'),
      answer: t('faq3.answer')
    },
    {
      id: 'faq4',
      question: t('faq4.question'),
      answer: t('faq4.answer')
    },
    {
      id: 'faq5',
      question: t('faq5.question'),
      answer: t('faq5.answer')
    }
  ];
  
  const getStatusBadge = (status) => {
    const statusMap = {
      'ordered': { text: 'Ordered', color: 'bg-blue-100 text-blue-800' },
      'processing': { text: 'Processing', color: 'bg-yellow-100 text-yellow-800' },
      'shipped': { text: 'Shipped', color: 'bg-green-100 text-green-800' },
      'delivered': { text: 'Delivered', color: 'bg-purple-100 text-purple-800' },
      'cancelled': { text: 'Cancelled', color: 'bg-red-100 text-red-800' }
    };
    
    const statusInfo = statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t('title')}
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            {t('subtitle')}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('faq')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'faq'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('tabs.faq')}
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'contact'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('tabs.contact')}
              </button>
              <button
                onClick={() => setActiveTab('track')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'track'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('tabs.track')}
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'faq' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">{t('faqTitle')}</h2>
                <div className="space-y-4">
                  <div className="space-y-6">
                    {faqs.map((faq) => (
                      <div key={faq.id} className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                        <p className="mt-2 text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900">{t('needMoreHelp')}</h3>
                  <p className="mt-2 text-gray-600">
                    {t('contactUsPrompt')}
                  </p>
                  <button
                    onClick={() => setActiveTab('contact')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {t('contactUsButton')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contactUs')}</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        {t('form.name')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        {t('form.email')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">
                        {t('form.orderId')} ({t('form.optional')})
                      </label>
                      <input
                        type="text"
                        id="orderId"
                        name="orderId"
                        value={formData.orderId}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                        {t('form.subject')}
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">{t('form.selectSubject')}</option>
                        <option value="order">{t('form.orderIssue')}</option>
                        <option value="shipping">{t('form.shipping')}</option>
                        <option value="return">{t('form.return')}</option>
                        <option value="payment">{t('form.payment')}</option>
                        <option value="other">{t('form.other')}</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        {t('form.message')}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isSubmitting ? t('form.submitting') : t('form.submit')}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t('contactInfo.title')}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">{t('contactInfo.email')}</h4>
                      <a href="mailto:support@tijarah.pk" className="text-blue-600 hover:text-blue-800">
                        support@tijarah.pk
                      </a>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">{t('contactInfo.phone')}</h4>
                      <a href="tel:+923001234567" className="text-gray-900">+92 300 1234567</a>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">{t('contactInfo.hours')}</h4>
                      <p className="text-gray-900">{t('contactInfo.hoursValue')}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">{t('contactInfo.address')}</h4>
                      <p className="text-gray-900">
                        Tijarah.pk Headquarters<br />
                        {t('contactInfo.addressLine1')}<br />
                        {t('contactInfo.addressLine2')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'track' && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h2 className="mt-3 text-2xl font-bold text-gray-900">{t('trackOrder.title')}</h2>
                  <p className="mt-2 text-gray-600">
                    {t('trackOrder.description')}
                  </p>
                </div>

                <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handleTrackOrder} className="max-w-2xl mx-auto">
                      <div>
                        <label htmlFor="trackingId" className="sr-only">
                          {t('trackOrder.placeholder')}
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <div className="relative flex-grow focus-within:z-10">
                            <input
                              type="text"
                              name="trackingId"
                              id="trackingId"
                              value={trackingId}
                              onChange={(e) => setTrackingId(e.target.value)}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none rounded-l-md pl-4 pr-12 py-3 sm:text-sm border-gray-300"
                              placeholder={t('trackOrder.placeholder')}
                              aria-label="Order ID"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={isTracking}
                            className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                          >
                            {isTracking ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('trackOrder.tracking')}
                              </>
                            ) : (
                              <>
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                                <span>{t('trackOrder.button')}</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          {t('trackOrder.helpText')}
                        </p>
                      </div>
                    </form>

                    {trackingResult && (
                      <div className="mt-8 border-t border-gray-200 pt-6">
                        <div className="bg-white overflow-hidden">
                          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                              Order #{trackingResult.id}
                            </h3>
                            <div className="mt-1 flex items-center">
                              <p className="text-sm text-gray-500">
                                Status: {getStatusBadge(trackingResult.status)}
                              </p>
                            </div>
                          </div>
                          <div className="px-4 py-5 sm:p-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                              <div>
                                <p className="text-sm font-medium text-gray-500">Tracking Number</p>
                                <p className="mt-1 text-sm text-gray-900">{trackingResult.trackingNumber}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Carrier</p>
                                <p className="mt-1 text-sm text-gray-900">{trackingResult.carrier}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Estimated Delivery</p>
                                <p className="mt-1 text-sm text-gray-900">
                                  {new Date(trackingResult.estimatedDelivery).toLocaleDateString(undefined, { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </p>
                              </div>
                            </div>

                            <div className="mt-8">
                              <p className="text-sm font-medium text-gray-500 mb-4">Order History</p>
                              <div className="flow-root">
                                <ul className="-mb-8">
                                  {trackingResult.history.map((event, eventIdx) => (
                                    <li key={eventIdx}>
                                      <div className="relative pb-8">
                                        {eventIdx !== trackingResult.history.length - 1 ? (
                                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                        ) : null}
                                        <div className="relative flex space-x-3">
                                          <div>
                                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                              event.status === 'ordered' ? 'bg-blue-500' : 
                                              event.status === 'processing' ? 'bg-yellow-500' : 
                                              'bg-green-500'
                                            }`}>
                                              {event.status === 'ordered' ? (
                                                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                              ) : event.status === 'processing' ? (
                                                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                                </svg>
                                              ) : (
                                                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-2h1a1 1 0 00.894-.553l1.447-2.894A1 1 0 0021.553 9H17a1 1 0 00-1 1v1h-.05a2.5 2.5 0 00-4.9 0H10V8a1 1 0 00-1-1H6.05a2.5 2.5 0 00-4.9 0H3V5a1 1 0 00-1-1z" />
                                                </svg>
                                              )}
                                            </span>
                                          </div>
                                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between">
                                            <div>
                                              <p className="text-sm text-gray-500 capitalize">
                                                {event.status}
                                              </p>
                                              <p className="text-sm text-gray-500 mt-1">
                                                {event.location}
                                              </p>
                                            </div>
                                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                              <time dateTime={event.date}>
                                                {new Date(event.date).toLocaleString(undefined, {
                                                  month: 'short',
                                                  day: 'numeric',
                                                  hour: '2-digit',
                                                  minute: '2-digit'
                                                })}
                                              </time>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
                            <Link
                              href={`/orders/${trackingResult.id}`}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              {t('trackOrder.viewDetails')}
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    {t('trackOrder.viewAllPrompt')}{' '}
                    <Link href="/orders" className="font-medium text-blue-600 hover:text-blue-500">
                      {t('trackOrder.viewAllOrders')}
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Helpful Links */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t('helpfulLinks.title')}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link href="/payment-options" className="hover:text-blue-600">
                        {t('helpfulLinks.payment.title')}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {t('helpfulLinks.payment.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link href="/returns" className="hover:text-blue-600">
                        {t('helpfulLinks.returns.title')}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {t('helpfulLinks.returns.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link href="/shipping" className="hover:text-blue-600">
                        {t('helpfulLinks.shipping.title')}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {t('helpfulLinks.shipping.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link href="/faq" className="hover:text-blue-600">
                        {t('helpfulLinks.faq.title')}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {t('helpfulLinks.faq.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerServicePage;
