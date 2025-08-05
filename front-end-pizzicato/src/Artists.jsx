import React, { useState, useEffect } from "react";
import TopNavigation from "./TopNavigation"; 
import Sidebar from "./Sidebar"; 

function Artists() {
  const [artists, setArtists] = useState([]);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchArtistsByName = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Sending request to fetch artists by name:", name);  // Log for name search
      const response = await fetch(import.meta.env.VITE_API_BYARTIST_NAME, {
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
      const response = await fetch(import.meta.env.VITE_API_BYARTIST_COUNTRY, {
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
    <div className="flex flex-col h-screen">
      <TopNavigation />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8 ml-64">
          <div id="content" className="text-center">
            <h1 className="text-4xl font-inria text-gray-800 mb-4">Artists Page</h1>
            
            {/* Filtro por nombre */}
            <div className="mb-8 flex font-inria justify-center space-x-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter artist name"
                className="px-4 py-2 font-inria  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 w-64"
              />
              <button
                onClick={fetchArtistsByName}
                className="px-4 py-2 font-inria bg-black text-white rounded-md hover:bg-gray-800 transition duration-300"
              >
                Filter by Name
              </button>
            </div>

            {/* Filtro por país */}
            <div className="mb-8 flex font-inria  justify-center space-x-4">
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter country"
                className="px-4 py-2 border font-inria  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 w-64"
              />
              <button
                onClick={fetchArtistsByCountry}
                className="px-4 py-2 bg-black text-white  font-inria rounded-md hover:bg-gray-800 transition duration-300"
              >
                Filter by Country
              </button>
            </div>

            {/* Muestra los mensajes de error o carga */}
            {isLoading ? (
              <p className="text-lg font-inria  text-gray-600 mb-6">Loading...</p>
            ) : error ? (
              <p className="text-lg font-inria text-red-600 mb-6">{error}</p>
            ) : (
              <div className="overflow-y-auto max-h-96"> {/* Limita la altura y habilita el scroll */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {artists.map((artist) => (
                    <div
                      key={artist.artist_id}
                      className="bg-white border border-gray-300 rounded-xl p-4 shadow-lg hover:shadow-xl transition duration-300"
                    >
                      <h2 className="text-xl font-inria  text-gray-800">{artist.name}</h2>
                      <p className=" font-inria text-gray-600">Country: {artist.country}</p>
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
  );
}

export default Artists;
