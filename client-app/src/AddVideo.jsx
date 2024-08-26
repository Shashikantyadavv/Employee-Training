import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VideoUpload = ({ token,handleLogout }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState('');
  const [description, setDescription] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleFileChange = (e) => setVideoFile(e.target.files[0]);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleOrderChange = (e) => setOrder(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const navigate= useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('videoFile', videoFile); 
    formData.append('title', title);
    formData.append('order', order);
    formData.append('description', description);

    try {
      await axios.post(`${apiUrl}/videos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Video uploaded successfully');
      setVideoFile(null);
      setTitle('');
      setOrder('');
      setDescription('');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error uploading video');
    }
  };

  return (

    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => {
          handleLogout(); 
          navigate('/login'); 
        }}
        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
      <h2 className="text-2xl font-bold mb-4">Upload Video</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Order</label>
          <input
            type="number"
            value={order}
            onChange={handleOrderChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Video File</label>
          <input
            type="file"
            accept="video/*"
            name="videoFile"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Upload Video
        </button>
      </form>
    </div>
  );
};

export default VideoUpload;
