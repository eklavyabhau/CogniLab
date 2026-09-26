import * as experimentService from './experiment.service.js';

export const create = async (req, res, next) => {
  try {
    const { title, description, instructions } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    const experiment = await experimentService.createExperiment(req.user._id, { title, description, instructions });
    res.status(201).json({ success: true, data: experiment });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const experiments = await experimentService.getResearcherExperiments(req.user._id);
    res.status(200).json({ success: true, data: experiments });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const experiment = await experimentService.getExperimentById(req.user._id, req.params.id);
    res.status(200).json({ success: true, data: experiment });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const experiment = await experimentService.updateExperiment(req.user._id, req.params.id, req.body);
    res.status(200).json({ success: true, data: experiment });
  } catch (error) {
    next(error);
  }
};

export const publish = async (req, res, next) => {
  try {
    const experiment = await experimentService.publishExperiment(req.user._id, req.params.id);
    res.status(200).json({ success: true, data: experiment });
  } catch (error) {
    next(error);
  }
};

export const getPublic = async (req, res, next) => {
  try {
    const experiment = await experimentService.getPublicExperiment(req.params.publicId);
    res.status(200).json({ success: true, data: experiment });
  } catch (error) {
    next(error);
  }
};
