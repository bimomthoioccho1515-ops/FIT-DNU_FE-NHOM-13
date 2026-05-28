// Admin Dashboard JavaScript

// Sample data for charts and tables
const monthlyRevenue = [12000, 15000, 18000, 22000, 25000, 28000, 30000, 32000, 35000, 38000, 40000, 42000];
const yearlyRevenue = [150000, 180000, 220000, 280000, 350000, 420000];

const inventoryData = [
    { name: 'Sản phẩm A', stock: 150, status: 'in-stock' },
    { name: 'Sản phẩm B', stock: 45, status: 'low-stock' },
    { name: 'Sản phẩm C', stock: 0, status: 'out-of-stock' },
    { name: 'Sản phẩm D', stock: 200, status: 'in-stock' },
    { name: 'Sản phẩm E', stock: 80, status: 'in-stock' }
];

const suppliersData = [
    { name: 'Nhà cung cấp 1', products: 25, lastDelivery: '2024-01-15' },
    { name: 'Nhà cung cấp 2', products: 18, lastDelivery: '2024-01-10' },
    { name: 'Nhà cung cấp 3', products: 32, lastDelivery: '2024-01-08' },
    { name: 'Nhà cung cấp 4', products: 15, lastDelivery: '2024-01-05' }
];

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeStats();
    initializeCharts();
    initializeTables();
});

function initializeStats() {
    // Calculate current stats
    const currentMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1];
    const previousMonthRevenue = monthlyRevenue[monthlyRevenue.length - 2];
    const monthChange = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1);

    const currentYearRevenue = yearlyRevenue[yearlyRevenue.length - 1];
    const previousYearRevenue = yearlyRevenue[yearlyRevenue.length - 2];
    const yearChange = ((currentYearRevenue - previousYearRevenue) / previousYearRevenue * 100).toFixed(1);

    const totalInventory = inventoryData.reduce((sum, item) => sum + item.stock, 0);
    const lowStockItems = inventoryData.filter(item => item.stock < 50 && item.stock > 0).length;

    // Update stats cards
    document.getElementById('monthly-revenue').textContent = formatCurrency(currentMonthRevenue);
    document.getElementById('monthly-change').textContent = `${monthChange}% so với tháng trước`;
    document.getElementById('monthly-change').classList.add(monthChange > 0 ? 'positive' : 'negative');

    document.getElementById('yearly-revenue').textContent = formatCurrency(currentYearRevenue);
    document.getElementById('yearly-change').textContent = `${yearChange}% so với năm trước`;
    document.getElementById('yearly-change').classList.add(yearChange > 0 ? 'positive' : 'negative');

    document.getElementById('total-inventory').textContent = totalInventory;
    document.getElementById('low-stock-alert').textContent = `${lowStockItems} sản phẩm sắp hết`;

    document.getElementById('total-suppliers').textContent = suppliersData.length;
}

function initializeCharts() {
    // Monthly Revenue Chart
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    new Chart(monthlyCtx, {
        type: 'line',
        data: {
            labels: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
            datasets: [{
                label: 'Doanh thu tháng (VNĐ)',
                data: monthlyRevenue,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });

    // Yearly Revenue Chart
    const yearlyCtx = document.getElementById('yearlyChart').getContext('2d');
    new Chart(yearlyCtx, {
        type: 'bar',
        data: {
            labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'Doanh thu năm (VNĐ)',
                data: yearlyRevenue,
                backgroundColor: '#764ba2',
                borderColor: '#764ba2',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function initializeTables() {
    // Inventory Table
    const inventoryTable = document.getElementById('inventoryTable');
    inventoryData.forEach(item => {
        const row = inventoryTable.insertRow();
        row.insertCell(0).textContent = item.name;
        row.insertCell(1).textContent = item.stock;

        const statusCell = row.insertCell(2);
        const statusBadge = document.createElement('span');
        statusBadge.className = `status-badge status-${item.status}`;
        statusBadge.textContent = getStatusText(item.status);
        statusCell.appendChild(statusBadge);
    });

    // Suppliers Table
    const suppliersTable = document.getElementById('suppliersTable');
    suppliersData.forEach(supplier => {
        const row = suppliersTable.insertRow();
        row.insertCell(0).textContent = supplier.name;
        row.insertCell(1).textContent = supplier.products;
        row.insertCell(2).textContent = supplier.lastDelivery;
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function getStatusText(status) {
    switch(status) {
        case 'in-stock': return 'Còn hàng';
        case 'low-stock': return 'Sắp hết';
        case 'out-of-stock': return 'Hết hàng';
        default: return 'Không xác định';
    }
}