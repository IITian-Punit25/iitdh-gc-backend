import express from 'express';
import { upload } from '../config/multer.js';

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `${process.env.NEXT_PUBLIC_API_URL || `http://localhost:${process.env.PORT || 5000}`}/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
});

export default router;
