// Handle Logout
document.getElementById('logoutBtn')?.addEventListener('click', function() {
    // Clear the logged-in user from localStorage
    localStorage.removeItem('loggedInUser');
    // Redirect to the login page
    window.location.href = "../../login/login.html";
});

// Initialize and display the logged-in user's name on page load
window.onload = function() {
    getLoggedInUser();
    displayProducts();
    loadNotifications();  // Load notifications for the seller
};

// Display logged-in user's name
function getLoggedInUser() {
    const loggedInAccount = JSON.parse(localStorage.getItem('loggedInUser'));

    // Debugging: Log to check if user is retrieved
    console.log('Logged-in account:', loggedInAccount);

    if (loggedInAccount) {
        const userName = `${loggedInAccount.firstName} ${loggedInAccount.lastName}`;
        document.getElementById('userName').textContent = userName; // Set the user's name in the dropdown
    } else {
        console.log('No logged-in user found!');
    }
}


// Display Products in Gallery
function displayProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const gallery = document.querySelector('.product-gallery');

    gallery.innerHTML = ''; // Clear existing products

    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-item');

        productCard.innerHTML = `
            <img src="${product.images[0]}" alt="Product Image">
            <h4>${product.seller}</h4>
            <p>${product.details}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Status:</strong> ${product.status}</p>
            <p><strong>Type:</strong> ${product.type}</p>
            <p><strong>Posted At:</strong> ${product.postedAt}</p>
            <button>❤️</button>
            <button>💬</button>
            <button class="delete-btn" onclick="deleteProduct(${index})">Delete</button>
        `;

        gallery.appendChild(productCard);
    });
}



// Delete Product from Gallery
function deleteProduct(index) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.splice(index, 1); // Remove product from array
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
    alert("Product deleted successfully.");
}

// Load notifications from localStorage
function loadNotifications() {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const notificationsList = document.getElementById('notificationsList');
    
    // Clear previous notifications
    notificationsList.innerHTML = '';

    // Display each notification
    notifications.forEach(notification => {
        const listItem = document.createElement('li');
        listItem.textContent = notification;
        notificationsList.appendChild(listItem);
    });
}

// Listen for checkout event and add a notification for the seller
function notifySellerOfCheckout(sellerName, productDetails) {
    const notification = `${sellerName} has had a product bought: ${productDetails}`;

    // Get the current notifications
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    
    // Add the new notification
    notifications.push(notification);
    
    // Save the updated notifications to localStorage
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // Reload notifications to update the UI
    loadNotifications();
}

// Handle Posting Product
document.getElementById('postProductForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const productImages = document.getElementById('productImages').files;
    const productType = document.getElementById('productType').value;
    const productStatus = document.getElementById('productStatus').value;
    const productDetails = document.getElementById('productDetails').value;
    const productPrice = document.getElementById('productPrice').value;

    if (productPrice <= 0 || !productDetails || productImages.length === 0) {
        alert('Please fill in all fields correctly!');
        return;
    }

    // Get the current logged-in user's details (seller's name)
    const loggedInAccount = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInAccount || loggedInAccount.role !== "seller") {
        alert('No seller found or not logged in!');
        return;
    }

    const sellerName = `${loggedInAccount.firstName} ${loggedInAccount.lastName}`;

    // Get the current date and time
    const postedAt = new Date().toLocaleString();

    // Convert image files to Base64
    const imagesBase64 = await Promise.all(
        Array.from(productImages).map((image) => convertToBase64(image))
    );

    // Create product object
    const product = {
        images: imagesBase64, // Store Base64-encoded images
        type: productType,
        status: productStatus,
        details: productDetails,
        price: productPrice,
        seller: sellerName,
        postedAt: postedAt,
    };

    // Store product to localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));

    // Display the product in the gallery
    displayProducts();
});

// Utility function to convert a File object to a Base64 string
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}