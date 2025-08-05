import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar"; 
import TopNavigation from "./TopNavigation"; 

function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="flex flex-col h-screen">
      <TopNavigation />
      <div className="flex flex-1">
        <Sidebar />

        {/* Contenido principal */}
        <div className="flex-1 p-8 ml-64">
         
          <div id="content" className="text-center">
            <h1 className="text-4xl font-inria text-gray-800 mb-4">In Tune</h1>
            <p className="text-lg font-inria text-gray-600 mb-6">with you.</p>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;