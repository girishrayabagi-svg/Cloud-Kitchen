
import React from 'react';
import { DELIVERY_RADIUS_KM } from '../constants';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[500px] flex items-center bg-gray-900 overflow-hidden">
      {/* Background Overlay Decorations */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500 opacity-20 skew-x-[-15deg] transform translate-x-32" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-600 opacity-10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 w-full grid md:grid-cols-2 gap-12 items-center">
        <div className="text-white space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-xs font-bold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Active Delivery Area
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Craving for <span className="text-orange-500">Magic</span> in Every Bite?
          </h1>
          <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
            Order premium chef-crafted meals from our Cloud Kitchen. Fresh ingredients, lightning-fast delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#menu" className="px-8 py-4 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all text-center">
              Order Now
            </a>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Delivering within {DELIVERY_RADIUS_KM}km
            </div>
          </div>
        </div>

        <div className="hidden md:block relative animate-float">
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" 
              alt="Delicious Food" 
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
          {/* Floating Element */}
          <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl z-20 animate-bounce-slow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Safe & Fast</p>
                <p className="text-sm font-bold text-gray-900">100% Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
