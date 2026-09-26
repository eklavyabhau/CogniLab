import * as participantService from './participant.service.js';

export const start = async (req, res, next) => {
  try {
    const { publicId } = req.params;
    const session = await participantService.startSession(publicId);
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

export const calibrate = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await participantService.submitCalibration(sessionId, req.body);
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

export const submitResponse = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const responseRecord = await participantService.recordResponse(sessionId, req.body);
    res.status(201).json({ success: true, data: responseRecord });
  } catch (error) {
    next(error);
  }
};

export const complete = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const result = await participantService.completeSession(sessionId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
