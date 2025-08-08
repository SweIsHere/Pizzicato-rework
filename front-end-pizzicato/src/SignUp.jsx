import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    tenant_id: "", // Usar tenant_id en lugar de email
    password: "",
    country: "",
  });

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
      // Guardar los datos del formulario en localStorage
      localStorage.setItem("signUpData", JSON.stringify(formData));
      navigate("/fav"); // Redirigir a la pantalla de selección de instrumento
    } catch (error) {
      console.error("Error:", error);
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
        <h1 className={`text-4xl font-inria italic mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Tuning your account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className={`block text-lg font-inria italic font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
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
            <label htmlFor="tenant_id" className={`block text-lg font-inria italic font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              E-mail
            </label>
            <input
              type="email"
              id="tenant_id"
              name="tenant_id"
              value={formData.tenant_id}
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
            <label htmlFor="country" className={`block text-lg font-inria italic font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
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
            Tune Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;