
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
    if (rate && !isNaN(amount)) {
        return amount * rate;
    } else {
        console.error(`Error with conversion: rate = ${rate}, amount = ${amount}`);
        return NaN;
    }
}

function updatePrices(product) {
    const selectedCurrency = localStorage.getItem('selectedCurrency') || 'USD';
    const convertedPrice = convertCurrency(product.price, selectedCurrency);
    if (!isNaN(convertedPrice)) {
        document.querySelector('.price').textContent = `${convertedPrice.toFixed(2)} ${selectedCurrency}`;
    } else {
        console.error('Error converting price:', product.price, selectedCurrency);
    }
}

function fetchProducts() {
    return fetch('/api/products/')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched products:', data.products); // Debug fetched products
            return data.products;
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            return [];
        });
}

function displayProduct(product) {
    const productDetails = document.getElementById('product-details');

    if (!product) {
        productDetails.innerHTML = `
            <div class="error-message">
                <h2>Product not found</h2>
                <p>Sorry, the product you are looking for is not available.</p>
                <a href="/index" class="back-to-products">Back to Products</a>
            </div>
        `;
        return;
    }

    productDetails.innerHTML = `
        <div class="product-container">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" id="main-image">
                ${product.model3D ? `<model-viewer src="${product.model3D}" alt="3D Model" id="3d-model" style="display: none;" auto-rotate camera-controls></model-viewer><button id="toggle-view" style="border-radius: 5px; margin-top: 10px;">View in 3D</button>` : ''}
                <div class="fixed-zoom-result" id="fixed-zoom-result"></div>
            </div>
            <div class="product-info">
                <h1>${product.name}</h1>
                <p class="price">$${product.price} USD</p>
                <p>${product.description}</p>
                <h3>Features:</h3>
                <ul>
                    ${product.features && product.features.length > 0 ? product.features.map(feature => `<li>${feature}</li>`).join('') : '<li>No features available</li>'}
                </ul>
                <button class="add-to-cart">Add to Cart</button>
                <a href="/index" class="back-to-products">Back to Products</a>
            </div>
        </div>
    `;

    if (product.model3D) {
        document.getElementById('toggle-view').addEventListener('click', function () {
            const mainImage = document.getElementById('main-image');
            const modelViewer = document.getElementById('3d-model');
            if (modelViewer.style.display === 'none') {
                modelViewer.style.display = 'block';
                mainImage.style.display = 'none';
                this.textContent = 'View Image';
            } else {
                modelViewer.style.display = 'none';
                mainImage.style.display = 'block';
                this.textContent = 'View in 3D';
            }
        });
    }

    const mainImage = document.getElementById('main-image');
    const fixedZoomResult = document.getElementById('fixed-zoom-result');

    mainImage.addEventListener('mousemove', zoom);
    mainImage.addEventListener('mouseleave', function () {
        fixedZoomResult.style.display = 'none';
    });

    function zoom(event) {
        const bounds = mainImage.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        const width = mainImage.offsetWidth;
        const height = mainImage.offsetHeight;

        const xRatio = x / width;
        const yRatio = y / height;

        const zoomFactor = 1.55;
        const backgroundSizeWidth = mainImage.naturalWidth * zoomFactor;
        const backgroundSizeHeight = mainImage.naturalHeight * zoomFactor;

        fixedZoomResult.style.display = 'block';
        fixedZoomResult.style.backgroundImage = `url(${mainImage.src})`;
        fixedZoomResult.style.backgroundSize = `${backgroundSizeWidth}px ${backgroundSizeHeight}px`;
        fixedZoomResult.style.width = '550px';
        fixedZoomResult.style.height = '600px';
        fixedZoomResult.style.position = 'absolute';
        fixedZoomResult.style.right = '20px';
        fixedZoomResult.style.top = '80px';
        fixedZoomResult.style.border = '1px solid #ccc';
        fixedZoomResult.style.borderRadius = '5px';
        fixedZoomResult.style.backgroundColor = 'var(--product-bg-color)';
        fixedZoomResult.style.zIndex = '1000';

        let fixedBackgroundPosX = -(xRatio * backgroundSizeWidth - fixedZoomResult.offsetWidth / 2);
        let fixedBackgroundPosY = -(yRatio * backgroundSizeHeight - fixedZoomResult.offsetHeight / 2);

        fixedBackgroundPosX = Math.max(Math.min(fixedBackgroundPosX, 0), fixedZoomResult.offsetWidth - backgroundSizeWidth);
        fixedBackgroundPosY = Math.max(Math.min(fixedBackgroundPosY, 0), fixedZoomResult.offsetHeight - backgroundSizeHeight);

        fixedZoomResult.style.backgroundPosition = `${fixedBackgroundPosX}px ${fixedBackgroundPosY}px`;
    }

    updatePrices(product);

    const addToCartBtn = document.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', function () {
        addToCart(product);
    });
}

const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));
console.log('Product ID from URL:', productId);

window.onload = function () {
    fetchProducts().then(products => {
        const product = products.find(p => p.id === productId);
        if (product) {
            displayProduct(product);
        } else {
            const productDetails = document.getElementById('product-details');
            productDetails.innerHTML = `
                <div class="error-message">
                    <h2>Product not found</h2>
                    <p>Sorry, the product you are looking for is not available.</p>
                    <a href="/index" class="back-to-products">Back to Products</a>
                </div>
            `;
        }

        const currencySelect = document.getElementById('currency-select');
        currencySelect.addEventListener('change', (event) => {
            const selectedCurrency = event.target.value;
            localStorage.setItem('selectedCurrency', selectedCurrency);
            updatePrices(product);
        });

        const savedCurrency = localStorage.getItem('selectedCurrency');
        if (savedCurrency) {
            currencySelect.value = savedCurrency;
            updatePrices(product);
        }
    });
};

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

const csrftoken = getCookie('csrftoken');


function cleanPrice(price) {
    if (typeof price === 'string') {
        return parseFloat(price.replace(/[^0-9.]/g, ''));
    }
    return price;
}

function addToCart(product) {
    console.log("Adding to cart:", product);

    // ????? ????? ??? ???????
    product.price = cleanPrice(product.price);

    fetch('/add_to_cart/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({ product: product }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // ???? ?? ????????
            if (data.status === 'success') {
                showNotification(`${product.name} has been added to your cart!`);
            } else {
                console.error("Error:", data.message);
                alert("Failed to add product to cart: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to add product to cart. Please try again.");
        });
}



function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerText = message;

    const progress = document.createElement('div');
    progress.classList.add('progress');
    notification.appendChild(progress);

    let width = 0;
    let interval;

    const startProgress = () => {
        clearInterval(interval);
        width = 0;
        progress.style.width = '100%';
        interval = setInterval(() => {
            if (width >= 100) {
                setTimeout(() => {
                    notification.style.animation = 'fadeOut 0.5s ease';
                    setTimeout(() => notification.remove(), 500);
                }, 500);
                clearInterval(interval);
            } else {
                width++;
                progress.style.width = (100 - width) + '%';
            }
        }, 50);
    };

    notification.addEventListener('mouseenter', () => {
        clearInterval(interval);
        width = 0;
        progress.style.width = '100%';
        notification.style.cursor = 'pointer';
    });

    notification.addEventListener('mouseleave', startProgress);

    notification.addEventListener('click', () => {
        window.location.href = 'cart';
    });

    document.body.appendChild(notification);

    startProgress();
}
