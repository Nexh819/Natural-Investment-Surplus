// Sample transaction data for the transaction history page
const transactionData = {
    transactions: [
        {
            id: "TRX123456",
            date: "2025-03-15T10:30:00",
            type: "deposit",
            description: "Deposit via M-Pesa",
            amount: 10000,
            status: "completed"
        },
        {
            id: "TRX123457",
            date: "2025-03-14T15:45:00",
            type: "investment",
            description: "Investment in Premium Plan",
            amount: -5000,
            status: "completed"
        },
        {
            id: "TRX123458",
            date: "2025-03-12T09:15:00",
            type: "return",
            description: "Daily return from Premium Plan",
            amount: 50,
            status: "completed"
        },
        {
            id: "TRX123459",
            date: "2025-03-11T14:20:00",
            type: "return",
            description: "Daily return from Premium Plan",
            amount: 50,
            status: "completed"
        },
        {
            id: "TRX123460",
            date: "2025-03-10T16:30:00",
            type: "deposit",
            description: "Deposit via Bank Transfer",
            amount: 15000,
            status: "completed"
        },
        {
            id: "TRX123461",
            date: "2025-03-08T11:25:00",
            type: "withdrawal",
            description: "Withdrawal to Bank Account",
            amount: -5000,
            status: "completed"
        },
        {
            id: "TRX123462",
            date: "2025-03-05T13:10:00",
            type: "referral",
            description: "Referral Commission from Sarah Johnson",
            amount: 200,
            status: "completed"
        },
        {
            id: "TRX123463",
            date: "2025-03-01T09:50:00",
            type: "investment",
            description: "Investment in Basic Plan",
            amount: -5000,
            status: "completed"
        }
    ],
    summary: {
        totalIn: 25300,
        totalOut: 10000,
        netAmount: 15300
    },
    pagination: {
        currentPage: 1,
        totalPages: 5,
        itemsPerPage: 10
    }
};

// Main document load function
document.addEventListener("DOMContentLoaded", function() {
    // Add the CSS for transaction history
    addTransactionStyles();
    
    // Setup profile dropdown functionality
    setupProfileDropdown();
    
    // Setup quick actions
    setupQuickActions();
    
    // Update user information
    updateUserInfo();
    
    // Populate transaction history
    populateTransactions(transactionData.transactions);
    
    // Update transaction summary
    updateTransactionSummary(transactionData.summary);
    
    // Setup pagination
    setupPagination(transactionData.pagination);
    
    // Setup filters
    setupFilters();
    
    // Setup button event listeners
    setupButtonListeners();
});

// Add CSS styles specific to transaction history
function addTransactionStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Transaction filters */
        .transaction-filters {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 25px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .filter-row {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            align-items: flex-end;
        }
        
        .filter-group {
            flex: 1;
            min-width: 200px;
        }
        
        .filter-group label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            color: var(--text-light);
            font-weight: 500;
        }
        
        .filter-group select, .filter-group input {
            width: 100%;
            padding: 10px 15px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            font-size: 14px;
            font-family: 'Poppins', sans-serif;
        }
        
        .date-inputs {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .date-inputs span {
            color: var(--text-light);
        }
        
        .date-input {
            flex: 1;
        }
        
        .btn-filter {
            background-color: var(--primary-color);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 500;
            transition: background-color 0.3s;
            height: 42px;
        }
        
        .btn-filter:hover {
            background-color: var(--secondary-color);
        }
        
        /* Transaction summary */
        .transaction-summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 25px;
        }
        
        .summary-card {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .summary-icon {
            width: 50px;
            height: 50px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
        
        .summary-card.in .summary-icon {
            background-color: rgba(46, 204, 113, 0.1);
            color: #27ae60;
        }
        
        .summary-card.out .summary-icon {
            background-color: rgba(231, 76, 60, 0.1);
            color: #e74c3c;
        }
        
        .summary-card.net .summary-icon {
            background-color: rgba(52, 152, 219, 0.1);
            color: #3498db;
        }
        
        .summary-content h3 {
            font-size: 14px;
            color: var(--text-light);
            margin-bottom: 5px;
        }
        
        .summary-content p {
            font-size: 20px;
            font-weight: 600;
        }
        
        /* Transaction table */
        .pagination {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding: 10px 0;
        }
        
        .btn-page {
            background-color: white;
            border: 1px solid var(--border-color);
            padding: 8px 15px;
            border-radius: 5px;
            font-size: 14px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .btn-page:hover {
            background-color: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        
        #page-info {
            color: var(--text-light);
            font-size: 14px;
        }
        
        /* Transaction status and type badges */
        .status-badge.pending {
            background-color: rgba(241, 196, 15, 0.1);
            color: #f39c12;
        }
        
        .status-badge.failed {
            background-color: rgba(231, 76, 60, 0.1);
            color: #e74c3c;
        }
        
        .type-badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            text-align: center;
            min-width: 80px;
        }
        
        .type-badge.deposit, .type-badge.return, .type-badge.referral {
            background-color: rgba(46, 204, 113, 0.1);
            color: #27ae60;
        }
        
        .type-badge.withdrawal, .type-badge.investment {
            background-color: rgba(231, 76, 60, 0.1);
            color: #e74c3c;
        }
        
        /* Amount styling */
        .amount-positive {
            color: #27ae60;
        }
        
        .amount-negative {
            color: #e74c3c;
        }
        
        /* Responsive tweaks */
        @media screen and (max-width: 768px) {
            .filter-row {
                flex-direction: column;
                gap: 15px;
            }
            
            .btn-filter {
                width: 100%;
            }
            
            .date-inputs {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .table-container {
                overflow-x: auto;
            }
        }
    `;
    document.head.appendChild(styleElement);
}

// Setup profile dropdown functionality
function setupProfileDropdown() {
    const profileTrigger = document.getElementById('profile-trigger');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    if (profileTrigger && profileDropdown) {
        // Toggle dropdown when clicking on profile
        profileTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Toggle active state for arrow rotation
            profileTrigger.classList.toggle('active');
            
            // Toggle visibility using class instead of inline style
            profileDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking anywhere else
        document.addEventListener('click', function(e) {
            if (!profileDropdown.contains(e.target) && !profileTrigger.contains(e.target)) {
                profileDropdown.classList.remove('show');
                profileTrigger.classList.remove('active');
            }
        });
    }
}

// Setup quick action buttons in dropdown
function setupQuickActions() {
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    if (quickActionBtns.length > 0) {
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const action = this.querySelector('span').textContent;
                alert(`${action} functionality coming soon!`);
                // Close the dropdown after action
                const profileDropdown = document.getElementById('profile-dropdown');
                const profileTrigger = document.getElementById('profile-trigger');
                if (profileDropdown && profileTrigger) {
                    profileDropdown.classList.remove('show');
                    profileTrigger.classList.remove('active');
                }
            });
        });
    }
}

// Update user information on the page
function updateUserInfo() {
    // Try to get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData')) || {
        username: "John Doe",
        balance: 15000,
        email: "munenemathewo35@gmail.com"
    };
    
    // Update username
    const usernameElements = document.querySelectorAll('#username, #dropdown-username');
    usernameElements.forEach(el => {
        if (el) el.textContent = userData.username;
    });
    
    // Update email
    const emailElement = document.querySelector('.dropdown-email');
    if (emailElement) emailElement.textContent = userData.email;
    
    // Update balance
    const balanceElement = document.getElementById('dropdown-balance');
    if (balanceElement) balanceElement.textContent = formatCurrency(userData.balance);
}

// Populate transaction history table
function populateTransactions(transactions) {
    const tableBody = document.querySelector('#transactions-table tbody');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    if (transactions && transactions.length > 0) {
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            
            // Format the date
            const formattedDate = formatDateTime(transaction.date);
            
            // Determine amount class (positive or negative)
            const amountClass = transaction.amount >= 0 ? 'amount-positive' : 'amount-negative';
            const formattedAmount = transaction.amount >= 0 
                ? `+${formatCurrency(transaction.amount)}` 
                : formatCurrency(transaction.amount);
            
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${transaction.id}</td>
                <td><span class="type-badge ${transaction.type}">${capitalizeFirstLetter(transaction.type)}</span></td>
                <td>${transaction.description}</td>
                <td class="${amountClass}">Ksh ${formattedAmount}</td>
                <td><span class="status-badge ${transaction.status.toLowerCase()}">${capitalizeFirstLetter(transaction.status)}</span></td>
            `;
            
            tableBody.appendChild(row);
        });
    } else {
        // Show empty state
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="6" class="empty-state">
                <div class="empty-state-container">
                    <i class="fas fa-receipt empty-icon"></i>
                    <p>No transactions found for the selected filters.</p>
                </div>
            </td>
        `;
        tableBody.appendChild(emptyRow);
    }
}

// Update transaction summary
function updateTransactionSummary(summary) {
    document.getElementById('total-in').textContent = formatCurrency(summary.totalIn);
    document.getElementById('total-out').textContent = formatCurrency(summary.totalOut);
    document.getElementById('net-amount').textContent = formatCurrency(summary.netAmount);
}

// Setup pagination
function setupPagination(pagination) {
    const pageInfoEl = document.getElementById('page-info');
    if (pageInfoEl) {
        pageInfoEl.textContent = `Page ${pagination.currentPage} of ${pagination.totalPages}`;
    }
    
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) {
        prevBtn.disabled = pagination.currentPage <= 1;
        prevBtn.addEventListener('click', function() {
            if (pagination.currentPage > 1) {
                // Here you would fetch the previous page of data
                alert('Loading previous page...');
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.disabled = pagination.currentPage >= pagination.totalPages;
        nextBtn.addEventListener('click', function() {
            if (pagination.currentPage < pagination.totalPages) {
                // Here you would fetch the next page of data
                alert('Loading next page...');
            }
        });
    }
}

// Setup filter functionality
function setupFilters() {
    const filterBtn = document.getElementById('filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            const typeFilter = document.getElementById('type-filter').value;
            const dateFrom = document.getElementById('date-from').value;
            const dateTo = document.getElementById('date-to').value;
            
            // Here you would use these values to filter the transactions
            // For now, we'll just log them and show an alert
            console.log('Filters:', { typeFilter, dateFrom, dateTo });
            alert(`Filtering transactions... Type: ${typeFilter}, From: ${dateFrom}, To: ${dateTo}`);
            
            // In a real app, you'd make an API call here to get filtered data
            // Then update the table with the results
        });
    }
    
    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const dateToInput = document.getElementById('date-to');
    const dateFromInput = document.getElementById('date-from');
    
    if (dateToInput) {
        dateToInput.value = formatDateForInput(today);
    }
    
    if (dateFromInput) {
        dateFromInput.value = formatDateForInput(thirtyDaysAgo);
    }
}

// Set up button event listeners
function setupButtonListeners() {
    // Logout button
    const logoutBtn = document.getElementById('sidebar-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear user data from localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            
            // Redirect to login
            window.location.href = 'login.html';
        });
    }
    
    // Dropdown logout button
    const dropdownLogoutBtn = document.getElementById('dropdown-logout-btn');
    if (dropdownLogoutBtn) {
        dropdownLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear user data from localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            
            // Redirect to login
            window.location.href = 'login.html';
        });
    }
}

// Helper function to format currency
function formatCurrency(amount) {
    // Convert to absolute value and format with commas
    const absAmount = Math.abs(Number(amount));
    return absAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Helper function to format date and time
function formatDateTime(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// Helper function to format date for input fields
function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}