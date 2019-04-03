// Validate all required fields before
// posting to the server

window.onload = function(){
    let customer_id = document.getElementById('customer_id');
    let suspendAccountBtn = document.getElementById('suspendAccount');

    suspendAccountBtn.onclick = (event)=>{
        event.preventDefault();
        validateSuspendAccount();
    }
}

const validateSuspendAccount = ()=>{
    let errormessageHolder = document.getElementById('errorMessage');
    errormessageHolder.innerHTML='';
    errormessageHolder.removeAttribute("class");

    if(customer_id.value==='0'){
        errormessageHolder.textContent = 'Select a customer whose bank account you wish to suspend.';
        errormessageHolder.className = 'errorMessage';  
        email.focus();      
        return false;
    }

    let suspend = document.getElementById('suspend').checked;
        if(suspend===false){
            errormessageHolder.textContent = 'You have to agree to the terms of suspending an account.';
            errormessageHolder.className = 'errorMessage';  
            return false;
        }
    window.location="staff-suspend-account.html"
} 
    
     


