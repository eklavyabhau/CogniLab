import * as trialService from './trial.service.js';

export const create = async (req, res, next) => {
  try {
    const { experimentId } = req.params;
    const trial = await trialService.createTrial(req.user._id, experimentId, req.body);
    res.status(201).json({ success: true, data: trial });
  } catch (error) {
    next(error);
  }
};

export const getByExperiment = async (req, res, next) => {
  try {
    const { experimentId } = req.params;
    const trials = await trialService.getTrialsByExperiment(experimentId);
    res.status(200).json({ success: true, data: trials });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trial = await trialService.updateTrial(req.user._id, id, req.body);
    res.status(200).json({ success: true, data: trial });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await trialService.deleteTrial(req.user._id, id);
    res.status(200).json({ success: true, message: 'Trial deleted successfully' });
  } catch (error) {
    next(error);
  }
};
