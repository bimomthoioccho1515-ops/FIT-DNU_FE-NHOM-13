/* ================= API ================= */

/* API_URL is provided by java/api.js */
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
      alert("Product not found");
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
    alert("Added to bag");
  } catch {
    alert("Failed to add to cart");
  }
}

async function addToFavorite(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const product = await res.json();
    if (!product.id) {
      alert("Product not found");
      return;
    }

    const favorites = getFavorites();
    if (favorites.some(x => String(x.id) === String(id))) {
      alert("Product already in favorites");
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
    alert("Added to favorites");
  } catch {
    alert("Failed to add to favorites");
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

    const description = product.description || 'Sporty design with comfortable fit and modern performance details for everyday wear.';

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
          <div class="price">${Number(product.price).toLocaleString("en-US")}₫</div>
          <div class="product-meta">
            <div class="meta-item">
              <span>Color</span>
              <strong>${product.color}</strong>
            </div>
            <div class="meta-item">
              <span>Stock</span>
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
          <p>Free shipping on orders over 1,000,000₫, flexible 14-day returns, and careful delivery handling.</p>
        </div>
      </section>
      <section class="related-products">
        <h2>Related products</h2>
        <div class="related-grid" id="relatedProducts"></div>
      </section>
    `;

    loadRelated(product.category, product.id);
  } catch {
    document.getElementById("productDetail").innerHTML = `<h2>Tính năng này đang trong quá trình phát triển, vui lòng quay lại sau.</h2>`;
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
          <div class="price">${Number(p.price).toLocaleString("en-US")}₫</div>
          <button onclick="event.stopPropagation(); addToCart('${p.id}')">Add to bag</button>
        </div>
      </div>
    `).join("");
  } catch {
    console.log("Failed to load related products");
  }
}

/* ================= INIT ================= */

window.onload = () => {
  updateCartCount();
  loadProduct();
};
