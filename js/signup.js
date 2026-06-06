document.getElementById('signup-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.some(user => user.username === username)) {
        alert('Username is already taken. Please choose another one.');
        return;
    }

    users.push({
        fullname,
        email,
        username,
        password
    });

    localStorage.setItem('users', JSON.stringify(users));

    alert('Sign-up successful! You can now log in.');
    window.location.href = 'login.html';
});