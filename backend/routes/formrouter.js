import express from 'express';
import { submitForm } from '../controller/formcontroller.js';

const router = express.Router();

router.post('/submit', submitForm);

export default router;