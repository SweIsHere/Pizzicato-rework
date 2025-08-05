import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Para redirigir
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
        const response = await axios.post(import.meta.env.VITE_API_USER_INFO, {
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
      const response = await axios.post(import.meta.env.VITE_API_SONGS_BYNAME, {
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
    <div className="top-navigation font-inria italic  flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center">
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
  const [darkTheme, setDarkTheme] = useState(false);
  const handleMode = () => setDarkTheme(!darkTheme);
  return (
    <span onClick={handleMode}>
      {darkTheme ? (
        <FaSun size="24" className="top-navigation-icon" />
      ) : (
        <FaMoon size="24" className="top-navigation-icon" />
      )}
    </span>
  );
};

const Search = ({ searchTerm, setSearchTerm, handleSearch }) => (
  <div className="search flex  font-inria italic items-center bg-gray-200 rounded-full px-3 py-1 w-96 border border-black">
    <input
      className="search-input font-inria italic  bg-transparent outline-none w-full mr-2"
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
    />
    <FaSearch size="18" className="text-gray-500" onClick={handleSearch} />
  </div>
);

const BellIcon = () => <FaRegBell size="24" className="top-navigation-icon" />;
const UserCircle = () => <FaUserCircle size="24" className="top-navigation-icon" />;
const HashtagIcon = () => <FaHashtag size="20" className="title-hashtag" />;
const Title = ({ username }) => <h5 className="title-text">{username}</h5>;

export default TopNavigation;
