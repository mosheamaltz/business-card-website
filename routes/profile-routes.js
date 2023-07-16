var express = require('express');
var router = express.Router();

var multer = require('multer');

var upload = multer({storage: multer.memoryStorage()});

var Card = require('../model/card');
var User = require('../model/user');


const { image_bufs_to_files, extension, card_to_pdf } = require('./helper-fuctions');


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

    image_bufs_to_files(cardArray);

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
    image_filename: extension(req.file.originalname),
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


router.get('/get-pdf/', (req, res, next)=>{
  Card.findById(req.query._id)
  .then((card)=>{
    card_to_pdf(card, res);
  });
});


module.exports = router;