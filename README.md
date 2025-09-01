# URL Shortener

A modern URL shortening service built with React and Node.js. This application allows users to create shortened versions of long URLs, making them easier to share and manage.

## Features

- Shorten any valid URL
- Clean and responsive user interface
- Real-time URL shortening
- Instant redirection to original URLs

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Vite (Build tool)

### Backend
- Node.js
- Express
- CORS
- nanoid (for generating unique URLs)

## Project Structure

```
URL_Shortner/
├── url-shortener-frontend/    # Frontend React application
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
└── url-shortener-backend/     # Backend Node.js server
    ├── server.js             # Express server setup
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hrushikeshpatil05/url-shortener.git
   cd URL_Shortner
   ```

2. Install backend dependencies:
   ```bash
   cd url-shortener-backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../url-shortener-frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd url-shortener-backend
   node server.js
   ```
   The server will start on http://localhost:8000

2. In a new terminal, start the frontend development server:
   ```bash
   cd url-shortener-frontend
   npm run dev
   ```
   The frontend will be available at http://localhost:5173

## How to Use

1. Open your browser and navigate to http://localhost:5173
2. Enter a long URL in the input field
3. Click "Shorten URL"
4. Copy and share the generated short URL
5. Anyone with the short URL will be redirected to the original URL

## API Endpoints

- `POST /shorten`: Create a new short URL
  - Body: `{ "url": "https://example.com" }`
  - Response: `{ "shortUrl": "http://localhost:8000/r/abc123" }`

- `GET /r/:id`: Redirect to original URL
  - Parameters: `id` - The unique identifier for the shortened URL

## Technical Notes

- URLs are stored in memory (they will be reset when the server restarts)
- Short URLs are generated using nanoid for uniqueness
- The backend uses CORS to allow requests from the frontend
- Frontend makes asynchronous API calls using the Fetch API

## Future Improvements

- Add database persistence for URLs
- Implement user accounts
- Add analytics for URL clicks
- Custom URL slugs
- URL expiration dates
- Click tracking and statistics

## License

This project is open source and available under the [MIT License](LICENSE).
