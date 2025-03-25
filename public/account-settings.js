document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const tabLinks = document.querySelectorAll('.settings-nav a');
    const settingsSections = document.querySelectorAll('.settings-section');
    const statusMessage = document.getElementById('status-message');
    const forms = {
        profile: document.getElementById('profile-form'),
        security: document.getElementById('security-form'),
        notifications: document.getElementById('notifications-form'),
        preferences: document.getElementById('preferences-form'),
        privacy: document.getElementById('privacy-form')
    };

    // Profile Elements
    const profilePictureUpload = document.getElementById('profile-picture-upload');
    const profileImage = document.getElementById('profile-image');
    const changeProfilePictureBtn = document.getElementById('change-picture');
    const removeProfilePictureBtn = document.getElementById('remove-picture');
    
    // Security Elements
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const passwordStrengthText = document.getElementById('password-strength-text');
    const strengthSegments = document.querySelectorAll('.strength-segment');
    const twoFactorToggle = document.getElementById('two-factor-auth');
    const twoFactorOptions = document.getElementById('two-factor-options');
    
    // User data storage (in a real app, this would come from an API)
    let userData = {
        profile: {
            firstName: 'Matthew',
            lastName: 'Munene',
            displayName: 'Dadius kiriaga',
            email: 'munenemathewo35@gmail.com',
            phoneNumber: '+254712345678',
            country: 'KE',
            bio: '',
            profilePicture: 'images/default-avatar.png'
        },
        settings: {
            // Notifications
            emailNotifications: {
                transactions: true,
                investments: true,
                news: true,
                promotions: false
            },
            smsNotifications: {
                transactions: true,
                security: true,
                promotions: false
            },
            pushNotifications: {
                transactions: true,
                investments: false
            },
            // Preferences
            theme: 'light',
            language: 'en',
            defaultDashboard: 'overview',
            showBalance: true,
            // Privacy
            dataCollection: true,
            marketingConsent: true,
            // Security
            twoFactorEnabled: false,
            authMethod: 'app'
        }
    };

    // Initialize settings page
    initSettingsPage();

    // Tab navigation
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get section ID from data attribute
            const sectionId = this.getAttribute('data-section');
            
            // Remove active class from all links and sections
            tabLinks.forEach(link => link.classList.remove('active'));
            settingsSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link and corresponding section
            this.classList.add('active');
            document.getElementById(sectionId).classList.add('active');
            
            // Update URL hash
            window.location.hash = sectionId;
        });
    });

    // Check URL hash on page load and navigate to that tab
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const targetLink = document.querySelector(`.settings-nav a[data-section="${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }

    // Profile picture actions
    changeProfilePictureBtn.addEventListener('click', function() {
        profilePictureUpload.click();
    });
    
    profilePictureUpload.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result;
                userData.profile.profilePicture = e.target.result;
            };
            reader.readAsDataURL(this.files[0]);
        }
    });
    
    removeProfilePictureBtn.addEventListener('click', function() {
        profileImage.src = 'images/default-avatar.png';
        userData.profile.profilePicture = 'images/default-avatar.png';
        profilePictureUpload.value = '';
    });

    // Password strength meter
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            updatePasswordStrength(password);
        });
    }

    // Two-factor authentication toggle
    if (twoFactorToggle) {
        twoFactorToggle.addEventListener('change', function() {
            twoFactorOptions.classList.toggle('hidden', !this.checked);
            userData.settings.twoFactorEnabled = this.checked;
        });
    }

    // Form submissions
    Object.keys(forms).forEach(formKey => {
        const form = forms[formKey];
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                saveFormData(formKey, this);
            });
        }
    });

    // Initialize settings from userData
    function initSettingsPage() {
        // Initialize profile data
        const profileElements = {
            'first-name': userData.profile.firstName,
            'last-name': userData.profile.lastName,
            'display-name': userData.profile.displayName,
            'bio': userData.profile.bio,
            'account-email': userData.profile.email,
            'phone-number': userData.profile.phoneNumber,
            'country': userData.profile.country
        };
        
        Object.keys(profileElements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = profileElements[id];
            }
        });
        
        // Initialize profile picture
        if (profileImage) {
            profileImage.src = userData.profile.profilePicture;
        }
        
        // Initialize notifications
        initCheckboxes('email-transactions', userData.settings.emailNotifications.transactions);
        initCheckboxes('email-investments', userData.settings.emailNotifications.investments);
        initCheckboxes('email-news', userData.settings.emailNotifications.news);
        initCheckboxes('email-promotions', userData.settings.emailNotifications.promotions);
        
        initCheckboxes('sms-transactions', userData.settings.smsNotifications.transactions);
        initCheckboxes('sms-security', userData.settings.smsNotifications.security);
        initCheckboxes('sms-promotions', userData.settings.smsNotifications.promotions);
        
        initCheckboxes('push-transactions', userData.settings.pushNotifications.transactions);
        initCheckboxes('push-investments', userData.settings.pushNotifications.investments);
        
        // Initialize preferences
        initRadioButtons('theme', userData.settings.theme);
        initSelectValue('language', userData.settings.language);
        initSelectValue('default-dashboard', userData.settings.defaultDashboard);
        initCheckboxes('show-balance', userData.settings.showBalance);
        
        // Initialize privacy settings
        initCheckboxes('data-collection', userData.settings.dataCollection);
        initCheckboxes('marketing-consent', userData.settings.marketingConsent);
        
        // Initialize security settings
        initCheckboxes('two-factor-auth', userData.settings.twoFactorEnabled);
        if (userData.settings.twoFactorEnabled) {
            twoFactorOptions.classList.remove('hidden');
        } else {
            twoFactorOptions.classList.add('hidden');
        }
        initRadioButtons('auth-method', userData.settings.authMethod);
    }

    // Helper function to initialize checkbox values
    function initCheckboxes(id, value) {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = value;
        }
    }

    // Helper function to initialize radio button values
    function initRadioButtons(name, value) {
        const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
        if (radio) {
            radio.checked = true;
        }
    }

    // Helper function to initialize select values
    function initSelectValue(id, value) {
        const select = document.getElementById(id);
        if (select) {
            select.value = value;
        }
    }

    // Save form data based on form type
    function saveFormData(formType, form) {
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Saving...';
        
        // Simulate API call with timeout
        setTimeout(() => {
            switch (formType) {
                case 'profile':
                    saveProfileData(form);
                    break;
                case 'security':
                    saveSecurityData(form);
                    break;
                case 'notifications':
                    saveNotificationsData(form);
                    break;
                case 'preferences':
                    savePreferencesData(form);
                    break;
                case 'privacy':
                    savePrivacyData(form);
                    break;
            }
            
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            
            // Show success message
            showMessage('Settings saved successfully!', 'success');
        }, 1000);
    }

    // Save profile data
    function saveProfileData(form) {
        userData.profile = {
            ...userData.profile,
            firstName: form.querySelector('#first-name').value,
            lastName: form.querySelector('#last-name').value,
            displayName: form.querySelector('#display-name').value,
            bio: form.querySelector('#bio').value,
            email: form.querySelector('#account-email').value,
            phoneNumber: form.querySelector('#phone-number').value,
            country: form.querySelector('#country').value
        };
        
        // In a real app, send to API
        console.log('Profile data saved:', userData.profile);
    }

    // Save security data
    function saveSecurityData(form) {
        const currentPassword = form.querySelector('#current-password').value;
        const newPassword = form.querySelector('#new-password').value;
        const confirmPassword = form.querySelector('#confirm-password').value;
        
        // Validate passwords
        if (newPassword) {
            if (newPassword !== confirmPassword) {
                showMessage('New passwords do not match', 'error');
                return;
            }
            
            if (newPassword.length < 8) {
                showMessage('Password must be at least 8 characters', 'error');
                return;
            }
            
            // In a real app, send password change to API
            console.log('Password changed');
        }
        
        userData.settings.twoFactorEnabled = form.querySelector('#two-factor-auth').checked;
        userData.settings.authMethod = form.querySelector('input[name="auth-method"]:checked').value;
        
        console.log('Security settings saved:', {
            twoFactorEnabled: userData.settings.twoFactorEnabled,
            authMethod: userData.settings.authMethod
        });
    }

    // Save notifications data
    function saveNotificationsData(form) {
        userData.settings.emailNotifications = {
            transactions: form.querySelector('#email-transactions').checked,
            investments: form.querySelector('#email-investments').checked,
            news: form.querySelector('#email-news').checked,
            promotions: form.querySelector('#email-promotions').checked
        };
        
        userData.settings.smsNotifications = {
            transactions: form.querySelector('#sms-transactions').checked,
            security: form.querySelector('#sms-security').checked,
            promotions: form.querySelector('#sms-promotions').checked
        };
        
        userData.settings.pushNotifications = {
            transactions: form.querySelector('#push-transactions').checked,
            investments: form.querySelector('#push-investments').checked
        };
        
        console.log('Notification settings saved:', {
            email: userData.settings.emailNotifications,
            sms: userData.settings.smsNotifications,
            push: userData.settings.pushNotifications
        });
    }

    // Save preferences data
    function savePreferencesData(form) {
        userData.settings.theme = form.querySelector('input[name="theme"]:checked').value;
        userData.settings.language = form.querySelector('#language').value;
        userData.settings.defaultDashboard = form.querySelector('#default-dashboard').value;
        userData.settings.showBalance = form.querySelector('#show-balance').checked;
        
        // Apply theme change immediately
        document.body.className = userData.settings.theme === 'dark' ? 'dark-theme' : '';
        
        console.log('Preference settings saved:', {
            theme: userData.settings.theme,
            language: userData.settings.language,
            defaultDashboard: userData.settings.defaultDashboard,
            showBalance: userData.settings.showBalance
        });
    }

    // Save privacy data
    function savePrivacyData(form) {
        userData.settings.dataCollection = form.querySelector('#data-collection').checked;
        userData.settings.marketingConsent = form.querySelector('#marketing-consent').checked;
        
        console.log('Privacy settings saved:', {
            dataCollection: userData.settings.dataCollection,
            marketingConsent: userData.settings.marketingConsent
        });
    }

    // Password strength meter
    function updatePasswordStrength(password) {
        let strength = 0;
        let feedback = 'None';
        
        if (!password) {
            resetStrengthMeter();
            return;
        }
        
        // Check length
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        
        // Check for lowercase and uppercase
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
        
        // Check for numbers and symbols
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Normalize strength to 0-4 scale
        strength = Math.min(strength, 4);
        
        // Update UI
        for (let i = 0; i < strengthSegments.length; i++) {
            if (i < strength) {
                strengthSegments[i].classList.add('active');
            } else {
                strengthSegments[i].classList.remove('active');
            }
        }
        
        // Set strength text
        switch (strength) {
            case 0:
                feedback = 'Very Weak';
                setStrengthColor('very-weak');
                break;
            case 1:
                feedback = 'Weak';
                setStrengthColor('weak');
                break;
            case 2:
                feedback = 'Fair';
                setStrengthColor('fair');
                break;
            case 3:
                feedback = 'Good';
                setStrengthColor('good');
                break;
            case 4:
                feedback = 'Strong';
                setStrengthColor('strong');
                break;
        }
        
        passwordStrengthText.textContent = feedback;
    }

    // Reset strength meter
    function resetStrengthMeter() {
        strengthSegments.forEach(segment => segment.classList.remove('active'));
        passwordStrengthText.textContent = 'None';
        setStrengthColor('');
    }

    // Set strength color class
    function setStrengthColor(strengthClass) {
        passwordStrengthText.className = '';
        if (strengthClass) {
            passwordStrengthText.classList.add(strengthClass);
        }
    }

    // Show status message
    function showMessage(message, type = 'info') {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';
        
        // Hide message after 3 seconds
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 3000);
    }

    // Add event listeners for session management
    document.querySelectorAll('.btn-danger').forEach(button => {
        button.addEventListener('click', function() {
            const isConfirmed = confirm('Are you sure you want to proceed with this action?');
            if (isConfirmed) {
                if (this.textContent.trim() === 'Delete My Account') {
                    showMessage('Account deletion request submitted', 'info');
                } else if (this.textContent.trim() === 'Logout') {
                    this.closest('.session-item').remove();
                    showMessage('Device logged out successfully', 'success');
                }
            }
        });
    });

    // Handle logout from all devices
    const logoutAllBtn = document.querySelector('button.btn-block');
    if (logoutAllBtn) {
        logoutAllBtn.addEventListener('click', function() {
            const isConfirmed = confirm('Are you sure you want to log out from all devices?');
            if (isConfirmed) {
                showMessage('Logged out from all devices', 'success');
            }
        });
    }

    // Add payment method button
    const addPaymentBtn = document.querySelector('.btn-add-payment');
    if (addPaymentBtn) {
        addPaymentBtn.addEventListener('click', function() {
            showMessage('This feature is coming soon!', 'info');
        });
    }

    // Upload ID button
    const uploadIdBtn = document.querySelector('.step-item.active .btn-sm');
    if (uploadIdBtn) {
        uploadIdBtn.addEventListener('click', function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*,.pdf';
            fileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    showMessage('ID uploaded successfully. Verification in progress.', 'success');
                }
            });
            fileInput.click();
        });
    }
});