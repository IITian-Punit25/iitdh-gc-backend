import express from 'express';
import { upload } from '../config/multer.js';

import passwordCheck from '../middleware/passwordCheck.js';

const router = express.Router();

router.post('/', passwordCheck, (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Construct URL from request instead of using frontend env var
        const protocol = req.protocol;
        const host = req.get('host');
        const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        res.json({ success: true, url: fileUrl });
    });
});

export default router;
