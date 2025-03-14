document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname;
    const selectedBrand = path.split('/').filter(Boolean).pop();
    const MEDIA_URL = '/path/to/your/media/';

    async function fetchProducts() {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data.products;
        } catch (error) {
            console.error('Failed to fetch products:', error);
            return [];
        }
    }

    function convertCurrency(amount, toCurrency) {
        const exchangeRates = {
            USD: 1,
            EGP: 50.7,
            SAR: 3.75,
            SYP: 12988.875,
            YER: 250,
            SDG: 500,
            KWD: 0.3077
        };
        const rate = exchangeRates[toCurrency];
        if (rate && !isNaN(amount)) {
            return amount * rate;
        } else {
            console.error(`Error with conversion: rate = ${rate}, amount = ${amount}`);
            return NaN;
        }
    }

    function updatePrices(products, selectedCurrency) {
        const productCards = document.querySelectorAll('.product-card .price');
        products.forEach((product, index) => {
            const priceElement = productCards[index];
            if (priceElement) {
                const convertedPrice = convertCurrency(product.price, selectedCurrency);
                if (!isNaN(convertedPrice)) {
                    priceElement.textContent = `$${convertedPrice.toFixed(2)} ${selectedCurrency}`;
                } else {
                    priceElement.textContent = `N/A`;
                }
            }
        });
    }

    const loadingSpinner = document.getElementById('loading-spinner');
    const content = document.getElementById('content');

    setTimeout(function () {
        loadingSpinner.style.display = 'none';
    }, 400);

    fetchProducts().then(products => {
        const productContainer = document.getElementById('product-container');
        const currencySelect = document.getElementById('currency-select');
        productContainer.innerHTML = '';

        products.forEach(product => {
            const productBrand = product.brand.replace('Brand: ', '').toLowerCase();
            if (!selectedBrand || productBrand === selectedBrand.toLowerCase()) {
                const productCard = `
                    <div class="product-card">
                        <a href="/index/product?id=${product.id}" class="card-link">
                            <img src="${product.image}" alt="${product.name}">
                            <h3>${product.name}</h3>
                            <p>${product.description}</p>
                            <p class="brand">${product.brand}</p>
                            <p class="price">${product.price}</p>
                        </a>
                    </div>
                `;
                productContainer.innerHTML += productCard;
            }
        });

        const savedCurrency = localStorage.getItem('selectedCurrency') || 'USD';
        currencySelect.value = savedCurrency;
        updatePrices(products, savedCurrency);

        currencySelect.addEventListener('change', function () {
            const newCurrency = currencySelect.value;
            localStorage.setItem('selectedCurrency', newCurrency);
            updatePrices(products, newCurrency);
        });
    });
});
