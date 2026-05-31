const API_URL =
"https://YOUR_PROJECT.mockapi.io/products";

function getCart(){

return JSON.parse(
localStorage.getItem(
"cart"
)
)||[];

}

function renderCheckout(){

const box=

document.getElementById(
"checkoutItems"
);

const cart=
getCart();

let total=0;

box.innerHTML=

cart.map(item=>{

const money=

item.price*
item.count;

total+=money;

return`

<div class="item">

<img
src="${item.image}">

<div class="info">

<h2>

${item.name}

</h2>

<p>

SL:
${item.count}

</p>

<div class="price">

${money.toLocaleString(
"vi-VN"
)}

₫

</div>

</div>

</div>

`;

}).join("");

document
.getElementById(
"total"
)

.innerText=

total.toLocaleString(
"vi-VN"
)

+"₫";

}

async function placeOrder(){

const name=

document
.getElementById(
"name"
).value;

const phone=

document
.getElementById(
"phone"
).value;

const address=

document
.getElementById(
"address"
).value;

if(

!name
||
!phone
||
!address

){

alert(
"Nhập đầy đủ thông tin"
);

return;

}

const cart=
getCart();

try{

for(
const item
of cart
){

const res=

await fetch(

`${API_URL}/${item.id}`

);

const product=

await res.json();

const remain=

product.stock
-
item.count;

if(
remain<0
){

alert(

`${product.name}
 hết hàng`

);

return;

}

await fetch(

`${API_URL}/${item.id}`,

{

method:
"PUT",

headers:{

"Content-Type":
"application/json"

},

body:

JSON.stringify({

...product,

stock:
remain

})

}

);

}

localStorage.removeItem(
"cart"
);

alert(
"Đặt hàng thành công"
);

location.href=
"index.html";

}
catch{

alert(
"Lỗi đặt hàng"
);

}

}

renderCheckout();