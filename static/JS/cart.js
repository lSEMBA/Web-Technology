document.addEventListener('DOMContentLoaded', function () {
    const cartContainer = document.getElementById('cart-items');
    const totalPriceContainer = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');
    const currencySelect = document.getElementById('currency-select');

    if (!cartContainer || !totalPriceContainer || !checkoutButton || !currencySelect) {
        console.error("One or more elements not found");
        return;
    }

    let cart = [];

    document.getElementById("checkout-button").addEventListener("click", function () {
        fetch('/checkout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': '{{ csrf_token }}',
            },
            body: JSON.stringify({ cart: cart }),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(data => {
                console.log("Success:", data);
                window.location.href = '/order_history/';
            })
            .catch(error => {
                console.error("Error:", error);
            });
    });

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
        if (typeof amount === 'string' && amount.includes('$')) {
            amount = parseFloat(amount.replace('$', '').trim());
        }
        const rate = exchangeRates[toCurrency];
        if (rate && !isNaN(amount)) {
            return amount * rate;
        } else {
            console.error(`Error with conversion: rate = ${rate}, amount = ${amount}`);
            return NaN;
        }
    }

    function updateCart() {
        renderCart();
    }

    function updatePrices(selectedCurrency) {
        const productPrices = document.querySelectorAll('.cart-item .item-details p span');
        cart.forEach((product, index) => {
            const priceElement = productPrices[index];
            if (priceElement) {
                const convertedPrice = convertCurrency(product.price, selectedCurrency);
                if (!isNaN(convertedPrice)) {
                    priceElement.textContent = convertedPrice.toFixed(2);
                } else {
                    priceElement.textContent = `N/A`;
                }
            }
        });
    }

    function updateCartSummary(selectedCurrency) {
        let totalPrice = 0;
        cart.forEach((product, index) => {
            let price = parseFloat(String(product.price).replace('$', ''));
            let quantity = product.quantity || 1;
            let itemTotal = price * quantity;
            totalPrice += itemTotal;

            const itemTotalElement = document.getElementById(`item-total-${index}`);
            if (itemTotalElement) {
                const convertedItemTotal = convertCurrency(itemTotal, selectedCurrency);
                itemTotalElement.innerText = !isNaN(convertedItemTotal) ? convertedItemTotal.toFixed(2) : 'N/A';
            }
        });

        const tax = totalPrice * 0.14;
        const totalNoTax = totalPrice - tax;

        const subtotalElement = document.getElementById('subtotal-price');
        const taxElement = document.getElementById('tax-price');
        const totalElement = document.getElementById('total-price');

        if (subtotalElement && taxElement && totalElement) {
            subtotalElement.innerText = convertCurrency(totalNoTax, selectedCurrency).toFixed(2);
            taxElement.innerText = convertCurrency(tax, selectedCurrency).toFixed(2);
            totalElement.innerText = convertCurrency(totalPrice, selectedCurrency).toFixed(2);
        } else {
            console.error("One or more summary elements not found");
        }
    }



    function fetchCartData() {
        return fetch('/get_cart/')
            .then(response => response.json())
            .then(data => {
                cart = data.cart;
                return cart;
            })
            .catch(error => {
                console.error("Error fetching cart data:", error);
                return [];
            });
    }

    // Function to update the cart display
    function updateCartDisplay() {
        fetchCartData().then(cart => {
            renderCart(cart);
        });
    }

    // Function to render the cart
    function renderCart(cart) {
        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            totalPriceContainer.innerHTML = "";
            checkoutButton.style.display = 'none';
            return;
        }

        cartContainer.innerHTML = `
        <h1>Shopping Cart</h1>
        ${cart.map((product, index) => `
            <div class="cart-item" data-id="${index}">
                <a href="/index/product?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                </a>
                <div class="item-details">
                    <h2><a href="/index/product?id=${product.id}">${product.name}</a></h2>
                    <p>Price: $<span>${convertCurrency(product.price, currencySelect.value).toFixed(2)}</span></p>
                    <div class="quantity">
                        <button class="quantity-btn decrease-quantity">-</button>
                        <input type="number" id="quantity${index}" value="${product.quantity || 1}">
                        <button class="quantity-btn increase-quantity">+</button>
                    </div>
                    <button class="remove-item">Remove</button>
                </div>
                <div class="item-total">
                    <p>Total: $<span id="item-total-${index}">0.00</span></p>
                </div>
            </div>
        `).join('')}
        
        <div class="cart-summary">
            <h3>Order Summary</h3>
            <p>Subtotal: $<span id="subtotal-price">0.00</span></p>
            <p>Tax (14%): $<span id="tax-price">0.00</span></p>
            <p><strong>Total: $<span id="total-price">0.00</span></strong></p>
        </div>
    `;

        updateCartSummary(currencySelect.value);
    }

    function removeFromCart(productId) {
        fetch(`/remove_from_cart/${productId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    updateCartDisplay(); // ????? ??? ????? ??? ?????
                } else {
                    console.error("Failed to remove item:", data.message);
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    function removeFromCart(productId) {
        fetch(`/remove_from_cart/${productId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // ??????? CSRF token
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    updateCartDisplay(); // ????? ????? ????? ??? ?????
                } else {
                    console.error("Failed to remove item:", data.message);
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }
    function userIsLoggedIn() {
        // ????? ?? ?????? ????? ????????? ??? ?????? ?? localStorage ??? ????? ??????
        const userToken = localStorage.getItem('userToken');
        return userToken !== null; // ??? ??? ?????? ??????? ???? ?? ???????? ???? ??????
    }

    function transferCartToServer() {
        if (userIsLoggedIn()) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length > 0) {
                cart.forEach(product => {
                    addToCart(product); // ????? ?? ???? ??? ??? ???????? ?? ????? ????????
                });
                localStorage.removeItem('cart'); // ??? ??????? ?? localStorage ??? ?????
            }
        }
    }

    // ??????? ?????? ??? ????? ??????
    transferCartToServer();

    currencySelect.addEventListener('change', (event) => {
        const selectedCurrency = event.target.value;
        localStorage.setItem('selectedCurrency', selectedCurrency);
        updatePrices(selectedCurrency);
        updateCartSummary(selectedCurrency);

    });

    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
        currencySelect.value = savedCurrency;
        updatePrices(savedCurrency);
        updateCartSummary(savedCurrency);
    }

    cartContainer.addEventListener('click', function (e) {
        const button = e.target;
        const itemElement = button.closest('.cart-item');
        const itemIndex = itemElement.getAttribute('data-id');
        const product = cart[itemIndex];

        if (button.classList.contains('remove-item')) {
            showConfirmationBox(itemIndex, product.id); // ????? productId ??? showConfirmationBox
        }

        if (button.classList.contains('increase-quantity')) {
            product.quantity = (product.quantity || 1) + 1;
            newQuantity = product.quantity;
            updateQuantity(cart[itemIndex].id, newQuantity);
            updateCartDisplay(); // ????? ??????? ??????
        }

        if (button.classList.contains('decrease-quantity')) {
            if (product.quantity > 1) {
                product.quantity -= 1;
                newQuantity = product.quantity;

                updateQuantity(cart[itemIndex].id, newQuantity);
                updateCartDisplay(); // ????? ??????? ??????
            }
        }

    });

    function showConfirmationBox(index, productId) {
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        document.body.appendChild(overlay);

        const confirmationBox = document.createElement('div');
        confirmationBox.classList.add('confirmation-box');
        confirmationBox.innerHTML = `
        <p>Are you sure you want to remove this item?</p>
        <div class="confirmation-buttons">
            <button class="confirm-btn">Yes</button>
            <button class="cancel-btn">No</button>
        </div>
    `;
        overlay.appendChild(confirmationBox);

        confirmationBox.querySelector('.confirm-btn').addEventListener('click', function () {
            removeFromCart(productId); // ??????? ???? ????? ?? productId
            document.body.removeChild(overlay);
        });

        confirmationBox.querySelector('.cancel-btn').addEventListener('click', function () {
            document.body.removeChild(overlay);
        });
    }
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrfToken = getCookie('csrftoken'); // ??????? CSRF token

function updateQuantity(productId, newQuantity) {
    fetch('/update_quantity/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken, // ??????? ??????? csrfToken
        },
        body: JSON.stringify({
            product_id: productId,
            quantity: newQuantity
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response from server:", data);
        if (data.status === 'success') {
            console.log("Quantity updated successfully");
        } else {
            console.error("Failed to update quantity:", data.message);
        }
    })
    .catch(error => console.error("Error:", error));
}

    

cartContainer.addEventListener('blur', function (e) {
    if (e.target.type === 'number') {
        const itemElement = e.target.closest('.cart-item');
        const itemIndex = itemElement.getAttribute('data-id');
        let newQuantity = e.target.value;

        if (newQuantity === '' || isNaN(newQuantity) || parseInt(newQuantity) <= 0) {
            e.target.value = cart[itemIndex].quantity;
        } else {
            cart[itemIndex].quantity = parseInt(newQuantity, 10);
            updateQuantity(cart[itemIndex].id, newQuantity); // ????? ?????? ?? ????? ????????
            updateCart();

        }

    }
    updateCartDisplay(); // ????? ??????? ??????

}, true);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const input = document.querySelector('input[type="number"]:focus');
        if (input) {
            const itemElement = input.closest('.cart-item');
            const itemIndex = itemElement.getAttribute('data-id');
            let newQuantity = input.value;
            updateCartDisplay(); // ????? ??????? ??????

            if (newQuantity === '' || isNaN(newQuantity) || parseInt(newQuantity) <= 0) {
                input.value = cart[itemIndex].quantity;
            } else {
                cart[itemIndex].quantity = parseInt(newQuantity, 10);
                updateQuantity(cart[itemIndex].id, newQuantity); // ????? ?????? ?? ????? ????????
                updateCart();

            }
        }
    }
});

    window.addEventListener('load', function () {
            console.log("DOMContentLoaded fired"); // ???? ??? ??? ??? ??? ????? ?????? ???? ????

        renderCart();
    });
    updateCartDisplay();

});
