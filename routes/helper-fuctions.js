
const { jsPDF } = require('jspdf');


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

var card_to_pdf = (card, res) => {
  var doc = new jsPDF({
    orientation: 'l',
    unit: 'px',
    format: [340,150]
  });
  doc.text(card.name, 200, 14);
  doc.text(card.type, 200, 30);
  doc.text('Contact Us!', 200, 50);
  doc.text(card.phone, 20, 120);
  doc.textWithLink(card.website, 150, 120, {url: card.website});
  doc.textWithLink(card.business_email, 220, 120, {url: 'mailto:'+card.business_email});
  res.send(doc.output('blob'));
}

exports = module.exports = { };
exports.image_bufs_to_files = image_bufs_to_files;
exports.extension = extension;
exports.card_to_pdf = card_to_pdf;