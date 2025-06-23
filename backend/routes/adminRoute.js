import express from 'express';
import {
  getAdminStats,
  getAllAppointments,
  updateAppointmentStatus
} from '../controller/adminController.js';

const router = express.Router();

router.get('/stats', getAdminStats);
router.get('/appointments', getAllAppointments);
router.put('/appointments/status', updateAppointmentStatus);

export default router;