'use strict';

// dependency
const express = require('express');
const app = express();
require('dotenv').config();

// refactor routes
const authRoutes = require('./auth/router');
const err404 = require('./middleware/404');
const err500 = require('./middleware/500');
// middleware
app.use(express.static('./public'));
app.use(express.json());
// main routes
app.use('/', authRoutes);

app.use('*', err404);
app.use(err500);

// export server
module.exports = {
  server: app,
  start: (port) => {
    port = process.env.PORT || port;
    app.listen(port, () => {
      console.log(`listing to port ${port}`);
    });
  },
};
