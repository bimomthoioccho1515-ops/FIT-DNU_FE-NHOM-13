const PRODUCT_API =
"https://6a1a846abc2f94475492525f.mockapi.io/products";

const ORDER_API =
"https://6a1a846abc2f94475492525f.mockapi.io/order";

let products = [];
let selectedProductId = null;

/* ================= LOAD ================= */

async function loadProducts(){

const res = await fetch(PRODUCT_API);
products = await res.json();

renderTable();
updateDashboard();
renderCharts();

}

/* ================= DASHBOARD ================= */

function updateDashboard(){

let totalInventory = 0;
let totalSold = 0;
let lowStock = 0;
let revenue = 0;

products.forEach(p=>{

totalInventory += Number(p.stock || 0);
totalSold += Number(p.sold || 0);

if(p.stock <= 5) lowStock++;

revenue += (p.sold || 0) * Number(p.price);

});

document.getElementById("totalInventory").innerText = totalInventory;
document.getElementById("totalSold").innerText = totalSold;
document.getElementById("lowStock").innerText = lowStock;
document.getElementById("totalRevenue").innerText =
revenue.toLocaleString("vi-VN") + "₫";

}

/* ================= TABLE ================= */

function renderTable(){

const tbody = document.getElementById("inventoryBody");

tbody.innerHTML = products.map(p=>`

<tr>

<td><img src="${p.image}" width="50"></td>

<td>${p.name}</td>

<td>${p.category}</td>

<td>${Number(p.price).toLocaleString("vi-VN")}₫</td>

<td>${p.stock}</td>

<td>${p.sold || 0}</td>

<td>${p.imported || 0}</td>

<td>
${p.stock > 10 ? "🟢 In stock" :
p.stock > 0 ? "🟡 Low stock" : "🔴 Out"}
</td>

<td>

<button onclick="openImport('${p.id}')">Import</button>
<button onclick="deleteProduct('${p.id}')">Delete</button>

</td>

</tr>

`).join("");

}

/* ================= ADD PRODUCT ================= */

async function addProduct(){

const data = {
name: document.getElementById("name").value,
price: Number(document.getElementById("price").value),
stock: Number(document.getElementById("stock").value),
category: document.getElementById("category").value,
color: document.getElementById("color").value,
image: document.getElementById("image").value,
sold: 0,
imported: Number(document.getElementById("stock").value)
};

await fetch(PRODUCT_API,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
});

closeAddModal();
loadProducts();

}

/* ================= DELETE ================= */

async function deleteProduct(id){

if(!confirm("Delete product?")) return;

await fetch(`${PRODUCT_API}/${id}`,{
method:"DELETE"
});

loadProducts();

}

/* ================= IMPORT STOCK ================= */

function openImport(id){
selectedProductId = id;
document.getElementById("importModal").style.display="flex";
}

function closeImportModal(){
document.getElementById("importModal").style.display="none";
}

async function confirmImport(){

const qty =
Number(document.getElementById("importQuantity").value);

const product =
products.find(p=>p.id==selectedProductId);

product.stock += qty;
product.imported = (product.imported || 0) + qty;

await fetch(`${PRODUCT_API}/${selectedProductId}`,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
stock:product.stock,
imported:product.imported
})
});

closeImportModal();
loadProducts();

}

/* ================= MODAL ================= */

function openAddModal(){
document.getElementById("addModal").style.display="flex";
}

function closeAddModal(){
document.getElementById("addModal").style.display="none";
}

/* ================= CHARTS ================= */

let revenueChart, inventoryChart;

function renderCharts(){

const ctx1 = document.getElementById("revenueChart");
const ctx2 = document.getElementById("inventoryChart");

if(revenueChart) revenueChart.destroy();
if(inventoryChart) inventoryChart.destroy();

/* REVENUE */
revenueChart = new Chart(ctx1,{
type:"bar",
data:{
labels: products.map(p=>p.name),
datasets:[{
label:"Revenue",
data:products.map(p=>(p.sold||0)*p.price)
}]
}
});

/* INVENTORY */
inventoryChart = new Chart(ctx2,{
type:"pie",
data:{
labels:products.map(p=>p.name),
datasets:[{
data:products.map(p=>p.stock)
}]
}
});

}

/* ================= LOGOUT ================= */

function logout(){
localStorage.removeItem("isLoggedIn");
window.location.href="login.html";
}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded",()=>{
loadProducts();
});