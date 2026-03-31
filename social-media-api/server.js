// server.js
const express = require('express');
const multer  = require('multer');
const authMiddleware = require('./middleware/auth');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());          // parses JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // serve uploaded images

// Template engine
app.set('view engine', 'ejs');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Routes (added in later steps)
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);

// POST /api/upload — upload an image
app.post('/api/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: 'No file uploaded' });
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

app.get('/posts', (req, res) => {
  // In a real app you'd import the posts array
  res.render('posts', { posts: [] });
});

// Home route
app.get('/', (req, res) => {
  res.send('Social Media API is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});