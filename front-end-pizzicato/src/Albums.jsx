import React, { useState, useEffect } from "react";
import TopNavigation from "./TopNavigation";
import Sidebar from "./Sidebar";
import axios from "axios";

function Albums() {
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all albums
  const loadAlbums = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(import.meta.env.VITE_API_ALBUM_FILTER);

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
        const response = await axios.get(`${import.meta.env.VITE_API_ALBUM_FILTER}?genre=${genre}`);

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
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 font-inria  flex flex-col ml-20"> 
        <TopNavigation />
        <main className="flex-1 font-inria  p-6 overflow-y-auto">
          <h1 className="text-2xl  font-inria mb-6">Albums</h1>

          {/* Genre Filter */}
          <div className="mb-6">
            <label htmlFor="genre-select" className="mr-4 font-inria ">Filter by Genre:</label>
            <select
              id="genre-select"
              value={selectedGenre}
              onChange={(e) => handleGenreFilter(e.target.value)}
              className="p-2 border rounded font-inria"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-center mb-6 font-inria">
              <p>{error}</p>
            </div>
          )}

          {/* Album Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <p className="text-lg font-inria  text-gray-600 mb-6">Loading...</p>
            ) : (
              displayAlbums.map((album) => {
                const [date, genre] = album["date#genre"].split("#"); // Desestructuramos el campo "date#genre"
                return (
                  <div
                    key={album.name}
                    className="bg-white  font-inria border border-gray-300 rounded-xl p-4 shadow-lg hover:shadow-xl transition duration-300"
                  >
                    <h2 className="text-xl font-inria text-gray-800">{album.name}</h2>
                    <p className="text-gray-600">Artist: {album.artist_id}</p>
                    <p className="text-gray-600">Genre: {genre}</p>
                    <p className="text-gray-600">Release Date: {date}</p>
                  </div>
                );
              })
            )}
          </div>

          {displayAlbums.length === 0 && !isLoading && (
            <p className="text-center text-gray-500 mt-10 font-inria">
              {selectedGenre
                ? `No albums found in the ${selectedGenre} genre.`
                : "No albums available."}
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default Albums;