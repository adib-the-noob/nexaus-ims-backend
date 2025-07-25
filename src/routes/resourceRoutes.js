import express from 'express';
import {
    addResource,
    getResources
} from '../controllers/resourceController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/add-resources', addResource);
router.get('/resources/:instituteId', getResources);