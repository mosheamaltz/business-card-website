var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');

function killUserDataFiles() {
  const directoryPath =  path.join(__dirname, '..', 'public', 'images', 'displayed_files');
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      } 
      
      for(let i in files){
        fs.unlink(path.join(directoryPath,files[i]), ()=>{ console.log(files[i]+' was deleted');});
      }
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Business card website', 
    authenticated: req.user? true: false
  });
});


/* GET sign out request*/
router.get('*/sign-out', function(req, res, next) {
  req.logout();
  killUserDataFiles();
  res.redirect('/');
});

/* DELETE page closed request*/
router.delete('/session-end', (req, res, next)=>{
  killUserDataFiles();
})



module.exports = router;
