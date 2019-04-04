// Validate all required fields before
// posting to the server

window.onload = ()=>{
    let customer_id = document.getElementById('customer_id');
    let deactivateAccountBtn = document.getElementById('deactivateAccount');

    deactivateAccountBtn.onclick = (event)=>{
        event.preventDefault();
        validateAccountDeactivation(); 
    }
}

   

const validateAccountDeactivation = () =>{
    let errormessageHolder = document.getElementById('errorMessage');
    errormessageHolder.innerHTML='';
    errormessageHolder.removeAttribute("class");

    if(customer_id.value==='0'){
        errormessageHolder.textContent = 'Choose a client you wish to deactivate its account.';
        errormessageHolder.className = 'errorMessage';  
        customer_id.focus();      
        return false;
    }
            
    window.location="admin-deactivate-account.html";
}