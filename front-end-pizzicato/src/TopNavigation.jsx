import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Para redirigir
import { API_ENDPOINTS } from './config/api';
import { useTheme } from './context/ThemeContext';
import {
  FaSearch,
  FaHashtag,
  FaRegBell,
  FaUserCircle,
  FaMoon,
  FaSun,
} from 'react-icons/fa';

const TopNavigation = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');  // Para el término de búsqueda
  const navigate = useNavigate();  // Hook para la redirección
  const { darkMode } = useTheme(); // Usar el contexto del tema

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenant_id');

    if (!token || !tenantId) {
      setError('No se encontró el token o tenant_id en el almacenamiento.');
      setIsLoading(false);
      return;
    }

    // Realizar la solicitud a la API para obtener el username
    const fetchUsername = async () => {
      try {
        const response = await axios.post(API_ENDPOINTS.users.info(), {
          tenant_id: tenantId,
        }, {
          headers: {
            'Authorization': token,
          }
        });

        if (response.data && response.data.username) {
          setUsername(response.data.username);
        } else {
          setError('Error: no se encontró el campo "username" en la respuesta.');
        }
      } catch (err) {
        setError('Error de conexión: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsername();
  }, []);

  // Función para realizar la búsqueda
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenant_id');
    
    try {
      const response = await axios.post(API_ENDPOINTS.songs.byName(), {
        name: searchTerm,
        tenant_id: tenantId,
      }, {
        headers: {
          'Authorization': token,
        }
      });

      if (response.status === 200) {
        // Redirigir a /home y pasar los resultados de la búsqueda
        navigate('/home', { state: { songs: response.data.body.items } });
      }
    } catch (error) {
      console.error("Error de búsqueda:", error);
      setError('Error al buscar canciones');
    }
  };

  return (
    <div className={`top-navigation font-inria italic flex items-center justify-between p-4 backdrop-blur-lg border-b transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-900/80 border-gray-700/50 text-white shadow-xl' 
        : 'bg-white/80 border-gray-200/50 text-black shadow-lg'
    }`}>
      <div className="flex items-center space-x-3">
        <HashtagIcon />
        <Title username={username} />
      </div>
      <div className="flex items-center space-x-4">
        <ThemeIcon />
        <Search 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          handleSearch={handleSearch} 
        />
        <BellIcon />
        <UserCircle />
      </div>
    </div>
  );
};

const ThemeIcon = () => {
  const { darkMode, toggleTheme } = useTheme();
  
  return (
    <span 
      onClick={toggleTheme} 
      className={`cursor-pointer transition-all duration-300 p-2 rounded-xl backdrop-blur-sm border hover:scale-110 ${
        darkMode 
          ? 'hover:bg-gray-700/40 border-gray-600/30 hover:border-gray-500/50 hover:shadow-lg' 
          : 'hover:bg-gray-200/40 border-gray-300/30 hover:border-gray-400/50 hover:shadow-md'
      }`}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <FaSun size="20" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300" />
      ) : (
        <FaMoon size="20" className="text-gray-600 hover:text-gray-500 transition-colors duration-300" />
      )}
    </span>
  );
};

const Search = ({ searchTerm, setSearchTerm, handleSearch }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`search flex font-inria italic items-center rounded-2xl px-4 py-2 w-96 backdrop-blur-sm border transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-800/40 border-gray-600/30 text-white focus-within:border-gray-500/50 focus-within:shadow-lg' 
        : 'bg-gray-100/40 border-gray-300/30 text-black focus-within:border-gray-400/50 focus-within:shadow-md'
    }`}>
      <input
        className={`search-input font-inria italic bg-transparent outline-none w-full mr-2 placeholder-gray-500 transition-colors duration-300 ${
          darkMode ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-500'
        }`}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <FaSearch 
        size="16" 
        className={`cursor-pointer transition-all duration-300 hover:scale-110 ${
          darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
        }`} 
        onClick={handleSearch} 
      />
    </div>
  );
};

const BellIcon = () => {
  const { darkMode } = useTheme();
  return (
    <span className={`cursor-pointer transition-all duration-300 p-2 rounded-xl backdrop-blur-sm border hover:scale-110 ${
      darkMode 
        ? 'hover:bg-gray-700/40 border-gray-600/30 hover:border-gray-500/50 hover:shadow-lg' 
        : 'hover:bg-gray-200/40 border-gray-300/30 hover:border-gray-400/50 hover:shadow-md'
    }`}>
      <FaRegBell 
        size="18" 
        className={`transition-colors duration-300 ${
          darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
        }`}
      />
    </span>
  );
};

const UserCircle = () => {
  const { darkMode } = useTheme();
  return (
    <span className={`cursor-pointer transition-all duration-300 p-2 rounded-xl backdrop-blur-sm border hover:scale-110 ${
      darkMode 
        ? 'hover:bg-gray-700/40 border-gray-600/30 hover:border-gray-500/50 hover:shadow-lg' 
        : 'hover:bg-gray-200/40 border-gray-300/30 hover:border-gray-400/50 hover:shadow-md'
    }`}>
      <FaUserCircle 
        size="18" 
        className={`transition-colors duration-300 ${
          darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
        }`}
      />
    </span>
  );
};

const HashtagIcon = () => {
  const { darkMode } = useTheme();
  return (
    <FaHashtag 
      size="18" 
      className={`transition-colors duration-300 ${
        darkMode ? 'text-gray-300' : 'text-gray-600'
      }`}
    />
  );
};

const Title = ({ username }) => {
  const { darkMode } = useTheme();
  return (
    <h5 className={`ml-2 font-medium text-lg transition-colors duration-300 ${
      darkMode ? 'text-white' : 'text-black'
    }`}>
      {username}
    </h5>
  );
};

export default TopNavigation;
