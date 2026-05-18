const STORAGE_KEY = 'warehouseInventory';

const initialProducts = [
  {
    id: 1,
    name: "Áo sơ mi trắng",
    price: 450000,
    stock: 150,
    category: "Quần áo",
    color: "white",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800"
  },
  {
    id: 2,
    name: "Giày thể thao",
    price: 1200000,
    stock: 45,
    category: "Giày",
    color: "black",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800"
  },
  {
    id: 3,
    name: "Áo hoodie xám",
    price: 650000,
    stock: 70,
    category: "Quần áo",
    color: "black",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800"
  },
  {
    id: 4,
    name: "Áo khoác jean",
    price: 890000,
    stock: 120,
    category: "Quần áo",
    color: "blue",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800"
  },
  {
    id: 5,
    name: "Giày sneaker trắng",
    price: 1450000,
    stock: 20,
    category: "Giày",
    color: "white",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800"
  },
  {
    id: 6,
    name: "Túi xách nữ",
    price: 980000,
    stock: 80,
    category: "Túi xách",
    color: "pink",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800"
  },
  {
    id: 7,
    name: "Đồng hồ thời trang",
    price: 2500000,
    stock: 25,
    category: "Phụ kiện",
    color: "black",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800"
  },
  {
    id: 8,
    name: "Kính mát cao cấp",
    price: 550000,
    stock: 0,
    category: "Phụ kiện",
    color: "black",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800"
  }
];

let products = loadProducts();
let cart = [];
let selectedCategory = 'all';
let selectedColor = 'all';

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const total = document.getElementById("total");
const searchInput = document.getElementById("searchInput");

function money(x) {
  return x.toLocaleString('vi-VN') + "₫";
}

function getWarehouseInventory() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
}

function saveWarehouseInventory(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadProducts() {
  const saved = getWarehouseInventory();
  if (saved) {
    return saved;
  }
  saveWarehouseInventory(initialProducts);
  return [...initialProducts];
}

function getFilteredProducts() {
  const query = searchInput.value.toLowerCase();
  return products.filter(product => {
    const matchesText = product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesColor = selectedColor === 'all' || product.color === selectedColor;
    return product.stock > 0 && matchesText && matchesCategory && matchesColor;
  });
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();
  productGrid.innerHTML = "";

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = `<div class="empty-state">Không có sản phẩm phù hợp.</div>`;
    return;
  }

  filteredProducts.forEach(product => {
    productGrid.innerHTML += `
      <div class="card">
        <img src="${product.image}" alt="${product.name}">
        <div class="card-body">
          <h3>${product.name}</h3>
          <div class="price">${money(product.price)}</div>
          <div class="stock-label">Còn: ${product.stock}</div>
          <button type="button" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
        </div>
      </div>
    `;
  });
}

function setCategory(category) {
  selectedCategory = category;
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
  renderProducts();
}

function setColor(color) {
  selectedColor = color;
  document.querySelectorAll('.color-circle').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.color === color);
  });
  renderProducts();
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product || product.stock <= 0) {
    alert('Sản phẩm đã hết hàng.');
    return;
  }
  cart.push({ ...product });
  decrementStock(id, 1);
  renderCart();
  renderProducts();
}

function decrementStock(id, quantity) {
  const warehouse = getWarehouseInventory() || [];
  const item = warehouse.find(p => p.id === id);
  if (!item) return;
  item.stock = Math.max(0, item.stock - quantity);
  saveWarehouseInventory(warehouse);
  products = warehouse;
}

function renderCart() {
  cartItems.innerHTML = "";
  let sum = 0;

  cart.forEach((item, index) => {
    sum += item.price;
    cartItems.innerHTML += `
      <div class="cart-item">
        <div class="cart-info">
          <span>${item.name}</span>
          <span>${money(item.price)}</span>
        </div>
        <button class="delete-btn" onclick="removeFromCart(${index})">Xóa</button>
      </div>
    `;
  });

  total.innerText = money(sum);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

searchInput.addEventListener('input', renderProducts);

function showPaymentOptions() {
  document.getElementById('paymentOptions').style.display = 'flex';
}

function hidePaymentOptions() {
  document.getElementById('paymentOptions').style.display = 'none';
}

function selectPayment(method) {
  const name = document.getElementById('customerName').value;
  const phone = document.getElementById('customerPhone').value;
  const address = document.getElementById('customerAddress').value;

  if (!name || !phone || !address) {
    alert('Vui lòng nhập đầy đủ thông tin khách hàng.');
    return;
  }

  let message = `Thông tin khách hàng:\nTên: ${name}\nSĐT: ${phone}\nĐịa chỉ: ${address}\n\n`;

  if (method === 'cod') {
    message += 'Bạn đã chọn thanh toán khi nhận hàng (COD). Đơn hàng sẽ được giao trong 3-5 ngày.';
  } else if (method === 'bank') {
    message += 'Bạn đã chọn chuyển khoản. Thông tin tài khoản: Vietcombank - 123456789 - Nguyễn Văn A. Sau khi chuyển, vui lòng gửi biên lai.';
  }

  alert(message);
  hidePaymentOptions();
}

renderProducts();
