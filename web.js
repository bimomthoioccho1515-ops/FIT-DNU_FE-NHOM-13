const products = [
  {
    id: 1,
    name: "Áo sơ mi trắng",
    price: 450000,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800"
  },
  {
    id: 2,
    name: "Giày thể thao",
    price: 1200000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800"
  },
  {
    id: 3,
    name: "Áo hoodie xám",
    price: 650000,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800"
  },
  {
    id: 4,
    name: "Áo khoác jean",
    price: 890000,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800"
  },
  {
    id: 5,
    name: "Giày sneaker trắng",
    price: 1450000,
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800"
  },
  {
    id: 6,
    name: "Túi xách nữ",
    price: 980000,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800"
  },
  {
    id: 7,
    name: "Đồng hồ thời trang",
    price: 2500000,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800"
  },
  {
    id: 8,
    name: "Kính mát cao cấp",
    price: 550000,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800"
  }
];

let cart = [];

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const total = document.getElementById("total");

function money(x) {
  return x.toLocaleString('vi-VN') + "₫";
}

function renderProducts() {
  productGrid.innerHTML = "";

  products.forEach(product => {
    productGrid.innerHTML += `
      <div class="card">
        <img src="${product.image}" alt="${product.name}">
        <div class="card-body">
          <h3>${product.name}</h3>
          <div class="price">${money(product.price)}</div>
          <button type="button" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
        </div>
      </div>
    `;
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  cart.push(product);
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";
  let sum = 0;

  cart.forEach(item => {
    sum += item.price;
    cartItems.innerHTML += `
      <div class="cart-item">
        <span>${item.name}</span>
        <span>${money(item.price)}</span>
      </div>
    `;
  });

  total.innerText = money(sum);
}

renderProducts();
