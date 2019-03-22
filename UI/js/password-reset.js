// Validate all required fields before
// posting to the server

window.onload = function(){
    let email = document.getElementById('email');
    let passwordResetBtn = document.getElementById('password_reset');

    passwordResetBtn.onclick = (event)=>{
        event.preventDefault();
        validatePasswordReset();
    };
}

const validatePasswordReset = ()=>{
    let errormessageHolder = document.getElementById('errorMessage');
    errormessageHolder.innerHTML='';
    errormessageHolder.removeAttribute("class");

    if(email.value===''){
        errormessageHolder.textContent = 'Email is required.';
        errormessageHolder.className = 'errorMessage';  
        email.focus();      
        return false;
    }
    else{
        if(validateEmail(email.value)===false){
            errormessageHolder.textContent = 'Sorry, only valid email format is allowed.';
            errormessageHolder.className = 'errorMessage';        
            return false;           
        }
    }
    window.location = "user-sign-in.html";

}

const validateEmail = (email)=>{
    //check for @
    let atSymbol = email.indexOf('@');
    let dot = email.indexOf('.');
        if(atSymbol < 1 ){return false;}
    
        else if(dot <= atSymbol + 2) {return false;}
    
    //Check that the dot is not at the end
    else if(dot === email.length - 1){return false;}
    else{
        return true;

    }
}