import express from 'express';
import * as experimentController from './experiment.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/public/:publicId', experimentController.getPublic);

router.use(protect);

router.post('/', experimentController.create);
router.get('/', experimentController.getAll);
router.get('/:id', experimentController.getOne);
router.patch('/:id', experimentController.update);
router.post('/:id/publish', experimentController.publish);

export default router;
