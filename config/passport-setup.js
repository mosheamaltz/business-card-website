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
                    username: email
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


// Regular Log in - not thru google.
passport.use('reg-signin',
    new LocalStrategy(
        (email, password, done) => {
            email = stripEmailOfDots(email);
            User.findOne({username: email})
            .then( (curUser) => {
                if(curUser){
                    if(curUser.password != password)
                        return done(null, false);
                    else {
                        console.log("User logged in successfully", curUser.username, curUser.password);
                        return done(null, curUser);
                    }
                }
                else {
                    return done(null, false);
                }
            })
        }
    )
);

//Add new password and log in:

passport.use('register-user',
    new LocalStrategy(
        (email, password, done) => {
            email=stripEmailOfDots(email);
            User.findOne({username: email})
            .then( (foundUser) => {
                if(!foundUser){
                    new User(
                        {
                            username: email,
                            password: null
                        }
                    ).save()
                    .then( (newUser) => {
                        console.log("new user created. ", newUser);
                        return done(null, newUser);
                    });
                }
                else{
                    return done(null, false);
                }
            });
        }
    )
);