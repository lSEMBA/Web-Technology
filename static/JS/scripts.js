document.addEventListener('DOMContentLoaded', function () {
    const resultsBox = document.querySelector(".result-box");
    const inputBox = document.getElementById("input-box");
    const searchInput = document.getElementById("search-input");

    let currentIndex = -1;

    let availableKeywords = [
        'High-End Laptop',
        'Dell',
        'Samsung S24 Ultra',
        'Samsung',
        'Wireless Headphones',
        'Sony',
        'Smartwatch',
        'Apple',
        'Bluetooth Speaker',
        'JBL',
        'Gaming Monitor',
        'ASUS',
        'Mechanical Keyboard',
        'Logitech',
        'Wireless Mouse',
        'HP',
        '4K Smart TV',
        'LG',
        'Drone with Camera',
        'DJI',
        'Gaming Headset',
        'Razer',
        'Action Camera',
        'GoPro',
        'External Hard Drive',
        'Seagate',
        'Smart Home Hub',
        'Google',
        'VR Headset',
        'Oculus',
        'Robot Vacuum',
        'iRobot',
        'Portable Projector',
        'Anker',
        'Smart Thermostat',
        'Nest',
        'Noise-Canceling Earbuds',
        'Bose',
        'Electric Scooter',
        'Segway',
        'Portable Power Bank',
        'Anker',
        'Streaming Webcam',
        'Logitech',
        'Smart Light Bulbs',
        'Philips Hue',
        'PlayStation 5'
    ];

    inputBox.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            search(inputBox.value);
        }
    });

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            search(searchInput.value);
        }
    });
    document.querySelector('.search-container button').addEventListener("click", function () {
        search(inputBox.value);
    });

    inputBox.onkeyup = function (e) {
        let input = inputBox.value;
        if (input.length) {
            let result = availableKeywords.filter((keyword) => {
                return keyword.toLowerCase().split(" ").some(word => word.startsWith(input.toLowerCase()));
            }).slice(0, 10);

            if (result.length) {
                display(result);
            } else {
                resultsBox.style.display = "none";
            }

            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                navigateResults(e.key === "ArrowDown" ? 1 : -1);
            } else if (e.key === "Enter" && currentIndex >= 0) {
                e.preventDefault();
                selectInput(document.querySelectorAll(".result-box li")[currentIndex]);
            }
        } else {
            resultsBox.style.display = "none";
        }
    };

    inputBox.onclick = function () {
        let input = inputBox.value;
        if (input.length) {
            let result = availableKeywords.filter((keyword) => {
                return keyword.toLowerCase().split(" ").some(word => word.startsWith(input.toLowerCase()));
            }).slice(0, 10);
            display(result);
        } else {
            resultsBox.style.display = "none";
        }
    };

    function display(result) {
        if (result.length) {
            currentIndex = -1;
            const content = result.map((list, index) => {
                return `<li onclick="selectInput(this)" data-index="${index}">${list}</li>`;
            });
            resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";
            resultsBox.style.display = "block";
        }
    }

    window.selectInput = function (list) {
        inputBox.value = list.innerHTML;
        resultsBox.style.display = "none";
        currentIndex = -1;
        search(list.innerHTML);
    };

    function search(query) {
        if (query) {
            window.location.href = `${window.location.origin}/index/search?query=${encodeURIComponent(query)}`;
        }
    }

    function navigateResults(direction) {
        const items = document.querySelectorAll(".result-box li");
        if (!items.length) return;

        currentIndex += direction;
        if (currentIndex < 0) currentIndex = items.length - 1;
        if (currentIndex >= items.length) currentIndex = 0;

        items.forEach(item => item.classList.remove("highlight"));
        items[currentIndex].classList.add("highlight");
        inputBox.value = items[currentIndex].innerHTML;
    }

    document.addEventListener("click", function (event) {
        if (!inputBox.contains(event.target) && !resultsBox.contains(event.target)) {
            resultsBox.style.display = "none";
        }
    });

    const loginModal = document.querySelector(".login-modal");
    if (loginModal) {
        document.querySelector('.fa-user').addEventListener('click', function () {
            loginModal.style.display = 'block';
        });

        window.addEventListener('click', function (event) {
            if (event.target == loginModal) {
                loginModal.style.display = 'none';
            }
        });
    }
});
function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
}

function initTheme() {
    const savedTheme = localStorage.getItem("theme");

    const theme = savedTheme || (prefersDark ? "light" : "dark");

    document.getElementById("theme-toggle").checked = (theme === "light");

    setTheme(theme);

}

document.getElementById("theme-toggle").addEventListener("change", () => {
    const newTheme = document.getElementById("theme-toggle").checked ? "light" : "dark";
    setTheme(newTheme);
});



initTheme();

function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
}

function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    const theme = savedTheme || (prefersDark ? "light" : "dark");
    document.getElementById("theme-toggle").checked = (theme === "light");

    setTheme(theme);



    const themeLink = document.getElementById("theme-toggle-link");
    themeLink.textContent = theme === "dark" ? "Light Theme" : "Dark Theme";
}

document.getElementById("theme-toggle").addEventListener("change", () => {
    const newTheme = document.getElementById("theme-toggle").checked ? "light" : "dark";
    setTheme(newTheme);

    const themeLink = document.getElementById("theme-toggle-link");
    themeLink.textContent = newTheme === "dark" ? "Light Theme" : "Dark Theme";
});

document.getElementById("theme-toggle-link").addEventListener("click", (event) => {
    event.preventDefault();

    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    const themeLink = document.getElementById("theme-toggle-link");
    themeLink.textContent = newTheme === "dark" ? "Light Theme" : "Dark Theme";

    const themeCheckbox = document.getElementById("theme-toggle");
    themeCheckbox.checked = (newTheme === "light");
});

initTheme();


document.addEventListener("DOMContentLoaded", function () {
    const productLink = document.getElementById("product-link");
    const dropdown = document.querySelector(".dropdown");

    productLink.addEventListener("click", function () {
        dropdown.style.display = dropdown.style.display === "none" || dropdown.style.display === "" ? "block" : "none";
    });

    document.addEventListener("click", function (e) {
        if (!productLink.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = "none";
        }
    });
});


const productItem = document.getElementById("product-item");
const productLink = document.getElementById("product-link");
const dropdown = productItem.querySelector(".dropdown");

let isDropdownVisible = false;





productLink.addEventListener("click", (event) => {
    event.preventDefault();
    isDropdownVisible = !isDropdownVisible;
    dropdown.style.display = isDropdownVisible ? "block" : "none";
});

function selectCategory(radio) {
    const selectedValue = radio.nextElementSibling.textContent;
    productLink.textContent = selectedValue;
    localStorage.setItem("selectedCategory", selectedValue);
    dropdown.style.display = "none";
    isDropdownVisible = false;
}

document.addEventListener("click", (event) => {
    if (!productItem.contains(event.target)) {
        dropdown.style.display = "none";
        isDropdownVisible = false;
    }
});

document.addEventListener("DOMContentLoaded", () => {

    const isHomePage = window.location.pathname === "/" ||
        (window.location.pathname.includes("index") &&
        !window.location.pathname.includes("brand") &&
        !window.location.pathname.includes("search"));

    if (isHomePage) {
        localStorage.setItem("selectedCategory", "All");
    }

    const savedCategory = isHomePage ? "All" : localStorage.getItem("selectedCategory") || "All";
    productLink.textContent = savedCategory;

    if (savedCategory === "All") {
        const allRadio = dropdown.querySelector('.label .text').textContent === "All";
        if (allRadio) {
            dropdown.querySelector('input').checked = true;
        }
    } else {
        const selectedRadio = Array.from(dropdown.querySelectorAll('.label'))
            .find(label => label.querySelector('.text').textContent === savedCategory);

        if (selectedRadio) {
            selectedRadio.querySelector('input').checked = true;
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const profileIcon = document.getElementById("profile-icon");
    const dropdownMenu = document.getElementById("dropdown-menu");

    profileIcon.addEventListener("click", function (event) {
        event.preventDefault();
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });

    // Close the dropdown if clicked outside
    document.addEventListener("click", function (event) {
        if (!profileIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = "none";
        }
    });
});
