const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const routes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(routes);

// add the user routes, un comment when other routes completed.
// app.use(require('./routes/api/user-routes'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});