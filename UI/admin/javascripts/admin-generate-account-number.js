// Validate all required fields before
// posting to the server

window.onload = ()=>{
    let customer_id = document.getElementById('customer_id');
    let account_no = document.getElementById('account_no');
    let generateAccountNoBtn = document.getElementById('generateAccountNo');

    generateAccountNoBtn.onclick = (event)=>{
        event.preventDefault();
        validateAccountGenerate(); 
    }

}

const validateAccountGenerate = () =>{
    let errormessageHolder = document.getElementById('errorMessage');
    errormessageHolder.innerHTML='';
    errormessageHolder.removeAttribute("class");

    if(customer_id.value==='0'){
        errormessageHolder.textContent = 'Choose a customer to give an account number.';
        errormessageHolder.className = 'errorMessage';  
        customer_id.focus();      
        return false;
    }
    
    if(account_no.value===''){
        errormessageHolder.textContent = 'Account Number is required.';
        errormessageHolder.className = 'errorMessage';  
        account_no.focus();      
        return false;
    }
    window.location="admin-generate-account-number.html";
}