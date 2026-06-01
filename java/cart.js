const CART_KEY = "cart";
const FAVORITE_KEY = "favorite";

/* ================= CART ================= */

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
}

function addToFavorite(id) {
  const cart = getCart();
  const item = cart.find(x => String(x.id) === String(id));
  if (!item) {
    return;
  }

  const favorites = getFavorites();
  if (favorites.some(x => String(x.id) === String(id))) {
    alert("Product already in favorites");
    return;
  }

  favorites.push({
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    count: item.count
  });

  saveFavorites(favorites);
  alert("Added to favorites");
  renderCartPage();
}

/* ================= FORMAT ================= */

function money(x) {
  return x.toLocaleString("en-US") + "₫";
}

/* ================= RENDER CART (COUNT GROUP) ================= */

function renderCartPage() {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("total");

  const cart = getCart();
  const favorites = getFavorites();

  let total = 0;

  // GROUP BY ID
  const grouped = {};

  cart.forEach(item => {
    if (!grouped[item.id]) {
      grouped[item.id] = { ...item };
    } else {
      grouped[item.id].count += item.count;
    }
  });

  container.innerHTML = Object.values(grouped).map(item => {
    total += item.price * item.count;
    const isFavoriteItem = favorites.some(f => String(f.id) === String(item.id));

    return `
      <div class="cart-item">
        <img src="${item.image}">

        <div class="cart-info">
          <h3>${item.name}</h3>
          <p>${money(item.price)}</p>
          <p>Quantity: <b>${item.count}</b></p>
        </div>

        <div class="cart-actions">
          <button class="favorite-btn" onclick="addToFavorite('${item.id}')">
            ${isFavoriteItem ? '✓ Favorited' : '♥ Favorite'}
          </button>
          <button class="remove-btn" onclick="removeItem('${item.id}')">Delete</button>
        </div>
      </div>
    `;
  }).join("");

  totalEl.innerText = money(total);
}

/* ================= REMOVE ================= */

function removeItem(id) {
  let cart = getCart();

  cart = cart.filter(item => String(item.id) !== String(id));

  saveCart(cart);

  renderCartPage();
}

/* INIT */

renderCartPage();