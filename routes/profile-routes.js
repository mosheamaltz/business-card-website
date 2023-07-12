var express = require('express');
var router = express.Router();
var Card = require('../model/card');
var User = require('../model/user');
router.use(function(req,res,next){
  if(!req.user)
      res.redirect('/auth');
  else next();
});

router.get('/', function(req, res, next){
  Card.find({
    '_id' : {$in: req.user.cards}
  })
  .then( (cardArray) => {
    res.render('profile', {
      user : req.user,
      cards: cardArray,
      title: 'My Profile', 
      authenticated: true
    });
  });
});

router.post('/create-card', function(req, res, next){
  new Card({
    user: req.user.id,
    name: req.body.name,
    phone: req.body.phone,
    type: req.body.type,
    website: req.body.website,
    business_email: req.body.business_email
  }).save()
  .then( (newCard)=>{
    User.findByIdAndUpdate(req.user.id,{$push: {'cards': newCard.id}})
    .then( (updatedUser)=>{
      req.user = updatedUser;
      res.redirect('/profile');
    });
  })
});



module.exports = router;