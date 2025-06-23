import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'] // Added HEAD
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  responseTime: {
    type: Number,
    required: true
  },
  statusCode: {
    type: Number,
    required: true
  }
}, { timestamps: true });

// Index for better query performance
statsSchema.index({ endpoint: 1, timestamp: -1 });
statsSchema.index({ method: 1 });
statsSchema.index({ statusCode: 1 });

const Stats = mongoose.model('Stats', statsSchema);

export default Stats;