// Handle Login
document.getElementById('loginForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const studentId = document.getElementById('student_id').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Retrieve accounts from localStorage
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    // Check if credentials are valid
    const validAccount = accounts.find(
        (account) => account.studentId === studentId && account.password === password
    );

    if (validAccount) {
        // Store the logged-in user in localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(validAccount));

        // Redirect based on the role
        if (validAccount.role === "buyer") {
            window.location.href = "../pages/buyer/buyer.html";
        } else if (validAccount.role === "seller") {
            window.location.href = "../pages/seller/seller.html";
        }
    } else {
        errorMessage.textContent = "Invalid Student ID or Password."; // Show error
        errorMessage.style.display = "block";
    }
});

// Handle Sign Up
document.getElementById('signupForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const firstName = document.getElementById('first_name').value;
    const lastName = document.getElementById('last_name').value;
    const gender = document.getElementById('gender').value;
    const studentId = document.getElementById('student_id').value;
    const password = document.getElementById('password').value;
    const repeatPassword = document.getElementById('repeat_password').value;
    const yearLevel = document.getElementById('year_level').value;
    const role = document.getElementById('role').value;

    if (password !== repeatPassword) {
        alert("Passwords do not match.");
        return;
    }

    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    // Check if student ID is already registered
    const existingAccount = accounts.find((account) => account.studentId === studentId);
    if (existingAccount) {
        alert("This Student ID is already registered.");
        return;
    }

    // Add new account to the accounts array
    accounts.push({ firstName, lastName, gender, studentId, password, yearLevel, role });

    // Save updated accounts array to localStorage
    localStorage.setItem('accounts', JSON.stringify(accounts));

    // Redirect to login page after successful signup
    alert("Account created successfully! Redirecting to login...");
    window.location.href = "../login/login.html";
});

// Admin - Add new account
function addAccount() {
    const firstName = document.getElementById('first_name').value;
    const lastName = document.getElementById('last_name').value;
    const gender = document.getElementById('gender').value;
    const studentId = document.getElementById('student_id').value;
    const password = document.getElementById('password').value;
    const repeatPassword = document.getElementById('repeat_password').value;
    const yearLevel = document.getElementById('year_level').value;
    const role = document.getElementById('role').value;

    if (password !== repeatPassword) {
        alert("Passwords do not match.");
        return;
    }

    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    const existingAccount = accounts.find(account => account.studentId === studentId);
    if (existingAccount) {
        alert("This Student ID is already registered.");
        return;
    }

    // Add new account with firstName, lastName, gender, password, etc.
    accounts.push({ firstName, lastName, gender, studentId, password, yearLevel, role });

    localStorage.setItem('accounts', JSON.stringify(accounts));

    displayAccounts();
    alert("Account added successfully.");
}

// Display all accounts (including password for Admin)
function displayAccounts() {
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const tableBody = document.getElementById('accountsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    accounts.forEach(account => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${account.firstName}</td>
            <td>${account.lastName}</td>
            <td>${account.gender}</td>
            <td>${account.studentId}</td>
            <td>${account.yearLevel}</td>
            <td>${account.role}</td>
            <td>${account.password}</td>  <!-- Display password -->
            <td><button class="delete-btn" onclick="deleteAccount('${account.studentId}')">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Delete account by student ID
function deleteAccount(studentId) {
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const updatedAccounts = accounts.filter(account => account.studentId !== studentId);

    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));

    displayAccounts();
    alert("Account deleted successfully.");
}

// Initial call to display all accounts when admin page loads
window.onload = displayAccounts;
