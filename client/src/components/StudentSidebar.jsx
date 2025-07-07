import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [testDropdownOpen, setTestDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleTestDropdown = () => setTestDropdownOpen(!testDropdownOpen);

  const handleDashboardClick = () => {
    navigate("/student-dashboard");
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Icon */}
      <div
        className="fixed top-3 left-3 z-[105] w-8 h-6 flex flex-col justify-between cursor-pointer md:hidden"
        onClick={toggleSidebar}
      >
        <div
          className={`h-1 rounded bg-blue-900 transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-[10px]" : ""
          }`}
        ></div>
        <div
          className={`h-1 rounded bg-blue-900 transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        ></div>
        <div
          className={`h-1 rounded bg-blue-900 transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-[10px]" : ""
          }`}
        ></div>
      </div>

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full w-full bg-gray-900 text-white px-4 py-6 z-[110] transform transition-all duration-300
        ${isOpen ? "translate-y-0" : "-translate-y-full"} 
        md:relative md:translate-y-0 md:translate-x-0 md:h-auto md:w-[220px] md:min-h-screen`}
      >
        {/* Close Button */}
        <div className="absolute top-3 right-3 md:hidden">
          <button 
            onClick={toggleSidebar}
            className="text-white hover:text-gray-300 focus:outline-none"
          >
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
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="w-full mt-8 md:mt-0">
          {/* Title */}
          <h4 className="text-base font-medium mb-4 text-left leading-snug whitespace-nowrap">
            Student Dashboard
          </h4>

          {/* Menu Items */}
          <ul className="flex flex-col items-start space-y-5 text-lg font-semibold">
            {/* Dashboard Button */}
            <li className="w-full">
              <button
                onClick={handleDashboardClick}
                className="w-full px-2 py-2 text-left hover:bg-gray-800 rounded transition"
              >
                Dashboard
              </button>
            </li>

            {/* Tests Dropdown */}
            <li className="w-full">
              <div
                className="flex justify-between items-center cursor-pointer px-2 py-2 w-full hover:bg-gray-800 rounded transition"
                onClick={toggleTestDropdown}
              >
                <span>Tests</span>
                <svg
                  className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                    testDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {testDropdownOpen && (
                <div className="mt-2 pl-2 flex flex-col items-center space-y-2">
                  <button 
                    className="w-40 px-3 py-2 text-sm text-white bg-gray-700 rounded-md hover:bg-blue-600 transition"
                  >
                    Enrolled Tests
                  </button>
                  <button 
                    className="w-40 px-3 py-2 text-sm text-white bg-gray-700 rounded-md hover:bg-blue-600 transition"
                  >
                    Check Scores
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 z-[100] md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
