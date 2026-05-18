document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const message = document.getElementById('message');

    if (!loginForm || !message) {
        console.error('Login form or message element not found');
        return;
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            message.style.color = 'red';
            message.textContent = 'Vui lòng nhập tài khoản và mật khẩu.';
            return;
        }

        if (username === 'admin' && password === 'admin') {
            message.style.color = 'green';
            message.textContent = 'Đăng nhập thành công! Chuyển hướng...';
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', 'admin');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 800);
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            message.style.color = 'green';
            message.textContent = 'Đăng nhập thành công! Chuyển hướng...';
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', 'user');
            localStorage.setItem('currentUser', username);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);
        } else {
            message.style.color = 'red';
            message.textContent = 'Tài khoản hoặc mật khẩu không đúng!';
        }
    });

    if (localStorage.getItem('isLoggedIn') === 'true') {
        const role = localStorage.getItem('userRole');
        if (role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'index.html';
        }
    }
});
