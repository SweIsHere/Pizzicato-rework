import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function FavInstrument() {
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const [signUpData, setSignUpData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para el mensaje de error
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperar los datos del formulario de localStorage
    const data = localStorage.getItem("signUpData");
    if (data) {
      setSignUpData(JSON.parse(data));
    }
  }, []);

  const handleInstrumentSelect = (instrument) => {
    setSelectedInstrument(instrument);
  };

  const handleSubmit = async () => {
    if (!selectedInstrument) {
      alert("Please select an instrument.");
      return;
    }

    if (signUpData) {
      const dataToSend = {
        ...signUpData,
        favoriteInstrument: selectedInstrument,
      };

      try {
        const response = await axios.post(import.meta.env.VITE_API_BASE_URL, dataToSend);
        console.log("Response:", response.data);
        // Si la respuesta contiene un código de error, manejamos el error
        if (response.data.statusCode && response.data.statusCode !== 200) {
          setErrorMessage(response.data.body || "Error desconocido");
        } else {
          navigate("/signin"); // Redirigir a la página de aterrizaje
        }
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage("Error en la conexión al servidor o algo salió mal.");
      }
    }
  };

  return (
    <div className="flex flex-col font-inria items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-inria italic text-black mb-2">
        One last thing,
      </h1>
      <h2 className="text-4xl font-inria italic text-black mb-8">
        what's your favorite instrument?
      </h2>

      {/* Mostrar el mensaje de error si existe */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-500 text-white rounded-md">
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        <button
          type="button"
          className={`px-6 py-3 rounded-full transition-colors ${
            selectedInstrument === "Violin"
              ? "bg-white text-black border border-black hover:bg-gray-200"
              : "bg-gray-200 text-gray-700 border border-black hover:bg-gray-300"
          }`}
          onClick={() => handleInstrumentSelect("Violin")}
        >
          Violin
        </button>
        <button
          type="button"
          className={`px-6 py-3 rounded-full transition-colors ${
            selectedInstrument === "Guitar"
              ? "bg-white text-black border border-black hover:bg-gray-200"
              : "bg-gray-200 text-gray-700 border border-black hover:bg-gray-300"
          }`}
          onClick={() => handleInstrumentSelect("Guitar")}
        >
          Guitar
        </button>
        <button
          type="button"
          className={`px-6 py-3 rounded-full transition-colors ${
            selectedInstrument === "Piano"
              ? "bg-white text-black border border-black hover:bg-gray-200"
              : "bg-gray-200 text-gray-700 border border-black hover:bg-gray-300"
          }`}
          onClick={() => handleInstrumentSelect("Piano")}
        >
          Piano
        </button>
        <button
          type="button"
          className={`px-6 py-3 rounded-full transition-colors ${
            selectedInstrument === "Flaute"
              ? "bg-white text-black border border-black hover:bg-gray-200"
              : "bg-gray-200 text-gray-700 border border-black hover:bg-gray-300"
          }`}
          onClick={() => handleInstrumentSelect("Flaute")}
        >
          Flaute
        </button>
        <button
          type="button"
          className={`px-6 py-3 rounded-full transition-colors ${
            selectedInstrument === "Drums"
              ? "bg-white text-black border border-black hover:bg-gray-200"
              : "bg-gray-200 text-gray-700 border border-black hover:bg-gray-300"
          }`}
          onClick={() => handleInstrumentSelect("Drums")}
        >
          Drums
        </button>
      </div>
      <button
        type="submit"
        className="mt-8 px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300"
        onClick={handleSubmit}
      >
        Save Favorite
      </button>
    </div>
  );
}

export default FavInstrument;
