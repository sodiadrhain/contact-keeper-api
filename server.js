const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ urlencoded: false }));

app.get('/', (req, res) =>
  res.json({
    msg: 'Welcome to the ContactKeeper API...',
  })
);

//Auth route
app.use('/api/auth', require('./routes/auth'));

//User route
app.use('/api/users', require('./routes/users'));

//Contacts route
app.use('/api/contacts', require('./routes/contacts'));

//error route
app.all('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
