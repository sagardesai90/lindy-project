# GIF Explorer App

A Giphy-like application built with React frontend and Node.js backend that allows users to browse trending GIFs and search for specific GIFs with infinite scrolling.

## Features

- 🎯 Display trending GIFs on initial page load (limit: 20)
- 🔍 Search functionality with real-time results
- 📱 Infinite scrolling for both trending and search results
- 📱 Mobile and desktop responsive design
- 🎨 Modern, beautiful UI with smooth animations

## Tech Stack

- **Frontend**: React.js with hooks (useState, useEffect, useCallback, useRef)
- **Backend**: Node.js with Express.js
- **API**: Giphy API (via our backend proxy)
- **Styling**: CSS3 with responsive design
- **HTTP Client**: Axios

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Giphy API key

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lindy-project
   ```

2. **Set up environment variables**
   Create a `.env` file in the backend directory with your Giphy API key:
   ```
   GIPHY_KEY=your_giphy_api_key_here
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on http://localhost:3001

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on http://localhost:3000

3. **Open your browser**
   Navigate to http://localhost:3000 to see the application

## API Endpoints

- `GET /api/trending` - Get trending GIFs
- `GET /api/search?q=<query>` - Search for GIFs

## Project Structure

```
lindy-project/
├── backend/
│   ├── server.js          # Express server with API routes
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   └── App.css       # Styling
│   └── package.json      # Frontend dependencies
└── README.md
```

## How It Works

1. **Initial Load**: The app fetches trending GIFs from Giphy API via our backend
2. **Search**: Users can type in the search field to find specific GIFs
3. **Infinite Scrolling**: Uses Intersection Observer API to detect when user reaches the bottom
4. **Dynamic Loading**: Automatically loads more GIFs as user scrolls
5. **Responsive Design**: Adapts to different screen sizes

## Areas for Improvement (Given More Time)

- Add GIF categories and filters
- Implement user authentication
- Add favorites/bookmarking functionality
- Implement GIF sharing capabilities
- Add loading skeletons for better UX
- Implement error boundaries and better error handling
- Add unit and integration tests
- Implement caching for better performance
- Add keyboard navigation support
- Implement GIF preview on hover

## License

ISC
