window.onload = function() {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage

    if (!token) {
        window.location.href = 'login.html'; // Redirect to login if no token
        return;
    }

    // Show loading spinner while fetching data
    document.getElementById('loading-spinner').style.display = 'block';

    // Fetch users data (only admins should access this)
    fetch('http://localhost:4000/admin/users', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` // Include the JWT token in the request header
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Unauthorized or error fetching data');
        }
        return response.json();
    })
    .then(data => {
        const usersTable = document.getElementById('users-table').getElementsByTagName('tbody')[0];
        const errorMessage = document.getElementById('error-message');

        // Hide loading spinner
        document.getElementById('loading-spinner').style.display = 'none';

        // Display users in the table
        data.users.forEach(user => {
            const row = usersTable.insertRow();
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>Ksh ${user.balance}</td>
                <td>${user.referralCode}</td>
                <td>${user.referredBy || 'N/A'}</td>
            `;
        });
    })
    .catch(error => {
        console.error('Error fetching users:', error);

        // Hide loading spinner
        document.getElementById('loading-spinner').style.display = 'none';

        // Show error message
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'You are not authorized to view this page or an error occurred.';
    });
};
