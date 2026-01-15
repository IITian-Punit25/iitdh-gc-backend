import express from 'express';
import Standing from '../models/Standing.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const standings = await Standing.find();
        res.json(standings);
    } catch (error) {
        console.error('Error fetching standings:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        await Standing.deleteMany({});
        if (Array.isArray(req.body) && req.body.length > 0) {
            await Standing.insertMany(req.body);
        }
        req.app.get('io').emit('dataUpdate', { type: 'standings' });
        res.json({ success: true, message: 'Standings saved successfully' });
    } catch (error) {
        console.error('Error saving standings:', error);
        res.status(500).json({ success: false, message: 'Error saving standings' });
    }
});

export default router;
