const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
      maxlength: 64
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    occurredAt: {
      type: Date,
      default: Date.now
    },
    receivedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

// Auto-clean events older than 90 days
analyticsEventSchema.index({ receivedAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
