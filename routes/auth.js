var express = require('express');
const passport = require('passport');
var router = express.Router();

const multer = require('multer');
var parser = multer({});

const User = require('../model/user');
const bodyParser = require('body-parser');

/* GET login page. */
router.get('/', function(req, res, next) {
    if(req.user)
        res.redirect('/');
    else{
        var err=false;
        if(req.query.fail)
            err='Wrong username/password. Please try again.';
        res.render('login', { 
            title: 'Log In', 
            authenticated: false, 
            errMsg: err, 
            in_or_up: '/reg-signin/'
        });
    }
});


/* GET SIGN UP PAGE */

router.get('/sign-up', (req, res, next)=>{
    var err=false;
    if(req.query.fail)
        err='There already is a user with that email.';
    res.render('login', { 
        title: 'Log In', 
        authenticated: false, 
        errMsg: err, 
        in_or_up: '/register/'
    });
});

//POST SIGN UP FORM RESULTS:
router.post('/register/', parser.none(), (req, res, next)=>{
    User.findOne({username: req.body.username})
    .then( user => {
        if(user)
            res.redirect('/auth/sign-up/?fail=1');
        else{
            passport.authenticate('register-user', {
                'successRedirect': '/auth/enter-password/',
                'failureRedirect': '/auth/sign-up/?fail=1',
            });
        }
    })
});


//GET ENTER PASSWORD FORM

router.get('/enter-password',(req, res)=>{
    if(!req.user)
        res.redirect('/auth/');
    else
        res.render('enterPassword', {
            title: "Choose Password for your account"
        });
})

//POST ENTER PASSWORD FORM RESULTS
router.post('/password-results', parser.none(), (req, res)=>{
    if(!req.user)
        res.redirect('/auth/');
    else
        User.findByIdAndUpdate(req.user.id, {password: res.password})
        .then( (updatedUser)=>{
            console.log(updatedUser.username, updatedUser.password);
            res.redirect('/profile/');
        })
})


/* GET auth google */
router.get('/google', passport.authenticate('google'));

/* Callback for google to redirect to: */
router.get('/google/redirect',
/** Fire passport verify callback:*/ passport.authenticate('google'),
   function(req,res, next){
    res.redirect('/auth/enter-password/');
});



/* POST regular sign in */
router.post('/reg-signin',
    passport.authenticate('reg-login',{
        failureRedirect: '/auth/?fail=1'
    }),
    function(req, res, next) {
        res.redirect('/profile/')
    }
);



module.exports = router;
