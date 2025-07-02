import React from 'react';

const Header = ({ user, toggleDropdown, isDropdownOpen, handleLogout, navigate }) => {
  const safeUser = user || {};

  const profileLetter =
    safeUser.name && safeUser.name.length > 0
      ? safeUser.name.charAt(0).toUpperCase()
      : safeUser.email && safeUser.email.length > 0
      ? safeUser.email.charAt(0).toUpperCase()
      : '?';

  return (
    <header className="bg-gray-900 text-gray-100 px-10 py-4 flex justify-between items-center relative z-10">
      <div className="text-lg md:text-xl font-medium">
        Welcome, {safeUser.name || safeUser.email || 'Student'}
      </div>

      <div className="relative z-20">
        <div
          className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer text-white text-xl font-bold overflow-hidden"
          onClick={toggleDropdown}
        >
          {safeUser.avatar ? (
            <img
              src={`http://localhost:3001${safeUser.avatar}`}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>{profileLetter}</span>
          )}
        </div>

        {isDropdownOpen && (
          <div className="absolute top-16 right-0 bg-white shadow-lg rounded-lg w-40 flex flex-col z-50">
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
