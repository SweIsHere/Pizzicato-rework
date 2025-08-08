import React, { useState, useEffect } from "react";
import TopNavigation from "./TopNavigation";
import Sidebar from "./Sidebar";
import axios from "axios";
import { API_ENDPOINTS } from "./config/api";
import { FaPlay } from "react-icons/fa"; // Importa el ícono de play desde react-icons/fa
import { useTheme } from "./context/ThemeContext";

function Podcasts() {
  const [podcasts, setPodcasts] = useState([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const { darkMode } = useTheme();

  // Convert duration in seconds to a readable format
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Fetch all podcasts
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.podcasts.all());
        const data = JSON.parse(response.data.body);
        setPodcasts(data.items);

        // Extract unique genres
        const uniqueGenres = [...new Set(data.items.map(podcast => podcast.genre))];
        setGenres(uniqueGenres);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      }
    };

    fetchPodcasts();
  }, []);

  // Filter podcasts by genre
  const handleGenreFilter = async (genre) => {
    setSelectedGenre(genre);

    if (!genre) {
      setFilteredPodcasts([]);
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.podcasts.byGenre(), { genre });
      const data = JSON.parse(response.data.body);
      setFilteredPodcasts(data.items);
    } catch (error) {
      console.error("Error filtering podcasts:", error);
    }
  };

  // Determine which podcasts to display
  const displayPodcasts = selectedGenre ? filteredPodcasts : podcasts;

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      <TopNavigation />
      <div className="flex flex-1 font-inria">
        <Sidebar />
        <div className="flex-1 p-8 ml-28">
          <div
            className={`backdrop-blur-sm rounded-3xl p-8 border transition-all duration-300 h-full ${
              darkMode
                ? "bg-gray-800/30 border-gray-700/50 shadow-2xl"
                : "bg-white/40 border-gray-200/50 shadow-xl"
            }`}
          >
          <h1 className={`text-3xl font-semibold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>Podcasts</h1>
          
          {/* Genre Filter */}
          <div className="mb-6">
            <label htmlFor="genre-select" className={`mr-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Filter by Genre:</label>
            <select 
              id="genre-select"
              value={selectedGenre}
              onChange={(e) => handleGenreFilter(e.target.value)}
              className={`p-2 rounded border transition-colors duration-300 ${
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

          {/* Podcast Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPodcasts.map((podcast) => (
              <div 
                key={podcast.podcast_uuid} 
                className={`rounded-xl p-4 shadow-md hover:shadow-xl transition-shadow relative border ${
                  darkMode ? "bg-gray-800/50 border-gray-700/50 text-white" : "bg-white/70 border-gray-200/60 text-gray-800"
                }`}
                title={`Duration: ${formatDuration(podcast.data.duration)}`}
              >
                <h2 className="text-xl font-semibold mb-2">{podcast.name}</h2>
                <div className="flex items-center mb-2">
                  <span className={`${darkMode ? "text-gray-300" : "text-gray-600"} mr-2`}>Duration:</span>
                  <span className={`${darkMode ? "text-gray-200" : "text-gray-700"}`}>{formatDuration(podcast.data.duration)}</span>
                </div>
                {podcast.data.explicit && (
                  <div className="text-red-500 font-bold">Explicit</div>
                )}

                {/* Play Button in bottom right corner */}
                <button
                  onClick={() => console.log("Play podcast:", podcast.podcast_uuid)}
                  className="absolute bottom-4 right-4 p-2 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300"
                >
                  <FaPlay size={24} /> {/* Usando FaPlay de react-icons */}
                </button>
              </div>
            ))}
          </div>

          {displayPodcasts.length === 0 && (
            <p className={`text-center mt-10 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {selectedGenre 
                ? `No podcasts found in the ${selectedGenre} genre.` 
                : "No podcasts available."}
            </p>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Podcasts;
