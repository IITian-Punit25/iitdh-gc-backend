import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const contact = await Contact.findOne();
        // Return the full contact object or empty default
        res.json(contact || {
            email: '',
            phone: '',
            address: '',
            socialMedia: { instagram: '', youtube: '' },
            coordinators: []
        });
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        // Upsert - update if exists, create if not
        await Contact.deleteMany({});
        await Contact.create(req.body);
        req.app.get('io').emit('dataUpdate', { type: 'contact' });
        res.json({ success: true, message: 'Contact saved successfully' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ success: false, message: 'Error saving contact' });
    }
});

export default router;
