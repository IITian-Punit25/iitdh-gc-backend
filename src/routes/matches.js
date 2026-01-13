import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// Get all matches
router.get('/', async (req, res) => {
    try {
        const { rows } = await query('SELECT * FROM matches ORDER BY date ASC');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching matches:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Create a match
router.post('/', async (req, res) => {
    const { sport, teamA, teamB, date } = req.body;

    // Basic validation
    if (!sport || !teamA || !teamB || !date) {
        return res.status(400).json({ error: 'Please provide sport, teamA, teamB, and date' });
    }

    try {
        const { rows } = await query(
            'INSERT INTO matches (sport, team_a, team_b, date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [sport, teamA, teamB, date, 'SCHEDULED']
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error('Error creating match:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

export default router;
