import express from 'express';
import { submitNewsletter } from '../controller/newscontroller.js';

const newsrouter = express.Router();

newsrouter.post('/newsdata', submitNewsletter);

export default newsrouter;