window.onload = function () {
    displayCartItems();
};

function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    let totalPrice = 0;

    cartItemsContainer.innerHTML = '';

    cart.forEach((product, index) => {
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
            <button class="remove-from-cart" onclick="confirmRemoveFromCart(${index})">Remove</button>
        `;

        cartItemsContainer.appendChild(productCard);
        totalPrice += parseFloat(product.price);
    });

    totalPriceElement.textContent = totalPrice.toFixed(2);
}

function confirmRemoveFromCart(index) {
    if (confirm('Are you sure you want to remove this product from the cart?')) {
        removeFromCart(index);
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);  // Remove the item at the given index
    localStorage.setItem('cart', JSON.stringify(cart));  // Save updated cart to localStorage
    displayCartItems();
}

document.getElementById('checkoutBtn')?.addEventListener('click', function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert('Your cart is empty! Please add items before proceeding to checkout.');
        return;
    }

    if (confirm('Are you sure you want to proceed to checkout?')) {
        const checkoutData = cart.map((product) => ({
            id: `CHK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            ...product,
            checkoutAt: new Date().toLocaleString()
        }));

        const existingCheckoutData = JSON.parse(localStorage.getItem('checkoutData')) || [];  // Get existing checkout data
        const updatedCheckoutData = existingCheckoutData.concat(checkoutData);  // Append new checkout data

        localStorage.setItem('checkoutData', JSON.stringify(updatedCheckoutData));  // Save updated checkout data

        localStorage.removeItem('cart');  // Clear cart after checkout

        alert('Checkout successful!');
        window.location.href = 'checkout.html';  // Redirect to checkout page
    }
});
