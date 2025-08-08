import React, { useState, useEffect } from "react";
import TopNavigation from "./TopNavigation"; 
import Sidebar from "./Sidebar";
import { useTheme } from "./context/ThemeContext";
import { API_ENDPOINTS } from "./config/api"; 

function Artists() {
  const [artists, setArtists] = useState([]);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();

  const fetchArtistsByName = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Sending request to fetch artists by name:", name);  // Log for name search
      const response = await fetch(API_ENDPOINTS.artists.byName(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response from fetchArtistsByName:", data);  // Log the response
        if (data.statusCode === 200) {
          setArtists(data.body.artists);
        } else {
          setError(data.body);
        }
      } else {
        setError(`Error fetching artists by name: ${response.status}`);
      }
    } catch (error) {
      setError("Error fetching artists: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArtistsByCountry = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Sending request to fetch artists by country:", country);  // Log for country search
      const response = await fetch(API_ENDPOINTS.artists.byCountry(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ country })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response from fetchArtistsByCountry:", data);  // Log the response
        if (data.statusCode === 200) {
          // Verificamos si la propiedad 'users' existe en la respuesta
          if (data.users && data.users.length > 0) {
            setArtists(data.users);
          } else {
            setError("No users found for this country.");
          }
        } else {
          setError(data.message || "No se encontraron artistas.");
        }
      } else {
        setError(`Error fetching artists by country: ${response.status}`);
      }
    } catch (error) {
      setError("Error fetching artists by country: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      <TopNavigation />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8 ml-28">
          <div
            className={`backdrop-blur-sm rounded-3xl p-8 border transition-all duration-300 h-full ${
              darkMode
                ? "bg-gray-800/30 border-gray-700/50 shadow-2xl"
                : "bg-white/40 border-gray-200/50 shadow-xl"
            }`}
          >
            <div id="content" className="text-center">
              <h1
                className={`text-4xl font-inria mb-6 transition-colors duration-300 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Artists
              </h1>
            
            {/* Filtro por nombre */}
            <div className="mb-8 flex font-inria justify-center space-x-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter artist name"
                className={`px-4 py-2 font-inria rounded-md focus:outline-none focus:ring-2 w-64 transition-colors duration-300 ${
                  darkMode
                    ? "bg-gray-900/60 text-white placeholder-gray-400 border border-gray-700 focus:ring-gray-500"
                    : "bg-white/70 text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-gray-500"
                }`}
              />
              <button
                onClick={fetchArtistsByName}
                className="px-4 py-2 font-inria bg-black text-white rounded-full hover:bg-gray-800 transition duration-300"
              >
                Filter by Name
              </button>
            </div>

            {/* Filtro por país */}
            <div className="mb-8 flex font-inria justify-center space-x-4">
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter country"
                className={`px-4 py-2 font-inria rounded-md focus:outline-none focus:ring-2 w-64 transition-colors duration-300 ${
                  darkMode
                    ? "bg-gray-900/60 text-white placeholder-gray-400 border border-gray-700 focus:ring-gray-500"
                    : "bg-white/70 text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-gray-500"
                }`}
              />
              <button
                onClick={fetchArtistsByCountry}
                className="px-4 py-2 bg-black text-white font-inria rounded-full hover:bg-gray-800 transition duration-300"
              >
                Filter by Country
              </button>
            </div>

            {/* Muestra los mensajes de error o carga */}
            {isLoading ? (
              <p
                className={`text-lg font-inria mb-6 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Loading...
              </p>
            ) : error ? (
              <p className="text-lg font-inria text-red-500 mb-6">{error}</p>
            ) : (
              <div className="overflow-y-auto max-h-96">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {artists.map((artist) => (
                    <div
                      key={artist.artist_id}
                      className={`rounded-xl p-4 shadow-lg hover:shadow-xl transition duration-300 border ${
                        darkMode
                          ? "bg-gray-800/50 border-gray-700/50 text-white"
                          : "bg-white/70 border-gray-200/60 text-gray-800"
                      }`}
                    >
                      <h2 className="text-xl font-inria">{artist.name}</h2>
                      <p className={`font-inria ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Country: {artist.country}
                      </p>
                      <img src={artist.photo} alt={artist.name} className="w-32 h-32 rounded-full mx-auto mt-4" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Artists;
