var express = require('express');
const passport = require('passport');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
    if(req.app.locals.authenticated)
        res.render('index', { title: 'Business card website', authenticated: true})
    else
        res.render('login', { title: 'Log In', authenticated: false });
});

/* GET auth google */
router.get('/google', passport.authenticate('google'));

/* Callback for google to redirect to: */
router.get('/google/redirect',
/** Fire passport verify callback:*/ passport.authenticate('google'),
   function(req,res, next){

    res.send("Logged in thru google");
});



/* POST regular sign in */
router.post('/reg-signin', passport.authenticate('local'), function(req, res, next) {
    res.render('index', { title: 'Regular Authentication PH', authenticated: true });
});



module.exports = router;
