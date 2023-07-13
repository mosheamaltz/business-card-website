var express = require('express');
var router = express.Router();

var path = require('path');
var fs = require('fs');
var multer = require('multer');

var upload = multer({storage: multer.memoryStorage()});

var Card = require('../model/card');
var User = require('../model/user');

const { pathToFileURL } = require('url');

router.use(function(req,res,next){
  if(!req.user)
      res.redirect('/auth/');
  else next();
});

router.get('/', function(req, res, next){
  Card.find({
    '_id' : {$in: req.user.cards}
  })
  .then( (cardArray) => {
    for(let i=0; i< cardArray.length; i++){

      if(!cardArray[i].image_filename)
        continue;
      let filepath = '/images/displayed_files/image_of_card_' + 
        i + 
        cardArray[i].image_filename;

      let buffer = cardArray[i].image;
      console.log(filepath);
      try{
        fs.writeFileSync(pathToFileURL(path.join(__dirname,'..','public',filepath)), buffer, {flag: 'wx+'});
      } catch(err){
        console.log(err);
      }
      cardArray[i].$locals.image_src = filepath;
    }
    res.render('profile', {
      user : req.user,
      cards: cardArray,
      title: 'My Profile', 
      authenticated: true
    });
  });
});

router.post('/create-card', upload.single('image_file'), function(req, res, next){
  console.log(req.file);

  new Card({
    user: req.user.id,
    name: req.body.name,
    phone: req.body.phone,
    type: req.body.type,
    website: req.body.website,
    business_email: req.body.business_email,
    image_filename: req.file.originalname,
    image: req.file.buffer
  }).save()
  .then( (newCard)=>{
    User.findByIdAndUpdate(req.user.id,{$push: {'cards': newCard.id}})
    .then( (updatedUser)=>{
      req.user = updatedUser;
    }).then(()=>{
      res.redirect('/');}
    );
  });
});





module.exports = router;