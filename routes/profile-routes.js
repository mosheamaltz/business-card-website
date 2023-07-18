var express = require('express');
var router = express.Router();

var multer = require('multer');

var upload = multer({storage: multer.memoryStorage()});

var Card = require('../model/card');
var User = require('../model/user');


const { image_bufs_to_files, extension } = require('./helper-fuctions');


router.use(function(req,res,next){
  if(!req.user)
      res.redirect('/auth/');
  else next();
});

function render_prof_page(req, res){
  Card.find({
    '_id' : {$in: req.user.cards}
  })
  .then( (cardArray) => {

    image_bufs_to_files(cardArray);
    res.location('/profile/');
    res.render('profile', {
      user : req.user,
      cards: cardArray,
      title: 'My Profile', 
      authenticated: true
    });
  });
}

router.post('/create-card', upload.single('image_file'), function(req, res, next){
  console.log(req.file);

  new Card({
    user: req.user.id,
    name: req.body.name,
    phone: req.body.phone,
    type: req.body.type,
    website: req.body.website,
    business_email: req.body.business_email,
    image_filename: extension(req.file.originalname),
    image: req.file.buffer
  }).save()
  .then( (newCard)=>{
    User.findByIdAndUpdate(req.user.id,{$push: {'cards': newCard.id}})
    .then( (updatedUser)=>{
      req.user = updatedUser;
    }).then(()=>{
      res.redirect('/profile/');}
    );
  });
});

router.post('/edit-card', upload.single('image_file'), (req, res, next)=>{
  var cardId = req.query._id;
  var updateFields = {};
  for(var field in req.body){
    if(field in Card.schema.tree && req.body[field] != '' )
      updateFields[field] = req.body[field];
  }
  Card.findByIdAndUpdate(cardId, updateFields)
  .then( (updatedCard)=>{
      console.log('Updated Card: ', updatedCard);
      res.redirect('/profile/');
  });
});


router.delete('/delete-card', (req, res, next) =>{
  var cardId = req.query._id;
  Card.findByIdAndDelete(cardId)
  .then( () => {
    User.findByIdAndUpdate(req.user.id, {$pull: {'cards': cardId}}).then(( updUser )=>{
      console.log('Card '+updUser+' deleted successfully');
      next();
    });
  });
});

router.use(render_prof_page);
module.exports = router;