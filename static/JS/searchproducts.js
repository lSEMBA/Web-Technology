document.addEventListener("DOMContentLoaded", function () {

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("query");
    const searchBox = document.getElementById("input-box");
    const searchInput = document.getElementById("search-input");
    const currencySelect = document.getElementById("currency-select");

    document.getElementById('price-filter').style.display = 'none';

    const storedCurrency = localStorage.getItem('selectedCurrency');
    if (storedCurrency) {
        currencySelect.value = storedCurrency;
    }

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
            return '$' + (amount * rate).toFixed(2) + ' ' + toCurrency;
        } else {
            console.error(`Error with conversion: rate = ${rate}, amount = ${amount}`);
            return NaN;
        }
    }

    currencySelect.addEventListener("change", function () {
        const selectedCurrency = currencySelect.value;
        localStorage.setItem('selectedCurrency', selectedCurrency);
        filterProducts(searchBox.value || searchInput.value || '');
    });

    async function fetchProducts() {
        const response = await fetch('/api/products/');
        const data = await response.json();
        return data.products;
    }

    async function filterProducts(query) {
        const currency = currencySelect.value;
        const searchUpperCase = query.toUpperCase();
        const productContainer = document.getElementById('product-container');
        productContainer.innerHTML = '';

        const products = await fetchProducts();
        products.forEach(product => {
            product.prices = convertCurrency(parseFloat(product.price), currency);
            product.price = `$${parseFloat(product.price)}`;
        });

        const minPriceValue = Math.min(...products.map(product => parseFloat(product.prices.replace('$', '').split(' ')[0])));
        const maxPriceValue = Math.max(...products.map(product => parseFloat(product.prices.replace('$', '').split(' ')[0])));

        const priceDisplay = document.getElementById('price-display');
        priceDisplay.textContent = `$${minPriceValue} - $${maxPriceValue}`;

        const priceRange = document.getElementById('price-range');
        if (priceRange.noUiSlider) {
            priceRange.noUiSlider.destroy();
        }
        noUiSlider.create(priceRange, {
            start: [minPriceValue, maxPriceValue],
            connect: true,
            range: {
                'min': minPriceValue,
                'max': maxPriceValue
            }
        });

        priceRange.noUiSlider.on('update', function (values) {
            const minPrice = parseFloat(values[0]);
            const maxPrice = parseFloat(values[1]);
            priceDisplay.textContent = `$${minPrice} - $${maxPrice}`;
        });

        document.getElementById('price-filter-button').addEventListener('click', function () {
            const values = priceRange.noUiSlider.get();
            const minPrice = parseFloat(values[0]);
            const maxPrice = parseFloat(values[1]);
            const selectedBrands = [...document.getElementById('brand-options').querySelectorAll('input:checked')].map(input => input.value);
            const sortOption = document.getElementById('sort-price').value;
            const selectedCategory = document.querySelector('input[name="value-radio"]:checked').nextElementSibling.textContent.trim();
            filterAndDisplayProducts(searchUpperCase, minPrice, maxPrice, products, selectedBrands, sortOption, selectedCategory, currency);
        });

        const brandOptionsContainer = document.getElementById('brand-options');
        const brands = [...new Set(products.map(product => product.brand.replace("Brand: ", "")))];
        brands.forEach(brand => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" value="${brand}"> ${brand}<br>`;
            brandOptionsContainer.appendChild(label);
        });

        document.getElementById('brand-filter-button').addEventListener('click', function () {
            const selectedBrands = [...brandOptionsContainer.querySelectorAll('input:checked')].map(input => input.value);
            const sortOption = document.getElementById('sort-price').value;
            const selectedCategory = document.querySelector('input[name="value-radio"]:checked').nextElementSibling.textContent.trim();
            filterAndDisplayProducts(searchUpperCase, minPriceValue, maxPriceValue, products, selectedBrands, sortOption, selectedCategory);
        });

        document.getElementById('sort-price').addEventListener('change', function () {
            const sortOption = this.value;
            const selectedBrands = [...brandOptionsContainer.querySelectorAll('input:checked')].map(input => input.value);
            const selectedCategory = document.querySelector('input[name="value-radio"]:checked').nextElementSibling.textContent.trim();
            filterAndDisplayProducts(searchUpperCase, minPriceValue, maxPriceValue, products, selectedBrands, sortOption, selectedCategory);
        });

        function getSelectedBrands() {
            return [...document.getElementById('brand-options').querySelectorAll('input:checked')].map(input => input.value);
        }

        function getSelectedCategory() {
            const selectedCategoryRadio = document.querySelector('input[name="value-radio"]:checked');
            return selectedCategoryRadio ? selectedCategoryRadio.nextElementSibling.textContent.trim() : '';
        }

        const selectedBrands = getSelectedBrands();
        const selectedCategory = getSelectedCategory();

        filterAndDisplayProducts(searchUpperCase, minPriceValue, maxPriceValue, products, selectedBrands, 'none', selectedCategory, currency);
    }

    function updateBrandOptions(products, selectedBrands) {
        const brandOptionsContainer = document.getElementById('brand-options');
        brandOptionsContainer.innerHTML = '';

        const brands = [...new Set(products.map(product => product.brand.replace("Brand: ", "")))];
        brands.forEach(brand => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" value="${brand}" ${selectedBrands.includes(brand) ? 'checked' : ''}> ${brand}<br>`;
            brandOptionsContainer.appendChild(label);
        });
    }

    function filterAndDisplayProducts(query, minPrice, maxPrice, products, selectedBrands = [], sortOption = 'none', selectedCategory = '', currency) {
        const productContainer = document.getElementById('product-container');

        let filteredProducts = products.filter(product =>
            (product.name.toUpperCase().includes(query) || product.brand.toUpperCase().replace("BRAND: ", "").includes(query)) &&
            parseFloat(product.prices.replace('$', '').split(' ')[0]) >= minPrice &&
            parseFloat(product.prices.replace('$', '').split(' ')[0]) <= maxPrice &&
            (selectedBrands.length === 0 || selectedBrands.includes(product.brand.replace("Brand: ", ""))) &&
            (selectedCategory === 'All' || product.category.toUpperCase() === selectedCategory.toUpperCase())
        );

        if (filteredProducts.length > 0) {
            if (sortOption === 'asc') {
                filteredProducts.sort((a, b) => parseFloat(a.prices.replace('$', '').split(' ')[0]) - parseFloat(b.prices.replace('$', '').split(' ')[0]));
            } else if (sortOption === 'desc') {
                filteredProducts.sort((a, b) => parseFloat(b.prices.replace('$', '').split(' ')[0]) - parseFloat(a.prices.replace('$', '').split(' ')[0]));
            }

            displayProducts(filteredProducts, currency);
            updateBrandOptions(filteredProducts, selectedBrands);

            const minFilteredPrice = Math.min(...filteredProducts.map(product => parseFloat(product.prices.replace('$', '').split(' ')[0])));
            const maxFilteredPrice = Math.max(...filteredProducts.map(product => parseFloat(product.prices.replace('$', '').split(' ')[0])));

            const priceDisplay = document.getElementById('price-display');
            priceDisplay.textContent = `$${minFilteredPrice} - $${maxFilteredPrice}`;

            if (minFilteredPrice !== maxFilteredPrice) {
                const priceRange = document.getElementById('price-range');
                priceRange.noUiSlider.updateOptions({
                    range: {
                        'min': minFilteredPrice,
                        'max': maxFilteredPrice
                    },
                    start: [minFilteredPrice, maxFilteredPrice]
                });
                document.getElementById('price-filter').style.display = 'block';
            } else {
                document.getElementById('price-filter').style.display = 'none';
            }

        } else {
            productContainer.innerHTML = '<p>No products found matching your search.<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></p>';
            document.getElementById('price-filter').style.display = 'none';
            document.getElementById('brand-filter').style.display = 'none';
        }
    }

    function displayProducts(productsToDisplay, currency) {
        const productContainer = document.getElementById('product-container');
        productContainer.innerHTML = '';
        productsToDisplay.forEach((product) => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <a href="/index/product?id=${product.id}" class="card-link">
                    <div class="content-wrapper">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p class="brand">${product.brand}</p>
                        <p class="price">${product.price}</p>
                        <p class="prices">${product.prices}</p>
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

    if (searchQuery) {
        searchBox.value = searchQuery;
        filterProducts(searchQuery);
    }

    fetchAndDisplayProducts();

    searchBox.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            filterProducts(searchBox.value);
        }
    });

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            filterProducts(searchInput.value);
        }
    });

    document.querySelector('.search-container button').addEventListener("click", function () {
        filterProducts(searchBox.value);
    });

});
