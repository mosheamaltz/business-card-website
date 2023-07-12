var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Business card website', 
    authenticated: req.user? true: false
  });
});


/* GET sign out request*/
router.get('*/sign-out', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
