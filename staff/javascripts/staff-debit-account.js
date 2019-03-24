// Validate all required fields before
// posting to the server

window.onload = () =>{
    let customer_id = document.getElementById('customer_id');
    let amount = document.getElementById('amount');
    let debitAccountBtn = document.getElementById('debitAccount');

    debitAccountBtn.onclick = (event)=>{
        event.preventDefault();
        validateAccountDebit(); 
    }

}

const validateAccountDebit = ()=>{
    let errormessageHolder = document.getElementById('errorMessage');
    errormessageHolder.innerHTML='';
    errormessageHolder.removeAttribute("class");
    if(customer_id.value==='0'){
        errormessageHolder.textContent = 'Select the customer\'s account to be debited.';
        errormessageHolder.className = 'errorMessage';  
        customer_id.focus();      
        return false;
    }
    
    if(amount.value===''){
        errormessageHolder.textContent = 'Amount is required.';
        errormessageHolder.className = 'errorMessage';  
        amount.focus();      
        return false;
    }
    else{
        if(amount.value<=0){
            errormessageHolder.textContent = 'You can\'t have a negative or zero amount to be credited. ';
            errormessageHolder.className = 'errorMessage';  
            amount.focus();      
            return false; 
        }
    }
    window.location="staff-debit-account.html";

}
