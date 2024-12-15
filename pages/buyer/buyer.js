// Initialize buyer dashboard with the logged-in user's name
window.onload = function() {
    getLoggedInUser();  // Get the logged-in user's name
    displayProducts();   // Display posted products by sellers
    updateCartCount();   // Update the cart item count in the nav
};

// Fetch and display products posted by sellers
function displayProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const gallery = document.querySelector('.product-card');
    
    gallery.innerHTML = '';  // Clear the gallery
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-item');
        productCard.innerHTML = `
            <img src="${product.images[0]}" alt="Product Image">
            <h4>${product.seller}</h4>
            <p>${product.details}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Status:</strong> ${product.status}</p>
            <p><strong>Type:</strong> ${product.type}</p>
            <p><strong>Posted At: </strong><br>${product.postedAt}</p>
            <button>❤️</button>
            <button>💬</button>
            <button class="add-to-cart-btn">
                <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
        `;

        // Add event listener to the cart button
        productCard.querySelector('.add-to-cart-btn').addEventListener('click', function() {
            addToCart(product);  // Add product to cart
            alert('Added to cart successfully.');  // Show notification
            updateCartCount();  // Update the cart count in the nav
        });

        gallery.appendChild(productCard);
    });
}

// Add product to cart in localStorage
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const loggedInAccount = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInAccount) {
        alert('Please log in to add items to the cart.');
        return;
    }

    product.buyerName = `${loggedInAccount.firstName} ${loggedInAccount.lastName}`; // Attach buyer's name
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update the cart item count in the navigation bar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');

    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Get the logged-in user's name
function getLoggedInUser() {
    const loggedInAccount = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInAccount) {
        const userName = `${loggedInAccount.firstName} ${loggedInAccount.lastName}`;
        document.getElementById('userName').textContent = userName;
    } else {
        console.log('No logged-in user found!');
    }
}

// Handle logout action
document.getElementById('logoutBtn')?.addEventListener('click', function() {
    localStorage.removeItem('loggedInUser');
    window.location.href = "../../login/login.html";
});