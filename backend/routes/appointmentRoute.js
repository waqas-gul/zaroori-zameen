import express from "express";
import { protect } from '../middleware/authmiddleware.js';
import {
  scheduleViewing,
  getAllAppointments,
  updateAppointmentStatus,
  getAppointmentsByUser,
  cancelAppointment,
  updateAppointmentMeetingLink,
  getAppointmentStats,
  submitAppointmentFeedback,
  getUpcomingAppointments,
  getUserAppointments
} from "../controller/appointmentController.js";


const router = express.Router();

// User routes
router.post("/schedule", protect, scheduleViewing);  // Add protect middleware
router.get("/user", getAppointmentsByUser);
router.put("/cancel/:id", cancelAppointment);
router.put("/feedback/:id", submitAppointmentFeedback);
router.get("/upcoming", getUpcomingAppointments);

// Admin routes
router.get("/all", getAllAppointments);
router.get("/user/:userId", getUserAppointments);

router.get("/stats", getAppointmentStats);
router.put("/status", updateAppointmentStatus);
router.put("/update-meeting", updateAppointmentMeetingLink);

export default router;