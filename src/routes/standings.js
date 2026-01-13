import express from 'express';
import { loadData, saveData } from '../utils/dataHandler.js';

const router = express.Router();

router.get('/', (req, res) => {
    const standings = loadData('standings.json');
    res.json(standings);
});

router.post('/', (req, res) => {
    if (saveData('standings.json', req.body)) {
        req.app.get('io').emit('dataUpdate', { type: 'standings' });
        res.json({ success: true, message: 'Standings saved successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Error saving standings' });
    }
});

export default router;
