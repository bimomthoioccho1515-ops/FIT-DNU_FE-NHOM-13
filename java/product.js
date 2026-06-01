/* ================= API ================= */

const API_URL = "https://6a1a846abc2f94475492525f.mockapi.io/products";
const CART_KEY = "cart";
const FAVORITE_KEY = "favorite";

/* ================= GET ID ================= */

const id = new URLSearchParams(window.location.search).get("id");

/* ================= CART ================= */

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
}

function updateCartCount() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.count, 0);
  badge.innerText = total;
}

async function addToCart(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const product = await res.json();
    if (!product.id) {
      alert("Sản phẩm không tồn tại");
      return;
    }

    const cart = getCart();
    const item = cart.find(x => String(x.id) === String(id));

    if (item) {
      item.count++;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        count: 1
      });
    }

    saveCart(cart);
    alert("Đã thêm vào giỏ");
  } catch {
    alert("Lỗi thêm giỏ hàng");
  }
}

async function addToFavorite(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const product = await res.json();
    if (!product.id) {
      alert("Sản phẩm không tồn tại");
      return;
    }

    const favorites = getFavorites();
    if (favorites.some(x => String(x.id) === String(id))) {
      alert("Sản phẩm đã có trong mục Yêu thích");
      return;
    }

    favorites.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      count: 1
    });

    saveFavorites(favorites);
    alert("Đã thêm vào Yêu thích");
  } catch {
    alert("Lỗi thêm vào Yêu thích");
  }
}

function setMainImage(src) {
  const main = document.querySelector('.detail-image');
  if (main) main.src = src;
}

/* ================= LOAD PRODUCT ================= */

async function loadProduct() {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const product = await res.json();
    if (!product.id) throw Error();

    const description = product.description || 'Thiết kế đậm chất thể thao, phù hợp mọi hoạt động hằng ngày với độ êm ái và form ôm vừa vặn.';

    document.getElementById("productDetail").innerHTML = `
      <section class="detail-page">
        <div class="detail-left">
          <div class="product-gallery">
            <img class="detail-image" src="${product.image}" alt="${product.name}">
            <div class="thumbnail-list">
              <img class="thumbnail active" src="${product.image}" alt="Thumbnail" onclick="setMainImage('${product.image}')">
              <img class="thumbnail" src="${product.image}" alt="Thumbnail" onclick="setMainImage('${product.image}')">
              <img class="thumbnail" src="${product.image}" alt="Thumbnail" onclick="setMainImage('${product.image}')">
            </div>
          </div>
        </div>
        <div class="detail-right">
          <div class="product-labels">
            <span class="product-label">New</span>
            <span class="product-label">Best seller</span>
          </div>
          <h1>${product.name}</h1>
          <div class="product-subtitle">${product.category} · ${product.color}</div>
          <div class="price">${Number(product.price).toLocaleString("vi-VN")}₫</div>
          <div class="product-meta">
            <div class="meta-item">
              <span>Màu</span>
              <strong>${product.color}</strong>
            </div>
            <div class="meta-item">
              <span>Kho</span>
              <strong>${product.stock}</strong>
            </div>
          </div>
          <div class="product-description">${description}</div>
          <div class="product-actions">
            <button class="add-to-cart" onclick="addToCart('${product.id}')">Add to bag</button>
            <button class="save-button" onclick="addToFavorite('${product.id}')">Save</button>
          </div>
        </div>
      </section>
      <section class="detail-info">
        <div class="detail-feature">
          <h3>Product details</h3>
          <p>${description}</p>
        </div>
        <div class="detail-feature">
          <h3>Shipping & returns</h3>
          <p>Miễn phí giao hàng cho đơn hàng từ 1 triệu, đổi trả trong 14 ngày. Đảm bảo chất lượng sản phẩm khi giao đến tay.</p>
        </div>
      </section>
      <section class="related-products">
        <h2>Related products</h2>
        <div class="related-grid" id="relatedProducts"></div>
      </section>
    `;

    loadRelated(product.category, product.id);
  } catch {
    document.getElementById("productDetail").innerHTML = `<h2>Không tìm thấy sản phẩm</h2>`;
  }
}

/* ================= RELATED ================= */

async function loadRelated(category, currentId) {
  try {
    const res = await fetch(API_URL);
    const products = await res.json();
    const list = products.filter(p => p.category === category && p.id != currentId).slice(0, 6);
    const box = document.getElementById("relatedProducts");
    if (!box) return;
    box.innerHTML = list.map(p => `
      <div class="card">
        <img src="${p.image}" onclick="location.href='product.html?id=${p.id}'">
        <div class="card-body">
          <h3>${p.name}</h3>
          <div class="price">${Number(p.price).toLocaleString("vi-VN")}₫</div>
          <button onclick="event.stopPropagation(); addToCart('${p.id}')">Thêm vào giỏ</button>
        </div>
      </div>
    `).join("");
  } catch {
    console.log("Lỗi tải sản phẩm liên quan");
  }
}

/* ================= INIT ================= */

window.onload = () => {
  updateCartCount();
  loadProduct();
};
