const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

//!========

const $buttonAuth = document.querySelector('.button-auth');
const $modalAuth = document.querySelector('.modal-auth');
const $closeAuth = document.querySelector('.close-auth');
const $logInForm = document.querySelector('#logInForm');
const $loginInput = document.querySelector('#login');
const $passwordInput = document.querySelector('#password');
const $userName = document.querySelector('.user-name');
const $buttonOut = document.querySelector('.button-out');

let login = localStorage.getItem('Delivery');

const toggleModalAuth = () => {
    $modalAuth.classList.toggle('is-open');
    $loginInput.style.borderColor = '#ff0000';

    $modalAuth.classList.toggle('is-open') ? disableScroll() : enableScroll();
};

$buttonAuth.addEventListener('click', toggleModalAuth);
$closeAuth.addEventListener('click', toggleModalAuth);

const authorized = () => {
  const logOut = () => {
    login = null;
    localStorage.removeItem('Delivery');

    $buttonAuth.style.display = '';
    $userName.style.display = '';
    $buttonOut.style.display = '';

    $buttonOut.removeEventListener('click', logOut);

    checkAuth();
  }

  $userName.textContent = login;

  $buttonAuth.style.display = 'none';
  $userName.style.display = 'inline';
  $buttonOut.style.display = 'block';

  $buttonOut.addEventListener('click', logOut);
};

const notAuthorized = () => {
  const logIn = e => {
    e.preventDefault();

    if ($logInput.value.trim()) {
      login = $loginInput.value;
      localStorage.setItem('Delivery', login);

      toggleModalAuth();

      $buttonAuth.removeEventListener('click', toggleModalAuth);
      $closeAuth.removeEventListener('click', toggleModalAuth);
      $logInForm.removeEventListener('submit', logIn);

      $logInForm.reset();
      checkAuth();
    } else {
      $loginInput.style.borderColor = '#ff0000';
      $loginInput.value = '';
    }
  }

  $buttonAuth.addEventListener('click', toggleModalAuth);
  $closeAuth.addEventListener('click', toggleModalAuth);
  $logInForm.addEventListener('submit', logIn);
  $modalAuth.addEventListener('click', ({ target }) => {
    target.classList.contains('is-open') && toggleModalAuth();
  });
};

const checkAuth = () => login ? authorized() : notAuthorized();

checkAuth();