import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { backendurl } from "../App";
import { MdDelete } from "react-icons/md";
import { FaEdit, FaStepBackward } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = `${backendurl}/api/users`;
  const navigate = useNavigate();
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/all`);
      setUsers(response.data.data.users);
    } catch (error) {
      showErrorAlert(
        "Failed to fetch users",
        error.response?.data?.message || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", editingUser.name);
      formData.append("email", editingUser.email);
      formData.append("role", editingUser.role);
      formData.append("phone", editingUser.phone || "");
      formData.append("bio", editingUser.bio || "");
      formData.append("isActive", editingUser.isActive);

      if (editingUser.photo instanceof File) {
        formData.append("avatar", editingUser.photo);
      }

      const { data } = await axios.put(
        `${API_URL}/${editingUser._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the users list with the returned user data
      setUsers(
        users.map((user) =>
          user._id === editingUser._id
            ? {
                ...data.user, // Use the user object from response
                avatar: data.user.avatar || data.avatarUrl || user.avatar, // Fallback chain
              }
            : user
        )
      );

      showSuccessAlert("User updated successfully!");
      setEditingUser(null);
    } catch (error) {
      showErrorAlert(
        "Update failed",
        error.response?.data?.message || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const setUserForEdit = (user) => {
    setEditingUser({
      _id: user._id,
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
      phone: user.phone || "",
      bio: user.bio || "",
      isActive: user.isActive || false,
      avatar: user.avatar || "", // This is the existing avatar path
      photo: null, // This will be used for new file uploads
      avatarPreview: user.avatar || "", // This can be either the path or data URL
    });
  };

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${userId}`);
        setUsers(users.filter((user) => user._id !== userId));
        showSuccessAlert("User deleted successfully!");
      } catch (error) {
        showErrorAlert(
          "Delete failed",
          error.response?.data?.message || error.message
        );
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showErrorAlert("File too large", "File size must be less than 2MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        showErrorAlert(
          "Invalid file type",
          "Please upload an image file (JPG, PNG, GIF)"
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingUser({
          ...editingUser,
          photo: file,
          avatarPreview: event.target.result, // This will be a data URL
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: message,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({
      icon: "error",
      title,
      text,
    });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <button
        className="flex items-center justify-center gap-2 my-4 bg-indigo-600 py-2 px-4 rounded-lg text-white hover:bg-indigo-700"
        onClick={() => navigate("/dashboard")}
      >
        <FaStepBackward />
        Go Back
      </button>
      <h1 className="text-3xl font-bold mb-8">User Management</h1>

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleUpdate}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editingUser.phone}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Role</label>
                    <select
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, role: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="user">User</option>
                      <option value="seller">Seller</option>
                      <option value="buyer">Buyer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={editingUser.bio}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, bio: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={editingUser.isActive}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          isActive: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <label htmlFor="isActive" className="text-gray-700">
                      Active User
                    </label>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Profile Photo
                    </label>
                    <div className="flex items-center">
                      {editingUser.avatarPreview ? (
                        <img
                          src={
                            editingUser.avatarPreview.startsWith("data:image")
                              ? editingUser.avatarPreview
                              : `${backendurl}${editingUser.avatarPreview}`
                          }
                          alt="Profile"
                          className="w-12 h-12 rounded-full mr-4 object-cover"
                        />
                      ) : editingUser.avatar ? (
                        <img
                          src={`${backendurl}/${editingUser.avatar}`}
                          alt="Profile"
                          className="w-12 h-12 rounded-full mr-4 object-cover"
                        />
                      ) : null}
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full"
                        accept="image/*"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading && users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Photo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.avatar ? (
                        <img
                          src={
                            user.avatar.startsWith("http")
                              ? user.avatar
                              : `${backendurl}${user.avatar}` // Removed extra slash here
                          }
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">
                            No photo
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {user.bio
                          ? user.bio.split(" ").slice(0, 76).join(" ") +
                            (user.bio.split(" ").length > 7 ? "..." : "")
                          : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.phone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setUserForEdit(user)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FaEdit className="text-2xl" />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <MdDelete className="text-2xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
