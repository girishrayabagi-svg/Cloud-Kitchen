
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import CartSidebar from './components/CartSidebar';
import AddressPicker from './components/AddressPicker';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Order, OrderStatus } from './types';
import { RAZORPAY_KEY_ID, BASE_DELIVERY_CHARGE, FREE_DELIVERY_THRESHOLD } from './constants';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Toast: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] animate-fade-in-up">
    <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <p className="text-sm font-bold">{message} added to cart!</p>
    </div>
  </div>
);

const CloudKitchenApp: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const { cart, clearCart, cartTotal, lastAddedItem } = useCart();
  const { isAuthenticated, login, user } = useAuth();

  const deliveryCharge = cartTotal >= FREE_DELIVERY_THRESHOLD ? 0 : BASE_DELIVERY_CHARGE;
  const totalPayableAmount = cartTotal + deliveryCharge;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      login('customer@example.com', 'user');
    }
    setIsCartOpen(false);
    setShowAddressPicker(true);
  };

  const createOrderInBackend = async (paymentData: any, address: string, coords: { lat: number, lng: number }) => {
    // In a production app, this would be a POST request to your Node.js/MongoDB API
    // const response = await fetch('/api/orders', { method: 'POST', body: JSON.stringify(...) });
    // return await response.json();
    
    console.log("Simulating backend storage in MongoDB...");
    return new Promise<Order>((resolve) => {
      setTimeout(() => {
        const newOrder: Order = {
          id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          userId: user?.id || 'guest',
          items: [...cart],
          totalAmount: totalPayableAmount,
          status: OrderStatus.PENDING,
          address,
          coordinates: coords,
          createdAt: new Date().toISOString(),
          paymentId: paymentData.razorpay_payment_id,
          deliveryTime: '35 mins'
        };
        resolve(newOrder);
      }, 1000);
    });
  };

  const onAddressValidated = (address: string, coords: { lat: number; lng: number }) => {
    setShowAddressPicker(false);
    setPaymentError(null);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: totalPayableAmount * 100, // Amount in paise
      currency: 'INR',
      name: 'CloudKitchen Pro',
      description: 'Payment for your delicious meal',
      image: 'https://cdn-icons-png.flaticon.com/512/3443/3443338.png',
      handler: async function (response: any) {
        setIsProcessing(true);
        try {
          const order = await createOrderInBackend(response, address, coords);
          setActiveOrder(order);
          clearCart();
        } catch (err) {
          setPaymentError("Payment verification failed. Please contact support.");
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '9876543210'
      },
      theme: {
        color: '#f97316' // Orange-500
      },
      modal: {
        ondismiss: function() {
          setPaymentError("Payment was cancelled. Please try again to complete your order.");
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setPaymentError(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      setPaymentError("Unable to initialize payment gateway. Please check your connection.");
    }
  };

  return (
    <Layout>
      {isProcessing && (
        <div className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Finalizing your order...</h2>
          <p className="text-gray-500">Storing order in our kitchen database</p>
        </div>
      )}

      {paymentError && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[150] w-full max-w-md px-4 animate-scale-up">
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl shadow-xl flex items-start gap-4">
            <div className="bg-red-100 p-2 rounded-full text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-grow">
              <h4 className="font-bold text-red-900">Oops! Something went wrong</h4>
              <p className="text-sm text-red-700 mt-1">{paymentError}</p>
              <button 
                onClick={() => setPaymentError(null)}
                className="mt-3 text-sm font-bold text-red-800 hover:underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {lastAddedItem && <Toast message={lastAddedItem} />}

      {!activeOrder ? (
        <>
          <Hero />
          <MenuSection />
          
          <div className="fixed bottom-6 right-6 z-40">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-orange-500 text-white h-14 w-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] font-bold h-6 w-6 rounded-full flex items-center justify-center border-2 border-orange-500">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>

          <CartSidebar 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            onCheckout={handleCheckout}
          />
        </>
      ) : (
        <div className="max-w-3xl mx-auto px-4 py-12 animate-scale-up">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-black">Order Confirmed!</h2>
              <p className="text-gray-500 mt-2 font-mono">ID: {activeOrder.id}</p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Status Tracking</h3>
                <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-200">
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center z-10">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="font-bold text-gray-800">Order Placed</p>
                    <p className="text-xs text-gray-500">We have received your order</p>
                  </div>
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center z-10">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                    </div>
                    <p className="font-bold text-gray-800">Preparing</p>
                    <p className="text-xs text-gray-500">Chef is working on your meal</p>
                  </div>
                  <div className="relative pl-10 opacity-30">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center z-10"></div>
                    <p className="font-bold text-gray-800">On the Way</p>
                    <p className="text-xs text-gray-500">Delivery partner picked up</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-2xl p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Delivery Address
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{activeOrder.address}</p>
                <div className="mt-4 h-40 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm font-medium">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-2 animate-bounce">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-3.44A20.01 20.01 0 016.586 13M9 11V9m0 2h2m-2 0v2m0-2H7" />
                      </svg>
                    </div>
                    Live tracking will appear here soon...
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setActiveOrder(null)}
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
              >
                Order More Food
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddressPicker && (
        <AddressPicker 
          onValidated={onAddressValidated} 
          onCancel={() => setShowAddressPicker(false)} 
        />
      )}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <CloudKitchenApp />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
