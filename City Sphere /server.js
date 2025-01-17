const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: 'YOUR_RAZORPAY_KEY_ID', // Replace with your key
    key_secret: 'YOUR_RAZORPAY_KEY_SECRET' // Replace with your secret
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// In-memory user storage (replace with database in production)
const users = [];
const JWT_SECRET = 'your-secret-key'; // Use environment variable in production

// Routes
app.post('/api/register', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Check if user exists
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = {
            id: users.length + 1,
            fullname,
            email,
            password: hashedPassword
        };
        users.push(user);

        // Create token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, fullname, email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, fullname: user.fullname, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Protected route example
app.get('/api/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ user: { id: user.id, fullname: user.fullname, email: user.email } });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

// Payment Routes
app.post('/create-order', async (req, res) => {
    try {
        const { amount, paymentMethod, upiId } = req.body;

        const options = {
            amount: amount, // amount in paise
            currency: 'INR',
            receipt: 'order_' + Date.now(),
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Webhook to verify payment
app.post("/verify-payment", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", razorpay.key_secret)
            .update(sign)
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment is verified
            res.json({ verified: true });
        } else {
            res.status(400).json({ verified: false });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ error: "Failed to verify payment" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
