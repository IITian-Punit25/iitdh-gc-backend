import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import TokenBlacklist from '../models/TokenBlacklist.js';

dotenv.config();

const passwordCheck = async (req, res, next) => {
    // Check for Authorization header (Bearer token)
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Access denied. Token missing.' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_production';

    try {
        // Check if token is blacklisted (was logged out)
        const blacklisted = await TokenBlacklist.findOne({ token });
        if (blacklisted) {
            return res.status(403).json({ success: false, message: 'Token has been revoked. Please login again.' });
        }

        // Verify token signature and expiry
        const decoded = jwt.verify(token, secret);

        // Check token version (if JWT_VERSION env changed, all old tokens invalid)
        const currentVersion = process.env.JWT_VERSION || '1';
        if (decoded.version && decoded.version !== currentVersion) {
            return res.status(403).json({ success: false, message: 'Session expired. Please login again.' });
        }

        req.user = decoded;
        req.token = token; // Attach token for logout
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ success: false, message: 'Token expired. Please login again.' });
        }
        return res.status(403).json({ success: false, message: 'Invalid token.' });
    }
};

export default passwordCheck;
