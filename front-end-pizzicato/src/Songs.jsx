import { useState, useEffect } from "react";
import TopNavigation from "./TopNavigation";
import Sidebar from "./SideBar"; // fix: nombre de archivo
import axios from "axios";
import { API_ENDPOINTS } from "./config/api";
import { useTheme } from "./context/ThemeContext";
import { usePlayer } from "./context/PlayerContext";

function Songs() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { darkMode } = useTheme();
  const { playTrack } = usePlayer();

  //   readable format
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getInitials = (text) => (text ? text.slice(0, 2).toUpperCase() : "PI");

  // Efecto 3D parallax (tilt)
  const handleCardMouseMove = (e) => {
    // Evitar en móviles o si el usuario prefiere menos animación
    if ('ontouchstart' in window || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const wrapper = e.currentTarget;
    const card = wrapper.querySelector('[data-tilt-card]');
    const glare = wrapper.querySelector('[data-tilt-glare]');
    if (!card) return;

    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;

    const maxTilt = 10; // grados
    const rotateX = (py - 0.5) * -2 * maxTilt; // invertimos para que "mire" al cursor
    const rotateY = (px - 0.5) * 2 * maxTilt;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
    card.style.transition = 'transform 60ms linear';

    // Glare
    if (glare) {
      glare.style.opacity = '1';
      glare.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.35), rgba(255,255,255,0.05) 40%, transparent 70%)`;
    }
  };

  const handleCardMouseLeave = (e) => {
    const wrapper = e.currentTarget;
    const card = wrapper.querySelector('[data-tilt-card]');
    const glare = wrapper.querySelector('[data-tilt-glare]');
    if (card) {
      card.style.transition = 'transform 200ms ease';
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
    if (glare) glare.style.opacity = '0';
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

      const response = await axios.post(API_ENDPOINTS.songs.all(), requestBody, {
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
      const response = await axios.post(API_ENDPOINTS.favorites.add(), {
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
    <div
      className={`grid grid-rows-[auto,1fr] h-screen overflow-hidden transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      <div className="sticky top-0 z-40">
        <TopNavigation />
      </div>

      {/* Contenedor flex principal */}
      <div className="flex min-h-0 overflow-hidden">
        <Sidebar />

        {/* Área scrollable principal - CLAVE: overflow-y-auto + min-h-0 aquí */}
        <main className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-6 md:p-8 ml-28 mr-4 md:mr-8">
            <div
              className={`backdrop-blur-sm rounded-3xl p-8 border transition-all duration-300 ${
                darkMode ? "bg-gray-800/30 border-gray-700/50 shadow-2xl" : "bg-white/40 border-gray-200/50 shadow-xl"
              }`}
            >
              <h1
                className={`font-inria text-4xl md:text-5xl font-bold mb-8 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Songs
                <span className={`font-inria block text-lg font-normal mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Discover your next favorite track
                </span>
              </h1>

              {/* Genre Filter with macOS styling */}
              <div className="font-inria mb-8 flex items-center gap-4 flex-wrap">
                <label htmlFor="genre-select" className={`font-inria text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Filter by Genre:
                </label>
                <div className="relative">
                  <select
                    id="genre-select"
                    value={selectedGenre}
                    onChange={(e) => handleGenreFilter(e.target.value)}
                    className={`font-inria appearance-none px-4 py-2.5 pr-10 rounded-xl border font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                      darkMode
                        ? "bg-gray-800/80 text-white border-gray-600/50 backdrop-blur-xl"
                        : "bg-white/80 text-gray-900 border-gray-200/50 backdrop-blur-xl"
                    }`}
                  >
                    <option value="">All Genres</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetFilter}
                  disabled={!selectedGenre}
                  className={`font-inria px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                    darkMode
                      ? "bg-gray-700/80 text-gray-200 hover:bg-gray-600/80 backdrop-blur-xl"
                      : "bg-gray-200/80 text-gray-800 hover:bg-gray-300/80 backdrop-blur-xl"
                  }`}
                >
                  Clear Filter
                </button>
              </div>

              {/* Pagination with refined styling */}
              <div className="font-inria mb-10 flex justify-center items-center space-x-3">
                <button
                  onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
                  disabled={page === 1}
                  className={`font-inria px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-xl ${
                    darkMode ? "bg-gray-800/80 text-white hover:bg-gray-700/80" : "bg-white/80 text-gray-900 hover:bg-gray-50/80"
                  }`}
                >
                  ← Previous
                </button>
                <div className={`font-inria px-4 py-2.5 rounded-xl text-sm font-medium backdrop-blur-xl ${
                  darkMode ? "bg-gray-800/60 text-gray-300" : "bg-white/60 text-gray-700"
                }`}>
                  {page} of {totalPages}
                </div>
                <button
                  onClick={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`font-inria px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-xl ${
                    darkMode ? "bg-gray-800/80 text-white hover:bg-gray-700/80" : "bg-white/80 text-gray-900 hover:bg-gray-50/80"
                  }`}
                >
                  Next →
                </button>
              </div>

              {/* Song Grid with macOS Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                {isLoading ? (
                  // Enhanced loading skeletons
                  Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className={`rounded-2xl p-6 border animate-pulse backdrop-blur-xl ${
                        darkMode
                          ? "bg-gray-900/60 border-gray-700/30"
                          : "bg-white/70 border-gray-200/30"
                      }`}
                    >
                      <div className={`mb-5 rounded-2xl w-full aspect-square ${darkMode ? "bg-gray-700/60" : "bg-gray-200/60"}`} />
                      <div className={`h-6 mb-3 rounded-lg ${darkMode ? "bg-gray-700/60" : "bg-gray-200/60"}`} />
                      <div className={`h-4 mb-4 rounded ${darkMode ? "bg-gray-700/60" : "bg-gray-200/60"}`} />
                      <div className={`h-3 w-2/3 mb-6 rounded ${darkMode ? "bg-gray-700/60" : "bg-gray-200/60"}`} />
                      <div className={`h-10 rounded-xl ${darkMode ? "bg-gray-700/60" : "bg-gray-200/60"}`} />
                    </div>
                  ))
                ) : error ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-lg text-red-500 mb-4">⚠️ {error}</p>
                    <button 
                      onClick={() => loadSongs(1)}
                      className="px-6 py-3 bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-500/30 transition-all"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  displaySongs.map((song) => (
                    <div
                      key={song.song_uuid}
                      className="group relative"
                      onMouseMove={handleCardMouseMove}
                      onMouseLeave={handleCardMouseLeave}
                      style={{ perspective: '1000px' }}
                    >
                      <div
                        data-tilt-card
                        className={`relative rounded-2xl p-6 backdrop-blur-2xl backdrop-saturate-150 border transition-all duration-300 will-change-transform transform-gpu hover:shadow-2xl ${
                          darkMode
                            ? "bg-gray-900/70 border-gray-700/40 hover:bg-gray-900/80"
                            : "bg-white/80 border-gray-200/40 hover:bg-white/90"
                        }`}
                        style={{
                          boxShadow: darkMode 
                            ? '0 10px 40px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)' 
                            : '0 10px 40px -15px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        {/* Musical note overlay (subtle) */}
                        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
                          <svg className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                          </svg>
                        </div>

                        {/* Glare effect */}
                        <div
                          data-tilt-glare
                          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
                          style={{ mixBlendMode: 'soft-light' }}
                        />

                        {/* Album Art */}
                        <div className="relative overflow-hidden rounded-2xl mb-5 aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-900 shadow-inner">
                          {song.picture_url ? (
                            <img
                              src={song.picture_url}
                              alt={`${song.name} cover`}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className={`text-4xl font-black tracking-wider ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                                {getInitials(song.name)}
                              </div>
                            </div>
                          )}

                          {/* Vinyl effect overlay */}
                          <div className="absolute inset-0 rounded-2xl" style={{
                            background: 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.1) 21%, rgba(0,0,0,0.1) 22%, transparent 23%, transparent 40%, rgba(0,0,0,0.05) 41%, rgba(0,0,0,0.05) 42%, transparent 43%)',
                            opacity: song.picture_url ? 0.3 : 0.6
                          }} />

                          {/* Album badge */}
                          {song.album_name && (
                            <div className="absolute left-3 top-3 px-3 py-1.5 text-xs font-medium rounded-xl bg-black/60 text-white backdrop-blur-sm border border-white/20">
                              {song.album_name}
                            </div>
                          )}

                          {/* Play overlay on hover */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                              <svg className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Track Info */}
                        <div className="mb-4">
                          <h3 className={`font-inria text-lg font-semibold mb-1 line-clamp-2 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {song.name}
                          </h3>
                          <p className={`font-inria text-sm mb-3 line-clamp-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {song.artist_name || song.artist_id}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2">
                            {song.genre && (
                              <span className={`font-inria px-2.5 py-1 rounded-lg text-xs font-medium ${
                                darkMode
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}>
                                {song.genre}
                              </span>
                            )}
                            {song?.data?.duration != null && (
                              <span className={`font-inria px-2.5 py-1 rounded-lg text-xs font-medium ${
                                darkMode
                                  ? "bg-gray-700/60 text-gray-300"
                                  : "bg-gray-100 text-gray-700"
                              }`}>
                                {formatDuration(song.data.duration)}
                              </span>
                            )}
                            {song?.data?.explicit && (
                              <span className="font-inria px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                                Explicit
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <button
                            onClick={() => playTrack({
                              title: song.name,
                              artist: song.artist_name || song.artist_id,
                              audioUrl: song.audio_url,
                              cover: song.picture_url,
                            })}
                            className={`font-inria w-full px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] ${
                              darkMode
                                ? "bg-white text-gray-900 hover:bg-gray-100"
                                : "bg-gray-900 text-white hover:bg-gray-800"
                            }`}
                          >
                            ▶ Play Now
                          </button>
                          <button
                            onClick={() => handleAddToFavorites(song.song_uuid)}
                            className={`font-inria w-full px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border ${
                              darkMode
                                ? "border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500"
                                : "border-gray-300/50 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                            }`}
                          >
                            ♡ Add to Favorites
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {displaySongs.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-16">
                  <div className="mb-4">
                    <svg className={`w-16 h-16 mx-auto ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  </div>
                  <p className={`font-inria text-lg font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {selectedGenre ? `No songs found in ${selectedGenre}` : "No songs available"}
                  </p>
                  <p className={`font-inria text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                    {selectedGenre ? "Try selecting a different genre or clear the filter" : "Check back later for new releases"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Songs;
