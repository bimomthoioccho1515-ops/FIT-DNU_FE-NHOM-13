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
        message.textContent = 'Username must be at least 3 characters.';
        return;
    }

    if (!isValidEmail(email)) {
        message.textContent = 'Please enter a valid email.';
        return;
    }

    if (password.length < 6) {
        message.textContent = 'Password must be at least 6 characters.';
        return;
    }

    if (password !== confirmPassword) {
        message.textContent = 'Passwords do not match.';
        return;
    }

    // Check if username already exists (simple check, in real app use database)
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.some(user => user.username === username)) {
        message.textContent = 'Username already exists.';
        return;
    }

    // Save user (in real app, send to server)
    const newUser = { username, email, password };
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    // Success
    message.style.color = 'green';
    message.textContent = 'Registration successful! Redirecting to login...';

    // Redirect to login after 2 seconds
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}