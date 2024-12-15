// Handle Logout
document.getElementById('logoutBtn')?.addEventListener('click', function () {
    // Clear the logged-in user from localStorage
    localStorage.removeItem('loggedInUser');
    // Redirect to the login page
    window.location.href = "../../login/login.html";
});

// Initialize and display the logged-in user's name on page load
window.onload = function () {
    getLoggedInUser();
    displayProducts();
    loadNotifications(); // Load notifications for the seller
    loadPendingOrders(); // Load pending orders for the seller
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
    localStorage.setItem('products', JSON.stringify(products)); // Update localStorage
    displayProducts(); // Refresh gallery
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

// Load pending orders for the seller
function loadPendingOrders() {
    const checkoutData = JSON.parse(localStorage.getItem('checkoutData')) || [];
    const pendingOrders = checkoutData.filter(order => order.status === 'pending');
    const pendingOrdersContainer = document.getElementById('pendingOrdersList');
    pendingOrdersContainer.innerHTML = ''; // Clear existing orders

    pendingOrders.forEach(order => {
        const orderItem = document.createElement('li');
        orderItem.innerHTML = `
            <strong>${order.seller}</strong> ordered: ${order.details} 
            <button onclick="acceptOrder('${order.id}')">Accept</button>
            <button onclick="declineOrder('${order.id}')">Decline</button>
        `;
        pendingOrdersContainer.appendChild(orderItem);
    });
}

// Handle accepting an order
function acceptOrder(orderId) {
    const checkoutData = JSON.parse(localStorage.getItem('checkoutData')) || [];
    const updatedCheckoutData = checkoutData.map(order => {
        if (order.id === orderId) {
            order.status = 'accepted';
            notifyCustomer(order.seller, order.details, 'accepted');
        }
        return order;
    });

    localStorage.setItem('checkoutData', JSON.stringify(updatedCheckoutData));
    loadPendingOrders(); // Reload pending orders list
}

// Handle declining an order
function declineOrder(orderId) {
    const checkoutData = JSON.parse(localStorage.getItem('checkoutData')) || [];
    const updatedCheckoutData = checkoutData.map(order => {
        if (order.id === orderId) {
            order.status = 'declined';
            notifyCustomer(order.seller, order.details, 'declined');
        }
        return order;
    });

    localStorage.setItem('checkoutData', JSON.stringify(updatedCheckoutData));
    loadPendingOrders(); // Reload pending orders list
}

// Notify the customer that the seller accepted or declined the order
function notifyCustomer(sellerName, productDetails, status) {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const notificationMessage = status === 'accepted' 
        ? `Seller ${sellerName} accepted your order: ${productDetails}.` 
        : `Seller ${sellerName} declined your order. Please choose another item.`;

    notifications.push(notificationMessage);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    loadNotifications(); // Reload notifications on the customer side
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
    alert("Product posted successfully!");
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
