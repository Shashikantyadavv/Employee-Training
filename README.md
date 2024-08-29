﻿# Employee-Training

					Employees Training

Project Overview
The project is a video training module application that allows users to view a series of videos. Each video tracks the user's progress, and the system manages playback restrictions based on the user's progress. The application is built using React for the frontend, Node.js with Express for the backend, and MongoDB for the database.
Frameworks and Libraries Used
•	Frontend:
o	React: Used for building the user interface.
o	Tailwind CSS: Used for styling the components.
o	React Router: Used for navigation between different pages.
o	Axios: Used for making HTTP requests to the backend.
•	Backend:
o	Node.js with Express: Used to create the REST API that interacts with the frontend.
o	MongoDB with Mongoose: Used as the database to store video data and user progress.
o	JWT (JSON Web Tokens): Used for user authentication.
•	Video Player:
o	I chose ReactPlayer for its ease of use, React compatibility, and built-in support for multiple video sources and customization options, which align well with the project's requirements.
Key Functionalities
1.	Video Playback Management:
o	The user can play videos and their progress is tracked.
o	Users can navigate to the next or previous videos, with constraints based on their progress.
2.	Progress Tracking:
o	The system tracks the progress of each video for each user.
o	Progress is stored in MongoDB and fetched on the initial load.
3.	Navigation Constraints:
o	The "Next" button is disabled until the current video is completed (100% progress).
o	The "Previous" button is disabled when the user is at the first video.

To Run on your local system follow these steps:
1.	Clone the repo from https://github.com/Shashikantyadavv/Employee-Training .
2.	Open in VS Code.
3.	In .env file change the database uri and base API path.
4.	Run “npm i” for both client and server.
5.	For server run command “nodemon index.js”.
6.	For client run command “npm start”.
Live app link - https://employee-training-web.vercel.app/ .
Demo Video link - https://drive.google.com/file/d/1p7iUJwKYyh-kCcjZ3fkyVL_0aNIhWP4U/view?usp=sharing 

