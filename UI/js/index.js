/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
const validateEmail = (email) => {
  const atSymbol = email.indexOf('@');
  const dot = email.indexOf('.');
  if (atSymbol < 1) { return false; }
  if (dot <= atSymbol + 2) { return false; }
  if (dot === email.length - 1) { return false; }

  return true;
};

window.onload = () => {
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const signup = document.getElementById('signup');

  signup.onclick = (event) => {
    event.preventDefault();
    validateClientSignUp();
  };
};

const validateClientSignUp = () => {
  const errormessageHolder = document.getElementById('errorMessage');
  errormessageHolder.innerHTML = '';
  errormessageHolder.removeAttribute('class');

  if (email.value === '') {
    errormessageHolder.textContent = 'Email is required.';
    errormessageHolder.className = 'errorMessage';
    email.focus();
    return false;
  }

  if (validateEmail(email.value) === false) {
    errormessageHolder.textContent = 'Sorry, only valid email format is allowed.';
    errormessageHolder.className = 'errorMessage';
    return false;
  }


  if (password.value === '') {
    errormessageHolder.textContent = 'Password is required.';
    errormessageHolder.className = 'errorMessage';
    password.focus();
    return false;
  }

  if (password.value.length <= 7) {
    errormessageHolder.textContent = 'Minimum of 8 characters of password length is allowed';
    errormessageHolder.className = 'errorMessage';
    password.focus();
    return false;
  }


  const tandc = document.getElementById('tandc').checked;
  if (tandc === false) {
    errormessageHolder.textContent = 'You have to accept Banka Terms and Conditions.';
    errormessageHolder.className = 'errorMessage';
    return false;
  }
  const baseUrl = 'http://127.0.0.1:5000';
  const registerEndpoint = '/api/v1/auth/register';
  const url = `${baseUrl}${registerEndpoint}`;
  fetch(url, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    method: 'POST',
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  }).then(response => response.json()).then((data) => {
    if (data.status === 409) {
      errormessageHolder.textContent = 'Sorry, you already have an account.';
      errormessageHolder.className = 'errorMessage';
    } else {
      errormessageHolder.textContent = 'Registration successful';
      errormessageHolder.className = 'errorMessage';
      window.location = 'user-sign-in.html';
    }
  });
};
