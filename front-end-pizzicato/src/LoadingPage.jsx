import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";

function LoadingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    const loadingSound = document.getElementById("loading-sound");
    loadingSound.play().then(() => {
      console.log("Sonido reproducido correctamente.");
    }).catch((err) => {
      console.error("Error al reproducir el sonido:", err);
    });

    setTimeout(() => {
      setIsLoading(false);
      navigate("/landingPage");
    }, 3000);
  }, []);

  return (
    <div className={`flex items-center justify-center min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-white via-gray-50 to-gray-100'
    }`}>
      {/* Pantalla de carga */}
      {isLoading && (
        <div className={`flex items-center justify-center flex-col text-center relative backdrop-blur-lg rounded-3xl p-12 border transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-800/30 border-gray-700/50 shadow-2xl' 
            : 'bg-white/30 border-gray-200/50 shadow-xl'
        }`}>
          <p className={`text-xl mb-8 font-inria italic transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Cargando...</p>
          
          <div className="relative">
            <div className={`animate-spin rounded-full h-32 w-32 border-t-4 mb-4 transition-colors duration-300 ${
              darkMode ? 'border-gray-300' : 'border-black'
            }`}></div>
            <img
              src="http://media.proprofs.com/images/FC/user_images/misc/8565128792.gif"
              alt="Loading"
              className="h-12 w-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-7 rounded-full filter transition dark:invert dark:brightness-200 dark:contrast-125"
            />
          </div>
        </div>
      )}

      {/* Audio */}
      <audio id="loading-sound" src="/src/assets/piano/pianofront1.mp3"></audio>
    </div>
  );
}


export default LoadingPage;