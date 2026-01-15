import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
    id: String,
    title: String,
    url: String,
    type: String
}, { timestamps: true, strict: false });

export default mongoose.model('Gallery', gallerySchema);
