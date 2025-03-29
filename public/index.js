document.addEventListener('DOMContentLoaded', function() {
    // Add the CSS for dropdown
    addDropdownStyles();

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }

    console.log("User Token:", token);  // Debugging: Check the token

    // Load user data and update UI
    loadUserData();

    // Setup profile dropdown functionality
    setupProfileDropdown();
    
    // Setup quick actions
    setupQuickActions();

    // Logout functionality (sidebar button)
const sidebarLogoutBtn = document.getElementById('sidebar-logout-btn');
if (sidebarLogoutBtn) {
    sidebarLogoutBtn.addEventListener('click', handleLogout);
}

// Fix for settings dropdown functionality
const settingsDropdowns = document.querySelectorAll('.sidebar-nav .dropdown');
if (settingsDropdowns.length > 0) {
    settingsDropdowns.forEach(dropdown => {
        const toggleBtn = dropdown.querySelector('.dropdown-toggle');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('active');
                
                // Toggle icon direction
                const icon = this.querySelector('.dropdown-icon');
                if (icon) {
                    if (dropdown.classList.contains('active')) {
                        icon.classList.remove('fa-angle-right');
                        icon.classList.add('fa-angle-down');
                    } else {
                        icon.classList.remove('fa-angle-down');
                        icon.classList.add('fa-angle-right');
                    }
                }
            });
        }
    });
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function(e) {
        settingsDropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
                
                // Reset icon
                const icon = dropdown.querySelector('.dropdown-icon');
                if (icon) {
                    icon.classList.remove('fa-angle-down');
                    icon.classList.add('fa-angle-right');
                }
            }
        });
    });
}

    // Logout functionality (dropdown button)
    const dropdownLogoutBtn = document.getElementById('dropdown-logout-btn');
    if (dropdownLogoutBtn) {
        dropdownLogoutBtn.addEventListener('click', handleLogout);
    }

    // FAQ accordions
    setupFAQAccordions();

    // Fetch featured investment plans for homepage
    fetchFeaturedInvestmentPlans();
    
    // Theme toggle
    setupThemeToggle();
    
    // Setup mobile menu toggle
    setupMobileMenu();
    
    // Initialize hero section counters
    initializeCounters();
    
    // Setup social sharing
    setupSocialSharing();
});

// Load user data and update UI elements
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;
    
    // Update username
    const usernameElements = document.querySelectorAll('#username, #dropdown-username');
    usernameElements.forEach(element => {
        if (element) element.textContent = userData.name || userData.username;
    });
    
    // Update email
    const emailElement = document.querySelector('.dropdown-email');
    if (emailElement && userData.email) {
        emailElement.textContent = userData.email;
    }
    
    // Update balance
    const balanceElements = document.querySelectorAll('#dropdown-balance, #wallet-balance, #available-balance');
    balanceElements.forEach(element => {
        if (element) element.textContent = formatCurrency(userData.balance || 0);
    });
    
    // Update investment overview statistics
    updateInvestmentStats(userData);
}

// Update investment statistics in the user overview section
function updateInvestmentStats(userData) {
    // These would ideally come from the backend
    // For now, using placeholder data or whatever is available in userData
    const totalInvested = document.getElementById('total-invested');
    const totalEarnings = document.getElementById('total-earnings');
    const referralEarnings = document.getElementById('referral-earnings');
    
    if (totalInvested) {
        totalInvested.textContent = formatCurrency(userData.totalInvested || 50000);
    }
    
    if (totalEarnings) {
        totalEarnings.textContent = formatCurrency(userData.totalEarnings || 8750);
    }
    
    if (referralEarnings) {
        referralEarnings.textContent = formatCurrency(userData.referralEarnings || 2500);
    }
}

// Add CSS styles for dropdown
function addDropdownStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .profile-dropdown {
            width: 280px;
            position: absolute;
            top: 60px;
            right: 0;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
            z-index: 1000;
        }

        .profile-dropdown.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .dropdown-header {
            padding: 15px;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
        }

        .dropdown-header img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
        }

        .dropdown-header div {
            display: flex;
            flex-direction: column;
        }

        .dropdown-email {
            font-size: 12px;
            color: var(--text-light);
        }

        .dropdown-menu {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .dropdown-menu li a {
            padding: 12px 15px;
            display: block;
            color: var(--text-color);
            text-decoration: none;
            transition: background-color 0.2s ease;
        }

        .dropdown-menu li a:hover {
            background-color: #f5f5f5;
        }

        .dropdown-menu li a i {
            width: 20px;
            margin-right: 8px;
            color: var(--primary-color);
        }

        .dropdown-divider {
            height: 1px;
            background-color: #eee;
            margin: 5px 0;
        }

        .profile-info {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 8px;
            transition: background-color 0.2s;
        }

        .profile-info:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }

        .profile-arrow {
            transition: transform 0.3s;
        }

        .profile-info.active .profile-arrow {
            transform: rotate(180deg);
        }
        
        /* Quick actions row */
        .dropdown-quick-actions {
            display: flex;
            justify-content: space-between;
            padding: 0 15px 15px;
        }

        .quick-action-btn {
            background-color: #f5f5f5;
            border: none;
            border-radius: 8px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            flex: 1;
            margin: 0 5px;
            cursor: pointer;
            transition: background-color 0.2s;
            text-decoration: none;
        }

        .quick-action-btn:hover {
            background-color: #e0e0e0;
        }

        .quick-action-btn i {
            font-size: 16px;
            color: var(--primary-color);
        }

        .quick-action-btn span {
            font-size: 12px;
            color: var(--text-color);
            font-weight: 500;
        }
        
        /* Balance styles for dropdown */
        .dropdown-balance {
            background-color: rgba(22, 160, 133, 0.1);
            padding: 12px 15px;
            margin: 0 15px 10px;
            border-radius: 8px;
            text-align: center;
        }

        .dropdown-balance span {
            font-size: 12px;
            color: var(--text-light);
        }

        .dropdown-balance h3 {
            font-size: 18px;
            color: var(--primary-color);
            margin-top: 5px;
        }

        /* Notifications dropdown */
        .notifications-dropdown {
            width: 320px;
            position: absolute;
            top: 60px;
            right: 80px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
            z-index: 1000;
        }

        .notifications-dropdown.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        /* New styles for home page sections */
        .hero-section {
            background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('images/hero-bg.jpg');
            background-size: cover;
            background-position: center;
            color: white;
            padding: 60px 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
            position: relative;
        }

        .hero-content {
            max-width: 700px;
            margin: 0 auto 40px;
        }

        .hero-content h1 {
            font-size: 2.5rem;
            margin-bottom: 20px;
            font-weight: 700;
        }

        .hero-content p {
            font-size: 1.2rem;
            margin-bottom: 30px;
            opacity: 0.9;
        }

        .hero-cta {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
        }

        .hero-stats {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
        }

        .stat-card {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 15px 25px;
            display: flex;
            align-items: center;
            backdrop-filter: blur(10px);
        }

        .stat-card i {
            font-size: 24px;
            margin-right: 15px;
            color: var(--accent-color);
        }

        .stat-info h3 {
            font-size: 1.5rem;
            margin: 0;
            font-weight: 700;
        }

        .stat-info p {
            margin: 5px 0 0;
            opacity: 0.8;
        }

        /* User overview section */
        .user-overview {
            background-color: var(--background-light);
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 30px;
        }

        .user-overview h2 {
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 1.5rem;
        }

        .overview-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }

        .overview-card {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
        }

        .card-icon {
            width: 50px;
            height: 50px;
            background-color: rgba(22, 160, 133, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
        }

        .card-icon i {
            font-size: 20px;
            color: var(--primary-color);
        }

        .card-info h3 {
            font-size: 0.9rem;
            margin: 0 0 5px;
            color: var(--text-light);
        }

        .card-info p {
            font-size: 1.3rem;
            font-weight: 700;
            margin: 0;
            color: var(--text-color);
        }

        .overview-actions {
            display: flex;
            gap: 15px;
            justify-content: flex-end;
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
    
    // Setup notifications dropdown
    const notificationsTrigger = document.getElementById('notifications-trigger');
    const notificationsDropdown = document.getElementById('notifications-dropdown');
    
    if (notificationsTrigger && notificationsDropdown) {
        notificationsTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationsDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', function(e) {
            if (!notificationsDropdown.contains(e.target) && !notificationsTrigger.contains(e.target)) {
                notificationsDropdown.classList.remove('show');
            }
        });
    }
}

// Setup quick action buttons in dropdown
function setupQuickActions() {
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    if (quickActionBtns.length > 0) {
        quickActionBtns.forEach(btn => {
            if (!btn.getAttribute('href')) {
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
            }
        });
    }
}

// Setup FAQ accordions
function setupFAQAccordions() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        question.addEventListener("click", function() {
            // Toggle active state
            item.classList.toggle("active");
            
            // Update icon
            const icon = question.querySelector("i");
            if (item.classList.contains("active")) {
                icon.classList.remove("fa-chevron-down");
                icon.classList.add("fa-chevron-up");
            } else {
                icon.classList.remove("fa-chevron-up");
                icon.classList.add("fa-chevron-down");
            }
        });
    });
}

// Fetch featured investment plans for the homepage
function fetchFeaturedInvestmentPlans() {
    // Featured plans container on the homepage
    const featuredPlansContainer = document.querySelector('.featured-plans-container');
    if (!featuredPlansContainer) return; // Not on the homepage
    
    fetch('http://localhost:4000/investment-plans', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch investment plans');
        }
        return response.json();
    })
    .then(plans => {
        console.log("Plans fetched for homepage:", plans);
        updateFeaturedPlans(plans);
    })
    .catch(error => {
        console.error('Error:', error);
        // Keep the static featured plans if API fails
    });
}

// Update the featured plans section with real data
function updateFeaturedPlans(plans) {
    if (!Array.isArray(plans) || plans.length === 0) return;
    
    const featuredPlansContainer = document.querySelector('.featured-plans-container');
    if (!featuredPlansContainer) return;
    
    // Choose three plans to display (e.g., first, middle, last)
    let plansToShow = [];
    
    if (plans.length >= 3) {
        // Show a small, medium, and large plan
        plansToShow = [
            plans.find(p => p.amount <= 1000) || plans[0],
            plans.find(p => p.amount > 1000 && p.amount <= 10000) || plans[Math.floor(plans.length / 2)],
            plans.find(p => p.amount > 10000) || plans[plans.length - 1]
        ];
    } else {
        plansToShow = plans.slice(0, 3); // Show up to 3 plans
    }
    
    // Clear existing content
    featuredPlansContainer.innerHTML = '';
    
    // Add the plans
    plansToShow.forEach((plan, index) => {
        // Calculate total return
        const totalReturn = plan.dailyReturn * plan.duration;
        const roi = ((totalReturn / plan.amount) * 100).toFixed(0);
        
        // Generate icon based on plan size
        let iconClass = 'fas fa-seedling';
        if (plan.amount >= 5000 && plan.amount < 15000) {
            iconClass = 'fas fa-tree';
        } else if (plan.amount >= 15000) {
            iconClass = 'fas fa-gem';
        }
        
        // Create plan card
        const planCard = document.createElement('div');
        planCard.className = 'plan-card';
        
        // Add featured class to middle plan
        if (index === 1) {
            planCard.classList.add('featured');
            planCard.innerHTML = '<div class="plan-tag">Most Popular</div>';
        } else if (index === 2) {
            planCard.innerHTML = '<div class="plan-tag">Best Value</div>';
        }
        
        planCard.innerHTML += `
            <div class="plan-header">
                <div class="plan-icon">
                    <i class="${iconClass}"></i>
                </div>
                <h3>${plan.name || getPlanName(plan.amount)}</h3>
                <div class="plan-price">
                    <span>Ksh ${formatCurrency(plan.amount)}</span>
                </div>
            </div>
            <div class="plan-features">
                <div class="plan-feature">
                    <i class="fas fa-coins"></i>
                    <div>
                        <h4>Daily Return</h4>
                        <p>Ksh ${formatCurrency(plan.dailyReturn)}</p>
                    </div>
                </div>
                <div class="plan-feature">
                    <i class="fas fa-calendar-alt"></i>
                    <div>
                        <h4>Duration</h4>
                        <p>${plan.duration} days</p>
                    </div>
                </div>
                <div class="plan-feature">
                    <i class="fas fa-hand-holding-usd"></i>
                    <div>
                        <h4>Total Return</h4>
                        <p>Ksh ${formatCurrency(totalReturn)} (${roi}%)</p>
                    </div>
                </div>
            </div>
            <a href="investment-plans.html" class="invest-btn" data-plan-id="${plan._id}">Invest Now</a>
        `;
        
        featuredPlansContainer.appendChild(planCard);
    });
}

// Logout handler function
function handleLogout(e) {
    e.preventDefault();
    console.log("Logging out...");
    // Clear any stored data
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    // Redirect to login page
    window.location.href = "login.html";
}

// Helper function to get a nice plan name based on amount
function getPlanName(amount) {
    if (amount <= 600) return "Starter";
    if (amount <= 1000) return "Basic";
    if (amount <= 2000) return "Bronze";
    if (amount <= 5000) return "Silver";
    if (amount <= 10000) return "Gold";
    if (amount <= 20000) return "Platinum";
    if (amount <= 30000) return "Diamond";
    if (amount <= 40000) return "Elite";
    return "VIP";
}

// Helper function to format currency
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Setup dark/light theme toggle
function setupThemeToggle() {
    const themeSwitch = document.getElementById('theme-switch');
    const dropdownThemeToggle = document.getElementById('dropdown-theme-toggle');
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
    
    // Toggle theme on dropdown item click
    if (dropdownThemeToggle) {
        dropdownThemeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleTheme();
        });
    }
}

// Theme toggle function
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-theme');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update theme switch
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) themeSwitch.checked = isDarkMode;
    
    // Update theme text
    const themeText = document.getElementById('theme-mode-text');
    if (themeText) themeText.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
}

// Setup mobile menu toggle
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show-mobile');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (sidebar.classList.contains('show-mobile') && 
                !sidebar.contains(e.target) && 
                e.target !== mobileMenuToggle) {
                sidebar.classList.remove('show-mobile');
            }
        });
    }
}

// Initialize counters with animation
function initializeCounters() {
    const statElements = document.querySelectorAll('.stat-info h3');
    
    if (statElements.length === 0) return;
    
    statElements.forEach(element => {
        const targetValue = element.textContent;
        element.textContent = '0';
        
        // Extract the numeric part and the text part
        const matches = targetValue.match(/^([^\d]*)([\d,]+)(.*)$/);
        if (!matches) return;
        
        const prefix = matches[1] || '';
        const targetNumber = parseInt(matches[2].replace(/,/g, ''));
        const suffix = matches[3] || '';
        
        // Animate the counter
        let currentNumber = 0;
        const duration = 2000; // 2 seconds
        const steps = 50;
        const increment = targetNumber / steps;
        const stepTime = duration / steps;
        
        const counterAnimation = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                clearInterval(counterAnimation);
            }
            
            element.textContent = prefix + formatCurrency(Math.floor(currentNumber)) + suffix;
        }, stepTime);
    });
}

// Setup social sharing functionality
function setupSocialSharing() {
    // This is for the referral section on the homepage
    const referralLink = document.getElementById('referral-link');
    if (!referralLink) return;
    
    // Get user's referral code from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.referralCode) {
        referralLink.value = `https://naturalsurplus.investments/ref/${userData.referralCode}`;
    }
    
    // Setup copy to clipboard
    const copyBtn = document.getElementById('copy-referral-link');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            referralLink.select();
            document.execCommand('copy');
            
            // Show copied message
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        });
    }
    
    // Setup social share buttons
    const shareButtons = {
        whatsapp: document.getElementById('share-whatsapp'),
        facebook: document.getElementById('share-facebook'),
        twitter: document.getElementById('share-twitter')
    };
    
    if (shareButtons.whatsapp) {
        shareButtons.whatsapp.addEventListener('click', function(e) {
            e.preventDefault();
            const text = `Join Natural Surplus Investment and earn high daily returns! Use my referral link: ${referralLink.value}`;
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        });
    }
    
    if (shareButtons.facebook) {
        shareButtons.facebook.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink.value)}`, '_blank', 'width=600,height=400');
        });
    }
    
    if (shareButtons.twitter) {
        shareButtons.twitter.addEventListener('click', function(e) {
            e.preventDefault();
            const text = `Earn daily returns with Natural Surplus Investment! Use my referral link:`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink.value)}`, '_blank', 'width=600,height=400');
        });
    }
}

// Ensure dropdown functionality works on all pages
document.addEventListener('DOMContentLoaded', function() {
    // Settings dropdown functionality
    const settingsDropdowns = document.querySelectorAll('.sidebar-nav .dropdown');
    
    settingsDropdowns.forEach(dropdown => {
        const toggleBtn = dropdown.querySelector('.dropdown-toggle');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Toggle icon direction
                const icon = this.querySelector('.dropdown-icon');
                if (icon) {
                    if (dropdown.classList.contains('active')) {
                        icon.classList.remove('fa-angle-right');
                        icon.classList.add('fa-angle-down');
                    } else {
                        icon.classList.remove('fa-angle-down');
                        icon.classList.add('fa-angle-right');
                    }
                }
            });
        }
    });
});

// Ensure dropdown works across all pages - execute immediately
(function() {
    // Settings dropdown functionality
    const settingsDropdowns = document.querySelectorAll('.sidebar-nav .dropdown');
    
    settingsDropdowns.forEach(dropdown => {
        const toggleBtn = dropdown.querySelector('.dropdown-toggle');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('active');
                
                // Toggle icon direction
                const icon = this.querySelector('.dropdown-icon');
                if (icon) {
                    if (dropdown.classList.contains('active')) {
                        icon.classList.remove('fa-angle-right');
                        icon.classList.add('fa-angle-down');
                    } else {
                        icon.classList.remove('fa-angle-down');
                        icon.classList.add('fa-angle-right');
                    }
                }
            });
        }
    });
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function(e) {
        settingsDropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
                
                // Reset icon
                const icon = dropdown.querySelector('.dropdown-icon');
                if (icon) {
                    icon.classList.remove('fa-angle-down');
                    icon.classList.add('fa-angle-right');
                }
            }
        });
    });
})();