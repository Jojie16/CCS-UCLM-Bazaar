window.onload = function () {
    displayCheckoutItems();
};

function displayCheckoutItems() {
    const checkoutData = JSON.parse(localStorage.getItem('checkoutData')) || [];
    const checkoutItemsContainer = document.getElementById('checkoutItems');

    checkoutItemsContainer.innerHTML = '';

    checkoutData.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-item');

        productCard.innerHTML = `
            <img src="${product.images[0]}" alt="Product Image">
            <h4>${product.seller}</h4>
            <p>${product.details}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Status:</strong> ${product.status}</p>
            <p><strong>Type:</strong> ${product.type}</p>
            <p><strong>Posted At:</strong><br>${product.postedAt}</p>
            <p><strong>Checked Out At:</strong><br>${product.checkoutAt}</p>
            <button class="cancel-btn" onclick="cancelOrder(${index})">Cancel Order</button>
        `;

        checkoutItemsContainer.appendChild(productCard);
    });
}

function cancelOrder(index) {
    if (confirm('Are you sure you want to cancel your order?')) {
        const checkoutData = JSON.parse(localStorage.getItem('checkoutData')) || [];
        checkoutData.splice(index, 1);  // Remove the item at the given index
        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));  // Save updated data to localStorage
        alert('Order canceled!');
        window.location.href = 'buyer.html';  // Redirect after canceling
    }
}
