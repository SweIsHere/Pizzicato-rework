import React, { useState, useEffect } from "react";
import TopNavigation from "./TopNavigation";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useTheme } from "./context/ThemeContext";
import { API_ENDPOINTS } from "./config/api";

function Albums() {
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();

  // Fetch all albums
  const loadAlbums = async () => {
    setIsLoading(true);
    setError(null);

    try {
  const response = await axios.get(API_ENDPOINTS.albums.filter());

      // Imprimir la respuesta completa de la API para depuración
      console.log("API Response:", response.data);

      // Verificar si la respuesta tiene la estructura correcta
  if (!response.data || !Array.isArray(response.data.items)) {
        throw new Error("La respuesta de la API no tiene la estructura esperada. Se esperaba 'items' como un array.");
      }

      const data = response.data.items;

      // Separar los géneros y las fechas
      setAlbums(data);

      // Extraer géneros únicos del campo "date#genre"
      const uniqueGenres = [...new Set(data.map(album => album["date#genre"].split("#")[1]))];
      setGenres(uniqueGenres);
    } catch (error) {
      console.error("Error fetching albums:", error);
      setError("Error fetching albums: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter albums by genre
  const handleGenreFilter = async (genre) => {
    setSelectedGenre(genre);

    if (!genre) {
      setFilteredAlbums([]); // Si no se selecciona género, reseteamos el filtro
      loadAlbums(); // Vuelvo a cargar todos los álbumes sin filtro
    } else {
      setIsLoading(true);
      setError(null);

      try {
  const base = API_ENDPOINTS.albums.filter();
  const response = await axios.get(`${base}?genre=${encodeURIComponent(genre)}`);

        // Imprimir la respuesta completa de la API para depuración
        console.log("API Response:", response.data);

        // Verificar si la respuesta tiene la estructura correcta
        if (!response.data || !Array.isArray(response.data.items)) {
          throw new Error("La respuesta de la API no tiene la estructura esperada. Se esperaba 'items' como un array.");
        }

        const data = response.data.items;
        setFilteredAlbums(data);
      } catch (error) {
        console.error("Error fetching albums by genre:", error);
        setError("Error fetching albums by genre: " + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  
  useEffect(() => {
    loadAlbums();
  }, []);

  const displayAlbums = selectedGenre ? filteredAlbums : albums;

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
        <div className="flex-1 font-inria p-8 ml-28"> 
          <div
            className={`backdrop-blur-sm rounded-3xl p-8 border transition-all duration-300 h-full ${
              darkMode
                ? "bg-gray-800/30 border-gray-700/50 shadow-2xl"
                : "bg-white/40 border-gray-200/50 shadow-xl"
            }`}
          >
          <h1 className={`text-3xl font-inria mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>Albums</h1>

          {/* Genre Filter */}
          <div className="mb-6">
            <label htmlFor="genre-select" className={`mr-4 font-inria ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Filter by Genre:</label>
            <select
              id="genre-select"
              value={selectedGenre}
              onChange={(e) => handleGenreFilter(e.target.value)}
              className={`p-2 rounded font-inria border transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-900/60 text-white placeholder-gray-400 border-gray-700"
                  : "bg-white/70 text-gray-800 placeholder-gray-500 border-gray-300"
              }`}
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-center mb-6 font-inria">
              <p>{error}</p>
            </div>
          )}

          {/* Album Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <p className={`text-lg font-inria mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Loading...</p>
            ) : (
              displayAlbums.map((album) => {
                const [date, genre] = album["date#genre"].split("#"); // Desestructuramos el campo "date#genre"
                return (
                  <div
                    key={album.name}
                    className={`font-inria rounded-xl p-4 shadow-lg hover:shadow-xl transition duration-300 border ${
                      darkMode ? "bg-gray-800/50 border-gray-700/50 text-white" : "bg-white/70 border-gray-200/60 text-gray-800"
                    }`}
                  >
                    <h2 className="text-xl font-inria">{album.name}</h2>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>Artist: {album.artist_id}</p>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>Genre: {genre}</p>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>Release Date: {date}</p>
                  </div>
                );
              })
            )}
          </div>

          {displayAlbums.length === 0 && !isLoading && (
            <p className={`text-center mt-10 font-inria ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {selectedGenre
                ? `No albums found in the ${selectedGenre} genre.`
                : "No albums available."}
            </p>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Albums;