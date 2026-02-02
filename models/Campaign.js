import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Keeping UUID for continuity
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional link if we want strict relation
    createdAt: { type: Date, default: Date.now },
    type: { type: String, default: 'SMS' },
    numbersCount: { type: Number, required: true },
    successCount: { type: Number, default: 0 },
    failCount: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    content: { type: String },
    senderId: { type: String },
    mcc: { type: String },
    mnc: { type: String },
    mmsTitle: { type: String }
});

export default mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);
