const FAVORITE_KEY = "favorite";

function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
}

function money(x) {
  return x.toLocaleString("vi-VN") + "₫";
}

function renderFavorites() {
  const container = document.getElementById("favoriteItems");
  const totalEl = document.getElementById("favoriteTotal");

  const favorites = getFavorites();
  let total = 0;

  if (!favorites.length) {
    container.innerHTML = "<p>Bạn chưa có sản phẩm yêu thích.</p>";
    totalEl.innerText = "0₫";
    return;
  }

  container.innerHTML = favorites.map(item => {
    total += item.price * item.count;

    return `
      <div class="cart-item">
        <img src="${item.image}">
        <div class="cart-info">
          <h3>${item.name}</h3>
          <p>${money(item.price)}</p>
          <p>Số lượng: <b>${item.count}</b></p>
        </div>
        <div class="cart-actions">
          <button class="remove-btn" onclick="removeFavorite(${item.id})">Xóa</button>
        </div>
      </div>
    `;
  }).join("");

  totalEl.innerText = money(total);
}

function removeFavorite(id) {
  const favorites = getFavorites().filter(item => item.id !== id);
  saveFavorites(favorites);
  renderFavorites();
}

renderFavorites();