const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
   
const app = express();
   
app.use(logger('dev'));
app.use(express.json());
app.use(cors());

require('dotenv').config();
require('./config/database');

// const userRoute = require("./routes/user");
// app.use("/api/user", userRoute);

const studentRoute = require("./routes/student.js");
app.use("/api/students", studentRoute)

// app.use(express.static(path.join(__dirname,'..' ,'client', 'build')));

// app.get('/*', function(req, res) {
//     res.sendFile(path.join(__dirname,'..','client', 'build', 'index.html'));
//   });

app.get('/', (req, res) => {
  res.send('Hello, Express!')
})

const port = process.env.PORT || 3001;

app.listen(port, function() {
 console.log(`Express app running on port ${port}`)
});