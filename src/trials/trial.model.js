import mongoose from 'mongoose';

const trialSchema = new mongoose.Schema(
  {
    experiment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Experiment',
      required: true,
    },
    trialOrder: {
      type: Number,
      required: true,
    },
    stimulusType: {
      type: String,
      required: [true, 'Stimulus type is required'],
      trim: true,
    },
    stimulus: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Stimulus content is required'],
    },
    durationMs: {
      type: Number,
      default: 0,
    },
    expectedResponse: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

trialSchema.index({ experiment: 1, trialOrder: 1 }, { unique: true });

const Trial = mongoose.model('Trial', trialSchema);

export default Trial;
