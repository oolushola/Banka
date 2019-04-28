/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */

window.onload = () => {
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const login = document.getElementById('login');

  login.onclick = (event) => {
    event.preventDefault();
    validateClientLogin();
  };
};

const validateClientLogin = () => {
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

  const baseUrl = 'http://127.0.0.1:5000';
  const registerEndpoint = '/api/v1/auth/login';
  const url = `${baseUrl}${registerEndpoint}`;
  fetch(url, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    method: 'POST',
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  }).then(response => response.json()).then((data) => {
    if (data.status === 404) {
      errormessageHolder.textContent = 'No record match this login credentials, Sign Up.';
      errormessageHolder.className = 'errorMessage';
      reloader('index.html');
    }

    if (data.status === 401) {
      errormessageHolder.textContent = 'Invalid login details';
      errormessageHolder.className = 'errorMessage';
    }

    if (data.status === 200) {
      errormessageHolder.textContent = 'Login Successful. Please Wait...';
      errormessageHolder.className = 'errorMessage';
      reloader('user-profile.html');
    }
  });
  // window.location = 'user-profile.html';
};

const validateEmail = (email) => {
  const atSymbol = email.indexOf('@');
  const dot = email.indexOf('.');
  if (atSymbol < 1) { return false; }
  if (dot <= atSymbol + 2) { return false; }
  if (dot === email.length - 1) { return false; }
  return true;
};

const reloader = (destination) => {
  window.setTimeout(() => {
    window.location = `${destination}`;
  }, 3000);
};
