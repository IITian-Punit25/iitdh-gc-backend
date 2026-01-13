import express from 'express';
import { loadData, saveData } from '../utils/dataHandler.js';

const router = express.Router();

router.get('/', (req, res) => {
    const gallery = loadData('gallery.json');
    res.json(gallery);
});

router.post('/', (req, res) => {
    if (saveData('gallery.json', req.body)) {
        req.app.get('io').emit('dataUpdate', { type: 'gallery' });
        res.json({ success: true, message: 'Gallery saved successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Error saving gallery' });
    }
});

export default router;
