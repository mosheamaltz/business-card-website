const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local');
const keys = require('./keys');
const User = require('../model/user');

function stripEmailOfDots(email){
    [head, tail] = email.split('@');
    head = head.split('.').join('');
    return [head, tail].join('@');
}

function generatePassword() {
    var length = 12,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

passport.serializeUser( (user, done) => {
    
    if(user)
        done(null, user.id);
    else done(null, false);
});

passport.deserializeUser( (id, done) => {
    User.findById(id)
    .then( (user) => {
        done(null, user);
    });
});


// Google strategy:

passport.use(
    new GoogleStrategy({
        callbackURL: keys.google.redirectURI, /* needs to specify url from http:,
                                                 otherwise adds unexpected "/google/" */
        clientID : keys.google.client_id,
        clientSecret : keys.google.client_secret,
        scope: ['email']
    }, 

    // Once user info accessed from google:

    (accessToken, refreshToken, profile, done) => {
        
        email = stripEmailOfDots(profile._json.email);
        console.log(email);
        // search database for user with profile.id:
        User.findOne({username: email})
        .then( (curUser) => {
            if(curUser){
                //already have user
                done(null, curUser);
            }
            else { // need to create new user for this google id
                new User({
                    username: email,
                    password: generatePassword()
                })
                .save()
                .then( (newUser) => {
                    console.log("new user created. ", newUser);
                    done(null, newUser);
                });
            }
        });
    })
);



passport.use(
    new LocalStrategy(
        (email, password, done) => {
            email = stripEmailOfDots(email);
            User.findOne({username: email})
            .then( (curUser) => {
                if(curUser){
                    if(curUser.password != password)
                        done(null, false);
                    else {
                        console.log("User logged in successfully", curUser.username, curUser.password);
                        done(null, curUser);
                    }
                }
                else {// create new user
                    new User({
                        username: email,
                        password: password
                    }).save()
                    .then( (newUser) => {
                        console.log("User Created! ", newUser.username, newUser.password);
                        done(null, newUser);
                    })
                }
            })
        }
    )
);
