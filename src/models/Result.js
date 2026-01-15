import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    id: String,
    sport: String,
    teamA: String,
    teamB: String,
    scoreA: String,
    scoreB: String,
    winner: String,
    date: String,
    liveLink: String,
    streamStatus: String,
    scoreSheetType: String,
    scoreSheetLink: String
}, { timestamps: true, strict: false });

export default mongoose.model('Result', resultSchema);
