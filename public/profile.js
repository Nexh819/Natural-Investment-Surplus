document.addEventListener("DOMContentLoaded", function() {
    // DOM Elements
    const profileForm = document.getElementById('profile-form');
    const usernameInput = document.getElementById('profile-username');
    const emailInput = document.getElementById('profile-email');
    const passwordInput = document.getElementById('profile-password');
    const confirmPasswordInput = document.getElementById('profile-confirm-password');
    const profilePictureInput = document.getElementById('profile-picture');
    const profilePicturePreview = document.getElementById('preview-image');
    const darkModeToggle = document.getElementById('dark-mode');
    const emailNotificationsToggle = document.getElementById('email-notifications');
    const saveButton = document.getElementById('save-profile');
    const cancelButton = document.getElementById('cancel-changes');
    const statusMessage = document.getElementById('status-message');

    // Original values for cancel functionality
    let originalValues = {
        username: usernameInput.value,
        email: emailInput.value,
        darkMode: localStorage.getItem('darkMode') === 'true',
        emailNotifications: localStorage.getItem('emailNotifications') === 'true'
    };

    // Initialize the UI based on stored preferences
    initializeUserInterface();

    // Set up event listeners
    profilePictureInput.addEventListener('change', handleProfilePictureChange);
    darkModeToggle.addEventListener('change', toggleDarkMode);
    emailNotificationsToggle.addEventListener('change', toggleEmailNotifications);
    profileForm.addEventListener('submit', handleFormSubmit);
    cancelButton.addEventListener('click', handleCancel);

    // Profile picture preview functionality
    function handleProfilePictureChange(event) {
        const file = event.target.files[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePicturePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    // Initialize the UI based on stored preferences
    function initializeUserInterface() {
        // Load user data - In a real application, this would come from an API
        fetchUserProfile();
        
        // Apply dark mode if enabled
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }

        // Set email notifications preference
        emailNotificationsToggle.checked = localStorage.getItem('emailNotifications') === 'true';
    }

    // Mock function to fetch user profile - replace with actual API call
    function fetchUserProfile() {
        // In a real application, this would be an API call
        console.log('Fetching user profile...');
        // For demonstration, we're using the values already in the HTML
    }

    // Toggle dark mode
    function toggleDarkMode() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    }

    // Toggle email notifications
    function toggleEmailNotifications() {
        localStorage.setItem('emailNotifications', this.checked);
    }

    // Handle form submission
    function handleFormSubmit(event) {
        event.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Show loading state
        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';
        
        // Get form data
        const formData = new FormData();
        formData.append('username', usernameInput.value);
        formData.append('email', emailInput.value);
        
        if (passwordInput.value) {
            formData.append('password', passwordInput.value);
        }
        
        if (profilePictureInput.files[0]) {
            formData.append('profilePicture', profilePictureInput.files[0]);
        }

        // Save preferences
        const darkMode = darkModeToggle.checked;
        const emailNotifications = emailNotificationsToggle.checked;
        
        // Send data to server
        updateUserProfile(formData, darkMode, emailNotifications);
    }

    // Update user profile - replace with actual API call
    function updateUserProfile(formData, darkMode, emailNotifications) {
        // In a real application, this would be an API call
        fetch('/update-profile', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Save preferences to localStorage
                localStorage.setItem('darkMode', darkMode);
                localStorage.setItem('emailNotifications', emailNotifications);
                
                // Update original values for cancel functionality
                updateOriginalValues();
                
                // Show success message
                showStatusMessage('Profile updated successfully!', 'success');
                
                // Reset form state
                saveButton.disabled = false;
                saveButton.textContent = 'Save Changes';
                
                // Clear password fields
                passwordInput.value = '';
                confirmPasswordInput.value = '';
            } else {
                showStatusMessage('Error updating profile: ' + (data.message || 'Unknown error'), 'error');
                saveButton.disabled = false;
                saveButton.textContent = 'Save Changes';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showStatusMessage('Error: ' + error.message, 'error');
            saveButton.disabled = false;
            saveButton.textContent = 'Save Changes';
        });
    }

    // Form validation
    function validateForm() {
        // Reset previous error messages
        clearStatusMessage();
        
        // Validate email
        if (!isValidEmail(emailInput.value)) {
            showStatusMessage('Please enter a valid email address.', 'error');
            return false;
        }
        
        // Validate password if provided
        if (passwordInput.value) {
            if (passwordInput.value.length < 8) {
                showStatusMessage('Password must be at least 8 characters long.', 'error');
                return false;
            }
            
            if (passwordInput.value !== confirmPasswordInput.value) {
                showStatusMessage('Passwords do not match.', 'error');
                return false;
            }
        }
        
        return true;
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show status message
    function showStatusMessage(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = 'status-message ' + type;
        statusMessage.style.display = 'block';
        
        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 3000);
        }
    }

    // Clear status message
    function clearStatusMessage() {
        statusMessage.textContent = '';
        statusMessage.style.display = 'none';
    }

    // Handle cancel button click
    function handleCancel() {
        // Reset form to original values
        usernameInput.value = originalValues.username;
        emailInput.value = originalValues.email;
        passwordInput.value = '';
        confirmPasswordInput.value = '';
        
        // Reset toggles to original values
        darkModeToggle.checked = originalValues.darkMode;
        emailNotificationsToggle.checked = originalValues.emailNotifications;
        
        // Apply dark mode if it was originally enabled
        if (originalValues.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Clear status message
        clearStatusMessage();
    }

    // Update original values after successful save
    function updateOriginalValues() {
        originalValues = {
            username: usernameInput.value,
            email: emailInput.value,
            darkMode: darkModeToggle.checked,
            emailNotifications: emailNotificationsToggle.checked
        };
    }
});