const express = require('express');
const router = express.Router();

const generateSystemUser = require('./generateSystemUser.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'FB Partner Login Test App' });
});

router.get('/ssapiSetup', function(req, res, next) {
  const clientToken = req.query.token;
  const clientPixel = req.query.pixel;
  generateSystemUser(clientToken, clientPixel).then(suAccessToken => res.json(suAccessToken));

})

module.exports = router;
