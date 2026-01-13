import express from 'express';
import { loadData, saveData } from '../utils/dataHandler.js';

const router = express.Router();

router.get('/', (req, res) => {
    const teams = loadData('teams.json');
    res.json(teams);
});

router.post('/', (req, res) => {
    if (saveData('teams.json', req.body)) {
        req.app.get('io').emit('dataUpdate', { type: 'teams' });
        res.json({ success: true, message: 'Teams saved successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Error saving teams' });
    }
});

export default router;
