import React from "react";
import TopNavigation from "./TopNavigation"; 
import Sidebar from "./Sidebar"; 
import { useTheme } from "./context/ThemeContext";

function Account() {
  const { darkMode } = useTheme();
  return (
    <div
      className={`flex font-inria italic flex-col min-h-screen transition-colors duration-300 ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}
    >
      <TopNavigation />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8 ml-28">
          <div
            className={`backdrop-blur-sm rounded-3xl p-12 border transition-all duration-300 h-full flex items-center justify-center ${
              darkMode 
                ? 'bg-gray-800/30 border-gray-700/50 shadow-2xl' 
                : 'bg-white/40 border-gray-200/50 shadow-xl'
            }`}
          >
            <div id="content" className="text-center">
              <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Account Page</h1>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg mb-6`}>Changing your chords</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;