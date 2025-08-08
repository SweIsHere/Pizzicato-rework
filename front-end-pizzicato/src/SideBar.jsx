import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";

function Sidebar() {
  const { darkMode } = useTheme();

  return (
    <nav className={`fixed top-0 left-0 h-screen w-28 flex flex-col justify-between p-4 backdrop-blur-lg border-r transition-all duration-300 z-50 ${
      darkMode 
        ? 'bg-gray-900/70 border-gray-700/50 shadow-2xl' 
        : 'bg-white/70 border-gray-400/50 shadow-xl'
    }`}>
      <div className="flex flex-col space-y-6">
        <Link to="/account" className="group flex flex-col items-center">
          <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm border ${
            darkMode 
              ? 'group-hover:bg-gray-700/40 border-gray-600/30 group-hover:border-gray-500/50 group-hover:shadow-lg' 
              : 'group-hover:bg-gray-200/40 border-gray-300/30 group-hover:border-gray-400/50 group-hover:shadow-md'
          }`}>
            <img
              src="src/assets/icons/FClef 2.png"
              alt="Account"
              className="h-10 w-10 transition-transform group-hover:scale-110 filter transition dark:invert dark:brightness-200 dark:contrast-125"
            />
          </div>
          <span className={`text-xs font-medium mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Account</span>
        </Link>
        
        <div className="flex flex-col space-y-4">
          <Link to="/home" className="group flex flex-col items-center">
            <div className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm border ${
              darkMode 
                ? 'group-hover:bg-gray-700/40 border-gray-600/30 group-hover:border-gray-500/50 group-hover:shadow-lg' 
                : 'group-hover:bg-gray-200/40 border-gray-300/30 group-hover:border-gray-400/50 group-hover:shadow-md'
            }`}>
              <img
                src="src/assets/icons/home.png"
                alt="Home"
                className="h-6 w-6 transition-transform group-hover:scale-110 filter transition dark:invert dark:brightness-200 dark:contrast-125"
              />
            </div>
            <span className={`text-xs font-medium mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Home</span>
          </Link>
          
          <Link to="/artists" className="group flex flex-col items-center">
            <div className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm border ${
              darkMode 
                ? 'group-hover:bg-gray-700/40 border-gray-600/30 group-hover:border-gray-500/50 group-hover:shadow-lg' 
                : 'group-hover:bg-gray-200/40 border-gray-300/30 group-hover:border-gray-400/50 group-hover:shadow-md'
            }`}>
              <img
                src="src/assets/icons/artist.png"
                alt="Artists"
                className="h-6 w-6 transition-transform group-hover:scale-110 filter transition dark:invert dark:brightness-200 dark:contrast-125"
              />
            </div>
            <span className={`text-xs font-medium mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Artists</span>
          </Link>
          
          <Link to="/songs" className="group flex flex-col items-center">
            <div className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm border ${
              darkMode 
                ? 'group-hover:bg-gray-700/40 border-gray-600/30 group-hover:border-gray-500/50 group-hover:shadow-lg' 
                : 'group-hover:bg-gray-200/40 border-gray-300/30 group-hover:border-gray-400/50 group-hover:shadow-md'
            }`}>
              <img
                src="src/assets/icons/Music.png"
                alt="Songs"
                className="h-5 w-5 transition-transform group-hover:scale-110 filter transition dark:invert dark:brightness-200 dark:contrast-125"
              />
            </div>
            <span className={`text-xs font-medium mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Songs</span>
          </Link>
          
          <Link to="/albums" className="group flex flex-col items-center">
            <div className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm border ${
              darkMode 
                ? 'group-hover:bg-gray-700/40 border-gray-600/30 group-hover:border-gray-500/50 group-hover:shadow-lg' 
                : 'group-hover:bg-gray-200/40 border-gray-300/30 group-hover:border-gray-400/50 group-hover:shadow-md'
            }`}>
              <img
                src="src/assets/icons/Music Square.png"
                alt="Albums"
                className="h-6 w-6 transition-transform group-hover:scale-110 filter transition dark:invert dark:brightness-200 dark:contrast-125"
              />
            </div>
            <span className={`text-xs font-medium mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Albums</span>
          </Link>
          
          <Link to="/podcast" className="group flex flex-col items-center">
            <div className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm border ${
              darkMode 
                ? 'group-hover:bg-gray-700/40 border-gray-600/30 group-hover:border-gray-500/50 group-hover:shadow-lg' 
                : 'group-hover:bg-gray-200/40 border-gray-300/30 group-hover:border-gray-400/50 group-hover:shadow-md'
            }`}>
              <img
                src="src/assets/icons/podcast.png"
                alt="Podcasts"
                className="h-5 w-5 transition-transform group-hover:scale-110 filter transition dark:invert dark:brightness-200 dark:contrast-125"
              />
            </div>
            <span className={`text-xs font-medium mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Podcasts</span>
          </Link>
          
          <Link to="/favorites" className="group flex flex-col items-center">
            <div className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm border ${
              darkMode 
                ? 'group-hover:bg-gray-700/40 border-gray-600/30 group-hover:border-gray-500/50 group-hover:shadow-lg' 
                : 'group-hover:bg-gray-200/40 border-gray-300/30 group-hover:border-gray-400/50 group-hover:shadow-md'
            }`}>
              <img
                src="src/assets/icons/favorites.png"
                alt="Favorites"
                className="h-5 w-5 transition-transform group-hover:scale-110 filter transition dark:invert dark:brightness-200 dark:contrast-125"
              />
            </div>
            <span className={`text-xs font-medium mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Favorites</span>
          </Link>
        </div>
      </div>
      
      <div className="text-center">
        <p className={`text-xs font-medium transition-colors duration-300 ${
          darkMode ? 'text-gray-400/80' : 'text-gray-600/80'
        }`}>© Pizzicato</p>
      </div>
    </nav>
  );
}

export default Sidebar;