document.addEventListener('DOMContentLoaded', function () {
    // Wallet Data Management
    const walletService = {
        data: {
            balance: 15000,
            transactions: [
                { id: 'TXN123', date: '2025-03-15', amount: 5000, type: 'Deposit', status: 'Completed', method: 'M-Pesa' },
                { id: 'TXN124', date: '2025-03-12', amount: 2000, type: 'Withdraw', status: 'Completed', method: 'Bank Transfer' },
                { id: 'TXN125', date: '2025-03-10', amount: 12000, type: 'Deposit', status: 'Completed', method: 'M-Pesa' }
            ],
            paymentMethods: [
                { id: 'PM1', method: 'M-Pesa', details: 'Phone: 0712XXXXX3' },
                { id: 'PM2', method: 'Bank Transfer', details: 'Account: XXXXX4567' }
            ]
        },

        getBalance() {
            return this.data.balance;
        },

        getTransactions() {
            return [...this.data.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
        },

        getPaymentMethods() {
            return this.data.paymentMethods;
        },

        addTransaction(type, amount, method) {
            const newTransaction = {
                id: 'TXN' + (this.data.transactions.length + 126),
                date: new Date().toISOString().slice(0, 10),
                amount: amount,
                type: type,
                status: 'Completed',
                method: method
            };

            if (type === 'Deposit') {
                this.data.balance += amount;
            } else if (type === 'Withdraw') {
                this.data.balance -= amount;
            }

            this.data.transactions.unshift(newTransaction);
            return newTransaction;
        },

        addPaymentMethod(method, details) {
            const newMethod = {
                id: 'PM' + (this.data.paymentMethods.length + 3),
                method: method,
                details: details
            };
            this.data.paymentMethods.push(newMethod);
            return newMethod;
        },

        validateDeposit(amount) {
            if (!amount || isNaN(amount) || amount <= 0) {
                return { valid: false, message: 'Please enter a valid amount' };
            }
            return { valid: true };
        },

        validateWithdrawal(amount) {
            if (!amount || isNaN(amount) || amount <= 0) {
                return { valid: false, message: 'Please enter a valid amount' };
            }
            if (amount > this.data.balance) {
                return { valid: false, message: 'Insufficient balance' };
            }
            return { valid: true };
        }
    };

    // UI Management
    const walletUI = {
        elements: {
            balanceDisplay: document.getElementById('wallet-balance'),
            transactionTable: document.getElementById('transaction-history-table').querySelector('tbody'),
            paymentMethodsList: document.getElementById('payment-methods-list'),
            depositModal: document.getElementById('deposit-modal'),
            withdrawModal: document.getElementById('withdraw-modal'),
            depositForm: document.querySelector('#deposit-modal .modal-content'),
            withdrawForm: document.querySelector('#withdraw-modal .modal-content'),
            depositAmount: document.getElementById('deposit-amount'),
            withdrawAmount: document.getElementById('withdraw-amount'),
            statusMessage: document.createElement('div')
        },

        init() {
            // Add status message element to DOM
            this.elements.statusMessage.className = 'status-message';
            document.querySelector('.wallet-wrapper').appendChild(this.elements.statusMessage);
            
            // Initialize UI
            this.updateBalance();
            this.updateTransactionHistory();
            this.updatePaymentMethods();
            this.setupEventListeners();
        },

        updateBalance() {
            this.elements.balanceDisplay.textContent = `Ksh ${walletService.getBalance().toLocaleString()}`;
        },

        updateTransactionHistory() {
            const transactions = walletService.getTransactions();
            this.elements.transactionTable.innerHTML = '';

            if (transactions.length === 0) {
                const emptyRow = document.createElement('tr');
                emptyRow.innerHTML = '<td colspan="5" class="empty-state">No transactions yet</td>';
                this.elements.transactionTable.appendChild(emptyRow);
                return;
            }

            transactions.forEach(transaction => {
                const row = document.createElement('tr');
                
                // Format date to be more readable
                const date = new Date(transaction.date);
                const formattedDate = date.toLocaleDateString('en-KE', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                
                // Add appropriate class for deposit/withdraw
                const amountClass = transaction.type === 'Deposit' ? 'amount-deposit' : 'amount-withdraw';
                const amountPrefix = transaction.type === 'Deposit' ? '+' : '-';
                
                row.innerHTML = `
                    <td><span class="transaction-id">${transaction.id}</span></td>
                    <td>${formattedDate}</td>
                    <td class="${amountClass}">${amountPrefix} Ksh ${transaction.amount.toLocaleString()}</td>
                    <td><span class="transaction-type ${transaction.type.toLowerCase()}">${transaction.type}</span></td>
                    <td><span class="status-badge">${transaction.status}</span></td>
                `;
                
                this.elements.transactionTable.appendChild(row);
            });
        },

        updatePaymentMethods() {
            const methods = walletService.getPaymentMethods();
            this.elements.paymentMethodsList.innerHTML = '';

            if (methods.length === 0) {
                const emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                emptyState.textContent = 'No payment methods added yet';
                this.elements.paymentMethodsList.appendChild(emptyState);
                return;
            }

            methods.forEach(method => {
                const methodElement = document.createElement('div');
                methodElement.className = 'payment-method';
                
                // Create appropriate icon based on payment method
                const iconClass = method.method.toLowerCase().includes('m-pesa') ? 'mpesa-icon' : 
                                 method.method.toLowerCase().includes('bank') ? 'bank-icon' : 'card-icon';
                
                methodElement.innerHTML = `
                    <div class="method-icon ${iconClass}"></div>
                    <div class="method-details">
                        <h4>${method.method}</h4>
                        <p>${method.details}</p>
                    </div>
                `;
                
                this.elements.paymentMethodsList.appendChild(methodElement);
            });
        },

        setupEventListeners() {
            // Deposit button
            document.querySelector('.btn-deposit').addEventListener('click', () => {
                this.elements.depositModal.style.display = 'flex';
            });

            // Withdraw button
            document.querySelector('.btn-withdraw').addEventListener('click', () => {
                this.elements.withdrawModal.style.display = 'flex';
            });

            // Close deposit modal
            document.getElementById('close-deposit-modal').addEventListener('click', () => {
                this.elements.depositModal.style.display = 'none';
                this.elements.depositAmount.value = '';
            });

            // Close withdraw modal
            document.getElementById('close-withdraw-modal').addEventListener('click', () => {
                this.elements.withdrawModal.style.display = 'none';
                this.elements.withdrawAmount.value = '';
            });

            // Add Payment Method button
            document.querySelector('.btn-add-payment-method').addEventListener('click', () => {
                this.showAddPaymentMethodForm();
            });

            // Submit deposit
            document.getElementById('submit-deposit').addEventListener('click', () => {
                this.handleDeposit();
            });

            // Submit withdrawal
            document.getElementById('submit-withdraw').addEventListener('click', () => {
                this.handleWithdraw();
            });
        },

        handleDeposit() {
            const amount = parseFloat(this.elements.depositAmount.value);
            const validation = walletService.validateDeposit(amount);
            
            if (!validation.valid) {
                this.showMessage(validation.message, 'error');
                return;
            }

            // Get selected payment method (in a real app, this would be from a dropdown)
            // For now, we'll use the first payment method
            const paymentMethod = walletService.getPaymentMethods()[0];
            
            try {
                walletService.addTransaction('Deposit', amount, paymentMethod.method);
                this.updateBalance();
                this.updateTransactionHistory();
                this.elements.depositModal.style.display = 'none';
                this.elements.depositAmount.value = '';
                this.showMessage('Deposit successful!', 'success');
            } catch (error) {
                this.showMessage('An error occurred while processing your deposit', 'error');
                console.error(error);
            }
        },

        handleWithdraw() {
            const amount = parseFloat(this.elements.withdrawAmount.value);
            const validation = walletService.validateWithdrawal(amount);
            
            if (!validation.valid) {
                this.showMessage(validation.message, 'error');
                return;
            }

            // Get selected payment method (in a real app, this would be from a dropdown)
            // For now, we'll use the first payment method
            const paymentMethod = walletService.getPaymentMethods()[0];
            
            try {
                walletService.addTransaction('Withdraw', amount, paymentMethod.method);
                this.updateBalance();
                this.updateTransactionHistory();
                this.elements.withdrawModal.style.display = 'none';
                this.elements.withdrawAmount.value = '';
                this.showMessage('Withdrawal successful!', 'success');
            } catch (error) {
                this.showMessage('An error occurred while processing your withdrawal', 'error');
                console.error(error);
            }
        },

        showAddPaymentMethodForm() {
            // In a real app, this would show a modal with a form
            // For this example, we'll use a simple prompt
            const methodName = prompt('Enter payment method name (e.g., M-Pesa, Bank Transfer):');
            if (!methodName) return;
            
            const methodDetails = prompt('Enter payment method details:');
            if (!methodDetails) return;
            
            try {
                walletService.addPaymentMethod(methodName, methodDetails);
                this.updatePaymentMethods();
                this.showMessage('Payment method added successfully!', 'success');
            } catch (error) {
                this.showMessage('An error occurred while adding payment method', 'error');
                console.error(error);
            }
        },

        showMessage(message, type = 'info') {
            this.elements.statusMessage.textContent = message;
            this.elements.statusMessage.className = `status-message ${type}`;
            this.elements.statusMessage.style.display = 'block';
            
            // Auto-hide message after 3 seconds
            setTimeout(() => {
                this.elements.statusMessage.style.display = 'none';
            }, 3000);
        }
    };

    // Additional Utility Functions
    function formatCurrency(amount) {
        return `Ksh ${amount.toLocaleString()}`;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Initialize the wallet
    walletUI.init();

    // Add window event listeners to close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === walletUI.elements.depositModal) {
            walletUI.elements.depositModal.style.display = 'none';
        }
        if (event.target === walletUI.elements.withdrawModal) {
            walletUI.elements.withdrawModal.style.display = 'none';
        }
    });

    // Add keyboard support (Escape key closes modals)
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            walletUI.elements.depositModal.style.display = 'none';
            walletUI.elements.withdrawModal.style.display = 'none';
        }
    });

    // Add mobile enhancements
    function addMobileEnhancements() {
        // Check if device is mobile
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Add touch-specific classes
            document.body.classList.add('mobile-device');
            
            // Add swipe gestures for transaction history (in a real app)
            // This would require a touch library like Hammer.js
        }
    }
    
    // Call mobile enhancements
    addMobileEnhancements();
    
    // Handle window resize
    window.addEventListener('resize', addMobileEnhancements);
});

// M-Pesa integration functions
const mpesaService = {
    // Simulate M-Pesa STK Push
    initiateSTKPush(phoneNumber, amount, callbackFn) {
        // Show loading indicator
        walletUI.showMessage("Processing M-Pesa request...", "info");
        
        // In a real implementation, this would be an API call to your backend
        // which would then call the M-Pesa API to initiate the STK push
        
        // Simulate API request with setTimeout
        setTimeout(() => {
            // Simulate successful STK push
            console.log(`STK push initiated for ${phoneNumber} with amount ${amount}`);
            
            // Show confirmation to user that STK has been sent
            walletUI.showMessage("Please check your phone for the M-Pesa prompt", "info");
            
            // In a real app, you would now wait for a callback from your server
            // when the transaction is completed or failed
            
            // For demo purposes, we'll simulate a successful transaction after 5 seconds
            setTimeout(() => {
                // Call the callback function with success status
                if (typeof callbackFn === 'function') {
                    callbackFn({ success: true, transactionId: 'MP' + Math.floor(Math.random() * 1000000) });
                }
            }, 5000);
        }, 2000);
    },
    
    // Format phone number to required format (254XXXXXXXXX)
    formatPhoneNumber(phone) {
        // Remove any non-digit characters
        let cleaned = phone.replace(/\D/g, '');
        
        // If number starts with 0, replace with 254
        if (cleaned.startsWith('0')) {
            cleaned = '254' + cleaned.substring(1);
        }
        
        // If number doesn't start with 254, add it
        if (!cleaned.startsWith('254')) {
            cleaned = '254' + cleaned;
        }
        
        return cleaned;
    },
    
    // Validate phone number
    validatePhone(phone) {
        // Basic validation for Kenya phone numbers
        const regex = /^(0|254|\+254)?(7|1)[0-9]{8}$/;
        return regex.test(phone);
    }
};

// Modify your existing handleDeposit function in walletUI
walletUI.handleDeposit = function() {
    const amount = parseFloat(this.elements.depositAmount.value);
    const validation = walletService.validateDeposit(amount);
    
    if (!validation.valid) {
        this.showMessage(validation.message, 'error');
        return;
    }
    
    // Get selected payment method
    const paymentMethodSelect = document.getElementById('deposit-payment-method');
    const paymentMethodId = paymentMethodSelect.value;
    
    // Find the payment method object
    const paymentMethods = walletService.getPaymentMethods();
    const paymentMethod = paymentMethods.find(method => method.id === paymentMethodId);
    
    if (!paymentMethod) {
        this.showMessage('Please select a valid payment method', 'error');
        return;
    }
    
    // Close deposit modal first
    this.elements.depositModal.style.display = 'none';
    
    // Handle based on payment method type
    if (paymentMethod.method.toLowerCase().includes('m-pesa')) {
        // Get phone number from payment method or prompt user
        let phoneNumber = '';
        
        // Extract phone from the payment method details if available
        const phoneMatch = paymentMethod.details.match(/\d+/g);
        if (phoneMatch) {
            phoneNumber = phoneMatch.join('');
        }
        
        // If phone number is not available or invalid, prompt user
        if (!mpesaService.validatePhone(phoneNumber)) {
            phoneNumber = prompt("Enter M-Pesa phone number (e.g., 07XXXXXXXX):", "");
            
            if (!phoneNumber) {
                this.showMessage('Deposit cancelled', 'info');
                return;
            }
            
            if (!mpesaService.validatePhone(phoneNumber)) {
                this.showMessage('Invalid phone number format', 'error');
                return;
            }
        }
        
        // Format phone number
        phoneNumber = mpesaService.formatPhoneNumber(phoneNumber);
        
        // Initiate STK push
        mpesaService.initiateSTKPush(phoneNumber, amount, (result) => {
            if (result.success) {
                // Transaction successful
                try {
                    walletService.addTransaction('Deposit', amount, 'M-Pesa');
                    this.updateBalance();
                    this.updateTransactionHistory();
                    this.elements.depositAmount.value = '';
                    this.showMessage('M-Pesa deposit successful!', 'success');
                } catch (error) {
                    this.showMessage('An error occurred while processing your deposit', 'error');
                    console.error(error);
                }
            } else {
                // Transaction failed
                this.showMessage('M-Pesa transaction failed. Please try again.', 'error');
            }
        });
    } else {
        // Handle other payment methods
        try {
            walletService.addTransaction('Deposit', amount, paymentMethod.method);
            this.updateBalance();
            this.updateTransactionHistory();
            this.elements.depositAmount.value = '';
            this.showMessage('Deposit successful!', 'success');
        } catch (error) {
            this.showMessage('An error occurred while processing your deposit', 'error');
            console.error(error);
        }
    }
};

// Add this code to your setupEventListeners function in walletUI
// Add to setupEventListeners method
walletUI.setupEventListeners = function() {
    // Your existing code...
    
    // Add payment method selection change handler
    const depositPaymentMethod = document.getElementById('deposit-payment-method');
    if (depositPaymentMethod) {
        depositPaymentMethod.addEventListener('change', () => {
            // Show appropriate fields based on selected payment method
            const selectedMethod = depositPaymentMethod.options[depositPaymentMethod.selectedIndex].text;
            
            // Clear any previously shown custom fields
            const customFieldsContainer = document.getElementById('payment-method-fields');
            if (customFieldsContainer) {
                customFieldsContainer.innerHTML = '';
                
                // Add M-Pesa phone input if M-Pesa is selected
                if (selectedMethod.toLowerCase().includes('m-pesa')) {
                    const mpesaFields = document.createElement('div');
                    mpesaFields.innerHTML = `
                        <div class="form-group">
                            <label for="mpesa-phone">M-Pesa Phone Number</label>
                            <div class="phone-input">
                                <span class="country-code">+254</span>
                                <input type="text" id="mpesa-phone" placeholder="7XX XXX XXX" maxlength="9">
                            </div>
                            <small class="form-hint">Enter the phone number registered with M-Pesa</small>
                        </div>
                    `;
                    customFieldsContainer.appendChild(mpesaFields);
                }
            }
        });
    }
    
    // Your existing code...
};