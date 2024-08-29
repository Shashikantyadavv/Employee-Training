

---

# Employees Training

## Project Overview

The Employees Training project is a video training module application designed to help users follow a structured series of training videos. The application tracks user progress for each video and implements playback restrictions based on the user's progress. It is built using React for the frontend, Node.js with Express for the backend, and MongoDB for the database.

## Frameworks and Libraries Used

### Frontend
- **React:** For building the user interface.
- **Tailwind CSS:** For styling components with ease and consistency.
- **React Router:** For seamless navigation between different pages.
- **Axios:** For making HTTP requests to the backend.

### Backend
- **Node.js with Express:** To create a REST API that communicates with the frontend.
- **MongoDB with Mongoose:** For storing video data and tracking user progress.
- **JWT (JSON Web Tokens):** For secure user authentication.

### Video Player
- **ReactPlayer:** Chosen for its simplicity, compatibility with React, and support for multiple video sources and customization options. It perfectly aligns with the project's requirements.

## Key Functionalities

1. **Video Playback Management:**
   - Users can play videos, and their progress is automatically tracked.
   - Navigation to the next or previous videos is enabled with constraints based on user progress.

2. **Progress Tracking:**
   - The system keeps track of each user's progress for every video.
   - Progress is stored in MongoDB and retrieved upon initial load.

3. **Navigation Constraints:**
   - The "Next" button is disabled until the current video is fully completed (100% progress).
   - The "Previous" button is disabled when the user is on the first video.

## How to Run the Project Locally

To run the project on your local machine, follow these steps:

1. **Clone the Repository:**
   - Clone the repository from [GitHub](https://github.com/Shashikantyadavv/Employee-Training).

2. **Open the Project:**
   - Open the project in Visual Studio Code (VS Code).

3. **Configure Environment Variables:**
   - In the `.env` file, update the database URI and base API path as per your setup.

4. **Install Dependencies:**
   - Run `npm i` in both the client and server directories to install the required dependencies.

5. **Run the Server:**
   - Use the command `nodemon index.js` to start the server.

6. **Run the Client:**
   - Use the command `npm start` to start the client.

## Live Demo

- **Live App:** Check out the live application at [Employee Training Web](https://employee-training-web.vercel.app/).
- **Demo Video:** Watch a demo of the application [here](https://drive.google.com/file/d/1p7iUJwKYyh-kCcjZ3fkyVL_0aNIhWP4U/view?usp=sharing).

---

