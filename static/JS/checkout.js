const paymentMethod = document.getElementById('payment-method');
const paymentDetails = document.getElementById('payment-details');
const paymentDescription = document.getElementById('payment-description');

paymentMethod.addEventListener('change', () => {
    const method = paymentMethod.value;

    if (method === 'cash') {
        paymentDetails.style.display = 'none';
        paymentDescription.innerText = 'You will pay in cash upon receiving your order.';
    } else if (method === 'paypal') {
        paymentDetails.style.display = 'none';
        paymentDescription.innerText = 'You will be redirected to PayPal to complete your payment securely.';
        renderPayPalButton();
    } else if (method === 'visa' || method === 'mastercard') {
        paymentDetails.style.display = 'block';
        paymentDetails.innerHTML = `
            <label for="card-holder">Card Holder Name</label>
            <input type="text" id="card-holder" name="card-holder" placeholder="John Doe" required>
            <label for="card-number">Card Number</label>
            <input type="text" id="card-number" name="card-number" placeholder="1234 5678 9101 1121" required>
            <label for="expiry-date">Expiry Date</label>
            <input type="text" id="expiry-date" name="expiry-date" placeholder="MM/YY" required>
            <label for="cvv">CVV</label>
            <input type="text" id="cvv" name="cvv" placeholder="123" required>
        `;
        paymentDescription.innerText = 'Enter your card details below to process your payment.';
    } else if (method === 'google') {
        paymentDetails.style.display = 'none';
        paymentDescription.innerText = 'You will be redirected to Google Pay to complete your payment securely.';
    } else if (method === 'vodafone' || method === 'etisalat' || method === 'orange' || method === 'myfawry') {
        paymentDetails.style.display = 'block';
        paymentDetails.innerHTML = `
            <label for="phone-number">Enter your Phone Number</label>
            <input type="text" id="phone-number" name="phone-number" placeholder="+201" required>
        `;
        paymentDescription.innerText = `You will receive a code to complete the payment via ${method === 'vodafone'
            ? 'Vodafone Cash'
            : method === 'etisalat'
                ? 'Etisalat Cash'
                : method === 'orange'
                    ? 'Orange Cash'
                    : 'MyFawry'
            }.`;
    } else {
        paymentDetails.style.display = 'none';
        paymentDescription.innerText = '';
    }
});

function renderPayPalButton() {
    const paypalButtonContainer = document.createElement('div');
    paypalButtonContainer.id = 'paypal-button-container';
    document.body.appendChild(paypalButtonContainer);

    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: '10.00'
                    }
                }]
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                alert('Transaction completed by ' + details.payer.name.given_name);
            });
        }
    }).render('#paypal-button-container');
}

document.querySelector('.payment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const method = document.getElementById('payment-method').value;

    if (method === 'cash') {
        alert('You chose Cash on Delivery. Payment will be collected upon delivery.');
    } else if (method === 'paypal') {
        window.location.href = 'https://www.paypal.com/signin';
    } else if (method === 'google') {
        window.location.href = 'https://pay.google.com';
    } else if (method === 'visa' || method === 'mastercard') {
        const cardHolder = document.getElementById('card-holder').value;
        const cardNumber = document.getElementById('card-number').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;
        if (cardHolder && cardNumber && expiryDate && cvv) {
            alert(`Processing payment for ${cardHolder}.`);
        } else {
            alert('Please complete all card details.');
        }
    } else if (method === 'vodafone' || method === 'myfawry') {
        const phoneNumber = document.getElementById('phone-number').value;
        if (phoneNumber) {
            alert(`Processing payment via ${method === 'vodafone' ? 'Vodafone Cash' : 'MyFawry'} for phone number: ${phoneNumber}.`);
        } else {
            alert('Please enter a valid phone number.');
        }
    } else {
        alert('Please select a payment method.');
    }
});