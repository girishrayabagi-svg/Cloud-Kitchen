
export const KITCHEN_LOCATION = {
  lat: 12.9716, // Example: Bangalore
  lng: 77.5946,
  address: "123 Cloud Kitchen St, Tech City, India"
};

export const DELIVERY_RADIUS_KM = 10;
export const BASE_DELIVERY_CHARGE = 30;
export const FREE_DELIVERY_THRESHOLD = 500;

export const RAZORPAY_KEY_ID = 'rzp_test_STUB_KEY_12345'; // Replace with real test key for development
export const API_BASE_URL = 'https://cloud-kitchen-backend.example.com/api'; // Mock backend URL

export const CATEGORIES: string[] = [
  'Biryani', 'Burgers', 'Pizza', 'South Indian', 'Desserts', 'Drinks'
];

export const MOCK_MENU: any[] = [
  {
    id: '1',
    name: 'Hyderabadi Chicken Biryani',
    description: 'Authentic spice-rich biryani with tender chicken pieces and long grain basmati rice.',
    price: 349,
    category: 'Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=800',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Cheese Lava Burger',
    description: 'Double patty burger with oozing molten cheese and secret house sauce.',
    price: 199,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    isAvailable: true
  },
  {
    id: '3',
    name: 'Masala Dosa',
    description: 'Crispy fermented crepe filled with spicy potato mash, served with coconut chutney.',
    price: 120,
    category: 'South Indian',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYH7H-KRy-dnN9To-d5TJu7dKpY3f_nr0w3Q&s',
    isAvailable: true
  },
  {
    id: '4',
    name: 'Farmhouse Pizza',
    description: 'Fresh veggies, olives, and mushrooms on a hand-tossed sourdough base.',
    price: 499,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    isAvailable: true
  }
];
