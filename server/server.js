const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173', 'https://ems-2gho.onrender.com', 'https://ems-theta.vercel.app'].filter(Boolean);
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback to avoid blocking during debug
    }
  },
  credentials: true
}));
app.use(express.json());

// Paths - handled relative to where this file lives
// If this is in /server/server.js, we need to go up to find dist in root
const rootDir = __dirname.endsWith('server') ? path.join(__dirname, '..') : __dirname;
const distPath = path.join(rootDir, 'dist');
const uploadDir = path.join(rootDir, 'public', 'upload');

// Serve Static Files (Frontend Build)
app.use(express.static(distPath));

// Ensure upload folder is also served
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/upload', express.static(uploadDir));

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/departments', require('./routes/department'));
app.use('/api/employees', require('./routes/employee'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/salary', require('./routes/salary'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/dashboard', require('./routes/dashboard'));

// API Health Check
app.get("/api/health", (req, res) => {
  res.send("API is running...");
});

// Diagnostic Route: List files in dist
app.get("/api/debug-dist", (req, res) => {
  // Check both potential locations
  const locations = [
    { name: 'RootDist', path: path.join(__dirname, '..', 'dist') },
    { name: 'ServerDist', path: path.join(__dirname, 'dist') }
  ];

  const status = locations.map(loc => {
    const exists = fs.existsSync(loc.path);
    return {
      name: loc.name,
      path: loc.path,
      exists,
      files: exists ? fs.readdirSync(loc.path, { recursive: true }).slice(0, 50) : []
    };
  });

  res.json(status);
});

// SPA Fallback: Serve index.html for any other GET requests (for React Router)
app.get('*', (req, res) => {
  // If it's an API request that reached here, it's a 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: `API route ${req.method} ${req.url} not found.` });
  }

  // Otherwise, try to serve the index.html
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Fallback to searching in sub-dist if build was nested
    const nestedIndexPath = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(nestedIndexPath)) {
      res.sendFile(nestedIndexPath);
    } else {
      res.status(404).send("Frontend build not found. Please ensure the 'dist' folder exists.");
    }
  }
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));