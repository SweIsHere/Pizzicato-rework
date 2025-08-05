import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import "./index.css";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const navigate = useNavigate();

  

  const handleSignInClick = () => {
    navigate("/signin");
  }  

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <div className="bg-white-100 flex items-center justify-center min-h-screen m-0 p-0 relative">
      {/* Pantalla de bienvenida */}
      {!isLoading && !isContentVisible && (
        <div id="welcome-screen" className="flex items-center justify-center flex-col text-center">
          <h1 className="text-9xl font-jacquard24 text-gray-800 mb-4">Pizzicato</h1>
          <p className="text-3xl font-inria text-gray-600 mb-6 italic">Dive into Your Music Collection</p>
          <button
            id="sign-in-button"
            className="px-11 py-2 text-20 font-inria  mt-10 text-black bg-white border border-black rounded-full hover:bg-gray-200 transition duration-300 mb-4"
            onClick={handleSignInClick}
          >
            Sign In
          </button>
          <p className="text-lg font-inria text-gray-600 mb-2 mt-10">Don't have an account?</p>
          <button
            id="sign-up-button"
            className="px-6 py-2 text-white font-inria bg-black rounded-full hover:bg-gray-800 transition duration-300 mb-4"
            onClick={handleSignUpClick}
          >
            Sign Up
          </button>
        </div>
      )}

      
    </div>
  );
}

export default App;