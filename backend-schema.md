
# Backend Implementation Guide (Cloud Kitchen)

To deploy this in a real environment (Render/Node.js), implement these schemas and routes.

## MongoDB Schemas

```javascript
// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number,
  status: { 
    type: String, 
    enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'],
    default: 'Pending'
  },
  address: String,
  coordinates: { lat: Number, lng: Number },
  paymentId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
```

## Express API Routes

```javascript
// routes/orders.js
const router = require('express').Router();
const Order = require('../models/Order');

// Create Order
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Status (Admin Only)
router.patch('/:id/status', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    // Here you would trigger SMS/WhatsApp notification
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
```

## Environment Variables (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
GOOGLE_MAPS_API_KEY=your_maps_key
JWT_SECRET=your_secure_random_string
```
