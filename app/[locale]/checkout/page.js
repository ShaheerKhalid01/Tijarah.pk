'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'en';
  const { cart = [], clearCart } = useCart();
  
  const [activeStep, setActiveStep] = useState(1);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Pakistan',
    paymentMethod: 'cash_on_delivery',
  });

  const calculateSubtotal = () => {
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.1;
    return subtotal + tax;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOrderSubmitting(true);

    try {
      console.log('[Checkout] Form submitted');
      
      if (!formData.email || !formData.phone || !formData.address) {
        throw new Error('Please fill in all required fields');
      }

      if (!cart || cart.length === 0) {
        throw new Error('Your cart is empty');
      }

      const orderData = {
        customerName: `${formData.firstName} ${formData.lastName}` || session?.user?.name || 'Guest',
        customerEmail: formData.email || session?.user?.email || '',
        customerPhone: formData.phone || '',
        shippingAddress: {
          street: formData.address || '',
          city: formData.city || '',
          country: formData.country || 'Pakistan',
        },
        items: cart.map(item => ({
          productId: item._id || item.id,
          productName: item.name,
          quantity: item.quantity || 1,
          price: item.price || 0,
          image: item.images?.[0] || item.image || '',
        })),
        subtotal: calculateSubtotal(),
        tax: calculateSubtotal() * 0.1,
        total: calculateTotal(),
        paymentMethod: formData.paymentMethod || 'cash_on_delivery',
        paymentStatus: 'pending',
        userId: session?.user?.id || null,
      };

      console.log('[Checkout] Order data prepared:', orderData);

      const fetchOptions = {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      };

      console.log('[Checkout] Sending fetch request to /api/orders');
      console.log('[Checkout] Fetch options:', fetchOptions);

      const response = await fetch('/api/orders', fetchOptions);
      
      console.log('[Checkout] Response status:', response.status);
      console.log('[Checkout] Response headers:', response.headers);

      const result = await response.json();
      console.log('[Checkout] Response body:', result);

      if (!response.ok) {
        console.error('[Checkout] Response not OK');
        console.error('[Checkout] Error result:', result);
        throw new Error(result?.error || result?.message || `Failed to create order (Status: ${response.status})`);
      }

      console.log('[Checkout] Order created successfully');
      alert(`Order created!\nOrder #: ${result.order?.orderNumber || 'N/A'}`);
      
      if (clearCart) clearCart();
      setActiveStep(3);
      setTimeout(() => router.push(`/${locale}`), 2000);

    } catch (error) {
      console.error('[Checkout] Error caught:', error);
      console.error('[Checkout] Error message:', error.message);
      console.error('[Checkout] Error stack:', error.stack);
      alert(`Error: ${error.message}`);
    } finally {
      setOrderSubmitting(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add products to your cart before checking out.</p>
          <Link href={`/${locale}/products`} className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {activeStep < 3 && (
            <button onClick={() => activeStep === 1 ? router.back() : setActiveStep(1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-8">
              <FiArrowLeft className="mr-2" /> {activeStep === 1 ? 'Back to Cart' : 'Back to Shipping'}
            </button>
          )}

          <div className="mb-12">
            <div className="flex items-center justify-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep >= step ? 'bg-blue-600 text-white' : 'bg-white border-2 border-gray-300 text-gray-500'}`}>
                    {activeStep > step ? <FiCheckCircle className="w-6 h-6" /> : step}
                  </div>
                  {step < 3 && <div className={`h-1 w-16 ${activeStep > step ? 'bg-blue-600' : 'bg-gray-300'}`}></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {activeStep === 1 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                <form onSubmit={(e) => { e.preventDefault(); setActiveStep(2); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="px-4 py-2 border border-gray-300 rounded-md" required />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="px-4 py-2 border border-gray-300 rounded-md" required />
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-md" required />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-md" required />
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-md" required />
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="px-4 py-2 border border-gray-300 rounded-md" required />
                    <select name="country" value={formData.country} onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-md">
                      <option value="Pakistan">Pakistan</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                    </select>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Continue to Payment</button>
                  </div>
                </form>
              </div>
            )}

            {activeStep === 2 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 mb-8">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg">
                      <input type="radio" name="paymentMethod" value="cash_on_delivery" checked={formData.paymentMethod === 'cash_on_delivery'} onChange={handleInputChange} className="h-4 w-4" />
                      <span className="ml-3 text-gray-700">Cash on Delivery (COD)</span>
                    </label>
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg">
                      <input type="radio" name="paymentMethod" value="credit_card" checked={formData.paymentMethod === 'credit_card'} onChange={handleInputChange} className="h-4 w-4" />
                      <span className="ml-3 text-gray-700">Credit/Debit Card</span>
                    </label>
                  </div>
                  <div className="flex justify-between">
                    <button type="button" onClick={() => setActiveStep(1)} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700">Back</button>
                    <button type="submit" disabled={orderSubmitting} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      {orderSubmitting ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeStep === 3 && (
              <div className="text-center bg-white rounded-xl shadow-sm p-12">
                <FiCheckCircle className="mx-auto w-16 h-16 text-green-600 mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed! ✅</h2>
                <p className="text-gray-600 mb-8">Thank you for your purchase.</p>
                <Link href={`/${locale}`} className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg">Back to Home</Link>
              </div>
            )}

            {activeStep < 3 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                {cart.map((item) => (
                  <div key={item.id || item._id} className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">{item.name} x {item.quantity || 1}</span>
                    <span className="text-sm font-medium">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Tax (10%)</span>
                    <span>${(calculateSubtotal() * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}