import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Backendurl } from "../App";

const ProfileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${Backendurl}/api/users/profile/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = response.data.user || response.data;

        if (!userData) {
          throw new Error("User data not found in response");
        }

        setUser({
          _id: userData._id,
          name: userData.name || "Unknown User",
          email: userData.email || "No email provided",
          phone: userData.phone || "Not provided",
          role: userData.role || "user", // Added role field
          avatar: userData.avatar || "/user-profile.png",
          bio: userData.bio || "No bio provided.",
          joinDate:
            userData.joinDate ||
            (userData.createdAt
              ? new Date(userData.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Member since unknown date"),
        });
      } catch (err) {
        console.error("Full error object:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch user data"
        );

        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, navigate]);

  const handleEditProfile = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${Backendurl}/api/users/profile/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser({
        ...user,
        ...response.data.user,
        avatar: response.data.user.avatar || user.avatar,
      });
      return { success: true };
    } catch (err) {
      console.error("Error updating profile:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Failed to update profile",
      };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Try again
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                >
                  Go back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            User not found
          </h3>
          <p className="mt-1 text-gray-500">
            The requested user profile could not be found.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        {/* Profile Header */}
        <div className="px-6 pb-6 -mt-16 ">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end">
              <img
                src={
                  user.avatar
                    ? user.avatar.startsWith("http")
                      ? user.avatar // Full external URL
                      : `${Backendurl}${user.avatar}` // From backend uploads
                    : "/default-avatar.jpg" // From public folder
                }
                alt={user.name || "User Avatar"}
                className="h-24 w-24 rounded-full border-4 border-white object-cover"
              />

              <div className="ml-8 mb-2 ">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-gray-300">{user.joinDate}</p>
                {user.role && (
                  <span className="inline-flex items-center px-2.5 py-0.5 relative top-3 rounded-lg text-xl font-normal bg-blue-100 text-blue-800 capitalize">
                    {user.role}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="px-6 py-4 border-t border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
          <p className="text-gray-600 mb-6">{user.bio}</p>

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-1/3 text-gray-500">Email</div>
              <div className="w-2/3 font-medium">{user.email}</div>
            </div>
            {user.phone && (
              <div className="flex items-center">
                <div className="w-1/3 text-gray-500">Phone</div>
                <div className="w-2/3 font-medium">{user.phone}</div>
              </div>
            )}
            <div className="flex items-center">
              <div className="w-1/3 text-gray-500">Role</div>
              <div className="w-2/3 font-medium capitalize">{user.role}</div>
            </div>
            <div className="flex items-center">
              <div className="w-1/3 text-gray-500">Member Since</div>
              <div className="w-2/3 font-medium">{user.joinDate}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-100 flex justify-end space-x-3">
          <button
            className="px-4 py-2 w-full bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
            onClick={() =>
              navigate(`/profile/${id}/edit`, {
                state: { user }, // Only pass serializable data
              })
            }
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
