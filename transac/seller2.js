// Only show new order request if the buyer has checked out (newOrder flag is true)
if (localStorage.getItem('newOrder') === 'true') {
    setTimeout(() => {
        let orderRequest = document.getElementById('orderRequest');
        orderRequest.style.display = 'block'; // Show the order request

        // Seller's action on the order
        document.getElementById('acceptBtn').addEventListener('click', function() {
            // Update order status to accepted in localStorage
            localStorage.setItem('orderStatus', 'accepted');
            showSuccessMessage('Order accepted successfully');
            hideOrderRequest(); // Hide the order request section after action
            clearSellerData(); // Clear seller data after action
        });

        document.getElementById('declineBtn').addEventListener('click', function() {
            // Update order status to declined in localStorage
            localStorage.setItem('orderStatus', 'declined');
            showSuccessMessage('Order declined successfully');
            hideOrderRequest(); // Hide the order request section after action
            clearSellerData(); // Clear seller data after action
        });

    }, 3000); // Simulate delay before order is received
}

function hideOrderRequest() {
    // Hide the order request section after accepting or declining
    let orderRequest = document.getElementById('orderRequest');
    orderRequest.style.display = 'none'; // Set display to none
}

function clearSellerData() {
    // Clear all seller-related data after they accept or decline
    localStorage.removeItem('newOrder');
}

function showSuccessMessage(message) {
    // Show success message after action
    let successMessage = document.createElement('div');
    successMessage.textContent = message;
    successMessage.style.backgroundColor = '#4CAF50';
    successMessage.style.color = 'white';
    successMessage.style.padding = '10px';
    successMessage.style.marginTop = '20px';
    successMessage.style.borderRadius = '5px';
    document.body.appendChild(successMessage);

    // Hide the message after a few seconds (e.g., 3 seconds)
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000); // Message disappears after 3 seconds
}
