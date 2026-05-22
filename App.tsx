import React, { useEffect, useMemo, useState } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const CATEGORIES = ['All', 'Biryani', 'Burgers', 'Pizza', 'South Indian'];
const QR_CODE_IMAGE = '/payment-qr.svg';

type PaymentMethod = 'qr' | 'cod';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

type CartItem = MenuItem & {
  quantity: number;
};

type CheckoutDetails = {
  name: string;
  phone: string;
  address: string;
  paymentMethod: PaymentMethod;
  transactionNote: string;
};

const MOCK_MENU: MenuItem[] = [
  { id: '1', name: 'Hyderabadi Chicken Biryani', description: 'Authentic spice-rich biryani.', price: 349, category: 'Biryani', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop' },
  { id: '2', name: 'Cheese Lava Burger', description: 'Double patty with molten cheese.', price: 199, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop' },
  { id: '3', name: 'Masala Dosa', description: 'Crispy crepe with potato mash.', price: 120, category: 'South Indian', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop' },
  { id: '4', name: 'Farmhouse Pizza', description: 'Fresh veggies on sourdough base.', price: 499, category: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop' },
  { id: '5', name: 'Chicken Pepperoni', description: 'Classic pepperoni pizza.', price: 549, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop' },
  { id: '6', name: 'Idli Vada Set', description: 'Steamed rice cakes with crispy vada.', price: 99, category: 'South Indian', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop' },
];

const formatCurrency = (amount: number) => `Rs. ${amount}`;

const paymentLabel = (method?: PaymentMethod) => {
  if (method === 'cod') return 'Cash on Delivery';
  if (method === 'qr') return 'QR / UPI Scan';
  return 'Not selected';
};

const AdminPanel = ({ onGoHome }: { onGoHome: () => void }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map((orderDoc) => ({ id: orderDoc.id, ...orderDoc.data() })));
    });
  }, [isAuthenticated]);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'orders', id), { status });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4">Kitchen Login</h2>
          <input
            type="password"
            placeholder="Enter Admin Password"
            className="w-full border p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => (password === 'admin123' ? setIsAuthenticated(true) : alert('Wrong Password'))}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">Kitchen Dashboard</h1>
          <button onClick={onGoHome} className="text-orange-600 font-bold hover:underline text-left sm:text-right">Go to Website</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className={`bg-white p-5 md:p-6 rounded-xl shadow-sm border-l-8 ${
              order.status === 'Completed' ? 'border-green-500 opacity-70' :
              order.status === 'Preparing' ? 'border-orange-500' : 'border-red-500'
            }`}>
              <div className="flex justify-between gap-3 mb-4">
                <span className="font-bold text-gray-400">#{order.id.slice(-5)}</span>
                <span className="font-bold text-sm bg-gray-100 px-3 py-1 rounded-full">{order.status}</span>
              </div>

              <div className="mb-4 bg-blue-50 p-3 rounded-lg text-sm space-y-1">
                <p><span className="font-bold">Name:</span> {order.customerName}</p>
                <p><span className="font-bold">Phone:</span> {order.phone}</p>
                <p><span className="font-bold">Address:</span> {order.address}</p>
                <p><span className="font-bold">Payment:</span> {paymentLabel(order.paymentMethod)}</p>
                <p><span className="font-bold">Payment Status:</span> {order.paymentStatus || 'Pending'}</p>
                {order.transactionNote && <p><span className="font-bold">UPI Ref:</span> {order.transactionNote}</p>}
              </div>

              <div className="space-y-2 mb-4 border-b pb-4">
                {order.items?.map((item: CartItem, idx: number) => (
                  <div key={idx} className="flex justify-between gap-3 text-sm">
                    <span>{item.quantity} x {item.name}</span>
                    <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-black text-lg mb-4">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount || 0)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => updateStatus(order.id, 'Preparing')} className="bg-orange-100 text-orange-700 font-bold py-2 rounded">Start Cooking</button>
                <button onClick={() => updateStatus(order.id, 'Completed')} className="bg-green-100 text-green-700 font-bold py-2 rounded">Order Ready</button>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="bg-white p-8 rounded-xl shadow-sm text-gray-500 md:col-span-2 xl:col-span-3">
              No orders yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CheckoutForm = ({ total, onConfirm, onCancel }: {
  total: number;
  onConfirm: (details: CheckoutDetails) => void;
  onCancel: () => void;
}) => {
  const [details, setDetails] = useState<CheckoutDetails>({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'qr',
    transactionNote: '',
  });

  const handleSubmit = () => {
    if (!details.name.trim() || !details.phone.trim() || !details.address.trim()) {
      alert('Please fill in your name, phone number, and address.');
      return;
    }

    if (!/^[0-9]{10}$/.test(details.phone.trim())) {
      alert('Please enter a valid 10 digit phone number.');
      return;
    }

    onConfirm({
      ...details,
      name: details.name.trim(),
      phone: details.phone.trim(),
      address: details.address.trim(),
      transactionNote: details.transactionNote.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel}></div>
      <div className="bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl p-5 md:p-8 relative z-10 shadow-2xl animate-scale-up">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-bold">Checkout</h3>
            <p className="text-sm text-gray-500 mt-1">Total amount: <span className="font-bold text-gray-900">{formatCurrency(total)}</span></p>
          </div>
          <button onClick={onCancel} className="text-2xl leading-none text-gray-400 hover:text-gray-900">&times;</button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Your name"
                value={details.name}
                onChange={(e) => setDetails({ ...details, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                inputMode="numeric"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="9876543210"
                value={details.phone}
                onChange={(e) => setDetails({ ...details, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Address</label>
              <textarea
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
                rows={4}
                placeholder="House no, street, landmark..."
                value={details.address}
                onChange={(e) => setDetails({ ...details, address: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDetails({ ...details, paymentMethod: 'qr' })}
                  className={`border-2 rounded-xl p-3 text-sm font-bold ${details.paymentMethod === 'qr' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-700'}`}
                >
                  QR Scan
                </button>
                <button
                  type="button"
                  onClick={() => setDetails({ ...details, paymentMethod: 'cod', transactionNote: '' })}
                  className={`border-2 rounded-xl p-3 text-sm font-bold ${details.paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-700'}`}
                >
                  Cash on Delivery
                </button>
              </div>
            </div>

            {details.paymentMethod === 'qr' ? (
              <div className="border rounded-2xl p-4 text-center bg-gray-50">
                <img src={QR_CODE_IMAGE} alt="Scan this QR code to pay" className="w-48 h-48 mx-auto rounded-lg border bg-white p-2 object-contain" />
                <p className="text-sm font-bold text-gray-800 mt-3">Scan and pay {formatCurrency(total)}</p>
                <p className="text-xs text-gray-500 mt-1">After payment, enter the UPI reference number if available.</p>
                <input
                  type="text"
                  className="w-full border rounded-lg p-3 mt-3 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="UPI reference number (optional)"
                  value={details.transactionNote}
                  onChange={(e) => setDetails({ ...details, transactionNote: e.target.value })}
                />
              </div>
            ) : (
              <div className="border rounded-2xl p-4 bg-green-50 text-green-900">
                <p className="font-bold">Pay when your food arrives.</p>
                <p className="text-sm mt-1">Please keep exact cash ready for faster delivery.</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition mt-6"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

const CustomerApp = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [view, setView] = useState<'menu' | 'orders'>('menu');
  const [orderPhone, setOrderPhone] = useState('');

  const cartTotal = cart.reduce((a, b) => a + (b.price * b.quantity), 0);
  const totalItems = cart.reduce((a, b) => a + b.quantity, 0);

  const filteredMenu = useMemo(() => {
    return MOCK_MENU.filter((item) => (
      (activeCategory === 'All' || item.category === activeCategory) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [activeCategory, searchTerm]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map((orderDoc) => ({ id: orderDoc.id, ...orderDoc.data() })));
    });
  }, []);

  const customerOrders = useMemo(() => {
    const phone = orderPhone.trim();
    if (!phone) return [];
    return orders.filter((order) => order.phone === phone);
  }, [orderPhone, orders]);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      return existing
        ? prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => prev
      .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
      .filter((item) => item.quantity > 0));
  };

  const placeOrder = async (details: CheckoutDetails) => {
    setIsSavingOrder(true);
    try {
      await addDoc(collection(db, 'orders'), {
        items: cart,
        totalAmount: cartTotal,
        customerName: details.name,
        phone: details.phone,
        address: details.address,
        status: 'Pending',
        paymentMethod: details.paymentMethod,
        paymentStatus: details.paymentMethod === 'cod' ? 'Collect on delivery' : 'Awaiting QR payment confirmation',
        transactionNote: details.paymentMethod === 'qr' ? details.transactionNote : '',
        timestamp: new Date(),
      });

      setCart([]);
      setIsCheckoutOpen(false);
      setOrderPhone(details.phone);
      setView('orders');
      alert('Order placed successfully!');
    } catch (error) {
      alert(`Error saving order: ${error}`);
    } finally {
      setIsSavingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b px-4 py-3 md:px-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <button onClick={() => setView('menu')} className="text-xl font-black text-gray-900">Cloud<span className="text-orange-500">Kitchen</span></button>
          <div className="flex items-center gap-2">
            <button onClick={() => setView('orders')} className="font-bold text-gray-600 hover:text-orange-600 px-3 py-2 rounded-full">
              My Orders
            </button>
            <button onClick={() => setIsCartOpen(true)} className="font-bold text-white bg-gray-900 px-4 py-2 rounded-full hover:bg-orange-600 transition">
              Cart ({totalItems})
            </button>
          </div>
        </div>
      </nav>

      {view === 'menu' ? (
        <>
          <section className="bg-gray-900 text-white text-center py-10 md:py-14 px-4">
            <h1 className="text-3xl md:text-5xl font-black mb-4">Taste the Speed</h1>
            <div className="max-w-xl mx-auto space-y-4">
              <input
                type="text"
                placeholder="Search for food..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-gray-900 outline-none"
              />
              <div className="flex justify-center gap-2 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-bold ${activeCategory === cat ? 'bg-orange-500' : 'bg-gray-800'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 md:p-8 max-w-6xl mx-auto">
            {filteredMenu.map((item) => (
              <article key={item.id} className="bg-white rounded-2xl shadow-sm border p-4 hover:shadow-lg transition">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-xl mb-4 bg-gray-100" />
                <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-4 min-h-10">{item.description}</p>
                <div className="flex justify-between items-center gap-3">
                  <span className="font-bold text-lg">{formatCurrency(item.price)}</span>
                  <button onClick={() => addToCart(item)} className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition">Add</button>
                </div>
              </article>
            ))}
          </main>
        </>
      ) : (
        <main className="max-w-3xl mx-auto p-4 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900">My Orders</h1>
              <p className="text-gray-500 mt-1">Enter your phone number to check your order status.</p>
            </div>
            <button onClick={() => setView('menu')} className="bg-orange-500 text-white px-5 py-3 rounded-xl font-bold hover:bg-orange-600">Order More</button>
          </div>

          <input
            type="tel"
            inputMode="numeric"
            value={orderPhone}
            onChange={(e) => setOrderPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className="w-full border rounded-xl p-4 mb-5 outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter your 10 digit phone number"
          />

          {!orderPhone ? (
            <div className="bg-white rounded-2xl shadow-sm border p-8 text-center text-gray-500">
              Your orders will appear here after you enter the phone number used at checkout.
            </div>
          ) : customerOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
              <h2 className="text-xl font-bold text-gray-900">No orders found</h2>
              <p className="text-gray-500 mt-2">Check the phone number or place a new order.</p>
            </div>
          ) : (
            customerOrders.map((order) => (
              <article key={order.id} className="bg-white rounded-2xl shadow-sm border p-5 mb-4">
                <div className="flex justify-between gap-3 mb-3">
                  <span className="font-bold text-gray-400">Order #{order.id.slice(-5)}</span>
                  <span className={`font-bold text-sm px-3 py-1 rounded-full ${order.status === 'Completed' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}`}>{order.status}</span>
                </div>
                <div className="space-y-2 mb-4">
                  {order.items?.map((item: CartItem, idx: number) => (
                    <div key={idx} className="flex justify-between bg-gray-50 p-3 rounded-lg gap-3">
                      <span>{item.quantity} x {item.name}</span>
                      <b>{formatCurrency(item.price * item.quantity)}</b>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 grid sm:grid-cols-2 gap-2 text-sm">
                  <p><b>Total:</b> {formatCurrency(order.totalAmount || 0)}</p>
                  <p><b>Payment:</b> {paymentLabel(order.paymentMethod)}</p>
                  <p><b>Payment Status:</b> {order.paymentStatus || 'Pending'}</p>
                  <p><b>Delivery Phone:</b> {order.phone}</p>
                </div>
              </article>
            ))
          )}
        </main>
      )}

      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[60]" onClick={() => setIsCartOpen(false)} />
          <aside className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[70] p-6 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-3xl leading-none text-gray-400 hover:text-gray-900">&times;</button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-gray-400 mt-10">Your cart is empty.</p>
              ) : cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-3 gap-3">
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex gap-3 items-center bg-gray-100 rounded-lg px-3 py-1">
                    <button onClick={() => updateQty(item.id, -1)} className="text-lg font-bold">-</button>
                    <span className="font-bold min-w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="text-lg font-bold">+</button>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-black mb-4">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <button
                  onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                  className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition"
                >
                  Checkout
                </button>
              </div>
            )}
          </aside>
        </>
      )}

      {isCheckoutOpen && (
        <CheckoutForm
          total={cartTotal}
          onConfirm={isSavingOrder ? () => undefined : placeOrder}
          onCancel={() => setIsCheckoutOpen(false)}
        />
      )}
    </div>
  );
};

const App = () => {
  const [route, setRoute] = useState(() => window.location.hash === '#/admin' ? 'admin' : 'home');

  const goHome = () => {
    window.location.hash = '#/';
    setRoute('home');
  };

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash === '#/admin' ? 'admin' : 'home');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route === 'admin' ? <AdminPanel onGoHome={goHome} /> : <CustomerApp />;
};

export default App;
