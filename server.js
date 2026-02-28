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
            callback(null, true);
        }
    },
    credentials: true
}));
app.use(express.json());

// Paths
const distPath = path.resolve(__dirname, 'dist');
const uploadDir = path.resolve(__dirname, 'public', 'upload');

console.log('Server starting...');
console.log('Dist path:', distPath);
console.log('Upload path:', uploadDir);

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

// Diagnostic Route
app.get("/api/debug-dist", (req, res) => {
    try {
        const exists = fs.existsSync(distPath);
        const indexExists = fs.existsSync(path.join(distPath, 'index.html'));
        res.json({
            cwd: process.cwd(),
            dirname: __dirname,
            distPath,
            exists,
            indexExists,
            time: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SPA Fallback: Serve index.html for any other GET requests (for React Router)
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: `API route ${req.method} ${req.url} not found.` });
    }

    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile('index.html', { root: distPath }, (err) => {
            if (err) {
                console.error("Error sending file:", err);
                if (!res.headersSent) {
                    res.status(500).send("Error loading app. Please try again.");
                }
            }
        });
    } else {
        res.status(404).send(`Frontend build not found at ${indexPath}. Please run build command.`);
    }
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));