document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const message = document.getElementById('message');

    if (!loginForm || !message) {
        console.error('Login form or message element not found');
        return;
    }

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            message.style.color = 'red';
            message.textContent = 'Please enter your username and password.';
            return;
        }

        if (username === 'admin' && password === 'admin') {
            message.style.color = 'green';
            message.textContent = 'Login successful! Redirecting...';
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', 'admin');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 800);
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

        const users = await fetchUsers();
        const normalize = value => typeof value === 'string' ? value.trim().toLowerCase() : '';
        const loginKey = normalize(username);

        const user = users.find(u => {
            const storedUsername = normalize(u.username);
            const storedEmail = normalize(u.email);
            return (storedUsername === loginKey || storedEmail === loginKey) && u.password === password;
        });

        if (user) {
            message.style.color = 'green';
            message.textContent = 'Login successful! Redirecting...';
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', 'user');
            localStorage.setItem('currentUser', user.username);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);
        } else {
            message.style.color = 'red';
            message.textContent = 'Invalid username, email or password!';
        }
    });

    if (localStorage.getItem('isLoggedIn') === 'true') {
        const role = localStorage.getItem('userRole');
        if (role === 'admin') {
            window.location.href = './admin.html';
        } else {
            window.location.href = './index.html';
        }
    }
});
