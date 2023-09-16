const express = require('express');
const path = require('path');
const logger = require('morgan');
   
const app = express();
   
app.use(logger('dev'));
app.use(express.json());


require('dotenv').config();
require('./config/database');

app.use(express.static(path.join(__dirname,'..' ,'client', 'build')));


// app.get('/api/home', (req,res) => {
//     res.json({message: "Welcome to the home page"})
// });

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname,'..','client', 'build', 'index.html'));
  });

const port = process.env.PORT || 3001;

app.listen(port, function() {
 console.log(`Express app running on port ${port}`)
});