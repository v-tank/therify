const express = require('express');
const router = express.Router();
const userRoutes = require('./api/users');
const photoRoutes = require('./api/photos');
//const commentRoutes = require('./api/comments');

router.use("/user", userRoutes);
router.use("/photos", photoRoutes);
//router.use("/comment", commentRoutes);

// If no API routes are hit, send a nice message
router.use(function(req, res) {
  console.log('!!!!');
  res.send("Have a nice day.");
});

module.exports = router;