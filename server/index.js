const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const session = require('express-session')
const app = express();


app.use(logger('dev'));
app.use(express.json());

app.use(cors({
  origin: ['https://mindful-journal.vercel.app', 'http://localhost:3000' ],
  methods: 'GET, POST, PUT, DELETE',
  credentials: true,
}));

app.use(cookieParser());

// app.set('trust proxy', 1);

require('dotenv').config();

// app.use(session({
//   secret: "secret",
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     sameSite: "none",
//     secure: true
//   },
// }));

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

const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log(`Express app running on port ${port}`)
});