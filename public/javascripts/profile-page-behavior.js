

// Create Card button event handler:


var insideCard = false;

var card_to_pdf = (card) => {
    var doc = new jsPDF({
    orientation: 'l',
    unit: 'px',
    format: [340, 150]
    });
    doc.setFillColor('#f0f8ff');
    doc.setTextColor('#00008b');
    doc.setFontSize(20);
    var offset = 300 - doc.getTextWidth(card.name);
    doc.text(card.name, offset, 25);
    doc.setFontSize(13);
    offset = 290 - doc.getTextWidth(card.type);
    doc.text(card.type, offset, 50);
    doc.text('Contact Us!', 180, 90);
    offset = 10;
    doc.text(card.phone, offset, 120);
    offset+=doc.getTextWidth(card.phone) + 5;
    doc.textWithLink(card.website, offset, 120, {url: card.website});
    offset+=doc.getTextWidth(card.website) + 5;
    doc.textWithLink(card.business_email, offset, 120, {url: 'mailto:'+card.business_email});
    
    var img_h = card.img.height;
    var img_w = card.img.width;
    var type = card.img.src.split('.');
    type = type[type.length-1];
    doc.addImage(card.img, type, 20, 14, img_w, img_h);
    return doc.output('blob');
};
  


document.getElementsByTagName('body')[0].addEventListener('click', event=>{
    if(insideCard){
        insideCard = false;
        return;
    }
    deselectAllCards();
    var buttons = document.getElementsByClassName('selected-card-option-btn')
    for(let i=0; i<buttons.length; i++)
        buttons[i].classList.remove('visible');
});

var form_visible = ()=>{
    document.getElementsByClassName('card-form')[0].classList.add('visible');
};

var closeCardForm = ()=>{
    document.getElementsByClassName('card-form')[0].classList.remove('visible');
}

var createCard = ()=>{
    var formInputs = document.getElementsByTagName('form')[0].getElementsByTagName('input');
    for(let i=0; i<formInputs.length; i++){
        if(formInputs[i].type === 'text'|'url'|'email')
            formInputs[i].value = '';
    }
    form_visible();
};



//File Chosen event handler:

var fileChosen = ()=>{
    if(this.files && this.files[0].size > 500*1024){ // If file greater than 500 KB
       alert("File is too big! File needs to be smaller than 500KB. Please select another file");
       this.value = "";
    };
};


var deselectAllCards = ()=>{
    var selectedCards = document.getElementsByClassName('selected');
    for(let i = 0; i<selectedCards.length; i++)
    {
        selectedCards[i].classList.remove('selected');
    }
};

var selectCard = (element)=>{
    insideCard=true;
    deselectAllCards();
    closeCardForm();
    element.classList.add('selected');
    var buttons = document.getElementsByClassName('selected-card-option-btn')
    for(let i=0; i<buttons.length; i++)
        buttons[i].classList.add('visible');
};

var downloadSelectedCard = ()=>{
    var selectedCard = document.getElementsByClassName('selected')[0];
    var card = {
        name: selectedCard.getElementsByTagName('p')[0].textContent,
        type: selectedCard.getElementsByTagName('p')[1].textContent,
        phone: selectedCard.getElementsByTagName('p')[3].textContent,
        website: selectedCard.getElementsByTagName('a')[0].textContent,
        business_email: selectedCard.getElementsByTagName('a')[1].textContent,
        img: selectedCard.getElementsByTagName('img')[0]
    };
    var blob = card_to_pdf(card);
    var fileName = card.name+'.pdf';
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.dispatchEvent(new MouseEvent('click'));
};

var editSelectedCard = ()=>{
    var selectedCard = document.getElementsByClassName('selected')[0];
    var card = {
        name: selectedCard.getElementsByTagName('p')[0].textContent,
        type: selectedCard.getElementsByTagName('p')[1].textContent,
        phone: selectedCard.getElementsByTagName('p')[3].textContent,
        website: selectedCard.getElementsByTagName('a')[0].textContent,
        business_email: selectedCard.getElementsByTagName('a')[1].textContent
    };
    for(var property in card){
        document.getElementById(property).value = card[property];
    }
    document.getElementById('submit_form').value = 'Edit Card';
    var form = document.getElementsByTagName('form')[0];
    form.action='/profile/edit-card/?_id='+selectedCard.getAttribute('_id');
    form_visible();
};

var deleteSelectedCard = ()=>{
    var selectedCard = document.getElementsByClassName('selected')[0];
    if( !confirm('Are you sure you want to delete this card?\n' + selectedCard.textContent) )
        return;
    fetch('/profile/delete-card/?_id='+
        selectedCard.getAttribute('_id'),{
            method: 'DELETE',
        }).then(()=>{
            location.reload();
        })
}