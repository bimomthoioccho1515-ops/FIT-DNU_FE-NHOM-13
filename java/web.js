const API_URL =
"https://6a1a846abc2f94475492525f.mockapi.io/products";

const CART_KEY = "cart";

let products = [];

let selectedCategory = "all";
let selectedColor = "all";

/* LOAD PRODUCT */

async function loadProducts() {

try{

const res = await fetch(API_URL);

products = await res.json();

renderProducts();

}
catch(err){

console.log(err);

document.getElementById("productGrid").innerHTML =
"<h2>Không tải được dữ liệu</h2>";

}

}

/* CART */

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

}

/* ADD */

async function addToCart(id){

const product =
products.find(
p=>Number(p.id)===Number(id)
);

if(!product){

alert("Không tìm thấy");

return;

}

if(product.stock<=0){

alert("Hết hàng");

return;

}

let cart=getCart();

const item=
cart.find(
i=>Number(i.id)===Number(id)
);

if(item){

item.count++;

}else{

cart.push({
...product,
count:1
});

}

saveCart(cart);

/* update stock */

product.stock--;

const newSold =
(product.sold || 0) + 1;

product.sold =
newSold;

try{

await fetch(

`${API_URL}/${id}`,

{

method:"PUT",

headers:{
"Content-Type":
"application/json"
},

body:JSON.stringify({

stock:product.stock,

sold:newSold

})

}

);

}
catch{

alert(
"Lỗi cập nhật kho"
);

}

}

/* COUNT */

function updateCartCount(){

const cart=getCart();

const total=
cart.reduce(
(a,b)=>
a+b.count,
0
);

const el=
document.getElementById(
"cartCount"
);

if(el){

el.innerText=total;

}

}

/* FILTER */

function setCategory(cat){

selectedCategory=cat;

renderProducts();

}

/* RENDER */

function renderProducts(){

const grid=
document.getElementById(
"productGrid"
);

if(!grid)return;

const search=
document.getElementById(
"searchInput"
);

const q=
search
?
search.value.toLowerCase()
:
"";

const list=
products.filter(
p=>

p.stock>0&&

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

);

grid.innerHTML=
list.map(p=>`

<div class="card">

<img src="${p.image}">

<div class="card-body">

<h3>${p.name}</h3>

<p>

${Number(
p.price
).toLocaleString(
"vi-VN"
)}₫

</p>

<p>

Còn:
${p.stock}

</p>

<button
onclick="addToCart('${p.id}')"
>

Thêm vào giỏ

</button>

</div>

</div>

`).join("");

}

/* SEARCH */

const input=
document.getElementById(
"searchInput"
);

if(input){

input.addEventListener(
"input",
renderProducts
);

}

/* AUTH */

function isLoggedIn(){

return localStorage
.getItem(
"isLoggedIn"
)==="true";

}

function updateAuthButton(){

const btn=
document.getElementById(
"authBtn"
);

if(!btn)return;

btn.innerText=
isLoggedIn()
?
"Logout"
:
"Login";

}

function handleAuthAction(){

if(isLoggedIn()){

localStorage.removeItem(
"isLoggedIn"
);

updateAuthButton();

}else{

window.location.href=
"login.html";

}

}

/* INIT */

loadProducts();

updateCartCount();

updateAuthButton();