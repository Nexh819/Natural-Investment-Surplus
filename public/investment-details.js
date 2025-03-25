// Sample investment details data
const investmentData = {
    id: "INV12345",
    planName: "Premium Plan Investment",
    status: "active",
    amount: 5000,
    dailyReturn: 50,
    duration: "90 days",
    startDate: "2025-03-15",
    endDate: "2025-06-13",
    daysElapsed: 22,
    daysRemaining: 68,
    completionPercentage: 24,
    totalReturns: 1100,
    expectedReturns: 4500,
    roi: "90%",
    returns: [
        {
            date: "2025-04-05",
            amount: 50,
            status: "completed"
        },
        {
            date: "2025-04-04",
            amount: 50,
            status: "completed"
        },
        {
            date: "2025-04-03",
            amount: 50,
            status: "completed"
        },
        {
            date: "2025-04-02",
            amount: 50,
            status: "completed"
        },
        {
            date: "2025-04-01",
            amount: 50,
            status: "completed"
        },
        {
            date: "2025-03-31",
            amount: 50,
            status: "completed"
        },
        {
            date: "2025-03-30",
            amount: 50,
            status: "completed"
        },
        {
            date: "2025-03-29",
            amount: 50,
            status: "completed"
        },
        {
            date: "2025-03-28",
            amount: 50,
            status: "completed"
        },
        {
            date: "2025-03-27",
            amount: 50,
            status: "completed"
        }
        // Additional return entries would continue in the same format
    ],
    pagination: {
        currentPage: 1,
        totalPages: 3,
        itemsPerPage: 10
    }
};

// Main document load function
document.addEventListener("DOMContentLoaded", function() {
    // Add the CSS for investment details
    addInvestmentDetailsStyles();
    
    // Setup profile dropdown functionality
    setupProfileDropdown();
    
    // Setup quick actions
    setupQuickActions();
    
    // Load and display investment details
    loadInvestmentDetails(investmentData);
    
    // Populate returns history table
    populateReturnsHistory(investmentData.returns);
    
    // Setup pagination
    setupPagination(investmentData.pagination);
    
    // Setup button event listeners
    setupButtonListeners();
    
    // Get investment ID from URL if available
    const urlParams = new URLSearchParams(window.location.search);
    const investmentId = urlParams.get('id');
    
    if (investmentId) {
        console.log("Loading investment with ID:", investmentId);
        // Here you would fetch the specific investment data from the server
        // For now, we'll just use the sample data
    }
});

// Add CSS styles specific to investment details
function addInvestmentDetailsStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Back navigation */
        .back-nav {
            margin-bottom: 20px;
        }
        
        .back-link {
            display: inline-flex;
            align-items: center;
            color: var(--primary-color);
            font-weight: 500;
            text-decoration: none;
            transition: color 0.3s;
        }
        
        .back-link i {
            margin-right: 8px;
        }
        
        .back-link:hover {
            color: var(--secondary-color);
        }
        
        /* Investment details header */
        .investment-details-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .investment-details-header h1 {
            margin-right: 15px;
            font-size: 24px;
            color: var(--text-color);
        }
        
        /* Investment overview */
        .investment-overview {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .investment-card {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            padding: 20px;
        }
        
        .investment-info {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 20px;
        }
        
        .info-item h3 {
            font-size: 14px;
            color: var(--text-light);
            margin-bottom: 5px;
        }
        
        .info-item p {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-color);
        }
        
        /* Investment progress */
        .investment-progress {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            padding: 20px;
        }
        
        .investment-progress h2 {
            font-size: 18px;
            margin-bottom: 20px;
            color: var(--text-color);
        }
        
        .progress-container {
            margin-top: 15px;
        }
        
        .progress-bar {
            height: 12px;
            background-color: #f0f0f0;
            border-radius: 6px;
            overflow: hidden;
            margin-bottom: 15px;
        }
        
        .progress-fill {
            height: 100%;
            background-color: var(--primary-color);
            border-radius: 6px;
            transition: width 0.5s ease;
        }
        
        .progress-stats {
            display: flex;
            justify-content: space-between;
        }
        
        .progress-stat {
            display: flex;
            flex-direction: column;
        }
        
        .stat-label {
            font-size: 14px;
            color: var(--text-light);
            margin-bottom: 5px;
        }
        
        .stat-value {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-color);
        }
        
        /* Investment returns */
        .investment-returns {
            margin-bottom: 30px;
        }
        
        .returns-header {
            margin-bottom: 20px;
        }
        
        .returns-header h2 {
            font-size: 18px;
            color: var(--text-color);
        }
        
        .returns-overview {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .returns-card {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .returns-icon {
            width: 50px;
            height: 50px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
        
        .returns-card.total-returns .returns-icon {
            background-color: rgba(46, 204, 113, 0.1);
            color: #27ae60;
        }
        
        .returns-card.expected-returns .returns-icon {
            background-color: rgba(52, 152, 219, 0.1);
            color: #3498db;
        }
        
        .returns-card.roi .returns-icon {
            background-color: rgba(155, 89, 182, 0.1);
            color: #9b59b6;
        }
        
        .returns-content h3 {
            font-size: 14px;
            color: var(--text-light);
            margin-bottom: 5px;
        }
        
        .returns-content p {
            font-size: 20px;
            font-weight: 600;
        }
        
        /* Returns history */
        .returns-history {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            padding: 20px;
        }
        
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .section-header h2 {
            font-size: 18px;
            color: var(--text-color);
        }
        
        .btn-export {
            display: flex;
            align-items: center;
            gap: 8px;
            background-color: var(--primary-color);
            color: white;
            padding: 8px 15px;
            border-radius: 5px;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.3s;
        }
        
        .btn-export:hover {
            background-color: var(--secondary-color);
        }
        
        /* Pagination */
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
        
        /* Status badges */
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            text-transform: capitalize;
        }
        
        .status-badge.active, .status-badge.completed {
            background-color: rgba(46, 204, 113, 0.1);
            color: #27ae60;
        }
        
        .status-badge.pending {
            background-color: rgba(241, 196, 15, 0.1);
            color: #f39c12;
        }
        
        .status-badge.expired {
            background-color: rgba(231, 76, 60, 0.1);
            color: #e74c3c;
        }
        
        /* Responsive adjustments */
        @media screen and (max-width: 768px) {
            .investment-overview {
                grid-template-columns: 1fr;
            }
            
            .investment-info {
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            }
            
            .returns-overview {
                grid-template-columns: 1fr;
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

// Load and display investment details
function loadInvestmentDetails(data) {
    // Update page title and status
    document.getElementById('investment-plan-name').textContent = data.planName;
    
    const statusElement = document.getElementById('investment-status');
    statusElement.textContent = capitalizeFirstLetter(data.status);
    statusElement.className = `status-badge ${data.status}`;
    
    // Update investment info
    document.getElementById('amount-invested').textContent = `Ksh ${formatCurrency(data.amount)}`;
    document.getElementById('daily-return').textContent = `Ksh ${formatCurrency(data.dailyReturn)}`;
    document.getElementById('duration').textContent = data.duration;
    document.getElementById('start-date').textContent = formatDate(data.startDate);
    document.getElementById('end-date').textContent = formatDate(data.endDate);
    document.getElementById('days-remaining').textContent = `${data.daysRemaining} days`;
    
    // Update progress bar
    document.getElementById('progress-fill').style.width = `${data.completionPercentage}%`;
    document.getElementById('completion-percentage').textContent = `${data.completionPercentage}%`;
    document.getElementById('days-elapsed').textContent = `${data.daysElapsed} days`;
    
    // Update returns summary
    document.getElementById('total-returns').textContent = `Ksh ${formatCurrency(data.totalReturns)}`;
    document.getElementById('expected-returns').textContent = `Ksh ${formatCurrency(data.expectedReturns)}`;
    document.getElementById('total-roi').textContent = data.roi;
}

// Populate returns history table
function populateReturnsHistory(returns) {
    const tableBody = document.querySelector('#returns-table tbody');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    if (returns && returns.length > 0) {
        returns.forEach(returnItem => {
            const row = document.createElement('tr');
            
            // Format the date
            const formattedDate = formatDate(returnItem.date);
            
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>Ksh ${formatCurrency(returnItem.amount)}</td>
                <td><span class="status-badge ${returnItem.status}">${capitalizeFirstLetter(returnItem.status)}</span></td>
            `;
            
            tableBody.appendChild(row);
        });
    } else {
        // Show empty state
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="3" class="empty-state">
                <div class="empty-state-container">
                    <i class="fas fa-chart-line empty-icon"></i>
                    <p>No returns have been generated yet.</p>
                </div>
            </td>
        `;
        tableBody.appendChild(emptyRow);
    }
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
                alert('Loading previous page of returns...');
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.disabled = pagination.currentPage >= pagination.totalPages;
        nextBtn.addEventListener('click', function() {
            if (pagination.currentPage < pagination.totalPages) {
                // Here you would fetch the next page of data
                alert('Loading next page of returns...');
            }
        });
    }
}

// Setup button event listeners
function setupButtonListeners() {
    // Export button
    const exportBtn = document.querySelector('.btn-export');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            alert('Exporting returns history to CSV...');
            // Here you would implement the export functionality
        });
    }
    
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
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Helper function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}