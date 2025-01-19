# Echo Web Application

Echo is a modern web application that allows users to search for songs, like their favorite tracks, store them in Firebase Firestore, and share playlists with others. It uses Firebase authentication with Google, React for the frontend, and Tailwind CSS for styling. The application integrates the YouTube API for fetching songs and features animations powered by Framer Motion.

## Features

- **Search for Songs:** Search for your favorite tracks using the YouTube API.
- **Like Songs:** Mark songs as liked and save them to Firebase Firestore.
- **Create and Share Playlists:** Organize your favorite tracks into playlists and share them with other users.
- **Responsive Design:** Tailored for both desktop and mobile devices using Tailwind CSS.
- **User Authentication:** Sign in with Google using Firebase Authentication.
- **Smooth Animations:** Framer Motion ensures a delightful user experience.

## Technologies Used

- **JavaScript**
- **React**
- **Firebase (Firestore, Authentication)**
- **YouTube API**
- **Tailwind CSS**
- **Framer Motion**

## Live Demo

Check out the live application here: [Echo Web App](https://echo25.netlify.app/)

## Setup Instructions

Follow these steps to set up and run the Echo web application on your local machine:

### 1. Fork and Clone the Repository

1. Fork this repository to your GitHub account.
2. Clone the forked repository:
   ```bash
   git clone https://github.com/Harman-DevCloud/Echo.git
   cd echo
   ```

### 2. Install Dependencies

Install the required dependencies using npm or yarn:

```bash
npm install
```

### 3. Set Up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Add a web app to your project and copy the Firebase configuration.
4. In the root directory of the project, create a `.env.local` file and add your Firebase configuration:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```
5. Enable Firestore and Google Authentication in the Firebase Console.

### 4. Set Up YouTube API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Enable the YouTube Data API v3 for your project.
4. Create an API key and copy it.
5. Add the API key to your `.env.local` file:
   ```env
   REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key
   ```

### 5. Run the Application

Start the development server:

```bash
npm start
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Deploying the Application

You can deploy the application to platforms like Vercel, Netlify, or Firebase Hosting. Make sure to set up the environment variables on the chosen platform.

## Contributing

Feel free to open issues or submit pull requests for new features or bug fixes.

## License

This project is licensed under the [MIT License](LICENSE).
