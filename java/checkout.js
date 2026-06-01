const API_URL = "https://6a1a846abc2f94475492525f.mockapi.io/products";

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function renderCheckout() {
  const box = document.getElementById("checkoutItems");
  const cart = getCart();
  let total = 0;

  box.innerHTML = cart
    .map(item => {
      const money = item.price * item.count;
      total += money;

      return `
        <div class="item">
          <img src="${item.image}">
          <div class="info">
            <h2>${item.name}</h2>
            <p>Qty: ${item.count}</p>
            <div class="price">${money.toLocaleString("en-US")}₫</div>
          </div>
        </div>
      `;
    })
    .join("");

  document.getElementById("total").innerText = total.toLocaleString("en-US") + "₫";

  const summaryTotal = document.getElementById("summaryTotal");
  if (summaryTotal) {
    summaryTotal.innerText = total.toLocaleString("en-US") + "₫";
  }
}

async function placeOrder() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const paymentMethod = document.getElementById("paymentMethod");

  if (!name || !phone || !address) {
    alert("Please fill in all fields");
    return;
  }

  if (!paymentMethod.value) {
    alert("Please select a payment method");
    return;
  }

  const cart = getCart();
  if (!cart.length) {
    alert("Your cart is empty");
    return;
  }

  const pendingOrder = {
    name,
    phone,
    address,
    paymentMethod: paymentMethod.value,
    cart,
    total: document.getElementById("total").innerText
  };

  sessionStorage.setItem("pendingOrder", JSON.stringify(pendingOrder));
  location.href = "payment.html";
}

renderCheckout();