import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { db } from './firebase'; 
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';

// --- CONSTANTS ---
const RAZORPAY_KEY_ID = 'rzp_test_1DP5mmOlF5G5ag'; 
const CATEGORIES = ["All", "Biryani", "Burgers", "Pizza", "South Indian"];

const MOCK_MENU = [
  { id: '1', name: 'Hyderabadi Chicken Biryani', description: 'Authentic spice-rich biryani.', price: 349, category: 'Biryani', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop' },
  { id: '2', name: 'Cheese Lava Burger', description: 'Double patty with molten cheese.', price: 199, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop' },
  { id: '3', name: 'Masala Dosa', description: 'Crispy crepe with potato mash.', price: 120, category: 'South Indian', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop' },
  { id: '4', name: 'Farmhouse Pizza', description: 'Fresh veggies on sourdough base.', price: 499, category: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop' },
  { id: '5', name: 'Chicken Pepperoni', description: 'Classic pepperoni pizza.', price: 549, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800' },
  { id: '6', name: 'Idli Vada Set', description: 'Steamed rice cakes with donuts.', price: 99, category: 'South Indian', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800' },
];

// --- 1. ADMIN PANEL (Separate Page) ---
const AdminPanel = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    return onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [isAuthenticated]);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "orders", id), { status });
  };

  // Simple Security Check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">Kitchen Login</h2>
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            className="w-full border p-2 rounded mb-4"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            onClick={() => password === 'admin123' ? setIsAuthenticated(true) : alert('Wrong Password')}
            className="w-full bg-gray-900 text-white py-2 rounded font-bold"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-gray-900">Kitchen Dashboard</h1>
          <Link to="/" className="text-orange-500 font-bold hover:underline">Go to Website</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className={`bg-white p-6 rounded-xl shadow-sm border-l-8 ${
              order.status === 'Completed' ? 'border-green-500 opacity-60' : 
              order.status === 'Preparing' ? 'border-orange-500' : 'border-red-500'
            }`}>
              <div className="flex justify-between mb-4">
                <span className="font-bold text-gray-400">#{order.id.slice(-5)}</span>
                <span className="font-bold text-sm bg-gray-100 px-3 py-1 rounded-full">{order.status}</span>
              </div>
              
              {/* Customer Details */}
              <div className="mb-4 bg-blue-50 p-3 rounded-lg text-sm">
                <p><span className="font-bold">Name:</span> {order.customerName}</p>
                <p><span className="font-bold">Phone:</span> {order.phone}</p>
                <p><span className="font-bold">Address:</span> {order.address}</p>
              </div>

              <div className="space-y-2 mb-4 border-b pb-4">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.quantity} x {item.name}</span>
                    <span className="font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => updateStatus(order.id, "Preparing")} className="bg-orange-100 text-orange-700 font-bold py-2 rounded">Start Cooking</button>
                <button onClick={() => updateStatus(order.id, "Completed")} className="bg-green-100 text-green-700 font-bold py-2 rounded">Order Ready</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 2. CUSTOMER COMPONENTS ---

// New Checkout Form with Separate Fields
const CheckoutForm = ({ total, onConfirm, onCancel }: any) => {
  const [details, setDetails] = useState({ name: '', phone: '', address: '' });

  const handleSubmit = () => {
    if (!details.name || !details.phone || !details.address) {
      alert("Please fill in all details");
      return;
    }
    onConfirm(details);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel}></div>
      <div className="bg-white w-full max-w-md rounded-2xl p-8 relative z-10 shadow-2xl animate-scale-up">
        <h3 className="text-2xl font-bold mb-6">Delivery Details</h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="John Doe"
              onChange={e => setDetails({...details, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
            <input 
              type="tel" 
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="9876543210"
              onChange={e => setDetails({...details, phone: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Address</label>
            <textarea 
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
              rows={3}
              placeholder="House No, Street, Landmark..."
              onChange={e => setDetails({...details, address: e.target.value})}
            />
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition"
        >
          Pay ₹{total}
        </button>
      </div>
    </div>
  );
};

const CustomerApp = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  const cartTotal = cart.reduce((a, b) => a + (b.price * b.quantity), 0);

  const filteredMenu = MOCK_MENU.filter(item => {
    return (activeCategory === "All" || item.category === activeCategory) &&
           item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      return existing ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) : [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id: string, d: number) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + d) } : i).filter(i => i.quantity > 0));

  const handlePayment = (details: any) => {
    if (!(window as any).Razorpay) return alert("Razorpay SDK not loaded");
    
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: cartTotal * 100,
      currency: "INR",
      name: "Cloud Kitchen",
      description: "Food Order",
      handler: async function (response: any) {
        try {
          // SAVE ORDER TO FIREBASE WITH SEPARATE FIELDS
          await addDoc(collection(db, "orders"), {
            items: cart,
            totalAmount: cartTotal,
            customerName: details.name,
            phone: details.phone,
            address: details.address,
            status: "Pending",
            paymentId: response.razorpay_payment_id,
            timestamp: new Date()
          });
          setCart([]);
          setIsCheckoutOpen(false);
          alert("Order Placed Successfully!");
        } catch (e) {
          alert("Error saving order: " + e);
        }
      },
      prefill: { 
        name: details.name, 
        contact: details.phone 
      },
      theme: { color: "#F97316" }
    };
    new (window as any).Razorpay(options).open();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b px-4 py-3 md:px-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-black text-gray-900">Cloud<span className="text-orange-500">Kitchen</span></span>
          <button onClick={() => setIsCartOpen(true)} className="font-bold text-gray-700 bg-gray-100 px-4 py-2 rounded-full hover:bg-orange-100 transition">
            Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
          </button>
        </div>
      </nav>

      {/* Hero & Search */}
      <div className="bg-gray-900 text-white text-center py-12 px-4">
        <h1 className="text-4xl font-black mb-4">Taste the Speed</h1>
        <div className="max-w-xl mx-auto space-y-4">
          <input 
            type="text" 
            placeholder="Search for food..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full px-4 py-3 rounded-xl text-gray-900 outline-none" 
          />
          <div className="flex justify-center gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1 rounded-full text-sm font-bold ${activeCategory === cat ? 'bg-orange-500' : 'bg-gray-800'}`}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 md:p-8 max-w-6xl mx-auto">
        {filteredMenu.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border p-4 hover:shadow-lg transition">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-xl mb-4 bg-gray-100" />
            <h3 className="font-bold text-lg">{item.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{item.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">₹{item.price}</span>
              <button onClick={() => addToCart(item)} className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-bold">Add</button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[60]" onClick={() => setIsCartOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white z-[70] p-6 flex flex-col shadow-2xl">
            <div className="flex justify-between mb-6"><h2 className="text-2xl font-bold">Cart</h2><button onClick={() => setIsCartOpen(false)}>×</button></div>
            <div className="flex-grow overflow-y-auto space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div><p className="font-bold">{item.name}</p><p className="text-xs">₹{item.price}</p></div>
                  <div className="flex gap-2 items-center bg-gray-100 rounded px-2"><button onClick={() => updateQty(item.id, -1)}>-</button>{item.quantity}<button onClick={() => updateQty(item.id, 1)}>+</button></div>
                </div>
              ))}
            </div>
            {cart.length > 0 && <button onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold mt-4">Checkout ₹{cartTotal}</button>}
          </div>
        </>
      )}

      {/* Checkout Form Modal */}
      {isCheckoutOpen && <CheckoutForm total={cartTotal} onConfirm={handlePayment} onCancel={() => setIsCheckoutOpen(false)} />}
    </div>
  );
};

// --- 3. MAIN APP ROUTING ---
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerApp />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
