
import React, { useState } from 'react';
import { MOCK_MENU, CATEGORIES } from '../constants';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/geo';

const MenuSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Biryani');
  const { addToCart } = useCart();

  const filteredItems = MOCK_MENU.filter(item => item.category === activeCategory);

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto" id="menu">
      <div className="mb-8 overflow-x-auto hide-scrollbar flex gap-3 pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              activeCategory === cat 
                ? 'bg-orange-500 text-white shadow-lg' 
                : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-orange-600">
                {formatCurrency(item.price)}
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">{item.description}</p>
              <button 
                onClick={() => addToCart(item)}
                className="w-full py-2.5 bg-gray-50 text-gray-800 font-bold text-sm rounded-xl hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
