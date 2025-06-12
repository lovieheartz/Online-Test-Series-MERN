import React, { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

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

      {/* Sidebar - Now full-screen in mobile view */}
      <nav
        className={`fixed top-0 left-0 h-full w-full bg-gray-900 text-white px-4 py-6 z-[110] transform transition-all duration-300
        ${isOpen ? "translate-y-0" : "-translate-y-full"} 
        md:relative md:translate-y-0 md:translate-x-0 md:h-auto md:w-[220px] md:min-h-screen`}
      >
        {/* Close Button - Only visible in mobile view */}
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
          <ul className="flex flex-col items-end space-y-5 text-lg font-semibold pr-4">
            <li className="hover:underline cursor-pointer px-4 py-2 whitespace-nowrap">
              Enrolled Tests
            </li>
            <li className="hover:underline cursor-pointer px-4 py-2 whitespace-nowrap">
              Check Scores
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