import express from 'express';
import { loadData, saveData } from '../utils/dataHandler.js';

const router = express.Router();

router.get('/', (req, res) => {
    const results = loadData('results.json');
    res.json(results);
});

router.post('/', (req, res) => {
    if (saveData('results.json', req.body)) {
        req.app.get('io').emit('dataUpdate', { type: 'results' });
        res.json({ success: true, message: 'Results saved successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Error saving results' });
    }
});

export default router;
