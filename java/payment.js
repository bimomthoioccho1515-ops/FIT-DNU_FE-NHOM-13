const API_URL = "https://6a1a846abc2f94475492525f.mockapi.io/products";

function getPendingOrder() {
  return JSON.parse(sessionStorage.getItem("pendingOrder") || "null");
}

function renderPayment() {
  const order = getPendingOrder();
  if (!order) {
    alert("No pending order found.");
    location.href = "cart.html";
    return;
  }

  const box = document.getElementById("paymentSummary");
  const itemCount = order.cart.reduce((sum, item) => sum + item.count, 0);
  const totalPrice = order.cart.reduce((sum, item) => sum + item.price * item.count, 0);
  const formattedTotal = totalPrice.toLocaleString("en-US") + "₫";

  box.innerHTML = `
    <div class="order-info">
      <div>
        <p class="label">Name</p>
        <p>${order.name}</p>
      </div>
      <div>
        <p class="label">Phone</p>
        <p>${order.phone}</p>
      </div>
      <div>
        <p class="label">Shipping address</p>
        <p>${order.address}</p>
      </div>
      <div>
        <p class="label">Payment method</p>
        <p>${order.paymentMethod.toUpperCase()}</p>
      </div>
    </div>
    <div class="order-items">
      ${order.cart
        .map(
          item => `
            <div class="item">
              <img src="${item.image}" alt="${item.name}">
              <div class="info">
                <h2>${item.name}</h2>
                <p>Qty: ${item.count}</p>
              </div>
              <div class="price">${(item.price * item.count).toLocaleString("en-US")}₫</div>
            </div>
          `
        )
        .join("")}
    </div>
    <div class="order-footer">
      <div>
        <span>Subtotal</span>
        <strong>${formattedTotal}</strong>
      </div>
      <div>
        <span>Delivery</span>
        <strong>Free</strong>
      </div>
      <div class="order-total">
        <span>Total</span>
        <strong>${formattedTotal}</strong>
      </div>
    </div>
  `;

  const itemCountEl = document.getElementById("itemCount");
  if (itemCountEl) itemCountEl.innerText = `${itemCount}`;

  const summaryTotal = document.getElementById("summaryTotal");
  if (summaryTotal) summaryTotal.innerText = formattedTotal;
}

async function completePayment() {
  const order = getPendingOrder();
  if (!order) {
    alert("No pending order found.");
    location.href = "cart.html";
    return;
  }

  const confirmed = confirm(`Confirm payment with ${order.paymentMethod.toUpperCase()}?`);
  if (!confirmed) {
    return;
  }

  try {
    for (const item of order.cart) {
      const res = await fetch(`${API_URL}/${item.id}`);
      if (!res.ok) {
        throw new Error("Unable to fetch product data.");
      }
      const product = await res.json();
      const remain = product.stock - item.count;
      if (remain < 0) {
        alert(`${product.name} is out of stock. Please adjust your cart.`);
        location.href = "checkout.html";
        return;
      }
      await fetch(`${API_URL}/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...product,
          stock: remain
        })
      });
    }

    localStorage.removeItem("cart");
    sessionStorage.removeItem("pendingOrder");

    alert("Payment successful! Your order has been placed.");
    location.href = "index.html";
  } catch (error) {
    console.error(error);
    alert("Payment failed. Please try again later.");
  }
}

renderPayment();