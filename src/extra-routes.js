'use strict';
const express = require('express');
const router = express.Router();
const bearerMiddleware = require('./middleware/bearer-auth');
router.get('/secret', bearerMiddleware, (req,res) => {
  res.json(req.user);
});

module.exports = router;