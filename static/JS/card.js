(function () {

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
        console.log(`Converting ${amount} USD to ${toCurrency} with rate ${rate}`);
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
            const convertedPrice = convertCurrency(product.price, selectedCurrency);
            console.log(`Converted price for ${product.name}: ${convertedPrice}`);
            if (!isNaN(convertedPrice)) {
                priceElement.textContent = `$${convertedPrice.toFixed(2)} ${selectedCurrency}`;
            } else {
                priceElement.textContent = `N/A`;
            }
        });
    }

    function fetchProducts() {
        fetch('/api/products/')
            .then(response => response.json())
            .then(data => {
                const products = data.products;
                const productContainer = document.getElementById("product-container");
                productContainer.innerHTML = ''; // Clear existing products
                products.forEach(product => {
                    const productCard = document.createElement("div");
                    productCard.classList.add("product-card");
                    productCard.innerHTML = `
                        <a href= "/index/product?id=${product.id}" class="card-link">
                            <img src="${product.image}" alt="${product.name}">
                            <h3>${product.name}</h3>
                            <p>${product.description}</p>
                            <p class="brand">${product.brand}</p>
                            <p class="price">$${parseFloat(product.price).toFixed(2)} USD</p>
                        </a>
                    `;
                    productContainer.appendChild(productCard);
                });

                const currencySelect = document.getElementById('currency-select');
                currencySelect.addEventListener('change', (event) => {
                    const selectedCurrency = event.target.value;
                    localStorage.setItem('selectedCurrency', selectedCurrency);
                    updatePrices(products, selectedCurrency);
                });

                const savedCurrency = localStorage.getItem('selectedCurrency');
                if (savedCurrency) {
                    currencySelect.value = savedCurrency;
                    updatePrices(products, savedCurrency);
                }
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }

    fetchProducts();
})();

