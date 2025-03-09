// routes/trello.js
const express = require('express');
const { sortUpdateTrello } = require('../controllers/trelloController');
const router = express.Router();


// just need one route, but all the logic would go in one controller function. All the checks
router.post('/axe-violations', sortUpdateTrello);
module.exports = router;