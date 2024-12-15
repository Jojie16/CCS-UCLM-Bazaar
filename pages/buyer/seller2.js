// Updated seller2.js
if (localStorage.getItem('newOrder') === 'true') {
    const orders = JSON.parse(localStorage.getItem('cart')) || [];

    if (orders.length > 0) {
        let orderRequest = document.getElementById('orderRequest');
        orderRequest.innerHTML = ''; // Clear any previous content

        orders.forEach((order, index) => {
            const orderCard = document.createElement('div');
            orderCard.classList.add('order-item');
            orderCard.innerHTML = `
                <img src="${order.images[0]}" alt="Product Image">
                <h4><strong>Buyer: </strong>${order.buyerName || 'Unknown'}</h4>
                <p>${order.details}</p>
                <p><strong>Price:</strong> $${order.price}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <p><strong>Requested At:</strong> ${new Date().toLocaleString()}</p>
                <button id="acceptBtn${index}">Accept Order</button>
                <button id="declineBtn${index}">Decline Order</button>
            `;

            orderRequest.appendChild(orderCard);

            document.getElementById(`acceptBtn${index}`).addEventListener('click', () => handleOrderAction('accepted', index));
            document.getElementById(`declineBtn${index}`).addEventListener('click', () => handleOrderAction('declined', index));
        });

        orderRequest.style.display = 'block';
    }
}

function handleOrderAction(action, index) {
    const orders = JSON.parse(localStorage.getItem('cart')) || [];
    orders.splice(index, 1); // Remove the accepted/declined order
    localStorage.setItem('cart', JSON.stringify(orders));
    localStorage.setItem('orderStatus', action);

    alert(`Order ${action}!`);
    location.reload();
}