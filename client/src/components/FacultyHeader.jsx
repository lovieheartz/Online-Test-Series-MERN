import React from "react";

const FacultyHeader = ({
  user,
  toggleDropdown,
  isDropdownOpen,
  handleLogout,
  navigate,
}) => {
  // Defensive fallback
  const safeUser = user || {};

  // Compute profile letter safely
  const profileLetter =
    safeUser.name?.charAt(0)?.toUpperCase() ||
    safeUser.email?.charAt(0)?.toUpperCase() ||
    "?";

  // Determine which field holds the image
  const rawImage = safeUser.profilePicture || safeUser.avatar || null;

  // Log to help debug
  console.log("✅ FacultyHeader image field:", rawImage);

  // Compute image URL safely
  const profileImageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `http://localhost:3001${rawImage}`
    : null;

  return (
    <header className="bg-gray-900 text-gray-100 px-6 py-4 flex justify-between items-center relative z-10">
      <div className="text-lg md:text-xl font-medium truncate max-w-[70vw]">
        Welcome, {safeUser.name || safeUser.email || "User"}
      </div>

      <div className="relative z-20">
        <div
          className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer text-white text-xl font-bold overflow-hidden border border-white"
          onClick={toggleDropdown}
        >
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
          ) : (
            <span>{profileLetter}</span>
          )}
        </div>

        {isDropdownOpen && (
          <div className="absolute top-14 right-0 bg-white shadow-lg rounded-lg w-40 flex flex-col z-50">
            <button
              onClick={() => navigate("/profile")}
              className="px-4 py-3 text-left text-sm text-gray-800 hover:bg-gray-100"
            >
              Profile View
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-3 text-left text-sm text-gray-800 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default FacultyHeader;
