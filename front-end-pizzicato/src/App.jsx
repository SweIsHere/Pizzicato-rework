import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import "./App.css";
import "./index.css";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleSignInClick = () => {
    navigate("/signin");
  }  

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <div className={`flex items-center justify-center min-h-screen w-screen overflow-x-hidden m-0 p-0 relative transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900' 
        : 'bg-gradient-to-br from-gray-100 via-slate-50 to-zinc-100'
    }`}>
      {/* Animated pixel-art waves background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`${darkMode ? 'waves-dark' : 'waves-light'} waves`}>
          <span className="wave" style={{ '--size': '220px' }} />
          <span className="wave" style={{ '--size': '320px' }} />
          <span className="wave" style={{ '--size': '420px' }} />
          <span className="wave" style={{ '--size': '520px' }} />
          <span className="wave" style={{ '--size': '640px' }} />
          <span className="wave" style={{ '--size': '780px' }} />
        </div>
      </div>

      {/* Pantalla de bienvenida */}
      {!isLoading && !isContentVisible && (
        <div className={`relative z-10 backdrop-blur-lg rounded-3xl p-12 border transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-800/30 border-gray-700/50 shadow-2xl' 
            : 'bg-white/30 border-gray-200/50 shadow-xl'
        }`}>
          <div id="welcome-screen" className="flex items-center justify-center flex-col text-center">
            <h1 className={`text-9xl font-jacquard24 mb-4 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>Pizzicato</h1>
            <p className={`text-3xl font-inria italic mb-6 transition-colors duration-300 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Dive into Your Music Collection</p>
            
            <button
              id="sign-in-button"
              className="px-11 py-2 text-20 font-inria mt-10 text-black bg-white/90 border border-black rounded-full hover:bg-gray-200/90 transition-all duration-300 mb-4 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105"
              onClick={handleSignInClick}
            >
              Sign In
            </button>
            
            <p className={`text-lg font-inria mb-2 mt-10 transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Don't have an account?</p>
            
            <button
              id="sign-up-button"
              className="px-6 py-2 text-white font-inria bg-black/90 rounded-full hover:bg-gray-800/90 transition-all duration-300 mb-4 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105"
              onClick={handleSignUpClick}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      
    </div>
  );
}

export default App;