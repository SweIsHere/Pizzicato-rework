import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import App from "./App";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Fav from "./fav";
import LoadingPage from "./LoadingPage";
import LandingPage from "./LandingPage";
import Account from "./Account";
import Home from "./Home";
import Artists from "./Artists";
import Songs from "./Songs";
import Albums from "./Albums";
import Podcasts from "./Podcast";
import Favorites from "./Favorites";

const container = document.getElementById("root");
const root = createRoot(container);

const ProtectedRoute = ({ children }) => {
  const signUpData = localStorage.getItem("signUpData");
  return signUpData ? children : <Navigate to="/signup" />;
};

// Renderizado inicial
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route
        path="/fav"
        element={
          <ProtectedRoute>
            <Fav />
          </ProtectedRoute>
        }
      />
      <Route path="/loading" element={<LoadingPage />} />
      <Route path="/landingPage" element={<LandingPage />} />
      <Route path="/account" element={<Account />} />
      <Route path="/home" element={<Home />} />
      <Route path="/artists" element={<Artists />} />
      <Route path="/songs" element={<Songs />} />
      <Route path="/albums" element={<Albums />} />
      <Route path="/podcast" element={<Podcasts />} />
      <Route path= "/favorites" element={<Favorites />} />

    </Routes>
  </Router>
);