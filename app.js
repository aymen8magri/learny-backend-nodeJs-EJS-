const express = require('express');

require('./config/connect');

const stagiaireRoutes = require('./routes/stagiaireRoutes');

const app = express();
app.use(express.json());


app.use('/api/stagiaires', stagiaireRoutes);



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});