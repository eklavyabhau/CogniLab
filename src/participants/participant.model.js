import mongoose from 'mongoose';

const participantSessionSchema = new mongoose.Schema(
  {
    experiment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Experiment',
      required: true,
    },
    anonymousCode: {
      type: String,
      required: true,
      unique: true,
    },
    reliabilityScore: {
      type: Number,
      default: null,
    },
    reliabilitySummary: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    reliabilityFlags: {
      type: [String],
      default: [],
    },
    calibrationData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['STARTED', 'COMPLETED', 'ABANDONED'],
      default: 'STARTED',
    },
  },
  {
    timestamps: true,
  }
);

const ParticipantSession = mongoose.model('ParticipantSession', participantSessionSchema);

export default ParticipantSession;
