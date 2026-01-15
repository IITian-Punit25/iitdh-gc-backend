import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
    sport: { type: String, required: true },
    teamA: { type: String, required: true },
    teamB: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['SCHEDULED', 'LIVE', 'COMPLETED'], default: 'SCHEDULED' },
    scoreA: String,
    scoreB: String,
    winner: String
}, { timestamps: true });

export default mongoose.model('Match', matchSchema);
