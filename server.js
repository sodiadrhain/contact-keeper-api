const { urlencoded } = require('express');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ urlencoded: true }));

app.get('/', (req, res) =>
  res.json({
    status: true,
  })
);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
