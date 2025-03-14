const signInBtnLink = document.querySelector('.signInBtn-link');
const signUpBtnLink = document.querySelector('.signUpBtn-link');
const wrapper = document.querySelector('.wrapper');



signUpBtnLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});

signInBtnLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

function validatePhoneNumber(input) {
    let value = input.value;

    if (value.startsWith('+')) {
        if (value.length > 12) {
            input.value = value.slice(0, 12);
        }
        input.value = input.value.replace(/[^0-9+]/g, '');
        let plusIndex = value.indexOf('+', 1);
        if (plusIndex !== -1) {
            input.value = value.slice(0, plusIndex) + value.slice(plusIndex + 1);
        }
    } else {
        input.value = value.replace(/[^0-9]/g, '');
        if (input.value.length > 11) {
            input.value = input.value.slice(0, 11);
        }
    }
}


document.getElementById('sign-up-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;

    if (!username || !email || !phone || !password) {
        alert('Please fill in all fields.');
        return;
    }

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, phone, password }),
    })
        .then(response => {
            console.log('Response Status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Response Data:', data);
            if (data.success) {
                alert('Registration successful! Please log in.');
                document.querySelector('.wrapper').classList.remove('active');
            } else {
                alert(data.message || 'Registration failed!');
            }
        })
        .catch(error => {
            console.error('Error during registration:', error);
            alert('An error occurred. Please try again.');
        });
});



document.getElementById('sign-in-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        showNotification('يرجى إدخال اسم المستخدم وكلمة المرور.', false);
        return;
    }

    fetch('/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(data.message, true);
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 2000);
            } else {
                showNotification(data.message, false);
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            showNotification('حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.', false);
        });
});





document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                showNotification(data.message, true);
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 2000);
            } else {
                showNotification(data.message, false);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            showNotification('An error occurred. Please try again.', false);
        });
});



function showNotification(message, success = true) {
    const notification = document.createElement('div');
    notification.className = `notification ${success ? 'success' : 'error'}`;
    notification.textContent = message;

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    notification.appendChild(progressBar);

    document.body.appendChild(notification);

    let width = 100;
    const interval = setInterval(() => {
        width -= 2;
        progressBar.style.width = `${width}%`;
        if (width <= 0) {
            clearInterval(interval);
            notification.remove();
        }
    }, 75);
}

document.getElementById('checkout-button').addEventListener('click', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        showNotification('You must be logged in to proceed to checkout.', false);
        return;
    }

    window.location.href = 'checkout.html';
});

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. Please log in.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token.' });
        }
        req.user = user;
        next();
    });
}

document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('You have been logged out.');
    window.location.href = 'index.html';
});

fetch('http://localhost:3000/api/user-data', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('welcome').innerText = `Welcome, ${data.username}`;
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        alert('Please log in again.');
        window.location.href = 'index.html';
    });
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);

    if (!user) {
        return res.status(401).json({ success: false, message: 'User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Incorrect password.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
});

function readUsersFile() {
    const filePath = path.join(__dirname, 'users.json');
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users.json:', error);
        return [];
    }
}