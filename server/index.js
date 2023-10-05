const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());

app.use(cors({
  origin: ['https://mindful-journal.vercel.app', 'http://localhost:3000' ],
  methods: 'GET, POST, PUT, DELETE',
  credentials: true,
}));



require('dotenv').config();
require('./config/database');

app.use('/', require("./routes/authRoute"));

const studentRoute = require("./routes/student.js");
app.use("/api/students", studentRoute);
app.use("/api", studentRoute)

const teacherRoute = require('./routes/teacher.js');
app.use("/api", teacherRoute)

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});


// *** Use if testing routes with postman instead of above app.use and app.get
// app.get('/', (req, res) => {
//   res.send('Hello, Express!')
// })

const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log(`Express app running on port ${port}`)
});