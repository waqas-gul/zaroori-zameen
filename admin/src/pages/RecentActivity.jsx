import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
import {
  Home,
  Activity,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  Loader,
  ChevronRight,
  DollarSign,
} from "lucide-react";
import { backendurl } from "../App";
import { FaStepBackward } from "react-icons/fa";

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

const RecentActivity = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    recentActivity: [],
    loading: true,
    error: null,
  });

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
    <div className="min-h-screen bg-gray-50 p-24 m">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            className="flex items-center justify-center gap-2 bg-indigo-600 py-2 mb-4 px-4 rounded-lg text-white hover:bg-indigo-700"
            onClick={() => navigate("/dashboard")}
          >
            <FaStepBackward />
            Go Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-500">
            Track all system activities and events
          </p>
        </div>

        {/* Activity Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Panel Header */}
          <div className="p-6 border-b  border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50">
            <div className="flex items-center justify-center ">
              <div className=" s flex flex-col items-center">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <Activity className="text-orange-500 w-6 h-6" />
                  Recent Activity
                </h2>
                <p className="text-sm text-red-900 mt-1 bg-orange-100 px-2 rounded-lg">
                  {stats.recentActivity.length} activities
                </p>
              </div>
            </div>
          </div>

          {/* Activity List */}
          <div className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
            {stats.recentActivity?.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="p-5  flex items-center justify-center hover:bg-gray-50/50 transition-colors duration-150 gap-4 cursor-pointer group"
                >
                  <div
                    className={`p-3 rounded-lg flex-shrink-0 ${
                      index % 3 === 0
                        ? "bg-blue-50 text-blue-600"
                        : index % 3 === 1
                        ? "bg-green-50 text-green-600"
                        : "bg-purple-50 text-purple-600"
                    }`}
                  >
                    {index % 3 === 0 ? (
                      <Users className="w-5 h-5" />
                    ) : index % 3 === 1 ? (
                      <Home className="w-5 h-5" />
                    ) : (
                      <DollarSign className="w-5 h-5" />
                    )}
                  </div>
                  <div className="w-full flex items-center justify-around min-w-0 ">
                    <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-1.5">
                      {new Date(activity.timestamp).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 mt-1 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Activity className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-500">
                  No activity yet
                </h3>
                <p className="text-gray-400 mt-1 max-w-md">
                  When activities occur, they'll appear here with detailed
                  information about what happened.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
