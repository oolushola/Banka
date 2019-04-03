window.onload = ()=>{
    let old_password = document.getElementById('old_password');
    let new_password = document.getElementById('new_password');
    let confirm_new_password = document.getElementById('confirm_new_password');
    let updateAcctPassBtn = document.getElementById('updateAcctPass');

    updateAcctPassBtn.onclick = (event)=>{

        event.preventDefault();
        validateAcctPass();
    }
}


const validateAcctPass = () =>{
    let errordisplay = document.querySelector('#errorMessage');
    errordisplay.innerHTML='';
    errordisplay.removeAttribute("class");

    if(old_password.value===''){
        errordisplay.textContent = "Sorry, your old password is required.";
        errordisplay.className = "errorMessage";
        old_password.focus();
        return false;
    }
    else{
        if(passwordLengthChecker(old_password.value)===false){
            old_password.focus();
            return false;
        };
           
    }
    if(new_password.value===''){
        errordisplay.textContent = "New password is required.";
        errordisplay.className = "errorMessage";
        new_password.focus();
        return false;
    }
    else{
        if(passwordLengthChecker(new_password.value)===false){
            new_password.focus();
            return false;
        }
    }

    if(confirm_new_password.value===''){
        errordisplay.textContent = "Please confirm your new password.";
        errordisplay.className = "errorMessage";
        confirm_new_password.focus();
        return false;
    }
    else{
        if(passwordLengthChecker(confirm_new_password.value)===false){
            confirm_new_password.focus();
            return false;
        };
    }

    if(old_password.value===new_password.value){
        errordisplay.textContent = "Your new password should be different from your old password.";
        errordisplay.className = "errorMessage";
        return false;
    }
    else{
        if(new_password.value !== confirm_new_password.value){
            errordisplay.textContent = "Your password does not match each other";
            errordisplay.className = "errorMessage";
            return false;    
        }
    }
    
}

const passwordLengthChecker = (value)=>{
    let errordisplay = document.querySelector('#errorMessage');
    errordisplay.innerHTML='';
    errordisplay.removeAttribute("class");

    if(value.length <=7){
        errordisplay.textContent = "Sorry, minimum nuber of characters allowed is 8.";
        errordisplay.className = "errorMessage";
        return false;
    }
}