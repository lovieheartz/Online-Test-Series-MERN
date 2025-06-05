import React from 'react';

const Header = ({ user, toggleDropdown, isDropdownOpen, handleLogout, navigate }) => {
  const profileLetter = user?.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();

  return (
    <header className="bg-gray-900 text-gray-100 px-4 py-4 flex justify-between items-center relative z-10">
      {/* Header text with responsive sizing and truncation */}
      <div className="text-sm sm:text-base md:text-lg font-medium max-w-[50vw] sm:max-w-[60vw] truncate">
        Welcome, {user.name || user.email}
      </div>

      {/* Profile dropdown with fixed spacing */}
      <div className="relative z-20 flex-shrink-0 ml-2 sm:ml-4">
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer text-white text-lg sm:text-xl font-bold overflow-hidden"
          onClick={toggleDropdown}
        >
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>{profileLetter}</span>
          )}
        </div>

        {isDropdownOpen && (
          <div className="absolute top-12 sm:top-14 md:top-16 right-0 bg-white shadow-lg rounded-lg w-40 flex flex-col z-50">
            <button
              onClick={() => navigate('/profile')}
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

export default Header;