import express from 'express';
import * as resultsController from './results.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router({ mergeParams: true });

router.use(protect);
router.get('/', resultsController.getResults);
router.get('/:sessionId', resultsController.getSessionDetail);

export default router;
