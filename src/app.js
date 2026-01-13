import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import matchesRouter from './routes/matches.js';
import teamsRouter from './routes/teams.js';
import scheduleRouter from './routes/schedule.js';
import resultsRouter from './routes/results.js';
import galleryRouter from './routes/gallery.js';
import contactRouter from './routes/contact.js';
import standingsRouter from './routes/standings.js';
import authRouter from './routes/auth.js';
import uploadRouter from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from public directory (adjust path to go up from src)
app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

// API Routes
app.use('/api/matches', matchesRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/results', resultsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/contact', contactRouter);
app.use('/api/standings', standingsRouter);
app.use('/api', authRouter); // /api/login
app.use('/api/upload', uploadRouter);

// Basic Route
app.get('/', (req, res) => {
    res.send('GC Sports API is running');
});

export default app;
