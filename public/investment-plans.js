document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const investmentPlansContainer = document.getElementById('investment-plans-container');
    const investmentModal = document.getElementById('investment-modal');
    const closeInvestmentModal = document.getElementById('close-investment-modal');
    const cancelInvestment = document.getElementById('cancel-investment');
    const planNameSpan = document.getElementById('plan-name');
    const planIdInput = document.getElementById('plan-id');
    const planDailyReturnEl = document.getElementById('plan-daily-return');
    const planDurationEl = document.getElementById('plan-duration');
    const planTotalReturnEl = document.getElementById('plan-total-return');
    const investmentForm = document.getElementById('investment-form');
    const investmentAmount = document.getElementById('investment-amount');
    const summaryInvestmentEl = document.getElementById('summary-investment');
    const summaryDailyReturn = document.getElementById('summary-daily-return');
    const summaryDuration = document.getElementById('summary-duration');
    const summaryTotalReturn = document.getElementById('summary-total-return');
    const walletBalance = document.getElementById('wallet-balance');
    const dropdownBalance = document.getElementById('dropdown-balance');
    const statusMessage = document.getElementById('status-message');
    const copyReferralLinkBtn = document.getElementById('copy-referral-link');
    
    // Initialize page
    initializePage();
    
    // Load investment plans from API
    loadInvestmentPlans();
    
    // Initialize Navigation and Dropdowns
    setupNavigationAndDropdowns();
    
    // Setup event listeners
    setupEventListeners();
    
    // Functions
    function initializePage() {
        // Get user data - in a real app this would come from an API
        // For demo purposes, we're using hardcoded data
        const userBalance = 15000;
        
        // Update balance displays
        if (walletBalance) walletBalance.textContent = formatCurrency(userBalance);
        if (dropdownBalance) dropdownBalance.textContent = formatCurrency(userBalance);
        
        // Initialize theme from local storage
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
        
        // Setup FAQ toggles
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                item.classList.toggle('active');
                const icon = question.querySelector('i');
                if (item.classList.contains('active')) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                } else {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            });
        });
        
        // Setup referral link copy
        if (copyReferralLinkBtn) {
            copyReferralLinkBtn.addEventListener('click', copyReferralLink);
        }
        
        // Setup social sharing buttons
        setupSocialSharing();
    }
    
    // Load investment plans from API
    function loadInvestmentPlans() {
        // Show loading spinner
        investmentPlansContainer.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading investment plans...</p>
            </div>
        `;
        
        // Fetch plans from API
        fetch('http://localhost:4000/investment-plans')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch investment plans');
                }
                return response.json();
            })
            .then(plans => {
                // Clear loading spinner
                investmentPlansContainer.innerHTML = '';
                
                // Render each plan
                plans.forEach(plan => {
                    const planCard = createPlanCard(plan);
                    investmentPlansContainer.appendChild(planCard);
                });
                
                // Add event listeners to invest buttons
                document.querySelectorAll('.invest-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const planId = this.getAttribute('data-plan-id');
                        const plan = plans.find(p => p._id === planId);
                        if (plan) {
                            openInvestmentModal(plan);
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Error loading plans:', error);
                investmentPlansContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Failed to load investment plans. Please try again later.</p>
                        <button class="btn-primary" onclick="loadInvestmentPlans()">Retry</button>
                    </div>
                `;
            });
    }
    
    // Create a plan card element
    function createPlanCard(plan) {
        const planCard = document.createElement('div');
        planCard.className = 'plan-card';
        
        // Add featured tag for select plans
        if (plan.amount >= 10000 && plan.amount < 30000) {
            planCard.classList.add('featured');
            planCard.innerHTML += `<div class="plan-tag">Most Popular</div>`;
        } else if (plan.amount >= 30000) {
            planCard.innerHTML += `<div class="plan-tag">Best Value</div>`;
        }
        
        // Calculate the total return
        const totalReturn = plan.dailyReturn * plan.duration;
        const roi = ((totalReturn / plan.amount) * 100).toFixed(0);
        
        // Generate appropriate icon based on plan amount
        let iconClass = 'fas fa-seedling';
        if (plan.amount >= 5000 && plan.amount < 15000) {
            iconClass = 'fas fa-leaf';
        } else if (plan.amount >= 15000 && plan.amount < 30000) {
            iconClass = 'fas fa-tree';
        } else if (plan.amount >= 30000) {
            iconClass = 'fas fa-gem';
        }
        
        planCard.innerHTML += `
            <div class="plan-header">
                <div class="plan-icon">
                    <i class="${iconClass}"></i>
                </div>
                <h2>${plan.name || 'Investment Plan'}</h2>
                <div class="plan-price">
                    <span>Ksh ${formatCurrency(plan.amount)}</span>
                </div>
            </div>
            <div class="plan-features">
                <div class="plan-feature">
                    <i class="fas fa-coins"></i>
                    <div>
                        <h3>Daily Return</h3>
                        <p>Ksh ${formatCurrency(plan.dailyReturn)}</p>
                    </div>
                </div>
                <div class="plan-feature">
                    <i class="fas fa-calendar-alt"></i>
                    <div>
                        <h3>Duration</h3>
                        <p>${plan.duration} days</p>
                    </div>
                </div>
                <div class="plan-feature">
                    <i class="fas fa-hand-holding-usd"></i>
                    <div>
                        <h3>Total Return</h3>
                        <p>Ksh ${formatCurrency(totalReturn)} (${roi}%)</p>
                    </div>
                </div>
            </div>
            <button class="invest-btn" data-plan-id="${plan._id}">Invest Now</button>
        `;
        
        return planCard;
    }
    
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
    
    function setupEventListeners() {
        // Theme toggle
        const themeSwitch = document.getElementById('theme-switch');
        const dropdownThemeToggle = document.getElementById('dropdown-theme-toggle');
        
        if (themeSwitch) {
            themeSwitch.addEventListener('change', toggleTheme);
        }
        
        if (dropdownThemeToggle) {
            dropdownThemeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                toggleTheme();
            });
        }
        
        // Logout buttons
        const sidebarLogoutBtn = document.getElementById('sidebar-logout-btn');
        const dropdownLogoutBtn = document.getElementById('dropdown-logout-btn');
        
        if (sidebarLogoutBtn) {
            sidebarLogoutBtn.addEventListener('click', handleLogout);
        }
        
        if (dropdownLogoutBtn) {
            dropdownLogoutBtn.addEventListener('click', handleLogout);
        }
        
        // Close investment modal
        if (closeInvestmentModal) {
            closeInvestmentModal.addEventListener('click', function() {
                investmentModal.style.display = 'none';
            });
        }
        
        // Cancel investment button
        if (cancelInvestment) {
            cancelInvestment.addEventListener('click', function() {
                investmentModal.style.display = 'none';
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === investmentModal) {
                investmentModal.style.display = 'none';
            }
        });
        
        // Investment form submission
        if (investmentForm) {
            investmentForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const planId = planIdInput.value;
                const amount = parseFloat(investmentAmount.value);
                
                // Validate user has enough balance
                const userBalance = parseFloat(walletBalance.textContent.replace(/,/g, ''));
                if (amount > userBalance) {
                    showStatusMessage('Insufficient balance. Please add funds to your wallet.', 'error');
                    return;
                }
                
                // Process investment
                processInvestment(planId, amount);
            });
        }
    }
    
    function openInvestmentModal(plan) {
        // Check if user has sufficient balance
        const userBalance = parseFloat(walletBalance.textContent.replace(/,/g, ''));
        if (userBalance < plan.amount) {
            showStatusMessage(`Insufficient balance. You need Ksh ${formatCurrency(plan.amount)} to invest in this plan.`, 'error');
            return;
        }
        
        // Set plan details in modal
        planNameSpan.textContent = plan.name || 'Investment Plan';
        planIdInput.value = plan._id;
        planDailyReturnEl.textContent = `Ksh ${formatCurrency(plan.dailyReturn)}`;
        planDurationEl.textContent = `${plan.duration} days`;
        planTotalReturnEl.textContent = `Ksh ${formatCurrency(plan.dailyReturn * plan.duration)}`;
        
        // Set investment amount (fixed based on plan)
        investmentAmount.value = plan.amount;
        
        // Update summary values
        summaryInvestmentEl.textContent = `Ksh ${formatCurrency(plan.amount)}`;
        summaryDailyReturn.textContent = `Ksh ${formatCurrency(plan.dailyReturn)}`;
        summaryDuration.textContent = `${plan.duration} days`;
        summaryTotalReturn.textContent = `Ksh ${formatCurrency(plan.dailyReturn * plan.duration)}`;
        
        // Show the modal
        investmentModal.style.display = 'flex';
    }
    
    function processInvestment(planId, amount) {
        // Get user ID from local storage (in a real app)
        const userId = localStorage.getItem('userId') || '12345';
        
        // Prepare data for API call
        const investmentData = {
            userId: userId,
            planId: planId
        };
        
        // Update UI during processing
        const confirmBtn = document.getElementById('confirm-investment');
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Make API call to create investment
        fetch('/invest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify(investmentData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Investment failed');
            }
            return response.json();
        })
        .then(data => {
            // Close modal
            investmentModal.style.display = 'none';
            
            // Show success message
            showStatusMessage(`Investment of Ksh ${formatCurrency(amount)} successfully created!`, 'success');
            
            // Update wallet balance
            const newBalance = parseFloat(walletBalance.textContent.replace(/,/g, '')) - amount;
            walletBalance.textContent = formatCurrency(newBalance);
            if (dropdownBalance) dropdownBalance.textContent = formatCurrency(newBalance);
            
            // Redirect to investment details after short delay
            setTimeout(() => {
                window.location.href = `investment-details.html?id=${data.investment._id}`;
            }, 1500);
        })
        .catch(error => {
            console.error('Investment error:', error);
            showStatusMessage('Failed to create investment. Please try again.', 'error');
        })
        .finally(() => {
            // Reset button state
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = 'Confirm Investment';
        });
    }
    
    function setupSocialSharing() {
        const shareWhatsAppBtn = document.getElementById('share-whatsapp');
        const shareFacebookBtn = document.getElementById('share-facebook');
        const shareTwitterBtn = document.getElementById('share-twitter');
        const referralLink = document.getElementById('referral-link');
        
        if (shareWhatsAppBtn && referralLink) {
            shareWhatsAppBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const link = referralLink.value;
                const text = encodeURIComponent(`Join Natural Surplus Investment and start earning daily returns! Use my referral link: ${link}`);
                window.open(`https://wa.me/?text=${text}`, '_blank');
            });
        }
        
        if (shareFacebookBtn && referralLink) {
            shareFacebookBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const link = encodeURIComponent(referralLink.value);
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${link}`, '_blank', 'width=600,height=400');
            });
        }
        
        if (shareTwitterBtn && referralLink) {
            shareTwitterBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const link = referralLink.value;
                const text = encodeURIComponent(`Join Natural Surplus Investment and start earning daily returns! Use my referral link: ${link}`);
                window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'width=600,height=400');
            });
        }
    }
    
    function copyReferralLink() {
        const referralLink = document.getElementById('referral-link');
        if (referralLink) {
            referralLink.select();
            document.execCommand('copy');
            showStatusMessage('Referral link copied to clipboard!', 'success');
        }
    }
    
    function toggleTheme() {
        const body = document.body;
        const themeSwitch = document.getElementById('theme-switch');
        const themeText = document.getElementById('theme-mode-text');
        
        const isDarkMode = body.classList.contains('dark-theme');
        
        if (isDarkMode) {
            // Switch to light mode
            body.classList.remove('dark-theme');
            localStorage.setItem('darkMode', 'false');
            if (themeText) themeText.textContent = 'Dark Mode';
            if (themeSwitch) themeSwitch.checked = false;
        } else {
            // Switch to dark mode
            body.classList.add('dark-theme');
            localStorage.setItem('darkMode', 'true');
            if (themeText) themeText.textContent = 'Light Mode';
            if (themeSwitch) themeSwitch.checked = true;
        }
    }
    
    function handleLogout(e) {
        if (e) e.preventDefault();
        
        if (confirm('Are you sure you want to log out?')) {
            // Clear session data
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userData');
            
            // Redirect to login page
            window.location.href = 'login.html';
        }
    }
    
    function showStatusMessage(message, type = 'info') {
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
        statusMessage.className = `status-message ${type} show`;
        
        // Hide message after 3 seconds
        setTimeout(() => {
            statusMessage.className = 'status-message';
        }, 3000);
    }
    
    // Helper function to format currency
    function formatCurrency(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});