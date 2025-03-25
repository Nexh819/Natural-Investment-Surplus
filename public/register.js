document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const registerBtn = document.getElementById('register-btn');
    
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'dashboard.html';
    }

    // Toggle password visibility
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            const icon = togglePasswordBtn.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Toggle confirm password visibility
    const toggleConfirmPasswordBtn = document.querySelector('.toggle-confirm-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    if (toggleConfirmPasswordBtn) {
        toggleConfirmPasswordBtn.addEventListener('click', function() {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
            
            // Toggle icon
            const icon = toggleConfirmPasswordBtn.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Handle registration form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Hide previous messages
        errorMessage.classList.add('hide');
        successMessage.classList.add('hide');
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const referralCode = document.getElementById('referral-code').value.trim();
        const termsAgreed = document.getElementById('terms').checked;
        
        // Basic validation
        if (!name || !username || !email || !phone || !password || !confirmPassword) {
            showError('Please fill in all required fields');
            return;
        }
        
        // Terms agreement validation
        if (!termsAgreed) {
            showError('You must agree to the Terms of Service and Privacy Policy');
            return;
        }
        
        // Email validation
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }
        
        // Check password length
        if (password.length < 6) {
            showError('Password must be at least 6 characters');
            return;
        }
        
        // Show loading state
        const originalBtnText = registerBtn.innerHTML;
        registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        registerBtn.disabled = true;
        
        // Disable all form inputs during submission
        Array.from(form.elements).forEach(input => {
            input.disabled = true;
        });
        
        // Send registration request
        fetch('http://localhost:4000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                username,
                phone,
                password,
                referralCode
            })
        })
        .then(response => {
            // Check if the response is JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json().then(data => {
                    if (!response.ok) {
                        throw new Error(data.message || 'Registration failed');
                    }
                    return data;
                });
            } else {
                // Handle non-JSON response
                if (!response.ok) {
                    throw new Error('Server error: ' + response.status);
                }
                // For successful non-JSON responses, create a minimal object
                return { success: true };
            }
        })
        .then(data => {
            // Show success message
            showSuccess('Account created successfully! Redirecting to dashboard...');
            
            // Save token and user data to localStorage
            const userData = {
                name,
                username,
                email,
                phone,
                referralCode: data.referralCode || 'REF' + Math.floor(1000 + Math.random() * 9000),
                balance: 0
            };
            
            localStorage.setItem('token', data.token || 'temp_token_' + Date.now());
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        })
        .catch(error => {
            console.error('Error:', error);
            showError(error.message || 'Registration failed. Please try again.');
        })
        .finally(() => {
            // Reset button and form state
            registerBtn.innerHTML = originalBtnText;
            registerBtn.disabled = false;
            
            // Re-enable all form inputs
            Array.from(form.elements).forEach(input => {
                input.disabled = false;
            });
        });
    });
    
    // Helper function to show error message
    function showError(message) {
        errorMessage.querySelector('span').textContent = message;
        errorMessage.classList.remove('hide');
        
        // Scroll to error message
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Helper function to show success message
    function showSuccess(message) {
        successMessage.querySelector('span').textContent = message;
        successMessage.classList.remove('hide');
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Helper function for email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Real-time password matching validation
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    
    confirmPassword.addEventListener('input', function() {
        if (this.value && this.value !== password.value) {
            this.setCustomValidity('Passwords do not match');
        } else {
            this.setCustomValidity('');
        }
    });
    
    password.addEventListener('input', function() {
        if (confirmPassword.value && confirmPassword.value !== this.value) {
            confirmPassword.setCustomValidity('Passwords do not match');
        } else {
            confirmPassword.setCustomValidity('');
        }
    });
});