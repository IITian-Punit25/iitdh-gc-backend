import express from 'express';
import Gallery from '../models/Gallery.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const gallery = await Gallery.find();
        res.json(gallery);
    } catch (error) {
        console.error('Error fetching gallery:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        await Gallery.deleteMany({});
        if (Array.isArray(req.body) && req.body.length > 0) {
            await Gallery.insertMany(req.body);
        }
        req.app.get('io').emit('dataUpdate', { type: 'gallery' });
        res.json({ success: true, message: 'Gallery saved successfully' });
    } catch (error) {
        console.error('Error saving gallery:', error);
        res.status(500).json({ success: false, message: 'Error saving gallery' });
    }
});

export default router;
