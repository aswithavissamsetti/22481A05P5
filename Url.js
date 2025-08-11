import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  clickStats: [
    {
      timestamp: Date,
      referrer: String,
      ip: String,
      location: String // Placeholder for geo info
    }
  ]
});

export default mongoose.model('Url', urlSchema);