// Sample data for the dashboard
const userData = {
    username: "Dadius kiriaga",
    email: "munenemathewo35@gmail.com",
    balance: 15000,
    referralCode: "DAD123",
    referredBy: "James Smith",
    totalInvested: 50000,
    totalEarnings: 8750,
    totalReferrals: 5,
    activeReferrals: 3,
    referralEarnings: 2500,
    investments: [
        {
            _id: "INV1001",
            planName: "Premium Growth",
            amount: 30000,
            dailyReturn: 250,
            duration: "90 days",
            startDate: "2025-01-01",
            endDate: "2025-04-01",
            status: "Active"
        },
        {
            _id: "INV1002",
            planName: "Silver Plan",
            amount: 20000,
            dailyReturn: 150,
            duration: "60 days",
            startDate: "2025-02-15",
            endDate: "2025-04-16",
            status: "Active"
        },
        {
            _id: "INV1003",
            planName: "Quick Return",
            amount: 10000,
            dailyReturn: 100,
            duration: "30 days",
            startDate: "2024-12-10",
            endDate: "2025-01-09",
            status: "Completed"
        }
    ],
    referrals: [
        {
            name: "John Doe",
            avatar: "JD",
            date: "2025-03-10",
            status: "Active",
            commission: 1000
        },
        {
            name: "Jane Smith",
            avatar: "JS",
            date: "2025-03-05",
            status: "Active",
            commission: 750
        },
        {
            name: "Bob Johnson",
            avatar: "BJ",
            date: "2025-03-01",
            status: "Inactive",
            commission: 0
        }
    ],
    transactions: [
        {
            id: "TXN1001",
            type: "Deposit",
            amount: 5000,
            method: "M-Pesa",
            date: "2025-03-17",
            status: "Completed"
        },
        {
            id: "TXN1002",
            type: "Investment",
            amount: 20000,
            method: "Silver Plan",
            date: "2025-02-15",
            status: "Completed"
        },
        {
            id: "TXN1003",
            type: "Investment Return",
            amount: 250,
            method: "Premium Growth",
            date: "2025-03-15",
            status: "Completed"
        },
        {
            id: "TXN1004",
            type: "Withdrawal",
            amount: 2000,
            method: "M-Pesa",
            date: "2025-03-10",
            status: "Completed"
        }
    ]
};

// Main document load function
document.addEventListener("DOMContentLoaded", function() {
    // Initialize theme from local storage
    initializeTheme();
    
    // Setup navigation and dropdowns
    setupNavigationAndDropdowns();
    
    // Update user information
    updateUserInfo();
    
    // Initialize dashboard components
    initializeDashboardComponents();
    
    // Setup event listeners
    setupEventListeners();
});

// Initialize theme (light/dark)
function initializeTheme() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const body = document.body;
    const themeSwitch = document.getElementById('theme-switch');
    const themeText = document.getElementById('theme-mode-text');
    
    if (isDarkMode) {
        body.classList.add('dark-theme');
        if (themeSwitch) themeSwitch.checked = true;
        if (themeText) themeText.textContent = 'Light Mode';
    } else {
        body.classList.remove('dark-theme');
        if (themeSwitch) themeSwitch.checked = false;
        if (themeText) themeText.textContent = 'Dark Mode';
    }
}

// Setup navigation and dropdown menus
function setupNavigationAndDropdowns() {
    // Profile dropdown
    const profileTrigger = document.getElementById('profile-trigger');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    if (profileTrigger && profileDropdown) {
        profileTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            profileTrigger.classList.toggle('active');
            profileDropdown.classList.toggle('show');
        });
    }
    
    // Notifications dropdown
    const notificationsTrigger = document.getElementById('notifications-trigger');
    const notificationsDropdown = document.getElementById('notifications-dropdown');
    
    if (notificationsTrigger && notificationsDropdown) {
        notificationsTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationsDropdown.classList.toggle('show');
        });
    }
    
    // Close dropdowns when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (profileDropdown && !profileDropdown.contains(e.target) && !profileTrigger.contains(e.target)) {
            profileDropdown.classList.remove('show');
            profileTrigger.classList.remove('active');
        }
        
        if (notificationsDropdown && !notificationsDropdown.contains(e.target) && !notificationsTrigger.contains(e.target)) {
            notificationsDropdown.classList.remove('show');
        }
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show-mobile');
        });
    }
}

// Update user information
function updateUserInfo() {
    // Update user name and welcome message
    const usernameElements = document.querySelectorAll('#username, #dropdown-username');
    const welcomeName = document.getElementById('welcome-name');
    
    usernameElements.forEach(el => {
        if (el) el.textContent = userData.username;
    });
    
    if (welcomeName) {
        welcomeName.textContent = userData.username.split(' ')[0];
    }
    
    // Update email
    const dropdownEmail = document.querySelector('.dropdown-email');
    if (dropdownEmail) dropdownEmail.textContent = userData.email;
    
    // Update balance
    const balanceElements = document.querySelectorAll('#balance, #dropdown-balance');
    balanceElements.forEach(el => {
        if (el) el.textContent = formatCurrency(userData.balance);
    });
    
    // Update available balance in withdraw modal
    const availableBalance = document.getElementById('available-balance');
    if (availableBalance) availableBalance.textContent = `Ksh ${formatCurrency(userData.balance)}`;
    
    // Update stats
    updateElement('total-invested', formatCurrency(userData.totalInvested));
    updateElement('total-earnings', formatCurrency(userData.totalEarnings));
    updateElement('total-referrals', userData.totalReferrals);
    updateElement('active-referrals', userData.activeReferrals);
    updateElement('referral-earnings-value', formatCurrency(userData.referralEarnings));
    updateElement('referral-earnings-total', `Ksh ${formatCurrency(userData.referralEarnings)}`);
    
    // Update referral code
    const referralCodeElements = document.querySelectorAll('#referral-code, #modal-referral-code');
    referralCodeElements.forEach(el => {
        if (el) el.textContent = userData.referralCode;
    });
    
    // Update referral links
    const referralLinkElements = document.querySelectorAll('#referral-link, #modal-referral-link');
    referralLinkElements.forEach(el => {
        if (el) el.value = `https://naturalsurplusinvestment.com/ref=${userData.referralCode}`;
    });
}

// Helper function to update element text if element exists
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

// Initialize dashboard components
function initializeDashboardComponents() {
    // Set up investment filter
    const investmentFilter = document.getElementById('investment-filter');
    if (investmentFilter) {
        investmentFilter.addEventListener('change', function() {
            filterInvestments(this.value);
        });
    }
    
    // Mark all notifications as read
    const markAllRead = document.querySelector('.mark-all-read');
    if (markAllRead) {
        markAllRead.addEventListener('click', function(e) {
            e.preventDefault();
            const unreadItems = document.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
            });
            
            // Update notification count
            const notificationCount = document.querySelector('.notification-count');
            if (notificationCount) notificationCount.textContent = '0';
        });
    }
}

// Filter investments based on status
function filterInvestments(status) {
    const rows = document.querySelectorAll('#investments-table tbody tr');
    
    rows.forEach(row => {
        const rowStatus = row.querySelector('.status-badge').textContent.toLowerCase();
        
        if (status === 'all' || rowStatus === status.toLowerCase()) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Logout buttons
    setupLogoutButtons();
    
    // Theme toggle
    setupThemeToggle();
    
    // Copy buttons
    setupCopyButtons();
    
    // Invite modal
    setupInviteModal();
    
    // Social share buttons
    setupSocialShareButtons();
}

// Setup logout buttons
function setupLogoutButtons() {
    const logoutButtons = document.querySelectorAll('#sidebar-logout-btn, #dropdown-logout-btn');
    
    logoutButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Show confirmation before logout
                if (confirm('Are you sure you want to log out?')) {
                    // Clear any tokens or user data
                    localStorage.removeItem('token');
                    localStorage.removeItem('userData');
                    
                    // Redirect to login page
                    window.location.href = 'login.html';
                }
            });
        }
    });
}

// Setup theme toggle
function setupThemeToggle() {
    const themeToggles = [
        document.getElementById('theme-switch'),
        document.getElementById('dropdown-theme-toggle')
    ];
    
    themeToggles.forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                
                const isDarkMode = document.body.classList.contains('dark-theme');
                const themeText = document.getElementById('theme-mode-text');
                
                if (isDarkMode) {
                    // Switch to light mode
                    document.body.classList.remove('dark-theme');
                    localStorage.setItem('darkMode', 'false');
                    if (themeText) themeText.textContent = 'Dark Mode';
                    
                    // Update theme switch if it's a checkbox
                    const themeSwitch = document.getElementById('theme-switch');
                    if (themeSwitch && themeSwitch.type === 'checkbox') {
                        themeSwitch.checked = false;
                    }
                } else {
                    // Switch to dark mode
                    document.body.classList.add('dark-theme');
                    localStorage.setItem('darkMode', 'true');
                    if (themeText) themeText.textContent = 'Light Mode';
                    
                    // Update theme switch if it's a checkbox
                    const themeSwitch = document.getElementById('theme-switch');
                    if (themeSwitch && themeSwitch.type === 'checkbox') {
                        themeSwitch.checked = true;
                    }
                }
            });
        }
    });
}

// Setup copy buttons
function setupCopyButtons() {
    // Copy referral code
    setupCopyButton('copy-code', 'referral-code');
    setupCopyButton('modal-copy-code', 'modal-referral-code');
    
    // Copy referral link
    setupCopyButton('copy-link', 'referral-link');
    setupCopyButton('modal-copy-link', 'modal-referral-link');
}

// Helper function to set up a copy button
function setupCopyButton(buttonId, targetId) {
    const button = document.getElementById(buttonId);
    const target = document.getElementById(targetId);
    
    if (button && target) {
        button.addEventListener('click', function() {
            // If target is an input field
            if (target.tagName === 'INPUT') {
                target.select();
                target.setSelectionRange(0, 99999); // For mobile devices
            } else {
                // Create a temporary textarea to copy text content
                const textarea = document.createElement('textarea');
                textarea.value = target.textContent;
                document.body.appendChild(textarea);
                textarea.select();
                textarea.setSelectionRange(0, 99999); // For mobile devices
            }
            
            // Copy to clipboard
            document.execCommand('copy');
            
            // If target is a temporary textarea, remove it
            if (target.tagName !== 'INPUT') {
                document.body.removeChild(document.querySelector('textarea'));
            }
            
            // Show success message
            showStatusMessage('Copied to clipboard!', 'success');
        });
    }
}

// Setup invite modal
function setupInviteModal() {
    const inviteButton = document.getElementById('invite-friends-btn');
    const inviteModal = document.getElementById('invite-modal');
    const closeInviteModalBtn = document.getElementById('close-invite-modal');
    
    if (inviteButton && inviteModal) {
        inviteButton.addEventListener('click', function() {
            inviteModal.style.display = 'flex';
        });
    }
    
    if (closeInviteModalBtn && inviteModal) {
        closeInviteModalBtn.addEventListener('click', function() {
            inviteModal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === inviteModal) {
                inviteModal.style.display = 'none';
            }
        });
    }
    
    // Email invite form
    const emailInviteForm = document.getElementById('email-invite-form');
    if (emailInviteForm) {
        emailInviteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('friend-email').value;
            const message = document.getElementById('invite-message').value;
            
            // In a real application, this would send the invitation via API
            console.log('Sending invitation to:', email, 'Message:', message);
            
            // Show success message
            showStatusMessage('Invitation sent successfully!', 'success');
            
            // Reset form
            emailInviteForm.reset();
            
            // Close modal
            if (inviteModal) inviteModal.style.display = 'none';
        });
    }
}

// Setup social share buttons
function setupSocialShareButtons() {
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!button.getAttribute('href') || button.getAttribute('href') === '#') {
                e.preventDefault();
                
                const platform = button.classList.contains('whatsapp') ? 'WhatsApp' :
                                button.classList.contains('facebook') ? 'Facebook' :
                                button.classList.contains('twitter') ? 'Twitter' :
                                button.classList.contains('telegram') ? 'Telegram' : 'Email';
                
                const referralLink = document.getElementById('referral-link').value;
                let shareUrl = '';
                
                switch(platform) {
                    case 'Facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
                        break;
                    case 'Twitter':
                        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Join Natural Surplus Investment and get amazing returns on your investment! Use my referral code: ' + userData.referralCode)}&url=${encodeURIComponent(referralLink)}`;
                        break;
                    case 'Telegram':
                        shareUrl = `https://telegram.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join Natural Surplus Investment and get amazing returns on your investment! Use my referral code: ' + userData.referralCode)}`;
                        break;
                    case 'Email':
                        shareUrl = `mailto:?subject=${encodeURIComponent('Join Natural Surplus Investment')}&body=${encodeURIComponent('Hi,\n\nI thought you might be interested in Natural Surplus Investment. You can get amazing returns on your investment!\n\nUse my referral code: ' + userData.referralCode + '\n\nSign up here: ' + referralLink + '\n\nRegards,\n' + userData.username)}`;
                        break;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank');
                }
            }
        });
    });
}

// Display a status message
function showStatusMessage(message, type = 'info') {
    const statusMessage = document.getElementById('status-message');
    
    if (!statusMessage) {
        // Create status message element if it doesn't exist
        const newStatusMessage = document.createElement('div');
        newStatusMessage.id = 'status-message';
        newStatusMessage.className = 'status-message';
        document.body.appendChild(newStatusMessage);
        statusMessage = newStatusMessage;
    }
    
    // Set message content and type
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    
    // Hide message after 3 seconds
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 3000);
}

// Helper function to format currency
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Helper function to format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Settings dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const settingsDropdown = document.querySelector('.sidebar-nav .dropdown');
    if (settingsDropdown) {
      const dropdownToggle = settingsDropdown.querySelector('.dropdown-toggle');
      
      dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        settingsDropdown.classList.toggle('active');
      });
      
      // Check if we're on a settings page to auto-expand the dropdown
      const currentPage = window.location.pathname;
      if (currentPage.includes('settings')) {
        settingsDropdown.classList.add('active');
        
        // Highlight the specific settings link
        if (currentPage.includes('account-settings')) {
          settingsDropdown.querySelector('a[href="account-settings.html"]').parentElement.classList.add('active');
        } else if (currentPage.includes('system-settings')) {
          settingsDropdown.querySelector('a[href="system-settings.html"]').parentElement.classList.add('active');
        }
      }
    }
  });

  // Add this to the top of your existing DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Settings dropdown toggle
    const settingsDropdown = document.querySelector('.sidebar-nav .dropdown');
    if (settingsDropdown) {
      const dropdownToggle = settingsDropdown.querySelector('.dropdown-toggle');
      
      // Toggle dropdown on click
      dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        settingsDropdown.classList.toggle('active');
      });
      
      // Auto-expand dropdown if on settings page
      const currentPath = window.location.pathname;
      if (currentPath.includes('settings')) {
        settingsDropdown.classList.add('active');
        
        // Highlight the correct settings link
        if (currentPath.includes('account-settings')) {
          const accountItem = settingsDropdown.querySelector('a[href="account-settings.html"]').parentElement;
          accountItem.classList.add('active');
        } else if (currentPath.includes('system-settings')) {
          const systemItem = settingsDropdown.querySelector('a[href="system-settings.html"]').parentElement;
          systemItem.classList.add('active');
        }
      }
    }
  });

  // Settings dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const settingsDropdown = document.querySelector('.sidebar-nav .dropdown');
    if (settingsDropdown) {
      const dropdownToggle = settingsDropdown.querySelector('.dropdown-toggle');
      
      dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        settingsDropdown.classList.toggle('active');
      });
      
      // Check if we're on a settings page to auto-expand the dropdown
      const currentPage = window.location.pathname;
      if (currentPage.includes('settings')) {
        settingsDropdown.classList.add('active');
        
        // Highlight the specific settings link
        if (currentPage.includes('account-settings')) {
          settingsDropdown.querySelector('a[href="account-settings.html"]').parentElement.classList.add('active');
        } else if (currentPage.includes('system-settings')) {
          settingsDropdown.querySelector('a[href="system-settings.html"]').parentElement.classList.add('active');
        }
      }
    }
});

// Wait for the document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
    // Select the dropdown container, dropdown toggle, and the dropdown menu itself
    const settingsDropdown = document.querySelector('.sidebar-nav .dropdown');
    const dropdownToggle = settingsDropdown.querySelector('.dropdown-toggle');
    const dropdownMenu = settingsDropdown.querySelector('.dropdown-menu');

    // Add event listener for the dropdown toggle button
    dropdownToggle.addEventListener('click', function (e) {
        e.preventDefault();  // Prevent default link behavior
        // Toggle the 'show' class on the dropdown menu to display or hide it
        dropdownMenu.classList.toggle('show');
    });

    // Close the dropdown if the user clicks anywhere outside the dropdown
    document.addEventListener('click', function (e) {
        if (!settingsDropdown.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
});
