import * as resultsService from './results.service.js';

export const getResults = async (req, res, next) => {
  try {
    const { experimentId } = req.params;
    const data = await resultsService.getExperimentResults(req.user._id, experimentId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSessionDetail = async (req, res, next) => {
  try {
    const { experimentId, sessionId } = req.params;
    const data = await resultsService.getSessionDetail(req.user._id, experimentId, sessionId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
