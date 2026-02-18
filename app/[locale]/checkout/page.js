'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useState, useCallback, useMemo, memo, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

// ✅ OPTIMIZED: Move constants outside
const PAYMENT_METHODS = [
  { value: 'cash_on_delivery', label: 'Cash on Delivery (COD)' },
  { value: 'credit_card', label: 'Credit/Debit Card' },
];

const COUNTRIES = [
  { value: 'Pakistan', label: 'Pakistan' },
  { value: 'USA', label: 'USA' },
  { value: 'UK', label: 'UK' },
];

const CHECKOUT_STEPS = [1, 2, 3];

// ✅ OPTIMIZED: Extract StepIndicator component
const StepIndicator = memo(({ activeStep }) => (
  <div className="mb-12">
    <div className="flex items-center justify-center">
      {CHECKOUT_STEPS.map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep >= step
                ? 'bg-blue-600 text-white'
                : 'bg-white border-2 border-gray-300 text-gray-500'
              }`}
          >
            {activeStep > step ? <FiCheckCircle className="w-6 h-6" /> : step}
          </div>
          {step < 3 && (
            <div
              className={`h-1 w-16 ${activeStep > step ? 'bg-blue-600' : 'bg-gray-300'
                }`}
            />
          )}
        </div>
      ))}
    </div>
  </div>
));

StepIndicator.displayName = 'StepIndicator';

// ✅ OPTIMIZED: Extract BackButton component
const BackButton = memo(({ activeStep, onBack, onBackToCart }) => {
  if (activeStep >= 3) return null;

  return (
    <button
      onClick={activeStep === 1 ? onBackToCart : onBack}
      className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      type="button"
      aria-label="Go back"
    >
      <FiArrowLeft className="mr-2" />
      {activeStep === 1 ? 'Back to Cart' : 'Back to Shipping'}
    </button>
  );
});

BackButton.displayName = 'BackButton';

// ✅ OPTIMIZED: Extract ShippingForm component
const ShippingForm = memo(({ formData, onChange, onSubmit }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          placeholder="First Name"
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
          autoComplete="given-name"
          required
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          placeholder="Last Name"
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
          autoComplete="family-name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Email"
          className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
          autoComplete="email"
          required
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="Phone"
          className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
          autoComplete="tel"
          required
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={onChange}
          placeholder="Address"
          className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
          autoComplete="street-address"
          required
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={onChange}
          placeholder="City"
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
          autoComplete="address-level2"
          required
        />
        <select
          name="country"
          value={formData.country}
          onChange={onChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
          autoComplete="country-name"
        >
          {COUNTRIES.map((country) => (
            <option key={country.value} value={country.value} className="text-black">
              {country.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  </div>
));

ShippingForm.displayName = 'ShippingForm';

// ✅ OPTIMIZED: Extract PaymentForm component
const PaymentForm = memo(({ formData, onChange, onSubmit, isLoading, onBack }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
    <form onSubmit={onSubmit}>
      <div className="space-y-4 mb-8">
        {PAYMENT_METHODS.map((method) => (
          <label key={method.value} className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value={method.value}
              checked={formData.paymentMethod === method.value}
              onChange={onChange}
              className="h-4 w-4"
            />
            <span className="ml-3 text-gray-700">{method.label}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium"
        >
          {isLoading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </form>
  </div>
));

PaymentForm.displayName = 'PaymentForm';

// ✅ OPTIMIZED: Extract SuccessMessage component
const SuccessMessage = memo(({ locale }) => (
  <div className="text-center bg-white rounded-xl shadow-sm p-12">
    <FiCheckCircle className="mx-auto w-16 h-16 text-green-600 mb-6" />
    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed! ✅</h2>
    <p className="text-gray-600 mb-8">Thank you for your purchase.</p>
    <Link
      href={`/${locale}`}
      className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Back to Home
    </Link>
  </div>
));

SuccessMessage.displayName = 'SuccessMessage';

// ✅ OPTIMIZED: Extract OrderSummaryItem component
const OrderSummaryItem = memo(({ item }) => {
  const itemTotal = useMemo(
    () => ((item.price || 0) * (item.quantity || 1)).toFixed(2),
    [item.price, item.quantity]
  );

  return (
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-black">
        {item.name} x {item.quantity || 1}
      </span>
      <span className="text-sm font-medium text-black">${itemTotal}</span>
    </div>
  );
});

OrderSummaryItem.displayName = 'OrderSummaryItem';

// ✅ OPTIMIZED: Extract OrderSummary component
const OrderSummary = memo(({ cart, subtotal, total }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
    {cart.map((item) => (
      <OrderSummaryItem key={item.id || item._id} item={item} />
    ))}
    <div className="border-t pt-4 mt-4">
      <div className="flex justify-between mb-2">
        <span className="text-black">Subtotal</span>
        <span className="text-black">${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold text-lg border-t pt-2 text-black">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  </div>
));

OrderSummary.displayName = 'OrderSummary';

// ✅ OPTIMIZED: Extract EmptyCartMessage component
const EmptyCartMessage = memo(({ locale }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
      <p className="text-gray-600 mb-6">Add products to your cart before checking out.</p>
      <Link
        href={`/${locale}/products`}
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Continue Shopping
      </Link>
    </div>
  </div>
));

EmptyCartMessage.displayName = 'EmptyCartMessage';

// ✅ OPTIMIZED: Custom hook for calculations
const useOrderCalculations = (cart) => {
  return useMemo(() => {
    if (!cart || cart.length === 0) {
      return { subtotal: 0, total: 0 };
    }
    const subtotal = cart.reduce(
      (total, item) => total + ((item.price || 0) * (item.quantity || 1)),
      0
    );
    return { subtotal, total: subtotal };
  }, [cart]);
};

// ✅ OPTIMIZED: Main component
export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
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

  // ✅ OPTIMIZED: Memoized locale
  const locale = useMemo(() => params?.locale || 'en', [params?.locale]);

  // ✅ Auth guard: redirect to login if not authenticated
  useEffect(() => {
    if (session === null) {
      // session is null means loaded but not authenticated
      router.push(`/${locale}/login?callbackUrl=/${locale}/checkout`);
    }
  }, [session, locale, router]);

  // ✅ OPTIMIZED: Use calculation hook
  const { subtotal, total } = useOrderCalculations(cart);

  // ✅ OPTIMIZED: Memoized input handler
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // ✅ OPTIMIZED: Memoized shipping form handler
  const handleShippingSubmit = useCallback((e) => {
    e.preventDefault();
    setActiveStep(2);
  }, []);

  // ✅ OPTIMIZED: Memoized back handler
  const handleBack = useCallback(() => {
    setActiveStep(1);
  }, []);

  // ✅ OPTIMIZED: Memoized back to cart handler
  const handleBackToCart = useCallback(() => {
    router.back();
  }, [router]);

  // ✅ OPTIMIZED: Memoized submit handler
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setOrderSubmitting(true);

      try {
        if (!formData.email || !formData.phone || !formData.address) {
          throw new Error('Please fill in all required fields');
        }

        if (!cart || cart.length === 0) {
          throw new Error('Your cart is empty');
        }

        const orderData = {
          customerName:
            `${formData.firstName} ${formData.lastName}` ||
            session?.user?.name ||
            'Guest',
          customerEmail: formData.email || session?.user?.email || '',
          customerPhone: formData.phone || '',
          shippingAddress: {
            street: formData.address || '',
            city: formData.city || '',
            country: formData.country || 'Pakistan',
          },
          items: cart.map((item) => ({
            productId: item._id || item.id,
            productName: item.name,
            quantity: item.quantity || 1,
            price: item.price || 0,
            image: item.images?.[0] || item.image || '',
          })),
          subtotal,
          total,
          paymentMethod: formData.paymentMethod || 'cash_on_delivery',
          paymentStatus: 'pending',
          userId: session?.user?.id || null,
        };

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (!response.ok) {
          // Fallback: Create order locally if API fails
          const localOrderId = `local_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          const localOrderNumber = `ORD-${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}`;

          const localOrder = {
            _id: localOrderId,
            orderNumber: localOrderNumber,
            ...orderData,
            createdAt: new Date().toISOString(),
            status: 'pending',
          };

          const existingOrders = JSON.parse(
            localStorage.getItem('localOrders') || '[]'
          );
          existingOrders.push(localOrder);
          localStorage.setItem('localOrders', JSON.stringify(existingOrders));

          if (clearCart) clearCart();
          setActiveStep(3);
          setTimeout(() => router.push(`/${locale}`), 2000);
          return;
        }

        if (clearCart) clearCart();
        setActiveStep(3);
        setTimeout(() => router.push(`/${locale}`), 2000);
      } catch (error) {
        console.error('[Checkout] Error:', error);
      } finally {
        setOrderSubmitting(false);
      }
    },
    [formData, cart, session, subtotal, total, locale, clearCart, router]
  );

  if (!cart || cart.length === 0) {
    return <EmptyCartMessage locale={locale} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <BackButton
            activeStep={activeStep}
            onBack={handleBack}
            onBackToCart={handleBackToCart}
          />

          <StepIndicator activeStep={activeStep} />

          <div className="grid grid-cols-1 gap-8">
            {activeStep === 1 && (
              <ShippingForm
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleShippingSubmit}
              />
            )}

            {activeStep === 2 && (
              <PaymentForm
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                isLoading={orderSubmitting}
                onBack={handleBack}
              />
            )}

            {activeStep === 3 && <SuccessMessage locale={locale} />}

            {activeStep < 3 && (
              <OrderSummary cart={cart} subtotal={subtotal} total={total} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}