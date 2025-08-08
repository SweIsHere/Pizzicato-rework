import React from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import TopNavigation from "./TopNavigation"; 
import Sidebar from "./Sidebar"; 

function Home() {
  const location = useLocation();
  const songs = location.state?.songs || [];
  const { darkMode } = useTheme();

  return (
    <div className={`flex flex-col h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-white'
    }`}>
      <TopNavigation />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8 ml-28"> 
          <div className={`backdrop-blur-sm rounded-3xl p-8 border transition-all duration-300 ${
            darkMode 
              ? 'bg-gray-800/30 border-gray-700/50 shadow-2xl' 
              : 'bg-white/30 border-gray-200/50 shadow-xl'
          }`}>
            <div id="content" className="text-center">
              <h1 className={`text-5xl font-inria mb-6 transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Hitting Notes.</h1>
              <p className={`text-xl mb-8 transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Sync the beats.</p>

              {/* Mostrar las canciones */}
              <h2 className={`text-3xl font-inria mb-6 transition-colors duration-300 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>Song List</h2>
              
              <div className={`backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-900/40 border-gray-600/30' 
                  : 'bg-white/40 border-gray-300/30'
              }`}>
                <div className="song-list overflow-y-auto max-h-96">
                  {songs.length === 0 ? (
                    <p className={`text-lg transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Dreamed melody. Song not found.</p>
                  ) : (
                    <ul className="space-y-4">
                      {songs.map((song, index) => (
                        <li key={index} className={`song-item p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                          darkMode 
                            ? 'bg-gray-800/40 border-gray-700/30 hover:bg-gray-700/50 hover:border-gray-600/50' 
                            : 'bg-white/40 border-gray-200/30 hover:bg-white/60 hover:border-gray-300/50'
                        }`}>
                          <h3 className={`font-bold text-lg mb-2 transition-colors duration-300 ${
                            darkMode ? 'text-white' : 'text-gray-800'
                          }`}>{song.name}</h3>
                          <p className={`transition-colors duration-300 ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>{song.artist_id}</p>
                          <p className={`transition-colors duration-300 ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>Género: {song.genre}</p>
                          <p className={`transition-colors duration-300 ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>Duración: {song.data.duration} segundos</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Home;
