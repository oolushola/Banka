// Validate all required fields before
// posting to the server

window.onload = ()=>{
    let admin_category_id = document.getElementById('admin_category_id');
    let first_name = document.getElementById('first_name');
    let last_name = document.getElementById('last_name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let phone_no = document.getElementById('phone_no');
    let administratorBtn = document.getElementById('administrator');

    administratorBtn.onclick = (event)=>{
        event.preventDefault();
        validateAdminAccount(); 
    }

}

const validateAdminAccount = ()=>{
    let errormessageHolder = document.getElementById('errorMessage');
    errormessageHolder.innerHTML='';
    errormessageHolder.removeAttribute("class");

    if(admin_category_id.value==='0'){
        errormessageHolder.textContent = 'Select an administrative category';
        errormessageHolder.className = 'errorMessage';  
        admin_category_id.focus();      
        return false;
    }

    if(first_name.value===''){
        errormessageHolder.textContent = 'First name is required.';
        errormessageHolder.className = 'errorMessage';  
        first_name.focus();      
        return false;
    }

    if(last_name.value===''){
        errormessageHolder.textContent = 'Last name is required.';
        errormessageHolder.className = 'errorMessage';  
        last_name.focus();      
        return false;
    }

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
            email.focus();       
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
        if(password.value.length<=7){
            errormessageHolder.textContent = 'Minimum password character allowed is 8.';
            errormessageHolder.className = 'errorMessage';  
            password.focus();      
            return false;
        }
    }
    window.location="admin-create-administrative-account.html";

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