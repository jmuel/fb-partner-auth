var express = require('express');
var router = express.Router();

const generateSystemUser = require('./generateSystemUser');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/ssapiSetup', function(req, res, next) {
  const token = req.params.token;
  const pixelId = req.params.pixel;
  generateSystemUser(token, pixelId).then(resp => res.json(response));
});

module.exports = router;
