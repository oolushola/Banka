window.onload = ()=>{
    let date_of_birth = document.getElementById('date_of_birth');
    let account_type = document.getElementById('account_type');
    let createBankAccountBtn = document.getElementById('createBankAccount');
    let accounttype = document.querySelector(".accounttype");
   
    accounttype.onclick = ()=>{
        account_type.value = accounttype.value;
    }

    createBankAccount.onclick = (event)=>{
        validateBankAccount();
        event.preventDefault();
    }
}


const validateBankAccount = () =>{
    let errordisplay = document.querySelector('#errorMessage');
    errordisplay.innerHTML='';
    errordisplay.removeAttribute("class");

    if(date_of_birth.value===''){
        errordisplay.textContent = "Your date of birth is required.";
        errordisplay.className = "errorMessage";
        date_of_birth.focus();
        return false;
    }
    if(account_type.value===''){
        errordisplay.textContent = "Choose an account type you'd prefer.";
        errordisplay.className = "errorMessage";
    }

    

    
}


