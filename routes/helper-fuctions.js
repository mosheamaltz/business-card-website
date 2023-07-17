

var extension = (file) => {
    var arr = file.split('.');
    return arr[arr.length - 1];
};

var image_bufs_to_files = (cardArray) => {
    var fs = require('fs');
    var path = require('path');
    const { pathToFileURL } = require('url');
    for(let i=0; i< cardArray.length; i++){

      if(!cardArray[i].image_filename)
        continue;
      let filepath = '/images/displayed_files/' + 
        cardArray[i]._id + '.' +
        extension(cardArray[i].image_filename);

      let buffer = cardArray[i].image;
      console.log(filepath);
      try{
        fs.writeFileSync(pathToFileURL(path.join(__dirname,'..','public',filepath)), buffer, {flag: 'w+'});
      } catch(err){
        console.log(err);
      }
      cardArray[i].$locals.image_src = filepath;
    }
}

exports = module.exports = { };
exports.image_bufs_to_files = image_bufs_to_files;
exports.extension = extension;