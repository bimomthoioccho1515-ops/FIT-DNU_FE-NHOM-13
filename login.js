document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    // Check admin login
    if (username === 'admin' && password === 'admin') {
        message.style.color = 'green';
        message.textContent = 'Đăng nhập thành công! Chuyển hướng...';
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'admin');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
        return;
    }

    // Check regular users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        message.style.color = 'green';
        message.textContent = 'Đăng nhập thành công! Chuyển hướng...';
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('currentUser', username);
        setTimeout(() => {
            window.location.href = 'index.html'; // or user dashboard
        }, 1000);
    } else {
        message.style.color = 'red';
        message.textContent = 'Tài khoản hoặc mật khẩu không đúng!';
    }
});

// Check if already logged in
window.addEventListener('load', function() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const role = localStorage.getItem('userRole');
        if (role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'index.html';
        }
    }
});