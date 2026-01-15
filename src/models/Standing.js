import mongoose from 'mongoose';

const resultsSchema = new mongoose.Schema({
    first: { type: String, default: '' },
    second: { type: String, default: '' },
    third: { type: String, default: '' },
    fourth: { type: String, default: '' }
}, { _id: false });

const standingSchema = new mongoose.Schema({
    id: String,
    sport: String,
    type: String,
    category: String,
    results: resultsSchema
}, { timestamps: true, strict: false });

export default mongoose.model('Standing', standingSchema);
