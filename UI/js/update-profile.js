window.onload = ()=>{
    let first_name = document.getElementById('first_name');
    let last_name = document.getElementById('last_name');
    let phone_no = document.getElementById('phone_no');
    let state = document.getElementById('state');
    let gender = document.getElementById('gender');
    let address = document.getElementById('address');
    let updateProfileBtn = document.getElementById('updateProfile');

    updateProfileBtn.onclick = (event)=>{
        validateUserProfile();
        event.preventDefault();
    }
}


const validateUserProfile = () =>{
    let errordisplay = document.querySelector('#errorMessage');
    errordisplay.innerHTML='';
    errordisplay.removeAttribute("class");

    if(first_name.value===''){
        errordisplay.textContent = "Your first name is required.";
        errordisplay.className = "errorMessage";
        first_name.focus();
        return false;
    }
    if(last_name.value===''){
        errordisplay.textContent = "Your last name is required.";
        errordisplay.className = "errorMessage";
        last_name.focus();
        return false;
    }
    if(phone_no.value===''){
        errordisplay.textContent = "Your phone number is required.";
        errordisplay.className = "errorMessage";
        phone_no.focus();
        return false;
    }
    
    if(state.value===''){
        errordisplay.textContent = "Your state or province is required.";
        errordisplay.className = "errorMessage";
        state.focus();
        return false;
    }
    if(gender.value===0){
        errordisplay.textContent = "Your gender is required.";
        errordisplay.className = "errorMessage";
        gender.focus();
        false;
    }
    if(address.value===''){
        errordisplay.textContent = "Your Address is required.";
        errordisplay.className = "errorMessage";
        address.focus();
        return false;
    }   
}

