import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useTheme } from "./context/ThemeContext";
import Sidebar from "./Sidebar"; 
import TopNavigation from "./TopNavigation"; 

function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();

  useEffect(() => {
    const handlePopState = () => {
      if (location.pathname === "/landingPage") {
        navigate("/");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location, navigate]);

  const [data, setData] = useState(null);

  useEffect(() => {
    
    axios.get("https://api.example.com/data")
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className={`flex flex-col h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-white'
    }`}>
      <TopNavigation />
      <div className="flex flex-1">
        <Sidebar />

        {/* Contenido principal */}
        <div className="flex-1 p-8 ml-28">
          <div className={`backdrop-blur-sm rounded-3xl p-12 border transition-all duration-300 h-full flex items-center justify-center ${
            darkMode 
              ? 'bg-gray-800/30 border-gray-700/50 shadow-2xl' 
              : 'bg-white/30 border-gray-200/50 shadow-xl'
          }`}>
            <div id="content" className="text-center">
              <h1 className={`text-6xl font-inria mb-6 transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>In Tune</h1>
              <p className={`text-2xl font-inria italic transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>with you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default LandingPage;