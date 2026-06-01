document.getElementById('registerForm').addEventListener('submit', async function(event) {
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

    const fetchUsers = async () => {
        try {
            const response = await fetch(USER_API);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Unable to fetch users from MockAPI, falling back to local storage.');
        }
        return JSON.parse(localStorage.getItem('users') || '[]');
    };

    const existingUsers = await fetchUsers();
    const normalized = value => typeof value === 'string' ? value.trim().toLowerCase() : '';
    const normalizedUsername = normalized(username);
    const normalizedEmail = normalized(email);

    if (existingUsers.some(user => normalized(user.username) === normalizedUsername || normalized(user.email) === normalizedEmail)) {
        message.textContent = 'Username or email already exists.';
        return;
    }

    const newUser = { username, email, password };

    try {
        const response = await fetch(USER_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        if (!response.ok) {
            throw new Error('Unable to register user on MockAPI');
        }

        localStorage.removeItem('users');
        message.style.color = 'green';
        message.textContent = 'Registration successful! Redirecting to login...';

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } catch (error) {
        console.warn(error);
        const fallbackUsers = JSON.parse(localStorage.getItem('users') || '[]');
        fallbackUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(fallbackUsers));
        message.style.color = 'green';
        message.textContent = 'Registration successful locally! Redirecting to login...';

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}