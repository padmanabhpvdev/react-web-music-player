import { useState, useRef, useEffect } from "react";
import "./App.css";
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaHeadphones } from "react-icons/fa";
import {songs} from './playlists.js';

export default function App() {
  const [current, setCurrent] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const playPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
  const index = songs.findIndex((s) => s.id === current.id);
  if (index < songs.length - 1) {
    const nextIndex = index + 1;
    setCurrent(songs[nextIndex]);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 0);
  }
};

const prevSong = () => {
  const index = songs.findIndex((s) => s.id === current.id);
  if (index > 0) {
    const prevIndex = index - 1;
    setCurrent(songs[prevIndex]);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 0);
  }
};


  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [current]);

  const handleSeek = (e) => {
    const time = e.target.value;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="app-container">
      <header>
        <h2 className="title">&nbsp;<FaHeadphones/> My Music Player</h2>
      </header>
      <div className="main">
        <div className="player">
          <div className="player-card">
            <img src={current.img} alt={current.title} width="270" height="270"/>
            <h2 className="song-title">{current.title}</h2>
            <span className="song-artist">{current.artist}</span>

            <audio ref={audioRef} src={current.src} onEnded={nextSong} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}/>
            <div className="timeline">
              <span className="time">{formatTime(currentTime)}</span>
              <input type="range" min="0" max={duration || 0} value={currentTime} onChange={handleSeek} className="custom-range"
              style={{ "--value": `${(currentTime / duration) * 100}%` }}/>
              <span className="time">{formatTime(duration)}</span>
            </div>
            <div className="controls">
              <button onClick={prevSong} disabled={songs.findIndex((s) => s.id === current.id) === 0}><FaStepBackward/></button>
              <button onClick={playPause}>{isPlaying ? <FaPause/> : <FaPlay/>}</button>
              <button onClick={nextSong} disabled={songs.findIndex((s) => s.id === current.id) === songs.length - 1}><FaStepForward/></button>
            </div>
          </div>
        </div>
        <div className="playlist">
          <h2>Playlist ({current.id} of {songs.length})</h2>
          <ul>
            {songs.map((song) => (
              <li
                key={song.id}
                onClick={() => {
                  setCurrent(song);
                  setIsPlaying(false);
                }}
                className={song.id === current.id ? "active" : ""}
                style={{display: "flex", flexDirection: "row"}}
              > <img src={song.img} width="40" height="40" alt="" style={{borderRadius: "10px"}}/>
                <div>
                  <strong>{song.title}</strong><br/>
                  <span>{song.artist}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
