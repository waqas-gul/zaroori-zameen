import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Home,
  Check,
  X,
  Loader,
  Filter,
  Search,
  Link as LinkIcon,
  Send,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { backendurl } from "../App";
import { FaStepBackward } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMeetingLink, setEditingMeetingLink] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    const adminId = localStorage.getItem("adminId");
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendurl}/api/appointments/user/${adminId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data?.success) {
        // Access appointments from response.data.data
        const appointmentsData = response.data.data || [];
        setAppointments(appointmentsData);
      } else {
        toast.error(response.data?.message || "Failed to fetch appointments");
        setAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch appointments"
      );
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const response = await axios.put(
        `${backendurl}/api/appointments/status`,
        {
          appointmentId,
          status: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast.success(`Appointment ${newStatus} successfully`);
        fetchAppointments();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment status");
    }
  };

  const handleMeetingLinkUpdate = async (appointmentId) => {
    try {
      if (!meetingLink) {
        toast.error("Please enter a meeting link");
        return;
      }

      const response = await axios.put(
        `${backendurl}/api/appointments/update-meeting`,
        {
          appointmentId,
          meetingLink,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast.success("Meeting link sent successfully");
        setEditingMeetingLink(null);
        setMeetingLink("");
        fetchAppointments();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating meeting link:", error);
      toast.error("Failed to update meeting link");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      searchTerm === "" ||
      (apt.property?.title &&
        apt.property.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (apt.user?.name &&
        apt.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (apt.user?.email &&
        apt.user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filter === "all" || apt.status === filter;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              className="flex items-center my-4 justify-center gap-2 bg-indigo-600 py-2 px-4 rounded-lg text-white hover:bg-indigo-700"
              onClick={() => navigate("/dashboard")}
            >
              <FaStepBackward />
              Go Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Appointments
            </h1>
            <p className="text-gray-600">
              Manage and track property viewing appointments
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Appointments</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meeting Link
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <motion.tr
                    key={appointment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50"
                  >
                    {/* Property Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Home className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.property?.title ||
                              "Property title not available"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.property?.location ||
                              "Location not available"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Client Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.user?.name || "Unknown client"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.user?.email || "Email not available"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.date
                              ? new Date(appointment.date).toLocaleDateString()
                              : "Date not set"}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {appointment.time || "Time not set"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status?.charAt(0).toUpperCase() +
                          appointment.status?.slice(1) || "Unknown"}
                      </span>
                    </td>

                    {/* Meeting Link */}
                    <td className="px-6 py-4">
                      {editingMeetingLink === appointment._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            value={meetingLink}
                            onChange={(e) => setMeetingLink(e.target.value)}
                            placeholder="Enter meeting link"
                            className="px-2 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm w-full"
                          />
                          <button
                            onClick={() =>
                              handleMeetingLinkUpdate(appointment._id)
                            }
                            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingMeetingLink(null);
                              setMeetingLink("");
                            }}
                            className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          {appointment.meetingLink ? (
                            <a
                              href={appointment.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                            >
                              <LinkIcon className="w-4 h-4" />
                              View Link
                            </a>
                          ) : (
                            <span className="text-gray-500">No link yet</span>
                          )}
                          {appointment.status === "confirmed" && (
                            <button
                              onClick={() => {
                                setEditingMeetingLink(appointment._id);
                                setMeetingLink(appointment.meetingLink || "");
                              }}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                            >
                              <LinkIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      {appointment.status === "pending" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleStatusChange(appointment._id, "confirmed")
                            }
                            className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(appointment._id, "cancelled")
                            }
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No appointments found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
