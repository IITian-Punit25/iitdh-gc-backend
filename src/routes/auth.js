import express from 'express';
import jwt from 'jsonwebtoken';
import TokenBlacklist from '../models/TokenBlacklist.js';
import passwordCheck from '../middleware/passwordCheck.js';

const router = express.Router();

// Login - issue JWT with version
router.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        const secret = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_production';
        const version = process.env.JWT_VERSION || '1';

        // Include version in token - changing JWT_VERSION invalidates all old tokens
        const token = jwt.sign(
            { role: 'admin', version },
            secret,
            { expiresIn: '24h' }
        );

        res.json({ success: true, token, expiresIn: '24h' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

// Logout - blacklist the current token
router.post('/logout', passwordCheck, async (req, res) => {
    try {
        const token = req.token;
        const decoded = jwt.decode(token);

        // Add token to blacklist until it expires
        await TokenBlacklist.create({
            token,
            expiresAt: new Date(decoded.exp * 1000) // JWT exp is in seconds
        });

        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, message: 'Logout failed' });
    }
});

// Invalidate all sessions - increment JWT_VERSION to invalidate all tokens
router.post('/invalidate-all', passwordCheck, (req, res) => {
    // This endpoint tells admin to update JWT_VERSION env variable
    res.json({
        success: true,
        message: 'To invalidate all sessions, update JWT_VERSION in .env and restart server',
        currentVersion: process.env.JWT_VERSION || '1'
    });
});

export default router;
