import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function LoadingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
    <div className="flex items-center justify-center min-h-screen bg-white">
      {/* Pantalla de carga */}
      {isLoading && (
        <div id="loading-screen" className="flex items-center justify-center flex-col text-center relative">
          <p className="text-lg text-gray-600 mb-6">Cargando...</p>
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-black mb-4"></div>
            <img
              src="http://media.proprofs.com/images/FC/user_images/misc/8565128792.gif"
              alt="Loading"
              className="h-12 w-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-7"
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