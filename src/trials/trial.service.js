import Trial from './trial.model.js';
import Experiment from '../experiments/experiment.model.js';

export const createTrial = async (researcherId, experimentId, trialData) => {
  const experiment = await Experiment.findOne({ _id: experimentId, researcher: researcherId });
  if (!experiment) {
    const error = new Error('Experiment not found');
    error.statusCode = 404;
    throw error;
  }
  if (experiment.status === 'CLOSED') {
    const error = new Error('Cannot add trials to a closed experiment');
    error.statusCode = 400;
    throw error;
  }
  const trialCount = await Trial.countDocuments({ experiment: experimentId });
  const trialOrder = trialData.trialOrder || trialCount + 1;

  const trial = await Trial.create({
    ...trialData,
    experiment: experimentId,
    trialOrder,
  });
  return trial;
};

export const getTrialsByExperiment = async (experimentId) => {
  return await Trial.find({ experiment: experimentId }).sort({ trialOrder: 1 });
};

export const updateTrial = async (researcherId, trialId, updateData) => {
  const trial = await Trial.findById(trialId);
  if (!trial) {
    const error = new Error('Trial not found');
    error.statusCode = 404;
    throw error;
  }
  const experiment = await Experiment.findOne({ _id: trial.experiment, researcher: researcherId });
  if (!experiment) {
    const error = new Error('Not authorized to update this trial');
    error.statusCode = 403;
    throw error;
  }
  Object.assign(trial, updateData);
  await trial.save();
  return trial;
};

export const deleteTrial = async (researcherId, trialId) => {
  const trial = await Trial.findById(trialId);
  if (!trial) {
    const error = new Error('Trial not found');
    error.statusCode = 404;
    throw error;
  }
  const experiment = await Experiment.findOne({ _id: trial.experiment, researcher: researcherId });
  if (!experiment) {
    const error = new Error('Not authorized to delete this trial');
    error.statusCode = 403;
    throw error;
  }
  await trial.deleteOne();
  return { success: true };
};
