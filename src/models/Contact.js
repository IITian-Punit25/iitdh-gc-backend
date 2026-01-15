import mongoose from 'mongoose';

const coordinatorSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    role: { type: String, default: '' },
    phone: { type: String, default: '' },
    image: { type: String, default: '' },
    imageType: { type: String, default: 'url' }
}, { _id: false, strict: false });

const contactSchema = new mongoose.Schema({
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    socialMedia: {
        instagram: { type: String, default: '' },
        youtube: { type: String, default: '' }
    },
    coordinators: [coordinatorSchema]
}, { timestamps: true, strict: false });

export default mongoose.model('Contact', contactSchema);
