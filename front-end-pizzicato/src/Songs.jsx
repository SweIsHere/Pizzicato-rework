import React, { useState, useEffect } from "react";
import TopNavigation from "./TopNavigation";
import Sidebar from "./Sidebar";
import axios from "axios";

function Songs() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //   readable format
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Fetch all songs
  const loadSongs = async (pageNum) => {
    setIsLoading(true);
    setError(null);

    try {
      const tenantId = localStorage.getItem("tenant_id");
      const token = localStorage.getItem("token");

      if (!tenantId) {
        throw new Error("tenant_id not found in localStorage");
      }

      const requestBody = { tenant_id: tenantId, page: pageNum };

      const response = await axios.post(import.meta.env.VITE_API_SONGS_ALL, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.data.body) {
        const { items, totalPages } = response.data.body;
        setSongs(items);
        setTotalPages(totalPages);
        setPage(pageNum);

        // Extraemos los géneros de las canciones y los almacenamos
        const songGenres = [...new Set(items.map((song) => song.genre))];
        setGenres(songGenres);
      } else {
        setError("The API response does not contain the expected data.");
      }
    } catch (error) {
      setError("Error fetching songs: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Add song to favorites
  const handleAddToFavorites = async (songUuid) => {
    const tenantId = localStorage.getItem("tenant_id");
    const token = localStorage.getItem("token");

    if (!tenantId || !token) {
      alert("User not authenticated");
      return;
    }

    try {
      const response = await axios.post(import.meta.env.VITE_API_FAV_ADD, {
        tenant_id: tenantId,
        song_uuid: songUuid,
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.data.statusCode === 200) {
        alert("Song added to favorites!");
      } else {
        alert("Error adding song to favorites.");
      }
    } catch (error) {
      alert("Error adding song to favorites: " + error.message);
    }
  };

  // by genre
  const handleGenreFilter = (genre) => {
    setSelectedGenre(genre);

    if (!genre) {
      setFilteredSongs([]); // Reset filter
      loadSongs(1);  // Reset  first page , load all songs
    } else {
      // Filtro de canciones por genre
      const filtered = songs.filter((song) =>
        song.genre.toLowerCase() === genre.toLowerCase()
      );
      setFilteredSongs(filtered);
      setPage(1);  // Reset de la primera pagina aplicando filtro
    }
  };

  // Reset genre filter
  const resetFilter = () => {
    setSelectedGenre("");
    setFilteredSongs([]);
    loadSongs(1);  // Reset de la primera pagina y cargar all song 
  };

  useEffect(() => {
    loadSongs(page);
  }, [page]);

  const displaySongs = selectedGenre ? filteredSongs : songs;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 font-inria flex flex-col ml-20">
        <TopNavigation />
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Songs</h1>

          <div className="font-inria mb-6">
            <label htmlFor="genre-select" className="mr-4">Filter by Genre:</label>
            <select
              id="genre-select"
              value={selectedGenre}
              onChange={(e) => handleGenreFilter(e.target.value)}
              className="font-inria p-2 border rounded"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Pagination */}
          <div className="font-inria mb-8 flex justify-center items-center space-x-4">
            <button
              onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
              disabled={page === 1}
              className="font-inria px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="font-inria px-4 py-2 text-gray-800">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages))}
              disabled={page === totalPages}
              className="font-inria px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Song Grid */}
          <div className="font-inria grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <p className="font-inria text-lg text-gray-600 mb-6">Loading...</p>
            ) : error ? (
              <p className="font-inria text-lg text-red-600 mb-6">{error}</p>
            ) : (
              displaySongs.map((song) => (
                <div
                  key={song.song_uuid}
                  className="font-inria bg-white border border-gray-300 rounded-xl p-4 shadow-lg hover:shadow-xl transition duration-300"
                >
                  <h2 className="text-xl font-inria text-gray-800">{song.name}</h2>
                  <p className="text-gray-600 font-inria">Artist: {song.artist_id}</p>
                  <p className="text-gray-600 font-inria">Genre: {song.genre}</p>
                  <p className="text-gray-600 font-inria">
                    Duration: {formatDuration(song.data.duration)}
                  </p>
                  <p
                    className={`text-sm font-inria ${song.data.explicit ? "text-red-500" : "text-green-500"}`}
                  >
                    {song.data.explicit ? "Explicit" : "Clean"}
                  </p>
                  <button
                    onClick={() => handleAddToFavorites(song.song_uuid)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Add to Favorites
                  </button>
                </div>
              ))
            )}
          </div>

          {displaySongs.length === 0 && !isLoading && (
            <p className="text-center font-inria text-gray-500 mt-10">
              {selectedGenre
                ? `No songs found in the ${selectedGenre} genre.`
                : "No songs available."}
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default Songs;
