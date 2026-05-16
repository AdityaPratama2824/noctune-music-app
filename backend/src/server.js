const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const playlistRoute = require('../src/routes/playlist.route');
const favoriteRoute = require('../src/routes/favorite.route')
const authRoute = require('../src/routes/auth.route')
const musicRoute = require('../src/routes/music.route')
const userRoute = require('../src/routes/user.route')
dotenv.config();

app.use(cors());

const app = express();
connectDB();

app.use(express.json());

app.use("/api/playlists", playlistRoute)
app.use("/api/favorites", favoriteRoute)
app.use("/api/auth", authRoute)
app.use("/api/music", musicRoute)
app.use("/api/users", userRoute)

app.get('/', (req, res) => {
  res.send('Noctune Music App is running!');
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});