import express from 'express';
import { checkQuestionnaireStatus, submitQuestionnaire, skipQuestionnaire } from '../controller/questionnaireController.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

router.get('/status', authMiddleware, checkQuestionnaireStatus);
router.post('/submit', authMiddleware, submitQuestionnaire);
router.post('/skip', authMiddleware, skipQuestionnaire);


export default router;