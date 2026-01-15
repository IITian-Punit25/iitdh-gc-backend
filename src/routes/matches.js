import express from 'express';
import Match from '../models/Match.js';

const router = express.Router();

// Get all matches
router.get('/', async (req, res) => {
    try {
        const matches = await Match.find().sort({ date: 1 });
        res.json(matches);
    } catch (err) {
        console.error('Error fetching matches:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Create a match
router.post('/', async (req, res) => {
    const { sport, teamA, teamB, date } = req.body;

    if (!sport || !teamA || !teamB || !date) {
        return res.status(400).json({ error: 'Please provide sport, teamA, teamB, and date' });
    }

    try {
        const match = await Match.create({
            sport,
            teamA,
            teamB,
            date,
            status: 'SCHEDULED'
        });
        res.status(201).json(match);
    } catch (err) {
        console.error('Error creating match:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

export default router;
