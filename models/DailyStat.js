import mongoose from 'mongoose';

const DailyStatSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true }, // YYYY-MM-DD
    count: { type: Number, default: 0 },
});

export default mongoose.models.DailyStat || mongoose.model('DailyStat', DailyStatSchema);
