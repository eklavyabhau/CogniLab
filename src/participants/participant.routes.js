import express from 'express';
import * as participantController from './participant.controller.js';

const router = express.Router();

router.post('/start/:publicId', participantController.start);
router.post('/:sessionId/calibration', participantController.calibrate);
router.post('/:sessionId/responses', participantController.submitResponse);
router.post('/:sessionId/complete', participantController.complete);

export default router;
