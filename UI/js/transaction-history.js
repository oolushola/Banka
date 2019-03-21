window.onload = ()=>{
    let date_from = document.getElementById('date_from');
    let date_to = document.getElementById('date_to');
    let filterTransHistoryBtn = document.getElementById('filterTransHistory');

    filterTransHistoryBtn.onclick = (event)=>{
        event.preventDefault();
        validateTransHistory();
    }
}


const validateTransHistory = () =>{
    let errordisplay = document.querySelector('#errorMessage');
    errordisplay.innerHTML='';
    errordisplay.removeAttribute("class");

    if(date_from.value===''){
        errordisplay.textContent = "Choose the date you wish to start your filter.";
        errordisplay.className = "errorMessage";
        date_from.focus();
        return false;
    }
    if(date_to.value===''){
        errordisplay.textContent = "Choose the date you wish to end your filter.";
        errordisplay.className = "errorMessage";
        date_to.focus();
        return false;
    }
    

}