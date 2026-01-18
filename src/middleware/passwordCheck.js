import dotenv from 'dotenv';

dotenv.config();

const passwordCheck = (req, res, next) => {
    // Get password from custom header
    const password = req.headers['x-admin-password'];

    if (!password) {
        return res.status(401).json({ success: false, message: 'Access denied. Password required.' });
    }

    // Verify password
    if (password === (process.env.ADMIN_PASSWORD || 'admin123')) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Invalid password.' });
    }
};

export default passwordCheck;
