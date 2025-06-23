import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCalendarAlt, FaHome } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";
import { TbActivityHeartbeat, TbLocationCancel } from "react-icons/tb";
import { MdOutlinePendingActions, MdMenu, MdClose } from "react-icons/md";
import { FaRegPlusSquare, FaChartLine } from "react-icons/fa";
import { VscFolderActive } from "react-icons/vsc";
import { jwtDecode } from "jwt-decode";
import { IoEyeSharp } from "react-icons/io5";
import { FiActivity } from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Home,
  Activity,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  Loader,
  ChevronRight,
  Clock,
  DollarSign,
  PieChart,
  MessageSquare,
  FileText,
  Settings,
  HelpCircle,
  UsersIcon,
  HomeIcon,
} from "lucide-react";
import { backendurl } from "../App";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalProperties: 0,
    byApprovalStatus: {
      pending: 0,
      approved: 0,
      rejected: 0,
    },
    activeListings: 0,
    totalViews: 0,
    pendingAppointments: 0,
    recentActivity: [],
    viewsData: {},
    revenueData: {},
    totalUsers: 0,
    propertyTypes: {},
    loading: true,
    error: null,
  });

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 3,
      },
      point: {
        radius: 4,
        hoverRadius: 8,
        backgroundColor: "#fff",
        borderWidth: 2,
      },
    },
  };

  const barChartOptions = {
    ...lineChartOptions,
    plugins: {
      ...lineChartOptions.plugins,
      legend: {
        display: false,
      },
    },
    scales: {
      ...lineChartOptions.scales,
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "70%",
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${backendurl}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.data.success) {
        setStats((prev) => ({
          ...prev,
          ...response.data.stats,
          loading: false,
          error: null,
        }));
      } else {
        throw new Error(response.data.message || "Failed to fetch stats");
      }
    } catch (error) {
      setStats((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to fetch dashboard data",
      }));
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 300000);
    return () => clearInterval(interval);
  }, []);

  const propertyCards = [
    {
      link: "/list",
      title: "Total Properties",
      value: stats.totalProperties,
      icon: <FaRegPlusSquare className="w-6 h-6" />,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      trend: "12%",
      trendDirection: "up",
      description: "Total properties listed",
    },
    {
      link: "/active-listings",
      title: "Active Listings",
      value: stats.byApprovalStatus.approved,
      icon: <VscFolderActive className="w-6 h-6" />,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      trend: "8%",
      trendDirection: "up",
      description: "Currently active listings",
    },
    {
      link: "/pending-listings",
      title: "Pending Listings",
      value: stats.byApprovalStatus.pending,
      icon: <MdOutlinePendingActions className="w-6 h-6" />,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      trend: "5%",
      trendDirection: "down",
      description: "Awaiting confirmation",
    },
    {
      link: "/rejected-listings",
      title: "Rejected Listings",
      value: stats.byApprovalStatus.rejected,
      icon: <TbLocationCancel className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      trend: "15%",
      trendDirection: "up",
      description: "total Rejected Listings",
    },
  ];

  // Define your cards data above your component
  const Cards = [
    {
      id: "users",
      link: "/user-management",
      color: "bg-blue-500",
      icon: <UsersIcon />,
      trendDirection: "up",
      trend: "12%",
      title: "Total Users",
      value: stats.totalUsers,
      description: "",
    },

    {
      id: "Appintments",
      link: "/appointments",
      color: "bg-green-500",
      icon: <FaCalendarAlt />,
      trendDirection: "up",
      trend: "8%",
      title: "Appintments",
      value: stats.pendingAppointments,
      description: "Pendding Appintments",
    },

    {
      id: "Acticities",
      link: "/recent-activity",
      color: "bg-yellow-500",
      icon: <TbActivityHeartbeat />,
      trendDirection: "up",
      trend: "8%",
      title: "Users Activities",
      value: stats.recentActivity.length,
      description: "Recent Activities",
    },

    // Add more cards as needed
  ];

  const navItems = [
    {
      name: "Dashboard",
      icon: <Home className="w-5 h-5" />,
      path: "/dashboard",
    },
    {
      name: "Properties",
      icon: <FaHome className="w-5 h-5" />,
      path: "/properties",
      subItems: [
        { name: "All Properties", path: "/properties" },
        { name: "Add New", path: "/properties/add" },
        { name: "Categories", path: "/properties/categories" },
      ],
    },
    {
      name: "Users",
      icon: <Users className="w-5 h-5" />,
      path: "/user-management",
      subItems: [
        { name: "All Users", path: "/users" },
        { name: "Add New", path: "/users/add" },
        { name: "Roles", path: "/users/roles" },
      ],
    },
    {
      name: "Appointments",
      icon: <Calendar className="w-5 h-5" />,
      path: "/appointments",
    },
    {
      name: "Users Activities",
      icon: <FiActivity className="w-5 h-5" />,
      path: "/recent-activity",
    },
    {
      name: "Reports",
      icon: <FileText className="w-5 h-5" />,
      path: "/reports",
    },
    {
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/settings",
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getTokenData = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  if (stats.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-gray-500 mb-4">{stats.error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 
              transition-all duration-200 flex items-center gap-2 mx-auto shadow-md hover:shadow-lg"
          >
            <TrendingUp className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - No animation, always visible */}
      <div className="fixed lg:relative z-30 w-64 h-screen bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="text-xl font-semibold text-gray-800">
                PropEase
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-lg hover:bg-gray-100 hidden lg:block"
            >
              <MdMenu className="w-5 h-5 text-gray-500" />
            </button>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <MdClose className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>

            <nav className="px-2 space-y-1">
              {navItems.map((item) => (
                <div key={item.name}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`${
                          isActive(item.path)
                            ? "text-blue-500"
                            : "text-gray-500"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.subItems && (
                      <svg
                        className={`w-4 h-4 transform transition-transform ${
                          isActive(item.path) ? "rotate-90" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    )}
                  </button>

                  {item.subItems && isActive(item.path) && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.name}
                          onClick={() => {
                            navigate(subItem.path);
                            setMobileSidebarOpen(false);
                          }}
                          className={`w-full flex items-center p-2 rounded-lg transition-colors duration-200 ${
                            isActive(subItem.path)
                              ? "bg-blue-100 text-blue-600"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {subItem.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t">
            <div className="space-y-3">
              <button
                onClick={() => navigate("/help")}
                className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <HelpCircle className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Help & Support</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <FaSignOutAlt className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  WG
                </div>
                <div>
                  <p className="font-medium text-gray-900">Waqas Gul</p>
                  <p className="text-sm text-gray-500">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
              >
                <MdMenu className="w-6 h-6" />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  ></path>
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    AD
                  </div>
                  <span className="hidden md:inline-block font-medium">
                    Admin User
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto ">
          {/* Header */}
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">
                  Overview of your property management system
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select className="pl-10 pr-4 py-2 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>This year</option>
                  </select>
                </div>
                <button
                  onClick={fetchStats}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 
                    transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <TrendingUp className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Property Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {propertyCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(stat.link)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-lg ${stat.color} text-white shadow-md`}
                      >
                        {stat.icon}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          stat.trendDirection === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {stat.trendDirection === "up" ? "↑" : "↓"} {stat.trend}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-500">
                      {stat.title}
                    </h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        {stat.description}
                      </p>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* User Card - Separate Section */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {Cards.map((card, index) => (
                <motion.div
                  key={card.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(card.link)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-lg ${card.color} text-white shadow-md`}
                      >
                        {card.icon}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          card.trendDirection === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {card.trendDirection === "up" ? "↑" : "↓"} {card.trend}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-500">
                      {card.title}
                    </h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {card.value}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        {card.description}
                      </p>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts Section */}
            <div className=" lg:grid-cols-2 gap-6 mb-8 ">
              {/* Property Views Chart */}
              <div className="bg-white w-full rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <FaChartLine className="text-blue-500" />
                      Property Views
                    </h2>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg">
                        Week
                      </button>
                      <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg">
                        Month
                      </button>
                      <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg">
                        Year
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6 h-[350px]">
                  {stats.viewsData &&
                  Object.keys(stats.viewsData).length > 0 ? (
                    <Line data={stats.viewsData} options={lineChartOptions} />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500">No view data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            {/* Property Types Distribution - Enhanced UI */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <PieChart className="text-purple-600 w-5 h-5" />
                  <span>Property Types Distribution</span>
                  <span className="ml-auto bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {stats.propertyTypes?.length || 0} categories
                  </span>
                </h2>
              </div>

              <div className="p-6 h-[400px] flex flex-col">
                {stats.propertyTypes && stats.propertyTypes.length > 0 ? (
                  <>
                    {/* Main Chart Area */}

                    {/* Main Chart Area */}
                    <div className="flex-1 relative">
                      {/* Centered Total Count - Now perfectly aligned */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="relative text-center left-16">
                          <div className="text-3xl font-bold  text-gray-800">
                            {stats.propertyTypes
                              .reduce((sum, item) => sum + item.count, 0)
                              .toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Total Properties
                          </div>
                        </div>
                      </div>

                      <Pie
                        data={{
                          labels: stats.propertyTypes.map((item) => item.type),
                          datasets: [
                            {
                              data: stats.propertyTypes.map(
                                (item) => item.count
                              ),
                              backgroundColor: [
                                "#6C5CE7", // Vibrant purple
                                "#00B894", // Fresh green
                                "#0984E3", // Deep blue
                                "#FDCB6E", // Golden yellow
                                "#E17055", // Coral
                                "#A29BFE", // Soft purple
                                "#55EFC4", // Mint
                                "#FF7675", // Salmon
                              ],
                              borderWidth: 2,
                              borderColor: "#f8fafc", // Very light gray border
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          cutout: "68%", // Optimal donut size
                          plugins: {
                            legend: {
                              position: "right",
                              labels: {
                                usePointStyle: true,
                                pointStyle: "circle",
                                padding: 16,
                                font: {
                                  family: "Inter",
                                  size: 12,
                                  weight: "500",
                                },
                                generateLabels: (chart) => {
                                  const data = chart.data;
                                  if (
                                    data.labels.length &&
                                    data.datasets.length
                                  ) {
                                    return data.labels.map((label, i) => {
                                      const total =
                                        data.datasets[0].data.reduce(
                                          (a, b) => a + b,
                                          0
                                        );
                                      const value = data.datasets[0].data[i];
                                      const percentage = Math.round(
                                        (value / total) * 100
                                      );

                                      return {
                                        text: `${label}: ${value} (${percentage}%)`,
                                        fillStyle:
                                          data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        index: i,
                                        fontColor: "#4b5563", // Gray-600 for better readability
                                      };
                                    });
                                  }
                                  return [];
                                },
                              },
                            },
                            tooltip: {
                              displayColors: false,
                              backgroundColor: "#1e293b", // slate-800
                              titleColor: "#f8fafc", // slate-50
                              bodyColor: "#e2e8f0", // slate-200
                              bodyFont: {
                                weight: "500",
                              },
                              callbacks: {
                                label: (context) => {
                                  const total = context.dataset.data.reduce(
                                    (a, b) => a + b,
                                    0
                                  );
                                  const percentage = (
                                    (context.raw / total) *
                                    100
                                  ).toFixed(1);
                                  return `${context.label}: ${context.raw} properties (${percentage}%)`;
                                },
                              },
                            },
                          },
                        }}
                      />
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Detailed Breakdown
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stats.propertyTypes
                          .sort((a, b) => b.count - a.count)
                          .map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center p-3 bg-gray-50 rounded-lg"
                            >
                              <div
                                className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                                style={{
                                  backgroundColor: [
                                    "#8B5CF6",
                                    "#6366F1",
                                    "#3B82F6",
                                    "#10B981",
                                    "#F59E0B",
                                    "#EF4444",
                                    "#EC4899",
                                    "#14B8A6",
                                  ][index % 8],
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item.type}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Property type
                                </p>
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-sm font-bold text-gray-900">
                                  {item.count.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {Math.round(
                                    (item.count /
                                      stats.propertyTypes.reduce(
                                        (sum, i) => sum + i.count,
                                        0
                                      )) *
                                      100
                                  )}
                                  %
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <PieChart className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-gray-500 font-medium">
                      No property data available
                    </h3>
                    <p className="text-gray-400 text-sm mt-1 max-w-xs">
                      Property type distribution will appear here when data is
                      available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
