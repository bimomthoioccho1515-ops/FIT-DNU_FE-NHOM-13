const CART_KEY = "cart";

/* ================= CART ================= */

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* ================= FORMAT ================= */

function money(x) {
  return x.toLocaleString("vi-VN") + "₫";
}

/* ================= RENDER CART (COUNT GROUP) ================= */

function renderCartPage() {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("total");

  const cart = getCart();

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

    return `
      <div class="cart-item">
        <img src="${item.image}">

        <div class="cart-info">
          <h3>${item.name}</h3>
          <p>${money(item.price)}</p>
          <p>Số lượng: <b>${item.count}</b></p>
        </div>

        <button onclick="removeItem(${item.id})">Delete</button>
      </div>
    `;
  }).join("");

  totalEl.innerText = money(total);
}

/* ================= REMOVE ================= */

function removeItem(id) {
  let cart = getCart();

  cart = cart.filter(item => item.id !== id);

  saveCart(cart);

  renderCartPage();
}

/* INIT */

renderCartPage();