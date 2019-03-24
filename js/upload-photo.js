window.onload = ()=>{
    let photo = document.getElementById('photo');
    let uploadPhotoBtn = document.getElementById('uploadPhoto');

    uploadPhotoBtn.onclick = (event)=>{
        validatePhoto();
        event.preventDefault();
    }
}


const validatePhoto = () =>{
    let errordisplay = document.querySelector('#errorMessage');
    errordisplay.innerHTML='';
    errordisplay.removeAttribute("class");

    if(photo.value===''){
        errordisplay.textContent = "Choose a photo to be uploaded.";
        errordisplay.className = "errorMessage";
        photo.focus();
        return false;
    }
}