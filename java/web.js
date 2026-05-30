const STORAGE_KEY = "warehouseInventory";
const CART_KEY = "cart";

/* ================= DATA ================= */

const initialProducts = [
  { id: 1, name: "Áo sơ mi trắng", price: 450000, stock: 150, category: "Quần áo", color: "white", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800" },
  { id: 2, name: "Giày thể thao", price: 1200000, stock: 45, category: "Giày", color: "black", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800" },
  { id: 3, name: "Áo hoodie xám", price: 650000, stock: 70, category: "Quần áo", color: "black", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800" },
  { id: 4, name: "Áo khoác jean", price: 890000, stock: 120, category: "Quần áo", color: "blue", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800" },
  { id: 5, name: "Giày sneaker trắng", price: 1450000, stock: 20, category: "Giày", color: "white", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800" },
  { id: 6, name: "Túi xách nữ", price: 980000, stock: 80, category: "Túi xách", color: "pink", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800" },
  { id: 7, name: "Đồng hồ thời trang", price: 2500000, stock: 25, category: "Phụ kiện", color: "black", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800" },
  { id: 8, name: "Kính mát cao cấp", price: 550000, stock: 0, category: "Phụ kiện", color: "black", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800" }
];

/* ================= STATE ================= */

let products = loadProducts();
let selectedCategory = "all";
let selectedColor = "all";

/* ================= STORAGE ================= */

function loadProducts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
  return [...initialProducts];
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

/* ================= CART ================= */

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* ================= ADD TO CART (COUNT FIX) ================= */

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product || product.stock <= 0) return alert("Hết hàng");

  let cart = getCart();

  let item = cart.find(p => p.id === id);

  if (item) {
    item.count += 1;
  } else {
    cart.push({ ...product, count: 1 });
  }

  saveCart(cart);

  product.stock -= 1;
  saveProducts();

  renderProducts();
  updateCartCount();
}

/* ================= COUNT ================= */

function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (!el) return;

  const cart = getCart();

  const totalCount = cart.reduce((sum, item) => sum + item.count, 0);

  el.innerText = totalCount;
}

/* ================= RENDER ================= */

function renderProducts() {
  const grid = document.getElementById("productGrid");
  const search = document.getElementById("searchInput");

  const q = search ? search.value.toLowerCase() : "";

  const list = products.filter(p =>
    p.stock > 0 &&
    (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) &&
    (selectedCategory === "all" || p.category === selectedCategory) &&
    (selectedColor === "all" || p.color === selectedColor)
  );

  grid.innerHTML = list.map(p => `
    <div class="card">
      <img src="${p.image}">
      <div class="card-body">
        <h3>${p.name}</h3>
        <div>${p.price.toLocaleString("vi-VN")}₫</div>
        <div>Còn: ${p.stock}</div>
        <button onclick="addToCart(${p.id})">Thêm vào giỏ</button>
      </div>
    </div>
  `).join("");
}

/* INIT */

renderProducts();
updateCartCount();
/* ================= AUTH ================= */

function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

function updateAuthButton() {
  const authBtn = document.getElementById("authBtn");

  if (!authBtn) return;

  if (isLoggedIn()) {
    authBtn.innerText = "Logout";
  } else {
    authBtn.innerText = "Login";
  }
}

function handleAuthAction() {

  // Nếu đã đăng nhập -> đăng xuất
  if (isLoggedIn()) {

    localStorage.removeItem("isLoggedIn");

    alert("Đã đăng xuất");

    updateAuthButton();

    // nếu muốn quay về login page:
    // window.location.href = "login.html";

  } else {

    // chưa đăng nhập -> sang login page
    window.location.href = "login.html";
  }
}

/* ================= INIT ================= */

renderProducts();
updateCartCount();
updateAuthButton();
localStorage.setItem("isLoggedIn", "true");