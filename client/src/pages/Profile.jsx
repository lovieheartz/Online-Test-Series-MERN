import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("authToken");
  const role = JSON.parse(sessionStorage.getItem("user"))?.role;

  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Determine endpoints dynamically
  let endpoint = "";
  switch (role) {
    case "admin":
      endpoint = "/admin/profile";
      break;
    case "faculty":
      endpoint = "/faculty/profile";
      break;
    case "student":
      endpoint = "/student/profile";
      break;
    default:
      endpoint = null;
  }

  const profileEndpoint = endpoint ? `http://localhost:3001${endpoint}` : null;
  const avatarEndpoint = profileEndpoint?.replace("/profile", "/upload-avatar");

  const {
    data: profileData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profile", role],
    queryFn: async () => {
      if (!profileEndpoint) throw new Error("Unknown user role.");
      const res = await axios.get(profileEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    },
    enabled: !!token && !!endpoint,
  });

  const { register, reset, handleSubmit } = useForm();

  useEffect(() => {
    if (profileData) {
      reset(profileData);
    }
  }, [profileData, reset]);

  const onSubmit = async (data) => {
    if (!profileEndpoint) {
      alert("Unknown user role.");
      return;
    }
    try {
      setUpdateLoading(true);
      await axios.put(profileEndpoint, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
      setIsEditing(false);
      refetch();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !avatarEndpoint) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploadingAvatar(true);
      await axios.post(avatarEndpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Avatar uploaded successfully!");
      refetch();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to upload avatar. Please try again."
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-5">
        <h2 className="text-2xl text-red-600 mb-4">Error: {error.message}</h2>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">No profile data found.</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="main">
        <div className="content-container px-3 py-4 w-full mx-auto max-w-full">
          <div className="bg-white rounded-xl shadow-sm px-6 py-6 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300">
                  <img
                    src={
                      profileData.avatar
                        ? `http://localhost:3001${profileData.avatar}`
                        : "https://via.placeholder.com/150"
                    }
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-xl font-semibold text-gray-800">
                  My Profile
                </h1>
              </div>
              {!isEditing ? (
                <button
                  className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => setIsEditing(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"
                    />
                  </svg>
                  Edit
                </button>
              ) : (
                <button
                  className="px-3 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  onClick={() => {
                    reset(profileData);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Upload avatar */}
            <div className="flex justify-center mb-6">
              <label
                htmlFor="avatarUpload"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-sm"
              >
                {uploadingAvatar ? "Uploading..." : "Upload Avatar"}
              </label>
              <input
                type="file"
                id="avatarUpload"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </div>

            {/* Form */}
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  {...register("name")}
                  disabled={!isEditing}
                  className={`w-full border px-3 py-2 rounded ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  {...register("email")}
                  disabled={!isEditing}
                  className={`w-full border px-3 py-2 rounded ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>
              {profileData?.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    {...register("phone")}
                    disabled={!isEditing}
                    className={`w-full border px-3 py-2 rounded ${
                      isEditing ? "bg-white" : "bg-gray-100"
                    }`}
                  />
                </div>
              )}
              {profileData?.specialization && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Specialization
                  </label>
                  <input
                    {...register("specialization")}
                    disabled={!isEditing}
                    className={`w-full border px-3 py-2 rounded ${
                      isEditing ? "bg-white" : "bg-gray-100"
                    }`}
                  />
                </div>
              )}
              {profileData?.role && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <input
                    disabled
                    className="w-full border px-3 py-2 rounded bg-gray-100"
                    value={profileData.role}
                  />
                </div>
              )}
              {profileData?.createdAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Created At
                  </label>
                  <input
                    disabled
                    className="w-full border px-3 py-2 rounded bg-gray-100"
                    value={new Date(profileData.createdAt).toLocaleString()}
                  />
                </div>
              )}
              {isEditing && (
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {updateLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
