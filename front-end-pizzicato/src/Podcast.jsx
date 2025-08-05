import React, { useState, useEffect } from "react";
import TopNavigation from "./TopNavigation";
import Sidebar from "./Sidebar";
import axios from "axios";
import { FaPlay } from "react-icons/fa"; // Importa el ícono de play desde react-icons/fa

function Podcasts() {
  const [podcasts, setPodcasts] = useState([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenres] = useState([]);

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
        const response = await axios.get(import.meta.env.VITE_API_PODCAST_ALL);
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
      const response = await axios.post(import.meta.env.VITE_API_PODCAST_GENRE, { genre });
      const data = JSON.parse(response.data.body);
      setFilteredPodcasts(data.items);
    } catch (error) {
      console.error("Error filtering podcasts:", error);
    }
  };

  // Determine which podcasts to display
  const displayPodcasts = selectedGenre ? filteredPodcasts : podcasts;

  return (
    <div className="flex h-screen font-inria">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNavigation />
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Podcasts</h1>
          
          {/* Genre Filter */}
          <div className="mb-6">
            <label htmlFor="genre-select" className="mr-4">Filter by Genre:</label>
            <select 
              id="genre-select"
              value={selectedGenre}
              onChange={(e) => handleGenreFilter(e.target.value)}
              className="p-2 border rounded"
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
                className="border rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow relative"
                title={`Duration: ${formatDuration(podcast.data.duration)}`}
              >
                <h2 className="text-xl font-semibold mb-2">{podcast.name}</h2>
                <div className="flex items-center mb-2">
                  <span className="mr-2">Duration:</span>
                  <span>{formatDuration(podcast.data.duration)}</span>
                </div>
                {podcast.data.explicit && (
                  <div className="text-red-600 font-bold">Explicit</div>
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
            <p className="text-center text-gray-500 mt-10">
              {selectedGenre 
                ? `No podcasts found in the ${selectedGenre} genre.` 
                : "No podcasts available."}
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default Podcasts;
