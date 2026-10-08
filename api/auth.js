const jwt = require('jsonwebtoken');

// Ensure you define JWT_SECRET and ADMIN_PASSWORD in your Vercel Environment Variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key';

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { username, password } = req.body;
        const expectedPassword = process.env.ADMIN_PASSWORD;

        // Ensure environment variable is set up
        if (!expectedPassword) {
            return res.status(500).json({ message: 'Server configuration error: Admin password not set.' });
        }

        // Secure validation check using environment variable
        if (username === 'admin' && password === expectedPassword) {
            const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ token });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
