


// Create Card button event handler:

var openCardForm = ()=>{
    document.getElementById('createCardForm').style.visibility='visible';
};

var closeCardForm = ()=>{
    document.getElementById('createCardForm').style.visibility='hidden';
}

//File Chosen event handler:

var fileChosen = ()=>{
    if(this.files[0].size > 500*1024){ // If file greater than 500 KB
       alert("File is too big! File needs to be smaller than 500KB. Please select another file");
       this.value = "";
    };
};
