import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    campaignId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    phoneNumber: { type: String, required: true },
    content: { type: String },
    status: { type: String, enum: ['Delivered', 'Failed'], default: 'Delivered' },
    cost: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    mcc: { type: String, default: '310' },
    mnc: { type: String, default: '410' },
    type: { type: String, default: 'SMS' }
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
