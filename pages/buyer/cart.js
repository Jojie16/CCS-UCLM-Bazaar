window.onload = function() {
    displayCartItems();  // Display cart items on page load
};

// Fetch and display cart items in gallery format
function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];  // Get cart items from localStorage
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    let totalPrice = 0;

    // Clear any existing cart items
    cartItemsContainer.innerHTML = '';

    // Display each product in the cart as a gallery item
    cart.forEach(product => {
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
            <button class="remove-from-cart" onclick="removeFromCart('${product.details}')">Remove</button>
        `;
        
        cartItemsContainer.appendChild(productCard);

        totalPrice += parseFloat(product.price);  // Add the product price to the total
    });

    // Update the total price
    totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Remove product from cart
function removeFromCart(productDetails) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(product => product.details !== productDetails);  // Remove the product from the cart array

    localStorage.setItem('cart', JSON.stringify(cart));  // Save the updated cart
    displayCartItems();  // Re-render the cart items after removal
}

// Checkout button handler
document.getElementById('checkoutBtn')?.addEventListener('click', function() {
    if (confirm("Proceed to checkout?")) {
        // Handle the checkout process (you can redirect to a checkout page or process payment here)
        alert("Checkout successful!");
        localStorage.removeItem('cart');  // Clear cart after checkout
        window.location.href = 'checkout.html';  // Redirect to checkout page
    }
});

// Handle logout action
document.getElementById('logoutBtn')?.addEventListener('click', function() {
    localStorage.removeItem('loggedInUser');  // Clear logged-in user data from localStorage
    window.location.href = "../../login/login.html";  // Redirect to login page
});
