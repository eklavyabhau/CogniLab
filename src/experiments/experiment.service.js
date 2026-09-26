import { nanoid } from 'nanoid';
import Experiment from './experiment.model.js';

export const createExperiment = async (researcherId, { title, description, instructions }) => {
  const experiment = await Experiment.create({
    researcher: researcherId,
    title,
    description,
    instructions,
  });
  return experiment;
};

export const getResearcherExperiments = async (researcherId) => {
  return await Experiment.find({ researcher: researcherId }).sort({ createdAt: -1 });
};

export const getExperimentById = async (researcherId, experimentId) => {
  const experiment = await Experiment.findOne({ _id: experimentId, researcher: researcherId });
  if (!experiment) {
    const error = new Error('Experiment not found');
    error.statusCode = 404;
    throw error;
  }
  return experiment;
};

export const updateExperiment = async (researcherId, experimentId, updateData) => {
  const experiment = await getExperimentById(researcherId, experimentId);
  if (experiment.status === 'CLOSED') {
    const error = new Error('Cannot update closed experiment');
    error.statusCode = 400;
    throw error;
  }
  Object.assign(experiment, updateData);
  await experiment.save();
  return experiment;
};

export const publishExperiment = async (researcherId, experimentId) => {
  const experiment = await getExperimentById(researcherId, experimentId);
  if (experiment.status === 'PUBLISHED') {
    return experiment;
  }
  experiment.status = 'PUBLISHED';
  experiment.publicId = nanoid(8);
  experiment.publishedAt = new Date();
  await experiment.save();
  return experiment;
};

export const getPublicExperiment = async (publicId) => {
  const experiment = await Experiment.findOne({ publicId, status: 'PUBLISHED' });
  if (!experiment) {
    const error = new Error('Published experiment not found or link has expired');
    error.statusCode = 404;
    throw error;
  }
  return experiment;
};
