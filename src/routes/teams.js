import express from 'express';
import Team from '../models/Team.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const teams = await Team.find();
        res.json(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        // Clear existing and insert new data (matching previous behavior)
        await Team.deleteMany({});
        if (Array.isArray(req.body) && req.body.length > 0) {
            await Team.insertMany(req.body);
        }
        req.app.get('io').emit('dataUpdate', { type: 'teams' });
        res.json({ success: true, message: 'Teams saved successfully' });
    } catch (error) {
        console.error('Error saving teams:', error);
        res.status(500).json({ success: false, message: 'Error saving teams' });
    }
});

export default router;
