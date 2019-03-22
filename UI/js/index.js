// Validate all required fields before
// posting to the server

window.onload = function(){
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let signup = document.getElementById('signup');

    signup.onclick = (event) =>{
        event.preventDefault();
        validateUserSignUp();
    }

}

const validateUserSignUp =()=>{
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

    if(password.value===''){
        errormessageHolder.textContent = 'Password is required.';
        errormessageHolder.className = 'errorMessage';  
        password.focus();      
        return false;
    }
    else{
        if(password.value.length <=7){
            errormessageHolder.textContent = 'Minimum of 8 characters of password length is allowed';
            errormessageHolder.className = 'errorMessage';  
            password.focus();      
            return false;
        }
    }

    let tandc = document.getElementById('tandc').checked;
        if(tandc===false){
            errormessageHolder.textContent = 'You have to accept ogaBanka Terms and Conditions.';
            errormessageHolder.className = 'errorMessage';  
            return false;
        }
    window.location = "user-sign-in.html"
     
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