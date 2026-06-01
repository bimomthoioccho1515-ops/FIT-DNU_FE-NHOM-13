/* ================= API ================= */

const API_URL =
"https://6a1a846abc2f94475492525f.mockapi.io/products";

const CART_KEY = "cart";
const FAVORITE_KEY = "favorite";

let products = [];

let selectedCategory = "all";
let selectedColor = "all";

/* ================= LOAD PRODUCTS ================= */

async function loadProducts(){

try{

const res =
await fetch(API_URL);

products =
await res.json();

renderProducts();

}
catch(err){

console.log(err);

document.getElementById(
"productGrid"
).innerHTML=
"<h2>Lỗi tải dữ liệu</h2>";

}

}

/* ================= CART ================= */

function getCart(){

return JSON.parse(
localStorage.getItem(CART_KEY)
)||[];

}

function saveCart(cart){

localStorage.setItem(
CART_KEY,
JSON.stringify(cart)
);

updateCartCount();

}

function getFavorites(){
  return JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];
}

function saveFavorites(favorites){
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
  updateFavoriteCount();
}

function updateFavoriteCount(){
  const el = document.getElementById("favoriteCount");
  if(!el) return;
  const favorites = getFavorites();
  el.innerText = favorites.length;
}

/* ================= ADD ================= */

function addToCart(id){

const product =
products.find(
p=>String(p.id)===String(id)
);

if(!product)return;

let cart =
getCart();

const item =
cart.find(
x=>x.id===id
);

if(item){

item.count++;

}else{

cart.push({

id:product.id,
name:product.name,
price:product.price,
image:product.image,
count:1

});

}

saveCart(cart);

updateCartCount();

}
/* ================= COUNT ================= */

function updateCartCount(){

const el =
document.getElementById(
"cartCount"
);

if(!el){

return;

}

const cart =
getCart();

const total =
cart.reduce(
(sum,item)=>
sum+item.count,
0
);

el.innerText=
total;

}

/* ================= RENDER ================= */

function renderProducts(){

const grid =
document.getElementById(
"productGrid"
);

if(!grid){

return;

}

const search =
document.getElementById(
"searchInput"
);

const q =
search
?
search.value
.toLowerCase()
:
"";

const list =
products.filter(p=>{

return(

p.stock>0

&&

(
p.name
.toLowerCase()
.includes(q)

||

p.category
.toLowerCase()
.includes(q)
)

&&

(
selectedCategory==="all"

||

p.category===selectedCategory
)

&&

(
selectedColor==="all"

||

p.color===selectedColor
)

);

});

if(list.length===0){

grid.innerHTML=`

<div
class="empty-state">

Không tìm thấy sản phẩm

</div>

`;

return;

}

grid.innerHTML=
list.map(p=>`

<div
class="card">

<img
src="${p.image}"

onclick="
location.href=
'product.html?id=${p.id}'
">

<div
class="card-body">

<h3>

${p.name}

</h3>

<div
class="price">

${Number(
p.price
).toLocaleString(
"vi-VN"
)}₫

</div>

<div
class="stock-label">

Còn:
${p.stock}

</div>

<button

onclick="
event.stopPropagation();

addToCart(
'${p.id}'
)
">

Thêm vào giỏ

</button>

</div>

</div>

`).join("");

}

/* ================= FILTER ================= */

function setCategory(cat){

selectedCategory=
cat;

document
.querySelectorAll(
".category-btn"
)

.forEach(
btn=>

btn.classList.remove(
"active"
)

);

const current =
document.querySelector(
`[data-category="${cat}"]`
);

if(current){

current.classList.add(
"active"
);

}

renderProducts();

}

/* ================= SEARCH ================= */

document
.addEventListener(
"input",
e=>{

if(

e.target.id===
"searchInput"

){

renderProducts();

}

}
);

/* ================= LOGIN ================= */

function isLoggedIn(){

return(

localStorage
.getItem(
"isLoggedIn"
)

==="true"

);

}

function updateAuthButton(){

const btn=
document.getElementById(
"authBtn"
);

if(!btn){

return;

}

btn.innerText=

isLoggedIn()

?

"Logout"

:

"Login";

}

function handleAuthAction(){

if(

isLoggedIn()

){

localStorage.removeItem(
"isLoggedIn"
);

localStorage.removeItem(
"currentUser"
);

localStorage.removeItem(
"userRole"
);

updateAuthButton();

alert(
"Đăng xuất thành công"
);

}
else{

location.href=
"login.html";

}

}

/* ================= INIT ================= */

window.onload=()=>{

loadProducts();

updateCartCount();

updateFavoriteCount();

updateAuthButton();

};