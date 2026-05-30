document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const message = document.getElementById('message');

    // Reset message
    message.textContent = '';
    message.style.color = 'red';

    // Validation
    if (username.length < 3) {
        message.textContent = 'Tài khoản phải có ít nhất 3 ký tự!';
        return;
    }

    if (!isValidEmail(email)) {
        message.textContent = 'Email không hợp lệ!';
        return;
    }

    if (password.length < 6) {
        message.textContent = 'Mật khẩu phải có ít nhất 6 ký tự!';
        return;
    }

    if (password !== confirmPassword) {
        message.textContent = 'Mật khẩu xác nhận không khớp!';
        return;
    }

    // Check if username already exists (simple check, in real app use database)
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.some(user => user.username === username)) {
        message.textContent = 'Tài khoản đã tồn tại!';
        return;
    }

    // Save user (in real app, send to server)
    const newUser = { username, email, password };
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    // Success
    message.style.color = 'green';
    message.textContent = 'Đăng ký thành công! Chuyển hướng đến đăng nhập...';

    // Redirect to login after 2 seconds
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}