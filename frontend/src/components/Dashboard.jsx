import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddProperty from "./AddProperty";
import { motion, AnimatePresence } from "framer-motion";
import { Backendurl } from "../App";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { IoIosSend } from "react-icons/io";

import {
  Bath,
  Building,
  ChevronLeft,
  ChevronRight,
  Home,
  Layers,
  MapPin,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  Check,
  X,
  LinkIcon,
} from "lucide-react";
import { FiEdit } from "react-icons/fi";
import { MdOutlineAutoDelete } from "react-icons/md";
import { FcApproval } from "react-icons/fc";
import { LuBedDouble } from "react-icons/lu";
import { FaMaximize } from "react-icons/fa6";
import { GrInProgress } from "react-icons/gr";

const Dashboard = () => {
  const userId = localStorage.getItem("userId");
  const [activeTab, setActiveTab] = useState("approved");
  const [properties, setProperties] = useState([]);
  const [rejectedWithMessages, setRejectedWithMessages] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [appointmentCounts, setAppointmentCounts] = useState({
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  });
  const [counts, setCounts] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
    appointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingMeetingLink, setEditingMeetingLink] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");
  const navigate = useNavigate();

  // Update current time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateRemainingTime = (timestamp) => {
    if (!timestamp) return "";
    const deletionTime = new Date(timestamp).getTime();
    const diff = deletionTime - currentTime;

    if (diff <= 0) return "Deleting soon";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const fetchCounts = async () => {
    try {
      const [approvedRes, pendingRes, rejectedRes] = await Promise.all([
        axios.get(`${Backendurl}/api/products/approved/${userId}`),
        axios.get(`${Backendurl}/api/products/pending/${userId}`),
        axios.get(`${Backendurl}/api/products/rejected/${userId}`),
      ]);

      setCounts({
        approved:
          approvedRes.data.properties?.length || approvedRes.data.length || 0,
        pending:
          pendingRes.data.properties?.length || pendingRes.data.length || 0,
        rejected:
          rejectedRes.data.properties?.length || rejectedRes.data.length || 0,
        appointments: counts.appointments, // Keep existing appointment count
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const fetchRejectedWithMessages = async () => {
    try {
      const res = await axios.get(
        `${Backendurl}/api/products/rejected/${userId}`
      );

      const rejectedProperties = res.data.properties || res.data;

      // Filter properties that have rejection messages
      const withMessages = rejectedProperties.filter(
        (property) => property.rejectionReason
      );
      setRejectedWithMessages(withMessages);
    } catch (error) {
      console.error("Error fetching rejected properties with messages:", error);
    }
  };

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!userId || !token) {
      console.error("Missing authentication data");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await axios.get(
        `${Backendurl}/api/appointments/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      // Handle both array and object response formats
      let appointments = [];
      if (Array.isArray(response.data)) {
        appointments = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        appointments = response.data.data;
      } else if (
        response.data?.appointments &&
        Array.isArray(response.data.appointments)
      ) {
        appointments = response.data.appointments;
      } else if (
        response.data?.properties &&
        Array.isArray(response.data.properties)
      ) {
        appointments = response.data.properties;
      }

      // Calculate appointment counts
      const counts = {
        pending: 0,
        confirmed: 0,
        cancelled: 0,
      };

      appointments.forEach((appointment) => {
        if (appointment?.status && counts.hasOwnProperty(appointment.status)) {
          counts[appointment.status]++;
        }
      });
      // Update state
      setAppointments(appointments);
      setAppointmentCounts(counts);

      setCounts((prev) => ({
        ...prev,
        appointments: appointments.length,
      }));

      // If you need to fetch related property data
      // if (appointments.some((apt) => apt.propertyId)) {
      //   await fetchPropertiesForAppointments(appointments);
      // }
    } catch (error) {
      console.error("Appointment fetch error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "/login";
      }
    }
  };

  // Helper function to fetch property data
  // const fetchPropertiesForAppointments = async (appointments) => {
  //   try {
  //     const propertyIds = appointments.map((a) => a.propertyId).filter(Boolean);
  //     if (propertyIds.length === 0) return;

  //     const response = await axios.post(
  //       `${Backendurl}/api/properties/batch`,
  //       { ids: propertyIds },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const properties = response.data.properties || [];
  //     const propertyMap = properties.reduce((map, property) => {
  //       map[property._id] = property;
  //       return map;
  //     }, {});

  //     // Update appointments with property data
  //     setAppointments((prev) =>
  //       prev.map((appointment) => ({
  //         ...appointment,
  //         property: propertyMap[appointment.propertyId] || null,
  //       }))
  //     );
  //   } catch (error) {
  //     console.error("Error fetching properties:", error);
  //   }
  // };

  const handleStatusChange = async (appointmentId, newStatus) => {
    // First show confirmation dialog
    const confirmation = await Swal.fire({
      title: `Are you sure?`,
      html: `You're about to mark this appointment as <strong>${newStatus}</strong>.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, mark as ${newStatus}`,
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!confirmation.isConfirmed) return;

    try {
      const userEmail = localStorage.getItem("email");
      const response = await axios.put(
        `${Backendurl}/api/appointments/status`,
        {
          appointmentId,
          status: newStatus,
          userEmail: userEmail,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        // Show both SweetAlert and toast
        await Swal.fire({
          title: "Success!",
          text: `Appointment ${newStatus} successfully`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        toast.success(`Appointment ${newStatus} successfully`);
        fetchAppointments();
      } else {
        await Swal.fire({
          title: "Error!",
          text: response.data.message,
          icon: "error",
        });
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      await Swal.fire({
        title: "Error!",
        text: "Failed to update appointment status",
        icon: "error",
      });
      toast.error("Failed to update appointment status");
    }
  };

  const handleMeetingLinkUpdate = async (appointmentId) => {
    try {
      // Validate meeting link first
      if (!meetingLink) {
        await Swal.fire({
          icon: "error",
          title: "Missing Link",
          text: "Please enter a valid meeting link",
          confirmButtonColor: "#3085d6",
        });
        toast.error("Please enter a meeting link");
        return;
      }

      // Validate URL format if needed
      if (
        !meetingLink.startsWith("http://") &&
        !meetingLink.startsWith("https://")
      ) {
        await Swal.fire({
          icon: "error",
          title: "Invalid Link",
          html: "Meeting link should start with <strong>http://</strong> or <strong>https://</strong>",
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      // Show confirmation dialog
      const confirmation = await Swal.fire({
        title: "Update Meeting Link?",
        html: `You're about to set this meeting link:<br><strong>${meetingLink}</strong>`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        focusConfirm: false,
        preConfirm: () => {
          return meetingLink;
        },
      });
      const userEmail = localStorage.getItem("email");

      if (!confirmation.isConfirmed) return;

      // Make API call
      const response = await axios.put(
        `${Backendurl}/api/appointments/update-meeting`,
        {
          appointmentId,
          meetingLink,
          userEmail: userEmail,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        // Show success message
        await Swal.fire({
          title: "Success!",
          text: "Meeting link updated successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        toast.success("Meeting link sent successfully");
        setEditingMeetingLink(null);
        setMeetingLink("");
        fetchAppointments();
      } else {
        await Swal.fire({
          title: "Error!",
          text: response.data.message || "Failed to update meeting link",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating meeting link:", error);
      await Swal.fire({
        title: "Connection Error",
        text: "Failed to update meeting link. Please try again.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      toast.error("Failed to update meeting link");
    }
  };

  const fetchProperties = async () => {
    try {
      let url;
      if (activeTab === "pending") {
        url = `${Backendurl}/api/products/pending/${userId}`;
      } else if (activeTab === "rejected") {
        url = `${Backendurl}/api/products/rejected/${userId}`;
      } else if (activeTab === "approved") {
        url = `${Backendurl}/api/products/approved/${userId}`;
      }

      if (url) {
        const res = await axios.get(url);
        const propertiesWithIndex = (res.data.properties || res.data).map(
          (property) => ({
            ...property,
            currentImageIndex: 0,
          })
        );
        setProperties(propertiesWithIndex);
      }

      await fetchCounts();

      // Also fetch rejected with messages when needed
      if (activeTab === "rejection-messages") {
        await fetchRejectedWithMessages();
      }
    } catch (error) {
      console.error(
        "Error fetching properties:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNextImage = (propertyId) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property._id === propertyId
          ? {
              ...property,
              currentImageIndex:
                (property.currentImageIndex + 1) % property.image.length,
            }
          : property
      )
    );
  };

  const handlePrevImage = (propertyId) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property._id === propertyId
          ? {
              ...property,
              currentImageIndex:
                (property.currentImageIndex - 1 + property.image.length) %
                property.image.length,
            }
          : property
      )
    );
  };

  const handleImageChange = (propertyId, index) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property._id === propertyId
          ? { ...property, currentImageIndex: index }
          : property
      )
    );
  };

  useEffect(() => {
    if (activeTab !== "add") {
      fetchProperties();
      if (activeTab === "appointments") {
        fetchAppointments();
      }
    } else {
      setLoading(false);
      fetchCounts();
    }
  }, [userId, activeTab]);

  const handleDeleteProperty = async (propertyId, propertyTitle) => {
    const result = await Swal.fire({
      title: `Are you sure you want to remove "${propertyTitle}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(`${Backendurl}/api/products/remove`, {
          id: propertyId,
        });

        if (response.data.success) {
          toast.success("Property removed successfully");
          await fetchProperties();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error removing property:", error);
        toast.error("Failed to remove property");
      }
    }
  };

  const handleEditProperty = (id) => {
    navigate(`/update-property/${id}`);
  };

  const renderContent = () => {
    if (activeTab === "add") {
      return (
        <AddProperty
          userId={userId}
          onSuccess={() => setActiveTab("pending")}
        />
      );
    }

    if (activeTab === "rejection-messages") {
      return (
        <div className="space-y-6 ">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Rejection Messages
          </h2>

          {loading ? (
            <div className="text-center py-8">
              Loading rejection messages...
            </div>
          ) : rejectedWithMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No rejection messages found.
            </div>
          ) : (
            <div className="space-y-4">
              {rejectedWithMessages.map((property) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {property.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      Rejected on:{" "}
                      {new Date(property.updatedAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center text-red-600 mb-2">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">Rejection Reason:</span>
                    </div>
                    <p className="text-gray-700 pl-7">
                      {property.rejectionReason ||
                        "No specific reason provided"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Property ID:</span>{" "}
                      {property._id}
                    </div>
                    <div className="text-sm text-red-500">
                      <span className="font-medium">Deleting in:</span>{" "}
                      {calculateRemainingTime(property.scheduledForDeletion)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "appointments") {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Appointments
          </h2>

          {/* Status summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
              <div className="flex justify-between items-center">
                <h3 className="text-gray-600">Pending</h3>
                <Clock className="text-yellow-500" />
              </div>
              <p className="text-2xl font-bold">{appointmentCounts.pending}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
              <div className="flex justify-between items-center">
                <h3 className="text-gray-600">Confirmed</h3>
                <Check className="text-green-500" />
              </div>
              <p className="text-2xl font-bold">
                {appointmentCounts.confirmed}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
              <div className="flex justify-between items-center">
                <h3 className="text-gray-600">Cancelled</h3>
                <X className="text-red-500" />
              </div>
              <p className="text-2xl font-bold">
                {appointmentCounts.cancelled}
              </p>
            </div>
          </div>

          {/* Appointments table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                      Meeting Link
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <motion.tr
                      key={appointment._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-gray-50"
                    >
                      {/* Property Column */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Home className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-[180px]">
                              {appointment.property?.title ||
                                "No property title"}
                            </p>
                            <p className="text-sm text-gray-500 truncate max-w-[180px]">
                              {appointment.property?.location ||
                                "Location not specified"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Client Column */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-[150px]">
                              {appointment.user?.name ||
                                appointment.userId?.name ||
                                appointment.clientName ||
                                "Client name not available"}
                            </p>
                            <p className="text-sm text-gray-500 truncate max-w-[150px]">
                              {appointment.user?.email ||
                                appointment.userId?.email ||
                                appointment.clientEmail ||
                                "No email provided"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time Column */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {new Date(appointment.date).toLocaleDateString()}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              {appointment.time}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            appointment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </span>
                      </td>

                      {/* Meeting Link Column */}
                      <td className="px-4 py-4">
                        {editingMeetingLink === appointment._id ? (
                          <div className="flex flex-col space-y-2">
                            <input
                              type="url"
                              value={meetingLink}
                              onChange={(e) => setMeetingLink(e.target.value)}
                              placeholder="Enter meeting link"
                              className="px-2 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm w-full"
                              autoFocus
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleMeetingLinkUpdate(appointment._id)
                                }
                                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center"
                              >
                                <IoIosSend className="w-4 h-4 mr-1" />
                                Send
                              </button>
                              <button
                                onClick={() => {
                                  setEditingMeetingLink(null);
                                  setMeetingLink("");
                                }}
                                className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm flex items-center"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            {appointment.meetingLink ? (
                              <a
                                href={appointment.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1 truncate max-w-[180px]"
                              >
                                <LinkIcon className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">View Link</span>
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
                                <FiEdit className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {appointment.status === "pending" && (
                          <div className="flex gap-2">
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
            {appointments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No appointments found
              </div>
            )}
          </div>
        </div>
      );
    }

    if (loading) {
      return <div className="text-center py-8">Loading properties...</div>;
    }

    if (properties.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No {activeTab} properties found.
          {activeTab === "pending" && (
            <button
              onClick={() => setActiveTab("add")}
              className="text-blue-500 ml-2 hover:underline"
            >
              Add a property
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AnimatePresence>
          {properties.map((property) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Property Image Slider */}
              <div className="relative h-48">
                {/* Property Type Label */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                    {property.type || "Property"}
                  </span>
                </div>

                <div className="relative h-full w-full overflow-hidden">
                  <div
                    className="flex h-full transition-transform duration-300 ease-in-out"
                    style={{
                      transform: `translateX(-${
                        property.currentImageIndex * 100
                      }%)`,
                    }}
                  >
                    {property.image.map((img, index) => (
                      <div key={index} className="w-full h-full flex-shrink-0">
                        <img
                          src={img || "/placeholder.jpg"}
                          alt={`${property.title} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                {property.image.length > 1 && (
                  <>
                    <button
                      onClick={() => handlePrevImage(property._id)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleNextImage(property._id)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {property.image.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(property._id, index)}
                      className={`w-2 h-2 rounded-full ${
                        property.currentImageIndex === index
                          ? "bg-white"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProperty(property._id)}
                      className="flex items-center justify-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      <FiEdit />
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteProperty(property._id, property.title)
                      }
                      className="flex items-center justify-center gap-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      <MdOutlineAutoDelete />
                      Delete
                    </button>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {property.title}
                    </h2>
                  </div>

                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    {property.location}
                  </div>

                  {/* Status Badge with Countdown */}
                  <div className="mb-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        property.approvalStatus === "approved"
                          ? "bg-green-100 text-green-800"
                          : property.approvalStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      } flex flex-col items-start space-y-1`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <p>Status:</p>
                        {property.approvalStatus === "approved" ? (
                          <FcApproval />
                        ) : (
                          <GrInProgress />
                        )}
                        {property.approvalStatus.charAt(0).toUpperCase() +
                          property.approvalStatus.slice(1)}
                      </span>
                      {property.approvalStatus === "rejected" && (
                        <span className="text-[10px] text-red-600">
                          Deleting in:{" "}
                          {calculateRemainingTime(
                            property.scheduledForDeletion
                          )}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-4 break-words whitespace-normal overflow-hidden max-h-16 hover:max-h-none transition-all duration-200">
                    {property.description || "No description available"}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <p className="text-xl font-semibold text-blue-600">
                    PKR {property.price.toLocaleString()}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.availability === "rent"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    For {property.availability}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                    <LuBedDouble className="w-5 h-5 text-gray-400 mb-1" />
                    <span className="text-sm text-gray-600">
                      {property.beds} Beds
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                    <Bath className="w-5 h-5 text-gray-400 mb-1" />
                    <span className="text-sm text-gray-600">
                      {property.baths} Baths
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                    <FaMaximize className="w-5 h-5 text-gray-400 mb-1" />
                    <span className="text-sm text-gray-600">
                      {property.sqft} sqft
                    </span>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="border-t pt-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Details
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Layers className="w-4 h-4 mr-2 text-gray-400" />
                      Floors: {property.floors || "N/A"}
                    </div>
                    <div className="flex items-center">
                      <Home className="w-4 h-4 mr-2 text-gray-400" />
                      Type: {property.type || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Amenities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          <Building className="w-3 h-3 mr-1" />
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{property.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  const tabs = [
    { key: "add", label: "Add Property", icon: <Plus size={18} /> },
    {
      key: "approved",
      label: "Approved Listings",
      icon: <CheckCircle size={18} className="text-green-600" />,
      count: counts.approved,
    },
    {
      key: "pending",
      label: "Pending Listings",
      icon: <Clock size={18} className="text-yellow-600" />,
      count: counts.pending,
    },
    {
      key: "rejected",
      label: "Rejected Listings",
      icon: <XCircle size={18} className="text-red-600" />,
      count: counts.rejected,
    },
    {
      key: "appointments",
      label: "Appointments",
      icon: <Calendar size={18} className="text-purple-600" />,
      count: counts.appointments,
    },
    {
      key: "rejection-messages",
      label: "Rejection Messages",
      icon: <AlertCircle size={18} className="text-red-600" />,
      count: rejectedWithMessages.length,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-md transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-blue-600">
              Property Dashboard
            </h1>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Home className="text-white w-5 h-5" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            {sidebarOpen ? (
              <ChevronLeft className="text-gray-500" />
            ) : (
              <ChevronRight className="text-gray-500" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {tabs.map(({ key, label, icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center rounded-lg p-3 mb-1 transition-colors ${
                activeTab === key
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span
                className={`${
                  activeTab === key ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {icon}
              </span>
              {sidebarOpen && (
                <>
                  <span className="ml-3 font-medium">{label}</span>
                  {count > 0 && key !== "add" && (
                    <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>

        {sidebarOpen && (
          <div className="p-4 border-t text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Zaroori Zameen</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 mt-14">
        <div className="max-w-7xl mx-auto">
          {activeTab !== "add" &&
            activeTab !== "rejection-messages" &&
            activeTab !== "appointments" && (
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {activeTab === "approved"
                    ? "Approved Properties"
                    : activeTab === "pending"
                    ? "Pending Approvals"
                    : "Rejected Properties"}
                </h2>
                <button
                  onClick={() => setActiveTab("add")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  Add Property
                </button>
              </div>
            )}

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
