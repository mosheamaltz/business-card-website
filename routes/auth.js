var express = require('express');
const passport = require('passport');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
    if(req.user)
        res.redirect('/');
    else{
        var err=false;
        if(req.query.fail)
            err=true;
        res.render('login', { title: 'Log In', authenticated: false, errMsg: err });
    }
});

/* GET auth google */
router.get('/google', passport.authenticate('google'));

/* Callback for google to redirect to: */
router.get('/google/redirect',
/** Fire passport verify callback:*/ passport.authenticate('google'),
   function(req,res, next){
    res.redirect('/profile');
});



/* POST regular sign in */
router.post('/reg-signin',
    passport.authenticate('local',{
        failureRedirect: '/auth/?fail=1'
    }),
    function(req, res, next) {
        res.render('index', { title: 'Regular Authentication PH', authenticated: true });
    }
);



module.exports = router;
