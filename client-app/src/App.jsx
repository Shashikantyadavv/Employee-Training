import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Login from "./Login";
import Signup from "./Signup";
import VideoPlayer from "./VideoPlayer";
import VideoUpload from "./AddVideo";
import Home from "./Home";

const App = () => {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [progress, setProgress] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      const fetchUserData = async () => {
        try {
          const userRes = await axios.get("http://localhost:5000/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(userRes.data);

          const videoRes = await axios.get("http://localhost:5000/api/videos");
          setVideos(videoRes.data);

          const progressRes = await axios.get("http://localhost:5000/api/progress", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const progressMap = {};
          progressRes.data.forEach((item) => {
            progressMap[item.videoId._id] = {
              progress: item.progress,
              lastWatched: item.lastWatched,
            };
          });

          setProgress(progressMap);
        } catch (error) {
          console.error("Error fetching data", error);
        }
      };

      fetchUserData();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  const calculateOverallProgress = () => {
    const totalProgress = Object.values(progress).reduce(
      (acc, curr) => acc + curr.progress,
      0
    );
    return Math.round(totalProgress / videos.length || 0);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/login"
              element={
                user ? (
                  user.role === 'admin' ? (
                    <Navigate to="/upload" />
                  ) : (
                    <Navigate to="/" />
                  )
                ) : (
                  <Login setToken={setToken} />
                )
              }
            />
            <Route
              path="/signup"
              element={user ? <Navigate to="/" /> : <Signup />}
            />
            <Route
              path="/video/:id"
              element={
                user ? (
                  <VideoPlayer
                    token={token}
                    user={user}
                    progress={progress}
                    setProgress={setProgress}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/upload"
              element={
                user && user.role === 'admin' ? (
                  <VideoUpload token={token} handleLogout={handleLogout} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            <Route
              path="/"
              element={
                user ? (
                  <Home
                    videos={videos}
                    progress={progress}
                    token={token}
                    user={user}
                    setProgress={setProgress}
                    handleLogout={handleLogout}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
