import express from 'express';
import * as trialController from './trial.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', trialController.getByExperiment);

router.use(protect);
router.post('/', trialController.create);
router.patch('/:id', trialController.update);
router.delete('/:id', trialController.remove);

export default router;
