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
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173', 'https://ems-2gho.onrender.com'].filter(Boolean);
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Ensure upload folder exists
const uploadDir = path.join(__dirname, 'public', 'upload');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/upload', express.static(uploadDir));

// Serve Static Files (Frontend Build)
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
    console.log('Serving static files from:', distPath);
    app.use(express.static(distPath));
}

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

// SPA Fallback: Serve index.html for any other GET requests (for React Router)
if (fs.existsSync(distPath)) {
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api/')) {
            res.sendFile(path.join(distPath, 'index.html'));
        } else {
            res.status(404).json({ message: `API route ${req.method} ${req.url} not found.` });
        }
    });
} else {
    // Catch-all for API 404s if dist is not present
    app.use((req, res) => {
        if (req.path.startsWith('/api/')) {
            res.status(404).json({ message: `API route ${req.method} ${req.url} not found.` });
        } else {
            res.status(404).send("Frontend build not found. Please run build command.");
        }
    });
}

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));