import express from 'express';
import Schedule from '../models/Schedule.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const schedule = await Schedule.find();
        res.json(schedule);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        await Schedule.deleteMany({});
        if (Array.isArray(req.body) && req.body.length > 0) {
            await Schedule.insertMany(req.body);
        }
        req.app.get('io').emit('dataUpdate', { type: 'schedule' });
        res.json({ success: true, message: 'Schedule saved successfully' });
    } catch (error) {
        console.error('Error saving schedule:', error);
        res.status(500).json({ success: false, message: 'Error saving schedule' });
    }
});

export default router;
