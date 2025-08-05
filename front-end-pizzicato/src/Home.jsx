import React from "react";
import { useLocation } from "react-router-dom";
import TopNavigation from "./TopNavigation"; 
import Sidebar from "./Sidebar"; 

function Home() {
  const location = useLocation();
  const songs = location.state?.songs || [];

  return (
    <div className="flex flex-col h-screen">
      <TopNavigation />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8 ml-64"> 
         
          <div id="content" className="text-center">
            <h1 className="text-4xl font-inria text-gray-800 mb-4">Hitting Notes.</h1>
            <p className="text-lg text-gray-600 mb-6">Sync the beats.</p>

            {/* Mostrar las canciones */}
            <h2 className="text-2xl font-inria mb-4">Song List</h2>
            <div className="song-list overflow-y-auto max-h-96">
              {songs.length === 0 ? (
                <p>Dreamed melody. Song not found.</p>
              ) : (
                <ul>
                  {songs.map((song, index) => (
                    <li key={index} className="song-item mb-4 p-2 border-b">
                      <h3 className="font-bold text-lg">{song.name}</h3>
                      <p>{song.artist_id}</p>
                      <p>Género: {song.genre}</p>
                      <p>Duración: {song.data.duration} segundos</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
