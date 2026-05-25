
import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { cart } = useCart();
  const { user, isAdmin, logout } = useAuth();
  
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md shadow-sm z-50 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold italic text-lg">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-800">CloudKitchen<span className="text-orange-500">Pro</span></span>
        </a>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-semibold text-gray-600 hover:text-orange-500 transition-colors">Home</a>
          <a href="#menu" className="text-sm font-semibold text-gray-600 hover:text-orange-500 transition-colors">Menu</a>
        </div>

        {isAdmin && (
          <span className="hidden md:inline text-xs font-semibold px-2 py-1 bg-red-100 text-red-600 rounded">ADMIN</span>
        )}
        
        <div className="relative cursor-pointer group p-2 hover:bg-orange-50 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute top-1 right-1 bg-orange-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
              {totalItems}
            </span>
          )}
        </div>

        {user ? (
          <button onClick={logout} className="text-sm font-medium text-gray-600 hover:text-orange-500">Logout</button>
        ) : (
          <button className="text-sm font-medium text-white bg-orange-500 px-5 py-2 rounded-full hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95">Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
