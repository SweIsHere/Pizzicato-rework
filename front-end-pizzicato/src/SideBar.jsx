import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <nav className="fixed top-0 left-0 h-screen w-28 flex flex-col bg-white border-r border-black justify-between p-4">
      <div className="flex flex-col space-y-6">
        <Link to="/account" className="group flex flex-col items-center">
          <div className="h-16 w-16 rounded-full flex items-center justify-center group-hover:bg-gray-300 transition-colors">
            <img src="src/assets/icons/FClef 2.png" alt="Account" className="h-15 w-15" />
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:block group-hover:animate-fade-in hidden">Account</span>
        </Link>
        <div className="flex flex-col space-y-4">
          <Link to="/home" className="group flex flex-col items-center">
            <div className="h-16 w-16 rounded-full flex items-center justify-center group-hover:bg-gray-300 transition-colors">
              <img src="src\assets\icons\home.png" alt="Home" className="h-8 w-8" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:block group-hover:animate-fade-in hidden">Home</span>
          </Link>
          <Link to="/artists" className="group flex flex-col items-center">
            <div className="h-16 w-16 rounded-full flex items-center justify-center group-hover:bg-gray-300 transition-colors">
              <img src="src\assets\icons\artist.png" alt="Artists" className="h-8 w-8" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:block group-hover:animate-fade-in hidden">Artists</span>
          </Link>
          <Link to="/songs" className="group flex flex-col items-center">
            <div className="h-16 w-16 rounded-full flex items-center justify-center group-hover:bg-gray-300 transition-colors">
              <img src="src\assets\icons\Music.png" alt="Songs" className="h-7 w-7" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:block group-hover:animate-fade-in hidden">Songs</span>
          </Link>
          <Link to="/albums" className="group flex flex-col items-center">
            <div className="h-16 w-16 rounded-full flex items-center justify-center group-hover:bg-gray-300 transition-colors">
              <img src="src\assets\icons\Music Square.png" alt="Albums" className="h-8 w-8" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:block group-hover:animate-fade-in hidden">Albums</span>
          </Link>
          <Link to="/podcast" className="group flex flex-col items-center">
            <div className="h-16 w-16 rounded-full flex items-center justify-center group-hover:bg-gray-300 transition-colors">
              <img src="src\assets\icons\podcast.png" alt="Logout" className="h-7 w-7" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:block group-hover:animate-fade-in hidden">Podcasts</span>
          </Link>
          <Link to="/favorites" className="group flex flex-col items-center">
            <div className="h-16 w-16 rounded-full flex items-center justify-center group-hover:bg-gray-300 transition-colors">
              <img src="src\assets\icons\favorites.png" alt="Favorites" className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:block group-hover:animate-fade-in hidden">Favorites</span>
          </Link>
        </div>
      </div>
      <div>
        <p className="text-center text-gray-600 text-sm">© Pizzicato</p>
      </div>
    </nav>
  );
}

export default Sidebar;