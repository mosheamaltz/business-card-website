var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Business card website', authenticated: req.app.locals.authenticated});
});

/* GET sign out request*/
router.get('*/sign-out', function(req, res, next) {
  req.app.locals.authenticated =false;
  res.redirect('/');
});

module.exports = router;
