// Initialize the page on load
window.onload = function () {
    displayCartItems();
};

function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    let totalPrice = 0;

    cartItemsContainer.innerHTML = ''; // Clear any existing content

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalPriceElement.textContent = '0.00';
        return;
    }

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
    cart.splice(index, 1); // Remove the item at the given index
    localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart to localStorage
    displayCartItems();
}

// Handle checkout button click
const checkoutButton = document.getElementById('checkoutBtn');
if (checkoutButton) {
    checkoutButton.addEventListener('click', function () {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            alert('Your cart is empty! Please add items before proceeding to checkout.');
            return;
        }

        if (confirm('Are you sure you want to proceed to checkout?')) {
            // Show waiting message to buyer
            alert('Please wait for seller response...');

            // Simulate sending the order to the seller (set status to 'pending')
            localStorage.setItem('orderStatus', 'pending');
            localStorage.setItem('newOrder', 'true'); // Notify seller

            // Polling for order status change
            const checkStatusInterval = setInterval(() => {
                const status = localStorage.getItem('orderStatus');

                if (status === 'accepted') {
                    alert('Seller accepted your order!');

                    // Save the cart data to checkoutData in localStorage
                    const existingCheckoutData = JSON.parse(localStorage.getItem('checkoutData')) || [];
                    const checkoutData = cart.map((product) => ({
                        ...product,
                        checkoutAt: new Date().toLocaleString()
                    }));
                    localStorage.setItem('checkoutData', JSON.stringify([...existingCheckoutData, ...checkoutData]));

                    clearInterval(checkStatusInterval);
                    localStorage.removeItem('cart'); // Clear the cart after checkout
                    setTimeout(() => {
                        window.location.href = 'checkout.html'; // Redirect to checkout page
                    }, 2000); // Delay redirect for 2 seconds
                } else if (status === 'declined') {
                    alert('Seller declined one of your order. Please choose another item.');
                    clearInterval(checkStatusInterval);
                }
            }, 1000); // Check every second
        }
    });
}
