import mongoose from 'mongoose';

// Flexible schema - accepts any fields
const scheduleSchema = new mongoose.Schema({
    id: String,
    sport: String,
    category: String,
    teamA: String,
    teamB: String,
    date: String,
    time: String,
    venue: String,
    status: String,
    scoreA: String,
    scoreB: String,
    winner: String,
    liveLink: String,
    streamStatus: String,
    scoreSheetType: String,
    scoreSheetLink: String
}, { timestamps: true, strict: false });

export default mongoose.model('Schedule', scheduleSchema);
