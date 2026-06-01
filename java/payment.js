const API_URL = "https://6a1a846abc2f94475492525f.mockapi.io/products";

function getPendingOrder() {
  return JSON.parse(sessionStorage.getItem("pendingOrder") || "null");
}

function renderPayment() {
  const order = getPendingOrder();
  if (!order) {
    alert("Không có đơn hàng nào để thanh toán.");
    location.href = "cart.html";
    return;
  }

  const box = document.getElementById("paymentSummary");
  box.innerHTML = `
    <div class="order-info">
      <p><strong>Họ tên:</strong> ${order.name}</p>
      <p><strong>Số điện thoại:</strong> ${order.phone}</p>
      <p><strong>Địa chỉ:</strong> ${order.address}</p>
      <p><strong>Cổng thanh toán:</strong> ${order.paymentMethod.toUpperCase()}</p>
    </div>
    <div class="order-items">
      ${order.cart
        .map(
          item => `
            <div class="item">
              <img src="${item.image}">
              <div class="info">
                <h2>${item.name}</h2>
                <p>SL: ${item.count}</p>
                <div class="price">${(item.price * item.count).toLocaleString("vi-VN")}₫</div>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
    <div class="total">
      Tổng: <span>${order.total}</span>
    </div>
  `;
}

async function completePayment() {
  const order = getPendingOrder();
  if (!order) {
    alert("Không có đơn hàng nào để thanh toán.");
    location.href = "cart.html";
    return;
  }

  const confirmed = confirm(`Xác nhận thanh toán qua ${order.paymentMethod.toUpperCase()}?`);
  if (!confirmed) {
    return;
  }

  try {
    for (const item of order.cart) {
      const res = await fetch(`${API_URL}/${item.id}`);
      if (!res.ok) {
        throw new Error("Không thể lấy dữ liệu sản phẩm");
      }
      const product = await res.json();
      const remain = product.stock - item.count;
      if (remain < 0) {
        alert(`${product.name} không đủ hàng. Vui lòng giảm số lượng hoặc chọn sản phẩm khác.`);
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

    alert("Thanh toán thành công! Đơn hàng của bạn đã được gửi.");
    location.href = "index.html";
  } catch (error) {
    console.error(error);
    alert("Lỗi trong quá trình thanh toán. Vui lòng thử lại sau.");
  }
}

renderPayment();