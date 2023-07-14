var express = require('express');
const passport = require('passport');
var router = express.Router();


function generatePassword() {
    var length = 12,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}


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


/* GET SIGN UP PAGE */

router.get('/sign-up', (req, res, next)=>{

});

router.get('/create-password', (req, res, next)=>{

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
