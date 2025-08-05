import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa"; // Importa el ícono de "X" desde react-icons
import TopNavigation from "./TopNavigation";
import Sidebar from "./Sidebar";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar las canciones favoritas
  const loadFavorites = async () => {
    try {
      // Obtener tenant_id desde localStorage
      const tenantId = localStorage.getItem("tenant_id");

      if (!tenantId) {
        setError("No se encontró el tenant_id.");
        setIsLoading(false);
        return;
      }

      // Realizar la petición a la API
      const response = await axios.post(import.meta.env.VITE_API_FAV_MINE, {
        tenant_id: tenantId,
      });

      // Verificar si la respuesta contiene las canciones
      if (response.data.statusCode === 200 && response.data.body.items) {
        setFavorites(response.data.body.items);
      } else {
        setError("No se encontraron canciones favoritas.");
      }
    } catch (error) {
      setError("Error al obtener las canciones favoritas: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para eliminar una canción de favoritos
  const removeFavorite = async (songUuid) => {
    try {
      const tenantId = localStorage.getItem("tenant_id");

      if (!tenantId) {
        setError("No se encontró el tenant_id.");
        return;
      }

      // Realizar la petición a la API para eliminar la canción
      const response = await axios.post(import.meta.env.VITE_API_FAV_REMOVE, {
        tenant_id: tenantId,
        song_uuid: songUuid,
      });

      if (response.data.statusCode === 200) {
        // Actualizar el estado para reflejar la eliminación
        setFavorites(favorites.filter((fav) => fav.song_uuid !== songUuid));
      } else {
        setError("Error al eliminar la canción de favoritos.");
      }
    } catch (error) {
      setError("Error al eliminar la canción: " + error.message);
    }
  };

  // Cargar las canciones favoritas al montar el componente
  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <div className="flex flex-col  font-inria h-screen">
      <TopNavigation />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8 ml-64">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Favorites Songs</h1>

          {/* Mostrar el error si ocurrió */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
              <p>{error}</p>
            </div>
          )}

          {/* Si está cargando, mostrar el spinner */}
          {isLoading ? (
            <div className="text-center mt-10">
              <p className="text-xl text-gray-500">Loading your fav...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Si no hay canciones favoritas */}
              {favorites.length === 0 ? (
                <p className="text-center text-gray-500">Exigent listener. No fav founded.</p>
              ) : (
                // Lista de canciones favoritas con scroll
                <div className="max-h-96 overflow-y-auto">
                  {favorites.map((favorite) => (
                    <div
                      key={favorite.song_uuid}
                      className="flex items-center justify-between bg-white p-4 rounded-md shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">Song {favorite.song_uuid}</p>
                        <p className="text-gray-600">Added: {new Date(favorite.date_added).toLocaleString()}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                          Play
                        </button>
                        {/* Botón de eliminación */}
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeFavorite(favorite.song_uuid)}
                        >
                          <FaTimes size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Favorites;
