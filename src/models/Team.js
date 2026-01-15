import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
    id: String,
    name: { type: String, default: '' },
    year: { type: String, default: '' },
    branch: { type: String, default: '' },
    isCaptain: { type: Boolean, default: false },
    image: { type: String, default: '' },
    imageUrl: { type: String, default: '' }
}, { _id: false });

const teamSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    members: [memberSchema]
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);
