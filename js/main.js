'use strict';

// import Swiper from 'https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js';

const $cartButton = document.querySelector('#cart-button');
const $modal = document.querySelector('.modal');
const $close = document.querySelector('.close');
const $buttonAuth = document.querySelector('.button-auth');
const $modalAuth = document.querySelector('.modal-auth');
const $closeAuth = document.querySelector('.close-auth');
const $logInForm = document.querySelector('#logInForm');
const $loginInput = document.querySelector('#login');
const $passwordInput = document.querySelector('#password');
const $userName = document.querySelector('.user-name');
const $buttonOut = document.querySelector('.button-out');
const $cardsRestaurants = document.querySelector('.cards-restaurants');
const $containerPromo = document.querySelector('.container-promo');
const $restaurants = document.querySelector('.restaurants');
const $menu = document.querySelector('.menu');
const $logo = document.querySelector('.logo');
const $cardsMenu = document.querySelector('.cards-menu');
const $inputSearch = document.querySelector('.input-search');
const $modalBody = document.querySelector('.modal-body');
const $modalPrice = document.querySelector('.modal-pricetag');
const $buttonClearCart = document.querySelector('.clear-cart');

const $restaurantTitle = document.querySelector('.restaurant-title');
const $restaurantRating = document.querySelector('.rating');
const $restaurantPrice = document.querySelector('.price');
const $restaurantCategory = document.querySelector('.category');

let _login = localStorage.getItem('Delivery');
const _cart = [];

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

// $buttonAuth.addEventListener('click', toggleModalAuth);
// $closeAuth.addEventListener('click', toggleModalAuth);

//  optional

const authorized = () => {
    const logOut = () => {
      _login = null;
      localStorage.removeItem('Delivery');

      $buttonAuth.style.display = '';
      $userName.style.display = '';
      $buttonOut.style.display = '';
      $cartButton.style.display = '';

      $buttonOut.removeEventListener('click', logOut);

      checkAuth();
      //returnMain(); -> line 60
    };

    $userName.textContent = _login;

    $buttonAuth.style.display = 'none';
    $userName.style.display = 'inline';
    $buttonOut.style.display = 'flex'; //block
    $cartButton.style.display = 'flex'; //block

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

  const $cardRestaurant = document.createElement('a');
  $cardRestaurant.className = 'card card-restaurant';
  $cardRestaurant.products = products;
  $cardRestaurant.info = { kitchen, name, price, stars };

  const $card = `
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
  `;

  $cardRestaurant.insertAdjacentHTML('beforeend', $card);
  $cardsRestaurants.insertAdjacentElement('beforeend', $cardRestaurant);
};

const createCardGood = goods => {
  const { description, id, image, name, price } = goods;
console.log(goods);
  const $card = document.createElement('div');
  $card.className = 'card';

  $card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt=${name} class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">
          ${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `);

  $cardsMenu.insertAdjacentElement('beforeend', $card);
};

const openGoods = ({ target }) => {
  if (_login) {
    const restaurant = target.closest('.card-restaurant');

    if (restaurant) {
      //const info = restaurant.dataset.info;
      //const { name, kitchen, price, stars } = info.split(',');
      const { name, kitchen, price, stars } = restaurant.info;

      $cardsMenu.textContent = '';
      $containerPromo.classList.add('hide');
      $restaurants.classList.add('hide');
      $menu.classList.remove('hide');

      $restaurantTitle.textContent = name;
      $restaurantRating.textContent = stars;
      $restaurantPrice.textContent = `От ${price} ₽`;
      $restaurantCategory.textContent = kitchen;

      getData(`./db/${restaurant.products}`).then(data => data.forEach(createCardGood));  
    }
  } else {toggleModalAuth()}
};

const addToCart = ({ target }) => {
  const buttonAddToCart = target.closest('.button-add-cart');

  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;
    console.log(title, id, card);

    const food = _cart.find(item => item.id === id);
    console.log(food, 'FOOD find');

    food ? food.count += 1 : _cart.push({id: id, title: title, cost, count: 1});

    console.log(_cart, 'CART after');
  }
};

const renderCart = () => {
  $modalBody.textContent = '';

  _cart.forEach(item => {
    const { id, title, cost, count } = item;

    const $itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost} ₽</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id=${id}>-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id=${id}>+</button>
        </div>
      </div>
    `;

    $modalBody.insertAdjacentHTML('afterbegin', $itemCart);
  });

  const totalPriceSum = _cart.reduce((sum, item) => 
    sum + (parseFloat(item.cost) * item.count), 0);

  $modalPrice.textContent = `${totalPriceSum} ₽`;
};

const changeCount = ({ target }) => {
  if (target.classList.contains('counter-button')) {
    const food = _cart.find(item => item.id === target.dataset.id);

    if (target.classList.contains('counter-minus')) {
      food.count--;

      food.count === 0 && _cart.splice(_cart.indexOf(food), 1);
    }

    target.classList.contains('counter-plus') && food.count++;

    renderCart();
  }
};

const init = () => {
  getData('./db/partners.json').then(data => data.forEach(createCardRestaurant));  
                                        //toggleModalAuth
  $cartButton.addEventListener('click', () => {
    renderCart();
    toggleModal();
  });
  $buttonClearCart.addEventListener('click', () => {
    _cart.length = 0;

    renderCart();
  });
  $modalBody.addEventListener('click', changeCount);
  $cardsMenu.addEventListener('click', addToCart);
  $close.addEventListener('click', toggleModal);
  $cardsRestaurants.addEventListener('click', openGoods);
  //$logo.addEventListener('click', returnMain); -> line 60

  $logo.addEventListener('click', () => {
    $containerPromo.classList.remove('hide');
    $restaurants.classList.remove('hide');
    $menu.classList.add('hide');
  });

  checkAuth();

  $inputSearch.addEventListener('keypress', e => {
    if (e.charCode === '13') {
      const value = e.target.value.trim();

      if (!value) {
        e.target.style.backgroundColor = '#ff0000';
        e.target.value = '';

        setTimeout(() => e.target.style.backgroundColor = '', 1500);

        return;
      }

      getData('./db/partners.json')
        .then(data => data.map(partner => partner.products))
        .then(linkProducts => {
          $cardsMenu.textContent = '';

          linkProducts.forEach(link => getData(`./db/${link}`)
            .then(data => {
              const resultSearch = data.filter(item => {
                const name = item.name.toLowerCase();
                name.includes(value.toLowerCase());
              });

              $containerPromo.classList.add('hide');
              $restaurants.classList.add('hide');
              $menu.classList.remove('hide');

              $restaurantTitle.textContent = 'Результат поиска';
              $restaurantRating.textContent = '';
              $restaurantPrice.textContent = '';
              $restaurantCategory.textContent = 'разная кухня';

              resultSearch.forEach(createCardGood);
            })
          )
        });
    }  
  });
  

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