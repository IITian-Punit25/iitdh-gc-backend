import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matchesRouter from '../Backend/routes/matches.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: [process.env.CLIENT_URL || "http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Load data files
const loadData = (filename) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data', filename), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        return [];
    }
};

// Save data files
const saveData = (filename, data) => {
    try {
        fs.writeFileSync(path.join(__dirname, 'data', filename), JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error saving ${filename}:`, error);
        return false;
    }
};

// API Routes
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `${process.env.NEXT_PUBLIC_API_URL || `http://localhost:${process.env.PORT || 5000}`}/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
});

app.get('/api/teams', (req, res) => {
    const teams = loadData('teams.json');
    res.json(teams);
});

app.post('/api/teams', (req, res) => {
    if (saveData('teams.json', req.body)) {
        io.emit('dataUpdate', { type: 'teams' }); // Notify clients
        res.json({ success: true, message: 'Teams saved successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Error saving teams' });
    }
});

app.get('/api/schedule', (req, res) => {
    const schedule = loadData('schedule.json');
    res.json(schedule);
});

app.post('/api/schedule', (req, res) => {
    if (saveData('schedule.json', req.body)) {
        io.emit('dataUpdate', { type: 'schedule' }); // Notify clients
        res.json({ success: true, message: 'Schedule saved successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Error saving schedule' });
    }
});

app.get('/api/results', (req, res) => {
    const results = loadData('results.json');
    res.json(results);
});

app.post('/api/results', (req, res) => {
    if (saveData('results.json', req.body)) {
        io.emit('dataUpdate', { type: 'results' }); // Notify clients
        res.json({ success: true, message: 'Results saved successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Error saving results' });
    }
});

app.get('/api/gallery', (req, res) => {
    const gallery = loadData('gallery.json');
    res.json(gallery);
});

app.post('/api/gallery', (req, res) => {
    if (saveData('gallery.json', req.body)) {
        io.emit('dataUpdate', { type: 'gallery' }); // Notify clients
        res.json({ success: true, message: 'Gallery saved successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Error saving gallery' });
    }
});

app.get('/api/contact', (req, res) => {
    const contact = loadData('contact.json');
    res.json(contact);
});

app.post('/api/contact', (req, res) => {
    if (saveData('contact.json', req.body)) {
        io.emit('dataUpdate', { type: 'contact' }); // Notify clients
        res.json({ success: true, message: 'Contact saved successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Error saving contact' });
    }
});

app.get('/api/standings', (req, res) => {
    const standings = loadData('standings.json');
    res.json(standings);
});

app.post('/api/standings', (req, res) => {
    if (saveData('standings.json', req.body)) {
        io.emit('dataUpdate', { type: 'standings' }); // Notify clients
        res.json({ success: true, message: 'Standings saved successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Error saving standings' });
    }
});

app.use('/api/matches', matchesRouter);

app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === 'admin123') {
        res.json({ success: true, token: 'admin-token-secret' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

// Basic Route
app.get('/', (req, res) => {
    res.send('GC Sports API is running');
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
