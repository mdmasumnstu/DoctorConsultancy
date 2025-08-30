const showLoginBtn  = document.getElementById('showLoginBtn');
const showSignupBtn = document.getElementById('showSignupBtn');
const loginView  = document.getElementById('loginView');
const signupView = document.getElementById('signupView');

function activate(tab){
  const isLogin = tab === 'login';
  showLoginBtn.classList.toggle('is-active', isLogin);
  showSignupBtn.classList.toggle('is-active', !isLogin);

  // ARIA & visibility
  showLoginBtn.setAttribute('aria-selected', String(isLogin));
  showSignupBtn.setAttribute('aria-selected', String(!isLogin));
  loginView.hidden  = !isLogin;
  signupView.hidden = isLogin;

  // Focus first field of active form
  const firstField = (isLogin ? loginView : signupView).querySelector('input');
  if (firstField) firstField.focus();
}

showLoginBtn.addEventListener('click', () => activate('login'));
showSignupBtn.addEventListener('click', () => activate('signup'));

// Password reveal handlers (both forms)
document.querySelectorAll('.password-field .reveal').forEach(btn => {
  btn.addEventListener('click', e => {
    const input = e.currentTarget.previousElementSibling;
    const isPwd = input.getAttribute('type') === 'password';
    input.setAttribute('type', isPwd ? 'text' : 'password');
    e.currentTarget.setAttribute('aria-label', isPwd ? 'Hide password' : 'Show password');
  });
});

// Basic client-side validation with inline messages
function attachValidation(form){
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fields = [...form.querySelectorAll('input[required]')];
    let valid = true;

    fields.forEach(input => {
      const error = input.parentElement.querySelector('.error');
      if (!input.checkValidity()){
        valid = false;
        error.textContent = input.validationMessage;
      } else {
        error.textContent = '';
      }
    });

    // Extra: confirm password check for signup
    if (form.id === 'signupForm'){
      const pwd = form.querySelector('input[name="password"]');
      const confirm = form.querySelector('input[name="confirm"]');
      const error = confirm.parentElement.querySelector('.error');
      if (pwd.value !== confirm.value){
        valid = false;
        error.textContent = 'Passwords do not match.';
      }
    }

    if (valid){
      // Replace with your real submit/auth logic
      const data = Object.fromEntries(new FormData(form).entries());
      console.log('Form submit', form.id, data);
      alert((form.id === 'loginForm' ? 'Logged in' : 'Account created') + ' (demo).');
      form.reset();
    }
  });

  // Clear errors on input
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
      const error = input.parentElement.querySelector('.error');
      if (error) error.textContent = '';
    });
  });
}

attachValidation(document.getElementById('loginForm'));
attachValidation(document.getElementById('signupForm'));

// Default to login view
activate('login');
