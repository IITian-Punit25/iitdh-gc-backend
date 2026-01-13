import express from 'express';
import { loadData, saveData } from '../utils/dataHandler.js';

const router = express.Router();

router.get('/', (req, res) => {
    const contact = loadData('contact.json');
    res.json(contact);
});

router.post('/', (req, res) => {
    if (saveData('contact.json', req.body)) {
        req.app.get('io').emit('dataUpdate', { type: 'contact' });
        res.json({ success: true, message: 'Contact saved successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Error saving contact' });
    }
});

export default router;
