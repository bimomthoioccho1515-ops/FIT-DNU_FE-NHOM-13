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
  box.innerHTML = `
    <div class="order-info">
      <p><strong>Name:</strong> ${order.name}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Shipping address:</strong> ${order.address}</p>
      <p><strong>Payment method:</strong> ${order.paymentMethod.toUpperCase()}</p>
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
                <div class="price">${(item.price * item.count).toLocaleString("en-US")}₫</div>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
    <div class="total">
      Total: <span>${order.total}</span>
    </div>
  `;
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