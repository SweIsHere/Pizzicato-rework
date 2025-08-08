import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "./config/api";
import { useTheme } from "./context/ThemeContext";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Estado para el mensaje de error

  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Crear un objeto con tenant_id basado en el correo electrónico
      const dataToSend = {
        tenant_id: formData.email,
        password: formData.password,
      };
      // Hacer una llamada POST a la API
      const response = await axios.post(API_ENDPOINTS.users.login(), dataToSend);

      // Verificar si la respuesta contiene un error (statusCode 403)
      if (response.data.statusCode === 403) {
        setErrorMessage(response.data.body || "Error desconocido");
      } else {
        // Si no hay error, guardar el token y redirigir
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("tenant_id", response.data.tenant_id);
        localStorage.removeItem("signUpData");
        navigate("/loading");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      // Si ocurre un error con la solicitud, mostrar un mensaje de error
      setErrorMessage("Error en la conexión al servidor o algo salió mal.");
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}
    >
      <div
        className={`max-w-md w-full px-8 py-8 rounded-3xl backdrop-blur-lg border transition-all duration-300 ${
          darkMode
            ? 'bg-gray-800/40 border-gray-700/50 shadow-2xl'
            : 'bg-white/40 border-gray-200/60 shadow-xl'
        }`}
      >
        <h1 className={`text-4xl font-inria italic mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sign In</h1>
        
        {/* Si hay un mensaje de error, mostrarlo */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-500/90 text-white rounded-md">
            <p>{errorMessage}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block text-lg font-inria italic font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2 transition-colors duration-300 ${
                darkMode
                  ? 'bg-gray-900/60 text-white placeholder-gray-400 border border-gray-700 focus:ring-gray-500'
                  : 'bg-white/70 text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-gray-500'
              }`}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className={`block text-lg font-inria italic font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2 transition-colors duration-300 ${
                darkMode
                  ? 'bg-gray-900/60 text-white placeholder-gray-400 border border-gray-700 focus:ring-gray-500'
                  : 'bg-white/70 text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-gray-500'
              }`}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-8 py-3 bg-black font-inria italic text-white rounded-full hover:bg-gray-800 transition duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
