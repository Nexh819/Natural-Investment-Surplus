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
            statusMessage: document.getElementById('status-message')
        },

        init() {
            // Initialize UI
            this.updateBalance();
            this.updateTransactionHistory();
            this.updatePaymentMethods();
            this.setupEventListeners();
        },

        updateBalance() {
            this.elements.balanceDisplay.textContent = `Ksh ${walletService.getBalance().toLocaleString()}`;
            
            // Also update available balance in withdrawal form
            const availableBalance = document.getElementById('available-balance');
            if (availableBalance) {
                availableBalance.textContent = `Ksh ${walletService.getBalance().toLocaleString()}`;
            }
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

            // M-PESA payment form
            const mpesaForm = document.getElementById('mpesa-payment-form');
            if (mpesaForm) {
                mpesaForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleMpesaPayment();
                });
            }
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

        handleMpesaPayment() {
            const phoneNumber = document.getElementById('mpesa-phone-number').value;
            const amount = parseFloat(document.getElementById('mpesa-payment-amount').value);
            const purpose = document.getElementById('mpesa-payment-purpose').value;
            
            // Validate phone number (basic Kenya phone number validation)
            const phoneRegex = /^(0|254|\+254)?(7|1)[0-9]{8}$/;
            if (!phoneRegex.test(phoneNumber)) {
                this.showMessage('Please enter a valid M-PESA phone number', 'error');
                return;
            }
            
            // Validate amount
            if (!amount || isNaN(amount) || amount < 10) {
                this.showMessage('Please enter a valid amount (minimum KSh 10)', 'error');
                return;
            }
            
            // Call M-PESA integration function
            this.initiateMpesaPayment(phoneNumber, amount, purpose);
        },

        initiateMpesaPayment(phoneNumber, amount, purpose) {
            // Show loading state
            const payBtn = document.getElementById('mpesa-pay-btn');
            const originalBtnText = payBtn.textContent;
            payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            payBtn.disabled = true;
            
            // Show status message
            this.showMessage('Initiating M-PESA payment...', 'info');
            
            // Format phone number (ensure it starts with 254)
            let formattedPhone = phoneNumber.trim();
            if (formattedPhone.startsWith('0')) {
                formattedPhone = '254' + formattedPhone.substring(1);
            }
            if (!formattedPhone.startsWith('254')) {
                formattedPhone = '254' + formattedPhone;
            }
            
            // Show the payment status UI
            const mpesaStatusDiv = document.getElementById('mpesa-payment-status');
            mpesaStatusDiv.style.display = 'block';
            document.getElementById('mpesa-status-title').textContent = 'Payment Initiated';
            document.getElementById('mpesa-status-message').textContent = 'Please check your phone for the M-PESA prompt and enter your PIN.';
            
            // For demo purposes, we'll simulate the STK push process
            // In a real implementation, this would be an API call to your backend
            
            // Simulate a delay for STK push (2 seconds)
            setTimeout(() => {
                // Update status UI to show waiting for confirmation
                document.getElementById('mpesa-status-title').textContent = 'Awaiting Confirmation';
                
                // Simulate the payment confirmation process (5 seconds)
                setTimeout(() => {
                    // Simulate a successful payment
                    const success = true; // For demo purposes; real implementation would verify payment status
                    
                    if (success) {
                        // Update transaction history
                        walletService.addTransaction('Deposit', amount, 'M-Pesa');
                        
                        // Update UI
                        this.updateBalance();
                        this.updateTransactionHistory();
                        
                        // Show success message
                        document.getElementById('mpesa-status-icon').classList.remove('fa-spinner', 'fa-spin');
                        document.getElementById('mpesa-status-icon').classList.add('fa-check-circle');
                        document.getElementById('mpesa-status-title').textContent = 'Payment Successful';
                        document.getElementById('mpesa-status-message').textContent = `Your account has been credited with KSh ${amount}.`;
                        
                        // Show success status message
                        this.showMessage('M-PESA payment successful! Your account has been credited.', 'success');
                        
                        // Reset form after 3 seconds
                        setTimeout(() => {
                            document.getElementById('mpesa-phone-number').value = '';
                            document.getElementById('mpesa-payment-amount').value = '';
                            payBtn.innerHTML = originalBtnText;
                            payBtn.disabled = false;
                            mpesaStatusDiv.style.display = 'none';
                        }, 3000);
                    } else {
                        // Handle failed payment
                        document.getElementById('mpesa-status-icon').classList.remove('fa-spinner', 'fa-spin');
                        document.getElementById('mpesa-status-icon').classList.add('fa-times-circle');
                        document.getElementById('mpesa-status-title').textContent = 'Payment Failed';
                        document.getElementById('mpesa-status-message').textContent = 'The payment could not be processed. Please try again.';
                        
                        // Show error status message
                        this.showMessage('M-PESA payment failed. Please try again.', 'error');
                        
                        // Reset button
                        payBtn.innerHTML = originalBtnText;
                        payBtn.disabled = false;
                    }
                }, 5000);
            }, 2000);
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
            if (!this.elements.statusMessage) {
                this.elements.statusMessage = document.getElementById('status-message');
            }
            
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

// M-PESA API Integration
const mpesaAPI = {
    // In a real implementation, these would be API calls to your backend
    // which would then call the Safaricom Daraja API
    
    // Get OAuth token from Safaricom
    getAccessToken() {
        // This would be a server-side operation
        return new Promise((resolve) => {
            // Simulate successful token retrieval
            setTimeout(() => {
                resolve({
                    access_token: "simulated_access_token",
                    expires_in: "3599"
                });
            }, 500);
        });
    },
    
    // Initiate STK Push
    initiateSTKPush(phoneNumber, amount, accountReference) {
        // This would call your backend API, which would then call Safaricom
        return new Promise((resolve) => {
            // Simulate successful STK push
            setTimeout(() => {
                resolve({
                    success: true,
                    CheckoutRequestID: "ws_CO_" + Date.now(),
                    CustomerMessage: "Success. Request accepted for processing"
                });
            }, 1000);
        });
    },
    
    // Check transaction status
    checkTransactionStatus(checkoutRequestID) {
        // This would call your backend API to check transaction status
        return new Promise((resolve) => {
            // Simulate successful transaction
            setTimeout(() => {
                resolve({
                    success: true,
                    ResultCode: "0",
                    ResultDesc: "The service request is processed successfully."
                });
            }, 2000);
        });
    }
};

// Add CSS styles for M-PESA section
(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        /* M-PESA Payment Section Styles */
        .payment-section {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .payment-section h2 {
            margin-top: 0;
            display: flex;
            align-items: center;
            font-size: 1.5rem;
        }
        
        .payment-section h2 i {
            margin-right: 10px;
            color: #16a085;
        }
        
        .payment-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 20px;
        }
        
        .input-with-icon {
            position: relative;
        }
        
        .input-with-icon i {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #555;
        }
        
        .input-with-icon input {
            padding-left: 35px;
            width: 100%;
            height: 40px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 0.9rem;
        }
        
        .form-hint {
            font-size: 0.8rem;
            color: #777;
            margin-top: 5px;
        }
        
        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 10px;
        }
        
        .btn-block {
            width: 100%;
        }
        
        /* Payment Status Styles */
        .payment-status {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
            text-align: center;
            border: 1px solid #e9ecef;
        }
        
        .status-icon {
            font-size: 2rem;
            margin-bottom: 10px;
            color: #16a085;
        }
        
        .status-icon .fa-check-circle {
            color: #27ae60;
        }
        
        .status-icon .fa-times-circle {
            color: #e74c3c;
        }
        
        #mpesa-status-title {
            font-size: 1.2rem;
            margin: 10px 0;
        }
        
        #mpesa-status-message {
            color: #555;
            margin-bottom: 0;
        }
    `;
    document.head.appendChild(styleSheet);
})();