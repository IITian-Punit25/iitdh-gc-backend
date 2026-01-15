import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Team from '../models/Team.js';
import Schedule from '../models/Schedule.js';
import Result from '../models/Result.js';
import Standing from '../models/Standing.js';
import Gallery from '../models/Gallery.js';
import Contact from '../models/Contact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const DATA_DIR = path.join(__dirname, '../../data');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const importData = async () => {
    await connectDB();

    try {
        // Teams
        const teamsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'teams.json'), 'utf-8'));
        await Team.deleteMany({});
        await Team.insertMany(teamsData);
        console.log('Teams imported');

        // Schedule
        const scheduleData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'schedule.json'), 'utf-8'));
        await Schedule.deleteMany({});
        await Schedule.insertMany(scheduleData);
        console.log('Schedule imported');

        // Results
        const resultsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'results.json'), 'utf-8'));
        await Result.deleteMany({});
        await Result.insertMany(resultsData);
        console.log('Results imported');

        // Standings
        const standingsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'standings.json'), 'utf-8'));
        await Standing.deleteMany({});
        await Standing.insertMany(standingsData);
        console.log('Standings imported');

        // Gallery
        const galleryData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'gallery.json'), 'utf-8'));
        await Gallery.deleteMany({});
        await Gallery.insertMany(galleryData);
        console.log('Gallery imported');

        // Contact
        const contactData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'contact.json'), 'utf-8'));
        await Contact.deleteMany({});
        await Contact.create(contactData);
        console.log('Contact imported');

        console.log('Data Import Success');
        process.exit();
    } catch (error) {
        console.error('Error with data import:', error);
        process.exit(1);
    }
};

importData();
