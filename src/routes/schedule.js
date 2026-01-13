import express from 'express';
import { loadData, saveData } from '../utils/dataHandler.js';

const router = express.Router();

router.get('/', (req, res) => {
    const schedule = loadData('schedule.json');
    res.json(schedule);
});

router.post('/', (req, res) => {
    if (saveData('schedule.json', req.body)) {
        req.app.get('io').emit('dataUpdate', { type: 'schedule' });
        res.json({ success: true, message: 'Schedule saved successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Error saving schedule' });
    }
});

export default router;
