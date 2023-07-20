function generateRandomPassword() {
    var length = 12,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    //insert digit into first half of password:
    var ind = Math.floor(Math.random() * length/2);
    var ch = ("0123456789").charAt(Math.floor(Math.random() * 10));
    retVal = retVal.slice(0, ind) + ch + retVal.slice(ind);
    //insert special character into second half of password:
    var ind = length/2 + Math.floor(Math.random() * length/2);
    var ch = ("!@#$%^&*").charAt(Math.floor(Math.random() * 8));
    retVal = retVal.slice(0, ind) + ch + retVal.slice(ind);
    return retVal;
}

function showPassword(){
    var pw = document.getElementById('password');
    if(pw.type === 'password')
        pw.type = 'text';
    else
    pw.type = 'password';
}

function onPWInput(){
    document.getElementById('error-message').style.visibility='hidden';
};

var onformsubmit = (form, event) => {
    var pw = document.getElementById('password').value;
    if(pw.length<10 || pw.search(/\d/)===-1 || /[!@#$%^&\*]/.test(pw)===false){
        event.preventDefault();
        document.getElementById('error-message').style.visibility='visible';
    };
};