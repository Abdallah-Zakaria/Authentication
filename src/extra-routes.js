'use strict';
const permissions = require('./middleware/authorize');
const express = require('express');
const router = express.Router();
const bearerMiddleware = require('./middleware/bearer-auth');
router.get('/secret', bearerMiddleware, (req,res) => {
  res.json(req.user);
});
router.get('/read', bearerMiddleware, permissions('read'),(req,res)=>{
  res.status(200).json('Have access');
});
router.post('/add', bearerMiddleware, permissions('create'),(req,res)=>{
  res.status(201).json('Have access');
});
router.put('/change', bearerMiddleware, permissions('update'),(req,res)=>{
  res.status(202).json('Have access');
});
router.delete('/remove', bearerMiddleware, permissions('delete'),(req,res)=>{
  res.status(202).json('Have access');
});

module.exports = router;