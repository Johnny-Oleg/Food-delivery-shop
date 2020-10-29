'use strict';

// import Swiper from 'https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js';

const $cartButton = document.querySelector('#cart-button');
const $modal = document.querySelector('.modal');
const $close = document.querySelector('.close');
const $buttonAuth = document.querySelector('.button-auth');
const $modalAuth = document.querySelector('.modal-auth');
const $closeAuth = document.querySelector('.close-auth');
const $logInForm = document.querySelector('#logInForm');
const $loginInput = document.querySelector('#_login');
const $passwordInput = document.querySelector('#password');
const $userName = document.querySelector('.user-name');
const $buttonOut = document.querySelector('.button-out');
const $cardsRestaurants = document.querySelector('.cards-restaurants');
const $containerPromo = document.querySelector('.container-promo');
const $restaurants = document.querySelector('.restaurants');
const $menu = document.querySelector('.menu');
const $logo = document.querySelector('.logo');
const $cardsMenu = document.querySelector('.cards-menu');

let _login = localStorage.getItem('Delivery');

const getData = async url => {
  const res = await fetch(url).then()

  if (!res.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ${res.status}`);
  }

  return await res.json();
};

const validName = str => {
  const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return regName.test(str);
};

const toggleModal = () => $modal.classList.toggle('is-open');

const toggleModalAuth = () => {
    $modalAuth.classList.toggle('is-open');
    $loginInput.style.borderColor = '';

    $modalAuth.classList.contains('is-open') ? disableScroll() : enableScroll();
};

const clearForm = () => {
  $loginInput.style.borderColor = '';
  $logInForm.reset();
};

$buttonAuth.addEventListener('click', toggleModalAuth);
$closeAuth.addEventListener('click', toggleModalAuth);

const authorized = () => {
    const logOut = () => {
      _login = null;
      localStorage.removeItem('Delivery');

      $buttonAuth.style.display = '';
      $userName.style.display = '';
      $buttonOut.style.display = '';

      $buttonOut.removeEventListener('click', logOut);

      checkAuth();
    };

    $userName.textContent = _login;

    $buttonAuth.style.display = 'none';
    $userName.style.display = 'inline';
    $buttonOut.style.display = 'block';

    $buttonOut.addEventListener('click', logOut);
};

const notAuthorized = () => {
    const logIn = e => {
      e.preventDefault();

      if (validName($loginInput.value)) {
        _login = $loginInput.value;
        localStorage.setItem('Delivery', _login);

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
    };

    $buttonAuth.addEventListener('click', toggleModalAuth);
    $closeAuth.addEventListener('click', toggleModalAuth);
    $logInForm.addEventListener('submit', logIn);
    $modalAuth.addEventListener('click', ({ target }) => {
      target.classList.contains('is-open') && toggleModalAuth();
    });
};

$buttonAuth.addEventListener('click', clearForm);

const checkAuth = () => _login ? authorized() : notAuthorized();

checkAuth();

const createCardRestaurant = restaurant => {
  const { image, kitchen, name, price, stars, products, time_of_delivery} = restaurant;

  const $card = `
    <a href="restaurant.html" class="card card-restaurant data-products="${products}">
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${time_of_delivery} мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
            ${stars}
          </div>
          <div class="price">От ${price} ₽</div>
          <div class="category">${kitchen}</div>
        </div>
      </div>
    </a>
  `;

  $cardsRestaurants.insertAdjacentHTML('beforeend', $card);
};

const createCardGood = goods => {
  const { description, id, image, name, price } = goods;

  const $card = document.createElement('div');
  $card.className = 'card';

  $card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${title}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">
          ${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `);

  $cardsMenu.insertAdjacentElement('beforeend', $card);
};

const openGoods = ({ target }) => {
  if (_login) {
    const restaurant = target.closest('.card-restaurant');

    if (restaurant) {
      $cardsMenu.textContent = '';
      $containerPromo.classList.add('hide');
      $restaurants.classList.add('hide');
      $menu.classList.remove('hide');

      getData(`./db/${restaurant.dataset.product}`).then(data => {
        data.forEach(createCardGood);
      });  
    }
  } else {toggleModalAuth()}
};

const init = () => {
  getData('./db/partners.json').then(data => {
    data.forEach(createCardRestaurant);
  });  

  $cartButton.addEventListener('click', toggleModal);
  $close.addEventListener('click', toggleModal);
  $cardsRestaurants.addEventListener('click', openGoods);

  $logo.addEventListener('click', () => {
    $containerPromo.classList.remove('hide');
    $restaurants.classList.remove('hide');
    $menu.classList.add('hide');
  });

  checkAuth();

  new Swiper('.swiper-container', {
    sliderPerView: 1,
    loop: true,
    autoplay: true,
    effect: 'cube',
    grabCursor: true,
    cubeEffect: {
      shadow: false,
    },
    pagination: {
      el: 'swiper-pagination',
      clickable: true,
    },
  });
};  

init();

// new Swiper('.swiper-container', {
//   sliderPerView: 1,
//   loop: true,
//   autoplay: true,
//   effect: 'coverflow',
//   scrollbar: {
//     el: 'swiper-scrollbar',
//     draggable: true,
//   },
// });