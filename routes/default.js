const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
  return res.send("The app is Running");
})

module.exports = router; 
