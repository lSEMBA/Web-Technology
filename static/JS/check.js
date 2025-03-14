
function checkOrder() {
    const orderId = document.getElementById('order-id').value;

    const mockOrder = {
        id: '12345',
        product: 'Wireless Headphones',
        quantity: 2,
        price: '$100',
        date: 'Jan 1, 2025'
    };

    if (orderId === mockOrder.id) {
        document.getElementById('details-id').innerText = mockOrder.id;
        document.getElementById('details-product').innerText = mockOrder.product;
        document.getElementById('details-quantity').innerText = mockOrder.quantity;
        document.getElementById('details-price').innerText = mockOrder.price;
        document.getElementById('details-date').innerText = mockOrder.date;
        document.getElementById('order-details').style.display = 'block';
    } else {
        alert('Order not found. Please check your Order ID.');
        document.getElementById('order-details').style.display = 'none';
    }
}