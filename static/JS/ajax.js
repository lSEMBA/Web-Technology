$(document).ready(function () {
    const cache = {};
    const $contentDiv = $('#content');
    const $staticContent = $('#static-content');

    $('a[data-href]').on('click', function (e) {
        e.preventDefault();

        const page = $(this).data('href');
        console.log(`Clicked link with data-href: ${page}`);

        if (!page) {
            console.error('No page specified for this link.');
            return;
        }

        if (cache[page]) {
            console.log(`Loading cached content for: ${page}`);
            $contentDiv.html(cache[page]).show();
            $staticContent.hide();
        } else {
            console.log(`Fetching content for: ${page}`);
            $.get(page)
                .done(function (html) {
                    console.log(`Content loaded for: ${page}`);
                    cache[page] = html;
                    $contentDiv.html(html).show();
                    $staticContent.hide();
                })
                .fail(function (error) {
                    console.error(`Failed to load content for: ${page}`, error);
                    $contentDiv.html('<p>Error loading page. Please try again later.</p>').show();
                    $staticContent.hide();
                });
        }
    });
});
$.ajax({
    url: "your-url-here?timestamp=" + new Date().getTime(),
    method: "GET",
    success: function (data) {
        console.log("AJAX Success: ", data);
    },
    error: function (xhr, status, error) {
        console.error("AJAX Error: ", error);
    }
});


$.ajax({
    url: "{% url 'login' %}",
    method: "POST",
    data: {
        username: $("#username").val(),
        password: $("#password").val()
    },
    headers: {
        "X-CSRFToken": getCookie('csrftoken')
    },
    success: function (response) {
        console.log("Login successful");
    },
    error: function (xhr) {
        console.log("Login failed", xhr.responseJSON.error);
    }
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

document.addEventListener("DOMContentLoaded", function () {
    const currencySelect = document.getElementById("currency-select");
    const searchBox = document.getElementById("input-box");
    const productContainer = document.getElementById("product-container");

    const exchangeRates = {
        USD: 1,
        EGP: 50,
        SAR: 3.75,
        SYP: 12988,
        YER: 250,
        SDG: 500,
        KWD: 0.3077
    };

    function convertCurrency(amount, toCurrency) {
        const rate = exchangeRates[toCurrency];
        if (rate) {
            return "$" + (amount * rate).toFixed(2) + " " + toCurrency;
        }
        return amount;
    }

    function fetchProducts() {
        fetch('/get-products/')
            .then(response => response.json())
            .then(data => {
                const products = data.products;
                displayProducts(products);
            })
            .catch(error => console.error("Error fetching products:", error));
    }

    function displayProducts(products) {
        productContainer.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <a href="/index/product?id=${product.id}" class="card-link">
                    <div class="content-wrapper">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p class="brand">Brand: ${product.brand}</p>
                        <p class="price">${product.price}</p>
                    </div>
                </a>
                <button class="add-to-carts">Add to Cart</button>
            `;
            productContainer.appendChild(productCard);

            const addToCartButton = productCard.querySelector('.add-to-carts');
            addToCartButton.addEventListener('click', function () {
                addToCart(product);
            });
        });
    }

    function addToCart(product) {
        console.log(`Adding product to cart: ${product.name}`);
    }

    fetchProducts();
});