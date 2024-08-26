import React, { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import axios from "axios";

const VideoPlayer = ({ token, user, progress, setProgress, video }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); 
  const [currentTime, setCurrentTime] = useState(0); 
  const [duration, setDuration] = useState(0); 
  const id = video._id;
  const allProgress = progress;
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (videoRef.current && allProgress[id]?.lastWatched) {
      videoRef.current.seekTo(allProgress[id].lastWatched, "seconds");
    }
  }, [video, allProgress, id]);

  const handleProgress = async (state) => {
    const currentTime = state.playedSeconds;
    const duration = video?.duration || state.loadedSeconds;
    setCurrentTime(currentTime);
    setDuration(duration);
    const newProgress = Math.max(
      progress[id]?.progress || 0,
      (currentTime / duration) * 100
    );

    setProgress((prev) => ({
      ...prev,
      [id]: { progress: newProgress, lastWatched: currentTime, current: true },
    }));

    try {
      await axios.post(
        `${apiUrl}/user/progress`,
        {
          userId: user._id,
          videoId: id,
          progress: newProgress,
          lastWatched: currentTime,
          current: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error posting progress:", error);
    }
  };

  const handleEnded = async () => {
    try {
      await axios.post(
        `${apiUrl}/user/progress`,
        {
          userId: user._id,
          videoId: id,
          progress: 100,
          lastWatched: video?.duration,
          current: false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error posting progress:", error);
    }
  };


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    if (videoRef.current && allProgress[id]?.lastWatched) {
      videoRef.current.seekTo(allProgress[id].lastWatched, "seconds");
    }
  }, [video, progress, id]);


  return video ? (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">{video.title}</h2>
      <div className="mb-8">
        <ReactPlayer
          ref={videoRef}
          url={"http://localhost:5000/" + video.url}
          controls={false}
          playing={isPlaying} 
          className="w-full h-auto rounded-lg shadow-lg"
          onProgress={handleProgress}
          onEnded={handleEnded}
          onError={(e) => console.log("Error", e)}
          progressInterval={1000} 
          onStart={() => {
            if (videoRef.current && progress[id]?.lastWatched != null) {
              console.log(progress[id].lastWatched);
              videoRef.current.seekTo(progress[id].lastWatched, "seconds");
            }
          }}
          onPlay={() => setIsPlaying(true)} 
          onPause={() => setIsPlaying(false)} 
        />
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsPlaying((prev) => !prev)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <span className="text-gray-600">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <button
          onClick={() => {
            if (videoRef.current) {
              const rewindTime = Math.max(0, progress[id]?.lastWatched - 10);
              setProgress((prev) => ({
                ...prev,
                [id]: { ...prev[id], lastWatched: rewindTime },
              }));
              videoRef.current.seekTo(rewindTime, "seconds");
            }
          }}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Rewind 10s
        </button>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">
          Progress: {Math.round(progress[id]?.progress || 0)}%
        </span>
      </div>
    </div>
  ) : (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Loading...</h2>
    </div>
  );
};

export default VideoPlayer;
