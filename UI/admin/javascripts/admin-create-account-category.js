// Validate all required fields before
// posting to the server

window.onload = ()=>{
    let customer_id = document.getElementById('customer_id');
    let accountCategoryBtn = document.getElementById('accountCategory');

    accountCategoryBtn.onclick = (event)=>{
        event.preventDefault();
        validateAccountCategory(); 
    }
}

const validateAccountCategory = () =>{
    let errormessageHolder = document.getElementById('errorMessage');
    errormessageHolder.innerHTML='';
    errormessageHolder.removeAttribute("class");

    if(account_category.value===''){
        errormessageHolder.textContent = 'Name of account category is required.';
        errormessageHolder.className = 'errorMessage';  
        account_category.focus();      
        return false;
    }
            
    window.location="admin-create-account-category.html";
}