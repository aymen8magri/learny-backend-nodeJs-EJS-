const express = require('express');

require('./config/connect');

const stagiaireRoutes = require('./routes/stagiaireRoutes');

const app = express();
app.use(express.json());
const path = require('path');
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');



app.use('/responsable/stagiaires', stagiaireRoutes);



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});