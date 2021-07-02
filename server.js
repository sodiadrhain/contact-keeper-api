const express = require('express');
const app = express();
const connectDb = require('./config/db');
const PORT = process.env.PORT || 5000;

// Coonect to Database;
connectDb();

app.use(express.json());

app.get('/', (req, res) =>
  res.json({
    msg: 'Welcome to the ContactKeeper API...',
  })
);

// Auth route
app.use('/api/auth', require('./routes/auth'));

// User route
app.use('/api/users', require('./routes/users'));

// Contacts route
app.use('/api/contacts', require('./routes/contacts'));

// Error route
app.all('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
