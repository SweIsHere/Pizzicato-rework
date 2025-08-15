import { FaPlay, FaPause, FaTimes, FaVolumeDown, FaVolumeUp } from 'react-icons/fa';
import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';

function formatTime(t) {
  if (!t || Number.isNaN(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PlayerBar({ className = '' }) {
  const { darkMode } = useTheme();
  const { currentTrack, isPlaying, progress, duration, volume, setVolume, togglePlay, seek, closePlayer } = usePlayer();
  const shellRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const rippleId = useRef(0);
  const lastRippleTs = useRef(0);

  const handleMove = (e) => {
    const el = shellRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mx', `${x}%`);
    el.style.setProperty('--my', `${y}%`);
    el.style.setProperty('--rA', '0.12');

    // spawn ripple waves (rate-limited)
    const now = performance.now();
    if (now - lastRippleTs.current > 120) {
      lastRippleTs.current = now;
      spawnRipple(e);
    }
  };

  const handleLeave = () => {
    const el = shellRef.current;
    if (!el) return;
    el.style.setProperty('--rA', '0');
  };

  const spawnRipple = (e) => {
    const el = shellRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleId.current++;
    setRipples((rs) => [...rs, { id, x, y }]);
    // Auto-remove after animation
    setTimeout(() => {
      setRipples((rs) => rs.filter((r) => r.id !== id));
    }, 900);
  };

  if (!currentTrack) return null;

  return (
    <div className={`fixed left-0 right-0 bottom-0 z-50 px-6 py-4 ${className}`}>
      <div
        ref={shellRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onMouseDown={spawnRipple}
        className={`relative overflow-hidden max-w-5xl mx-auto rounded-2xl backdrop-blur-3xl backdrop-saturate-200 ${
          darkMode 
            ? 'bg-gray-900/85 border border-gray-700/30 shadow-xl shadow-black/20' 
            : 'bg-white/90 border border-gray-200/50 shadow-xl shadow-gray-900/10'
        }`}
        style={{ 
          '--mx': '50%', 
          '--my': '50%', 
          '--rA': 0,
          boxShadow: darkMode 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)' 
            : '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3)'
        }}
      >
        {/* Subtle glass texture */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0 1px, transparent 1px 4px)'
          }}
        />
        {/* macOS-style subtle tint */}
        <div
          className={`pointer-events-none absolute inset-0 rounded-2xl ${darkMode ? 'bg-blue-100/3' : 'bg-blue-50/8'}`}
        />
        {/* Cursor highlight (soft) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-all duration-200"
          style={{
            background: 'radial-gradient(400px circle at var(--mx) var(--my), rgba(255,255,255,var(--rA)), transparent 50%)',
            mixBlendMode: darkMode ? 'soft-light' : 'overlay',
          }}
        />
        {/* Water ripple waves */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
          {ripples.map((r) => (
            <span
              key={r.id}
              className="absolute rounded-full"
              style={{
                left: r.x,
                top: r.y,
                width: 8,
                height: 8,
                transform: 'translate(-50%, -50%)',
                background:
                  'repeating-radial-gradient(circle, rgba(255,255,255,0.4) 0 1.5px, rgba(255,255,255,0) 1.5px 6px)',
                filter: 'blur(0.2px)',
                mixBlendMode: darkMode ? 'soft-light' : 'overlay',
                animation: 'pizzicato-ripple 800ms ease-out forwards',
                opacity: 0.7,
              }}
            />
          ))}
        </div>
        {/* macOS-style inner light */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: darkMode
              ? 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 50%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)',
          }}
        />
        {/* Keyframes for ripple waves */}
        <style>{`
          @keyframes pizzicato-ripple {
            0% {
              transform: translate(-50%, -50%) scale(0.3);
              opacity: 0.5;
            }
            70% {
              opacity: 0.25;
            }
            100% {
              transform: translate(-50%, -50%) scale(10);
              opacity: 0;
            }
          }
        `}</style>
        <div className="flex items-center gap-4 px-6 py-4">
          {/* Cover Art */}
          <div className="h-16 w-16 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-900 flex-shrink-0 shadow-lg">
            {currentTrack.cover ? (
              <img src={currentTrack.cover} alt="Album cover" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <div className={`w-6 h-6 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
              </div>
            )}
          </div>

          {/* Track Info */}
          <div className="min-w-0 flex-1">
            <div className={`text-base font-semibold truncate leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {currentTrack.title || 'Unknown Track'}
            </div>
            <div className={`text-sm truncate mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentTrack.artist || 'Unknown Artist'}
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                darkMode 
                  ? 'bg-white text-gray-900 hover:bg-gray-100 hover:shadow-xl' 
                  : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-xl'
              } transform hover:scale-105 active:scale-95`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} style={{ marginLeft: '1px' }} />}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-sm">
            <span className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatTime(progress)}
            </span>
            <div className="relative flex-1 h-1.5 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.5}
                value={Math.min(progress, duration || 0)}
                onChange={(e) => seek(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className={`h-full rounded-full transition-all duration-100 ${
                  darkMode ? 'bg-white' : 'bg-gray-900'
                }`}
                style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
              />
            </div>
            <span className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatTime(duration)}
            </span>
          </div>

          {/* Volume Control */}
          <div className="hidden lg:flex items-center gap-3 w-32">
            <FaVolumeDown className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} size={14} />
            <div className="relative flex-1 h-1.5 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className={`h-full rounded-full transition-all duration-100 ${
                  darkMode ? 'bg-white' : 'bg-gray-900'
                }`}
                style={{ width: `${volume * 100}%` }}
              />
            </div>
            <FaVolumeUp className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} size={14} />
          </div>

          {/* Close Button */}
          <button
            onClick={closePlayer}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white' 
                : 'bg-gray-200/80 text-gray-600 hover:bg-gray-300 hover:text-gray-800'
            } backdrop-blur-sm`}
            aria-label="Close player"
          >
            <FaTimes size={12} />
          </button>
        </div>

        {/* Mobile Progress Bar */}
        <div className="md:hidden px-6 pb-4">
          <div className="flex items-center gap-3">
            <span className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatTime(progress)}
            </span>
            <div className="relative flex-1 h-1.5 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.5}
                value={Math.min(progress, duration || 0)}
                onChange={(e) => seek(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className={`h-full rounded-full transition-all duration-100 ${
                  darkMode ? 'bg-white' : 'bg-gray-900'
                }`}
                style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
              />
            </div>
            <span className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

PlayerBar.propTypes = {
  className: PropTypes.string,
};
