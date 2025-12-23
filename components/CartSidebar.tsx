
import React from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/geo';
import { BASE_DELIVERY_CHARGE, FREE_DELIVERY_THRESHOLD } from '../constants';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cart, updateQuantity, cartTotal } = useCart();
  const deliveryCharge = cartTotal >= FREE_DELIVERY_THRESHOLD ? 0 : BASE_DELIVERY_CHARGE;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-left">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Order</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4">
                <img src={item.image} className="w-16 h-16 rounded-lg object-cover" alt="" />
                <div className="flex-grow">
                  <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                  <p className="text-orange-600 font-bold text-sm mt-1">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 h-9">
                  <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-orange-500 font-bold">-</button>
                  <span className="text-sm font-bold min-w-[20px] text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-orange-500 font-bold">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-gray-50 border-t">
            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Charge</span>
                <span>{deliveryCharge === 0 ? 'FREE' : formatCurrency(deliveryCharge)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(cartTotal + deliveryCharge)}</span>
              </div>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 active:scale-95 transition-all"
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
