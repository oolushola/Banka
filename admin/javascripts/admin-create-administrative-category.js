// Validate all required fields before
// posting to the server

window.onload = ()=>{
    let admin_category = document.getElementById('admin_category');
    let accountCategoryBtn = document.getElementById('accountCategory');

    accountCategoryBtn.onclick = (event)=>{
        event.preventDefault();
        validateAccountCategory(); 
    }

}

const validateAccountCategory = ()=>{
    let errormessageHolder = document.getElementById('errorMessage');
    errormessageHolder.innerHTML='';
    errormessageHolder.removeAttribute("class");

    if(admin_category.value===''){
        errormessageHolder.textContent = 'Administrative category is required.';
        errormessageHolder.className = 'errorMessage';  
        admin_category.focus();      
        return false;
    }
    
    window.location="admin-create-administrative-category.html";

}
