import { createContext, useContext, useMemo, useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null); // { title, artist, audioUrl, cover }
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.9);

  // Ensure audio element exists
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "metadata";
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;
    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => setProgress(audio.currentTime || 0);
    const onEnded = () => setIsPlaying(false);
    const onError = (e) => {
      console.error("Audio error:", e);
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

  return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const playTrack = async (track) => {
    try {
      if (!track?.audioUrl) return;
      setCurrentTrack(track);
  const audio = audioRef.current;
  // Reset then set new source
  try { audio.pause(); } catch {}
  audio.src = track.audioUrl;
  audio.load();
      audio.currentTime = 0;
      await audio.play();
      setIsPlaying(true);
    } catch (e) {
      // Autoplay restrictions or load error
      setIsPlaying(false);
      console.error("Audio play error:", e);
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (e) {
        console.error("Audio resume error:", e);
      }
    }
  };

  const seek = (time) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(time, 0), duration || audio.duration || 0);
  };

  const closePlayer = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    setDuration(0);
    setProgress(0);
  };

  const value = useMemo(() => ({
    currentTrack,
    isPlaying,
    duration,
    progress,
    volume,
    setVolume,
    playTrack,
    togglePlay,
    seek,
    closePlayer,
  }), [currentTrack, isPlaying, duration, progress, volume]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

PlayerProvider.propTypes = {
  children: PropTypes.node,
};

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within a PlayerProvider");
  return ctx;
}
