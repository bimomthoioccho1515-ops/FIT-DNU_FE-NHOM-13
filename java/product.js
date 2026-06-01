/* ================= API ================= */

const API_URL =
"https://6a1a846abc2f94475492525f.mockapi.io/products";

const CART_KEY =
"cart";

/* ================= GET ID ================= */

const id =
new URLSearchParams(
window.location.search
).get(
"id"
);

/* ================= CART ================= */

function getCart(){

return JSON.parse(

localStorage.getItem(
CART_KEY

)

)||[];

}

function saveCart(cart){

localStorage.setItem(

CART_KEY,

JSON.stringify(
cart
)

);

updateCartCount();

}

function updateCartCount(){

const badge =

document.getElementById(
"cartCount"
);

if(
!badge
){

return;

}

const cart =
getCart();

const total =

cart.reduce(

(sum,item)=>

sum+
item.count,

0

);

badge.innerText =
total;

}

/* ================= ADD TO CART ================= */

async function addToCart(id){

try{

const res =

await fetch(

`${API_URL}/${id}`

);

const product =

await res.json();

if(
!product.id
){

alert(
"Sản phẩm không tồn tại"
);

return;

}

let cart =
getCart();

const item =

cart.find(

x=>

String(
x.id
)

===

String(
id
)

);

if(
item
){

item.count++;

}

else{

cart.push({

id:
product.id,

name:
product.name,

price:
Number(
product.price
),

image:
product.image,

count:
1

});

}

saveCart(
cart
);

alert(
"Đã thêm vào giỏ"
);

}
catch{

alert(
"Lỗi thêm giỏ hàng"
);

}

}

/* ================= LOAD PRODUCT ================= */

async function loadProduct(){

try{

const res =

await fetch(

`${API_URL}/${id}`

);

const product =

await res.json();

if(
!product.id
){

throw Error();

}

document
.getElementById(
"productDetail"
)

.innerHTML =

`

<div class="detail">

<img
src="${product.image}"
class="detail-img">

<div>

<h1>

${product.name}

</h1>

<h2>

${Number(
product.price
).toLocaleString(
"vi-VN"
)}

₫

</h2>

<p>

Danh mục:
<b>

${product.category}

</b>

</p>

<br>

<p>

Màu:
<b>

${product.color}

</b>

</p>

<br>

<p>

Kho:
<b>

${product.stock}

</b>

</p>

<br>

<button

onclick="
addToCart(
'${product.id}'
)
">

THÊM VÀO GIỎ

</button>

</div>

</div>

`;

loadRelated(
product.category,
product.id
);

}
catch{

document
.getElementById(
"productDetail"
)

.innerHTML=

`

<h2>

Không tìm thấy sản phẩm

</h2>

`;

}

}

/* ================= RELATED ================= */

async function loadRelated(

category,
currentId

){

try{

const res =

await fetch(
API_URL
);

const products =

await res.json();

const list =

products

.filter(

p=>

p.category
===

category

&&

p.id
!=

currentId

)

.slice(
0,
6
);

const box =

document.getElementById(
"relatedProducts"
);

if(
!box
){

return;

}

box.innerHTML=

list.map(

p=>

`

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
)}

₫

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

`

).join("");

}
catch{

console.log(
"Lỗi tải sản phẩm liên quan"
);

}

}

/* ================= INIT ================= */

window.onload=()=>{

updateCartCount();

loadProduct();

};