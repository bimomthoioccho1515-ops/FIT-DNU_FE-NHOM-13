/* ================= STATE ================= */

let products = [];
let orders = [];

let selectedProductId = null;

let revenueChart = null;

let inventoryChart = null;


/* ================= INIT ================= */

document.addEventListener(
"DOMContentLoaded",
() => {

if (
typeof PRODUCT_API ===
"undefined"
){

alert(
"Lỗi: chưa load api.js"
);

return;

}

loadProducts();

}
);


/* ================= LOAD ================= */

async function loadProducts(){

try{

const productRes = await fetch(PRODUCT_API);

if(
!productRes.ok
){

throw new Error();

}

products =
await productRes.json();

let orderRes = null;
if(typeof ORDER_API !== 'undefined'){
  orderRes = await fetch(ORDER_API).catch(() => null);
}

if(orderRes && orderRes.ok){
  orders = await orderRes.json();
} else {
  orders = [];
}

renderTable();

updateDashboard();

renderAnalysis();

renderCharts();

}

catch(err){

console.log(err);

alert(
"Không tải được dữ liệu"
);

}

}


/* ================= TABLE ================= */

function renderTable(){

const body =
document.getElementById(
"inventoryBody"
);

if(!body)
return;

body.innerHTML="";

products.forEach(

p=>{

body.innerHTML+=`

<tr>

<td>

<img
src="${p.image}"
width="60"
onerror="
this.src=
'https://placehold.co/60'
">

</td>

<td>${p.name}</td>

<td>${p.category}</td>

<td>

${Number(
p.price
).toLocaleString(
"vi-VN"
)}₫

</td>

<td>${p.stock}</td>

<td>${p.sold}</td>

<td>${p.imported}</td>

<td>

${
p.stock>10
?
"🟢"

:
p.stock>0
?
"🟡"

:
"🔴"
}

</td>

<td>

<button
onclick=
"openImport('${p.id}')"
>

Import

</button>

<button
onclick=
"deleteProduct('${p.id}')"
>

Delete

</button>

</td>

</tr>

`;

}

);

}


/* ================= DASHBOARD ================= */

function updateDashboard(){

let inventory=0;

let sold=0;

let revenue=0;

let low=0;

products.forEach(

p=>{

inventory+=
Number(
p.stock
)||0;

sold+=
Number(
p.sold
)||0;

revenue+=

(
Number(
p.price
)||0
)

*

(
Number(
p.sold
)||0
);

if(
p.stock<=5
)
low++;

}

);

setValue(
"totalInventory",
inventory
);

setValue(
"totalSold",
sold
);

setValue(
"lowStock",
low
);

setValue(
"totalOrders",
orders.length
);

const displayRevenue = orders.length > 0
  ? orders.reduce((sum, order) => sum + getOrderTotal(order), 0)
  : revenue;

setValue(

"totalRevenue",

displayRevenue
.toLocaleString(
"vi-VN"
)

+"₫"

);

}


function setValue(
id,
value
){

const el=
document.getElementById(
id
);

if(el)
el.innerText=
value;

}

function getOrderTotal(order){
  if(!order || typeof order !== 'object') return 0;
  if(typeof order.total === 'number') return order.total;
  if(typeof order.total === 'string'){
    const parsed = Number(order.total.replace(/[\D]/g, ''));
    if(!isNaN(parsed)) return parsed;
  }

  if(Array.isArray(order.cart)){
    return order.cart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const count = Number(item.count) || 0;
      return sum + price * count;
    }, 0);
  }

  return 0;
}

function renderAnalysis(){
  const revenueBody = document.getElementById('revenueAnalysisBody');
  const stockBody = document.getElementById('stockAnalysisBody');
  if(!revenueBody || !stockBody) return;

  const revenueRows = products
    .slice()
    .sort((a, b) => (Number(b.sold) * Number(b.price || 0)) - (Number(a.sold) * Number(a.price || 0)))
    .map(p => {
      const sold = Number(p.sold) || 0;
      const revenue = sold * (Number(p.price) || 0);
      return `
        <tr>
          <td>${p.name}</td>
          <td>${p.category || 'Other'}</td>
          <td>${sold}</td>
          <td>${revenue.toLocaleString('vi-VN')}₫</td>
        </tr>
      `;
    })
    .join('');

  const stockRows = products
    .slice()
    .sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0))
    .map(p => {
      const stock = Number(p.stock) || 0;
      const status = stock > 10 ? 'In stock' : stock > 0 ? 'Low stock' : 'Out of stock';
      return `
        <tr>
          <td>${p.name}</td>
          <td>${p.category || 'Other'}</td>
          <td>${stock}</td>
          <td>${status}</td>
        </tr>
      `;
    })
    .join('');

  revenueBody.innerHTML = revenueRows;
  stockBody.innerHTML = stockRows;
}


/* ================= CHART ================= */

function renderCharts(){

if(
typeof Chart
===
"undefined"
)
return;


if(
revenueChart
)
revenueChart.destroy();


if(
inventoryChart
)
inventoryChart.destroy();

const productLabels = products.map(x => x.name || `Product ${x.id}`);
const productRevenue = products.map(x => (Number(x.price) || 0) * (Number(x.sold) || 0));
const productStock = products.map(x => Number(x.stock) || 0);

const palette = [
  'rgba(255,99,132,0.85)',
  'rgba(54,162,235,0.85)',
  'rgba(255,206,86,0.85)',
  'rgba(75,192,192,0.85)',
  'rgba(153,102,255,0.85)',
  'rgba(255,159,64,0.85)',
  'rgba(199,199,199,0.85)',
  'rgba(83,102,255,0.85)',
  'rgba(255,102,204,0.85)',
  'rgba(102,255,178,0.85)'
];

const chartColors = productLabels.map((_, idx) => palette[idx % palette.length]);

revenueChart=

new Chart(

document
.getElementById(
"revenueChart"
),

{

type:
"bar",

data:{

labels:

productLabels,

datasets:[{

label:
"Revenue by Product",

backgroundColor:
chartColors,

borderColor:
chartColors.map(c => c.replace('0.85', '1')),

data:

productRevenue

}]

},

options:{

responsive:
true,
plugins:{
  legend:{ labels:{ color:'#fff' } }
},
scales:{
  y:{ ticks:{ color:'#fff' }, grid:{ color:'rgba(255,255,255,0.08)' } },
  x:{ ticks:{ color:'#fff' } }
}

}

}

);


inventoryChart=

new Chart(

document
.getElementById(
"inventoryChart"
),

{

type:
"doughnut",

data:{

labels:

productLabels,

datasets:[{

label:
"Stock",

data:

productStock,
backgroundColor: chartColors,

borderColor: chartColors.map(c => c.replace('0.85', '1'))

}]

},

options:{

responsive:
true,
plugins:{ legend:{ labels:{ color:'#fff' } } }

}

}

);

}


/* ================= ADD ================= */

async function addProduct(){

const product={

name:
value(
"name"
),

price:
Number(
value(
"price"
)
),

stock:
Number(
value(
"stock"
)
),

category:
value(
"category"
),

color:
value(
"color"
),

image:
value(
"image"
),

sold:0,

imported:
Number(
value(
"stock"
)
)

};

await fetch(

PRODUCT_API,

{

method:
"POST",

headers:{

"Content-Type":
"application/json"

},

body:

JSON.stringify(
product
)

}

);

closeAddModal();

loadProducts();

}


function value(id){

return document
.getElementById(
id
)
.value
.trim();

}


/* ================= DELETE ================= */

async function deleteProduct(id){

if(
!confirm(
"Xóa sản phẩm?"
)
)
return;

await fetch(

`${PRODUCT_API}/${id}`,

{

method:
"DELETE"

}

);

loadProducts();

}


/* ================= IMPORT ================= */

function openImport(id){

selectedProductId=id;

document
.getElementById(
"importModal"
)
.style.display=
"flex";

}


function closeImportModal(){

document
.getElementById(
"importModal"
)
.style.display=
"none";

}


async function confirmImport(){

const qty=

Number(

document
.getElementById(
"importQuantity"
)
.value

);

if(qty<=0)
return;

const p=
products.find(
x=>
x.id==
selectedProductId
);

p.stock+=qty;

p.imported+=qty;

await fetch(

`${PRODUCT_API}/${p.id}`,

{

method:
"PUT",

headers:{
"Content-Type":
"application/json"
},

body:
JSON.stringify(
p
)

}

);

closeImportModal();

loadProducts();

}


/* ================= UPLOAD ================= */

function triggerUploadInput(){

document
.getElementById(
"productUploadInput"
)
.click();

}


async function uploadProductsFromFile(
event
){

const file=
event.target.files[0];

if(!file)
return;

const text=
await file.text();

const data=
JSON.parse(
text
);

for(
const p
of data
){

await fetch(

PRODUCT_API,

{

method:
"POST",

headers:{

"Content-Type":
"application/json"

},

body:

JSON.stringify(
p
)

}

);

}

document
.getElementById(
"uploadStatus"
)
.innerText=
"Upload thành công";

loadProducts();

}


/* ================= MODAL ================= */

function openAddModal(){

document
.getElementById(
"addModal"
)
.style.display=
"flex";

}


function closeAddModal(){

document
.getElementById(
"addModal"
)
.style.display=
"none";

}

function logout(){
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}


/* ================= EXPORT ================= */

window.logout =
logout;

window.logout =
logout;

window.openAddModal =
openAddModal;

window.closeAddModal =
closeAddModal;

window.addProduct =
addProduct;

window.deleteProduct =
deleteProduct;

window.openImport =
openImport;

window.closeImportModal =
closeImportModal;

window.confirmImport =
confirmImport;

window.triggerUploadInput =
triggerUploadInput;

window.uploadProductsFromFile =
uploadProductsFromFile;