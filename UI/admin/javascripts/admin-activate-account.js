// Validate all required fields before
// posting to the server

window.onload = ()=>{
    let customer_id = document.getElementById('customer_id');
    let activateAccountBtn = document.getElementById('activateAccount');

    activateAccountBtn.onclick = (event)=>{
        event.preventDefault();
        validateAccountActivation(); 
    }

}

const validateAccountActivation = () =>{
    let errormessageHolder = document.getElementById('errorMessage');
    errormessageHolder.innerHTML='';
    errormessageHolder.removeAttribute("class");

    if(customer_id.value==='0'){
        errormessageHolder.textContent = 'Choose an account number to be activated.';
        errormessageHolder.className = 'errorMessage';  
        customer_id.focus();      
        return false;
    }
    let activate = document.getElementById('activate').checked;
        if(activate===false){
            errormessageHolder.textContent = 'Click to agree that you wish to activate the account number';
            errormessageHolder.className = 'errorMessage';  
            return false;
        }
        
    window.location="admin-activate-account.html";
}