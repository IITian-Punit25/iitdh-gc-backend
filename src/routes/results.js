import express from 'express';
import Result from '../models/Result.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const results = await Result.find();
        res.json(results);
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        await Result.deleteMany({});
        if (Array.isArray(req.body) && req.body.length > 0) {
            await Result.insertMany(req.body);
        }
        req.app.get('io').emit('dataUpdate', { type: 'results' });
        res.json({ success: true, message: 'Results saved successfully' });
    } catch (error) {
        console.error('Error saving results:', error);
        res.status(500).json({ success: false, message: 'Error saving results' });
    }
});

export default router;
