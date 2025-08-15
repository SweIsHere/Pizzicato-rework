// Configuración de APIs de AWS Gateway
const API_CONFIG = {
  // Configuración base
  region: import.meta.env.VITE_AWS_REGION,
  stage: import.meta.env.VITE_AWS_STAGE,
  
  // IDs de las APIs
  users: import.meta.env.VITE_API_USERS_ID,
  songs: import.meta.env.VITE_API_SONGS_ID,
  artists: import.meta.env.VITE_API_ARTISTS_ID,
  podcasts: import.meta.env.VITE_API_PODCASTS_ID,
  albums: import.meta.env.VITE_API_ALBUMS_ID,
  favorites: import.meta.env.VITE_API_FAVORITES_ID,
};

// Función helper para construir URLs
const buildApiUrl = (apiType, endpoint) => {
  const apiId = API_CONFIG[apiType];
  if (!apiId) {
    throw new Error(`API type "${apiType}" not found in configuration`);
  }
  return `https://${apiId}.execute-api.${API_CONFIG.region}.amazonaws.com/${API_CONFIG.stage}${endpoint}`;
};

// Endpoints organizados por categoría
export const API_ENDPOINTS = {
  // Usuarios
  users: {
    register: () => buildApiUrl('users', '/users/register'),
    login: () => buildApiUrl('users', '/users/login'),
    info: () => buildApiUrl('users', '/users/info'),
  },
  
  // Canciones
  songs: {
    all: () => buildApiUrl('songs', '/songs/all'),
    byGenre: () => buildApiUrl('songs', '/songs/genre'),
    byName: () => buildApiUrl('songs', '/songs/name'),
    
  },
  
  // Artistas
  artists: {
    info: () => buildApiUrl('artists', '/artist/getInfo'),
    byCountry: () => buildApiUrl('artists', '/artist/getallbycountry'),
    byName: () => buildApiUrl('artists', '/artist/getAllbyName'),
  },
  
  // Podcasts
  podcasts: {
    all: () => buildApiUrl('podcasts', '/podcasts'),
    byGenre: () => buildApiUrl('podcasts', '/podcasts/genre'),
  },
  
  // Álbumes
  albums: {
    filter: () => buildApiUrl('albums', '/albums'),
  },
  
  // Favoritos
  favorites: {
    add: () => buildApiUrl('favorites', '/favorites/add'),
    remove: () => buildApiUrl('favorites', '/favorites/remove'),
    mine: () => buildApiUrl('favorites', '/favorites/mine'),
  },
};

export default API_ENDPOINTS;
