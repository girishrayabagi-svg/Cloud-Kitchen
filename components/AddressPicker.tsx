
import React, { useState, useEffect } from 'react';
import { calculateDistance } from '../utils/geo';
import { KITCHEN_LOCATION, DELIVERY_RADIUS_KM } from '../constants';

interface AddressPickerProps {
  onValidated: (address: string, coords: { lat: number; lng: number }) => void;
  onCancel: () => void;
}

const AddressPicker: React.FC<AddressPickerProps> = ({ onValidated, onCancel }) => {
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleManualLocation = () => {
    setIsValidating(true);
    setError('');
    
    // Simulating Google Geocoding
    setTimeout(() => {
      // For demo purposes, we simulate a coordinate based on some dummy logic or just center near kitchen
      const mockLat = KITCHEN_LOCATION.lat + (Math.random() - 0.5) * 0.1;
      const mockLng = KITCHEN_LOCATION.lng + (Math.random() - 0.5) * 0.1;
      
      const dist = calculateDistance(KITCHEN_LOCATION.lat, KITCHEN_LOCATION.lng, mockLat, mockLng);
      
      if (dist > DELIVERY_RADIUS_KM) {
        setError(`Address is ${dist.toFixed(1)}km away. We only serve within ${DELIVERY_RADIUS_KM}km radius.`);
      } else {
        onValidated(address || 'Mock Address, 123 Tech Park', { lat: mockLat, lng: mockLng });
      }
      setIsValidating(false);
    }, 1500);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      return;
    }

    setIsValidating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const dist = calculateDistance(KITCHEN_LOCATION.lat, KITCHEN_LOCATION.lng, latitude, longitude);
        
        if (dist > DELIVERY_RADIUS_KM) {
          setError(`You are ${dist.toFixed(1)}km away. Our service area is limited to ${DELIVERY_RADIUS_KM}km.`);
        } else {
          onValidated('My Current Location', { lat: latitude, lng: longitude });
        }
        setIsValidating(false);
      },
      () => {
        setError('Permission denied or location unavailable');
        setIsValidating(false);
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-scale-up">
        <div className="p-6 bg-orange-50 border-b border-orange-100">
          <h2 className="text-xl font-bold text-gray-800">Set Delivery Location</h2>
          <p className="text-sm text-gray-500">We only deliver within {DELIVERY_RADIUS_KM}km of our kitchen.</p>
        </div>
        
        <div className="p-6 space-y-4">
          <button 
            onClick={useCurrentLocation}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-orange-500 text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Use My Current Location
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400">or enter manually</span>
            </div>
          </div>

          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="House No, Area, Landmark..." 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
            
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-lg flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button 
                onClick={onCancel}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button 
                disabled={!address || isValidating}
                onClick={handleManualLocation}
                className="flex-[2] py-3 bg-gray-900 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isValidating && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Check Availability
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressPicker;
