document.addEventListener('DOMContentLoaded', function() {
    // Initialize page
    initializePage();
    
    // Setup UI interactions
    setupEventListeners();
    
    // Load referrals data
    loadReferralsData();
});

// Initialize page components
function initializePage() {
    // Add the CSS for dropdowns
    addDropdownStyles();
    
    // Load user data
    loadUserData();
    
    // Setup navigation and dropdowns
    setupNavigationAndDropdowns();
    
    // Setup theme toggle
    setupThemeToggle();
    
    // Setup logout functionality
    setupLogout();
}

// Load user data from localStorage or API
function loadUserData() {
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Get user data from localStorage
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            // Update username in the UI
            updateUsername(userData.name || userData.username);
            
            // Update referral code
            updateReferralCode(userData.referralCode || 'DAD123');
            
            // Update wallet balance
            updateWalletBalance(userData.balance || 0);
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Update username in the UI
function updateUsername(username) {
    const usernameElements = document.querySelectorAll('#username, #dropdown-username');
    usernameElements.forEach(element => {
        if (element) {
            element.textContent = username;
        }
    });
    
    // Update welcome name if it exists
    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName) {
        welcomeName.textContent = username.split(' ')[0]; // First name only
    }
}

// Update referral code in UI
function updateReferralCode(code) {
    const referralCodeElements = document.querySelectorAll('#referral-code, #modal-referral-code');
    referralCodeElements.forEach(element => {
        if (element) {
            element.textContent = code;
        }
    });
    
    // Update referral links
    const referralLinkElements = document.querySelectorAll('#referral-link, #modal-referral-link');
    const baseUrl = 'https://naturalsurplus.investments/ref=';
    referralLinkElements.forEach(element => {
        if (element) {
            element.value = baseUrl + code;
        }
    });
}

// Update wallet balance in UI
function updateWalletBalance(balance) {
    const balanceElements = document.querySelectorAll('#dropdown-balance, #wallet-balance');
    const formattedBalance = formatCurrency(balance);
    balanceElements.forEach(element => {
        if (element) {
            element.textContent = formattedBalance;
        }
    });
}

// Setup event listeners for buttons and interactions
function setupEventListeners() {
    // Copy referral code and link buttons
    const copyCodeBtns = document.querySelectorAll('#copy-code, #modal-copy-code');
    copyCodeBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', copyReferralCode);
        }
    });
    
    const copyLinkBtns = document.querySelectorAll('#copy-link, #modal-copy-link');
    copyLinkBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', copyReferralLink);
        }
    });
    
    // Social share buttons
    setupSocialSharing();
    
    // Invite friends modal
    const inviteBtns = document.querySelectorAll('#invite-friends-btn, #empty-invite-btn');
    inviteBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', openInviteModal);
        }
    });
    
    // Close invite modal
    const closeModalBtn = document.getElementById('close-invite-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeInviteModal);
    }
    
    // Email invitation form
    const emailForm = document.getElementById('email-invite-form');
    if (emailForm) {
        emailForm.addEventListener('submit', sendEmailInvitation);
    }
    
    // Referral filter
    const referralFilter = document.getElementById('referral-filter');
    if (referralFilter) {
        referralFilter.addEventListener('change', filterReferrals);
    }
    
    // Click outside modal to close
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('invite-modal');
        if (event.target === modal) {
            closeInviteModal();
        }
    });
}

// Setup navigation and dropdowns
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
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (profileDropdown && !profileDropdown.contains(e.target) && !profileTrigger.contains(e.target)) {
            profileDropdown.classList.remove('show');
            profileTrigger.classList.remove('active');
        }
        
        if (notificationsDropdown && !notificationsDropdown.contains(e.target) && !notificationsTrigger.contains(e.target)) {
            notificationsDropdown.classList.remove('show');
        }
    });
    
    // Settings dropdown functionality
    const settingsDropdown = document.querySelector('.sidebar-nav .dropdown');
    if (settingsDropdown) {
        const settingsToggle = settingsDropdown.querySelector('.dropdown-toggle');
        
        // Toggle dropdown on click
        settingsToggle.addEventListener('click', function(e) {
            e.preventDefault();
            settingsDropdown.classList.toggle('active');
            
            // Toggle the direction of the arrow icon
            const arrow = this.querySelector('.dropdown-icon');
            if (arrow) {
                if (settingsDropdown.classList.contains('active')) {
                    arrow.classList.remove('fa-angle-right');
                    arrow.classList.add('fa-angle-down');
                } else {
                    arrow.classList.remove('fa-angle-down');
                    arrow.classList.add('fa-angle-right');
                }
            }
        });
        
        // Auto-expand the dropdown if on a settings page
        const currentPath = window.location.pathname;
        if (currentPath.includes('account-settings') || currentPath.includes('system-settings')) {
            settingsDropdown.classList.add('active');
            
            // Update arrow direction
            const arrow = settingsToggle.querySelector('.dropdown-icon');
            if (arrow) {
                arrow.classList.remove('fa-angle-right');
                arrow.classList.add('fa-angle-down');
            }
        }
    }
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show-mobile');
        });
    }
}

// Setup theme toggle
function setupThemeToggle() {
    const themeSwitch = document.getElementById('theme-switch');
    const themeToggleDropdown = document.getElementById('dropdown-theme-toggle');
    const themeText = document.getElementById('theme-mode-text');
    
    // Initialize theme
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-theme', isDarkMode);
    
    if (themeSwitch) themeSwitch.checked = isDarkMode;
    if (themeText) themeText.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
    
    // Toggle theme on switch change
    if (themeSwitch) {
        themeSwitch.addEventListener('change', toggleTheme);
    }
    
    // Toggle theme from dropdown
    if (themeToggleDropdown) {
        themeToggleDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            toggleTheme();
        });
    }
}

// Toggle theme function
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-theme');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update text and switch
    const themeSwitch = document.getElementById('theme-switch');
    const themeText = document.getElementById('theme-mode-text');
    
    if (themeSwitch) themeSwitch.checked = isDarkMode;
    if (themeText) themeText.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
}

// Setup logout functionality
function setupLogout() {
    const logoutBtns = document.querySelectorAll('#sidebar-logout-btn, #dropdown-logout-btn');
    logoutBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', handleLogout);
        }
    });
}

// Logout handler
function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('Are you sure you want to log out?')) {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        
        // Redirect to login
        window.location.href = 'login.html';
    }
}

// Copy referral code
function copyReferralCode() {
    const referralCode = document.getElementById('referral-code').textContent;
    copyToClipboard(referralCode);
    showStatusMessage('Referral code copied to clipboard!', 'success');
}

// Copy referral link
function copyReferralLink() {
    const referralLinkInput = document.getElementById('referral-link');
    referralLinkInput.select();
    document.execCommand('copy');
    showStatusMessage('Referral link copied to clipboard!', 'success');
}

// Setup social sharing
function setupSocialSharing() {
    // Main page share buttons
    setupShareButton('share-whatsapp', 'whatsapp');
    setupShareButton('share-facebook', 'facebook');
    setupShareButton('share-twitter', 'twitter');
    setupShareButton('share-telegram', 'telegram');
    setupShareButton('share-email', 'email');
    
    // Modal share buttons
    setupShareButton('modal-share-whatsapp', 'whatsapp');
    setupShareButton('modal-share-facebook', 'facebook');
    setupShareButton('modal-share-twitter', 'twitter');
    setupShareButton('modal-share-telegram', 'telegram');
    setupShareButton('modal-share-email', 'email');
}

// Setup a specific share button
function setupShareButton(buttonId, platform) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            shareReferral(platform);
        });
    }
}

// Share referral via specified platform
function shareReferral(platform) {
    const referralLink = document.getElementById('referral-link').value;
    const referralCode = document.getElementById('referral-code').textContent;
    const message = `Join Natural Surplus Investment and earn daily returns on your investments! Use my referral code: ${referralCode} or sign up with this link: ${referralLink}`;
    
    let shareUrl = '';
    
    switch(platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent('Join Natural Surplus Investment!')}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
            break;
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join Natural Surplus Investment!')}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${encodeURIComponent('Join Natural Surplus Investment')}&body=${encodeURIComponent(message)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank');
    }
}

// Open invite modal
function openInviteModal() {
    const modal = document.getElementById('invite-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Close invite modal
function closeInviteModal() {
    const modal = document.getElementById('invite-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Send email invitation
function sendEmailInvitation(e) {
    e.preventDefault();
    
    const email = document.getElementById('friend-email').value;
    const message = document.getElementById('invite-message').value;
    
    if (!email) {
        showStatusMessage('Please enter your friend\'s email', 'error');
        return;
    }
    
    // In a real application, this would make an API call
    // For now, we'll simulate a successful invitation
    
    showStatusMessage(`Invitation sent to ${email}!`, 'success');
    
    // Reset form
    document.getElementById('friend-email').value = '';
    document.getElementById('invite-message').value = '';
    
    // Close modal after short delay
    setTimeout(closeInviteModal, 1500);
}

// Load referrals data
function loadReferralsData() {
    // In a real application, this would fetch data from an API
    // For now, we'll use dummy data
    
    // Update statistics
    updateReferralStats({
        totalReferrals: 5,
        activeReferrals: 3,
        totalEarnings: 2500,
        monthlyEarnings: 750
    });
    
    // Load referrals list
    const referrals = [
        {
            id: 1,
            name: 'John Doe',
            dateJoined: '2025-03-10',
            level: 1,
            totalInvested: 20000,
            commission: 3600,
            status: 'active'
        },
        {
            id: 2,
            name: 'Jane Smith',
            dateJoined: '2025-03-05',
            level: 1,
            totalInvested: 15000,
            commission: 2700,
            status: 'active'
        },
        {
            id: 3,
            name: 'Bob Johnson',
            dateJoined: '2025-03-01',
            level: 1,
            totalInvested: 0,
            commission: 0,
            status: 'inactive'
        },
        {
            id: 4,
            name: 'Alice Brown',
            dateJoined: '2025-02-20',
            level: 2,
            totalInvested: 10000,
            commission: 500,
            status: 'active'
        },
        {
            id: 5,
            name: 'Sam Wilson',
            dateJoined: '2025-02-15',
            level: 3,
            totalInvested: 5000,
            commission: 100,
            status: 'inactive'
        }
    ];
    
    renderReferralsList(referrals);
}

// Update referral statistics
function updateReferralStats(stats) {
    document.getElementById('total-referrals-count').textContent = stats.totalReferrals;
    document.getElementById('active-referrals-count').textContent = stats.activeReferrals;
    document.getElementById('total-earnings').textContent = `Ksh ${formatCurrency(stats.totalEarnings)}`;
    document.getElementById('monthly-earnings').textContent = `Ksh ${formatCurrency(stats.monthlyEarnings)}`;
}

// Render referrals list
function renderReferralsList(referrals) {
    const referralsList = document.getElementById('referrals-list');
    const noReferrals = document.getElementById('no-referrals');
    
    if (!referrals || referrals.length === 0) {
        if (referralsList) referralsList.innerHTML = '';
        if (noReferrals) noReferrals.style.display = 'block';
        document.getElementById('referrals-table').style.display = 'none';
        return;
    }
    
    // Hide empty state, show table
    if (noReferrals) noReferrals.style.display = 'none';
    document.getElementById('referrals-table').style.display = 'table';
    
    // Create table rows
    let html = '';
    
    referrals.forEach(referral => {
        const dateJoined = new Date(referral.dateJoined);
        const formattedDate = dateJoined.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        let levelLabel = 'Direct';
        if (referral.level === 2) levelLabel = 'Level 2';
        if (referral.level === 3) levelLabel = 'Level 3';
        
        html += `
            <tr data-status="${referral.status}">
                <td>${referral.name}</td>
                <td>${formattedDate}</td>
                <td>${levelLabel}</td>
                <td>Ksh ${formatCurrency(referral.totalInvested)}</td>
                <td>Ksh ${formatCurrency(referral.commission)}</td>
                <td><span class="status-badge ${referral.status}">${referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}</span></td>
            </tr>
        `;
    });
    
    if (referralsList) {
        referralsList.innerHTML = html;
    }
}

// Filter referrals
function filterReferrals() {
    const filter = document.getElementById('referral-filter').value;
    const rows = document.querySelectorAll('#referrals-list tr');
    
    rows.forEach(row => {
        const status = row.getAttribute('data-status');
        if (filter === 'all' || status === filter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Utility function to copy text to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// Show status message
function showStatusMessage(message, type = 'info') {
    const statusMessage = document.getElementById('status-message');
    
    if (!statusMessage) return;
    
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type} show`;
    
    setTimeout(() => {
        statusMessage.className = 'status-message';
    }, 3000);
}

// Format currency
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Add CSS for dropdown styles
function addDropdownStyles() {
    // No need to add CSS directly here since it should be in styles.css
    // This function is kept for compatibility with other pages
}