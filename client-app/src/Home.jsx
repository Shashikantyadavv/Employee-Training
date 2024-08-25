import React, { useEffect, useState } from "react";
import CircularProgress from "./CircularProgress"; 
import VideoPlayer from "./VideoPlayer"; 
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Home = ({ progress, token, user, setProgress, handleLogout }) => {
  const [currentIndex, setCurrentIndex] = useState(null); 
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false); 
  const navigate = useNavigate();

  const calculateOverallProgress = () => {
    const totalProgress = Object.values(progress).reduce(
      (acc, curr) => acc + curr.progress,
      0
    );
    return Math.round(totalProgress / videos.length || 0);
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoRes = await axios.get("http://localhost:5000/api/videos");
        const videosData = videoRes.data;
        setVideos(videosData);

        if (!initialLoadComplete) {
          const firstIncompleteVideoIndex = videosData.findIndex(
            (video) =>
              !progress[video._id] || progress[video._id]?.progress < 100
          );

          setCurrentIndex(
            firstIncompleteVideoIndex !== -1 ? firstIncompleteVideoIndex : 0
          );
          setInitialLoadComplete(true); 
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, [progress, initialLoadComplete]);

  const handleNextVideo = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const overallProgress = () => {
    const totalProgress = Object.values(progress).reduce(
      (acc, curr) => acc + curr.progress,
      0
    );
    return Math.round(totalProgress / (videos.length || 1)); 
  };

  const currentVideo = videos[currentIndex];

  return (
    <div className="container mx-auto py-8">
      <header className="bg-white shadow mb-8">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          {user ? (
            <>
              <div className="flex items-center">
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h1 className="text-xl font-bold">{user.username}</h1>
                  <h2 className="text-sm text-gray-600">
                    {user.role === 'user' ? `Progress: ${calculateOverallProgress()}%` : 'Welcome to Admin Dashboard'}
                  </h2>
                </div>
              </div>
              <div className="flex justify-center mb-8">
                <CircularProgress
                  progress={overallProgress()}
                  currentIndex={currentIndex} 
                  totalVideo={videos.length}
                />
              </div>
              <button
                onClick={() => {
                  handleLogout(); 
                  navigate('/login'); 
                }}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </header>
      {!loading && currentVideo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">
              Module {currentIndex + 1}: {currentVideo.title}
            </h2>
            <p className="text-gray-700 mb-4">{currentVideo.description}</p>
            <div className="flex justify-center">
              {currentVideo.thumbnailUrl && (
                <img
                  src={currentVideo.thumbnailUrl} 
                  alt="Video Thumbnail"
                  className="w-full rounded-lg mb-4"
                />
              )}
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <VideoPlayer
              token={token}
              user={user}
              progress={progress}
              setProgress={setProgress}
              video={currentVideo}
            />
          </div>
        </div>
      ) : (
        <div>Loading video...</div>
      )}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevVideo}
          disabled={currentIndex === 0}
          className={`py-2 px-4 rounded-lg ${currentIndex === 0
              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
        >
          &larr; Previous Video
        </button>
        <span className="text-gray-600 mx-4">
          Module {currentIndex + 1} of {videos.length}
        </span>
        <button
          onClick={handleNextVideo}
          disabled={
            currentIndex >= videos.length - 1 ||
            progress[currentVideo._id]?.progress < 100
          }
          className={`py-2 px-4 rounded-lg ${currentIndex >= videos.length - 1 ||
              progress[currentVideo._id]?.progress < 100
              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
        >
          Next Video &rarr;
        </button>
      </div>
    </div>
  );
};

export default Home;
