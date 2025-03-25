/**
 * Natural Surplus Investments
 * System Settings JavaScript
 * 
 * This file handles all the functionality for the system settings page
 * including theme controls, localization, performance options, and advanced settings.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize system settings data
    initializeSystemData();
    
    // Initialize tab switching
    initializeTabs();
    
    // Initialize all form submissions
    initializeForms();
    
    // Setup toggle handlers and interactive elements
    initializeInteractions();
    
    // Setup advanced features
    initializeAdvancedSettings();
    
    // Display system information
    displaySystemInfo();
});

/**
 * Initialize system data and display name
 */
function initializeSystemData() {
    // Get system data from localStorage or use default
    const systemData = JSON.parse(localStorage.getItem('systemSettings')) || {
        appearance: {
            theme: 'light',
            accentColor: 'default',
            fontSize: 100,
            enableAnimations: true
        },
        localization: {
            language: 'en',
            timezone: 'UTC',
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12',
            defaultCurrency: 'USD'
        },
        performance: {
            dataRefreshRate: 60,
            highQualityCharts: true,
            enablePrefetch: true
        },
        advanced: {
            developerMode: false,
            showConsoleErrors: false,
            debugLogging: false
        }
    };
    
    // Get user data for username display
    const userData = JSON.parse(localStorage.getItem('userData')) || { name: 'Guest User' };
    document.getElementById('userName').textContent = userData.name;
    
    // Fill form fields with system data
    populateFormFields(systemData);
    
    // Apply current theme and styles
    applyCurrentTheme(systemData.appearance);
    
    // Set notification count (placeholder functionality)
    document.getElementById('notificationCount').textContent = Math.floor(Math.random() * 5);
}

/**
 * Fill form fields with system data
 */
function populateFormFields(systemData) {
    // Appearance settings
    if (systemData.appearance) {
        // Theme selection
        const themeRadio = document.querySelector(`input[name="theme"][value="${systemData.appearance.theme}"]`);
        if (themeRadio) themeRadio.checked = true;
        
        // Accent color
        const colorRadio = document.querySelector(`input[name="accentColor"][value="${systemData.appearance.accentColor}"]`);
        if (colorRadio) colorRadio.checked = true;
        
        // Font size
        const fontSizeSlider = document.getElementById('fontSize');
        if (fontSizeSlider) {
            fontSizeSlider.value = systemData.appearance.fontSize;
            updateFontSizePreview(systemData.appearance.fontSize);
        }
        
        // Animations
        const animationsToggle = document.getElementById('enableAnimations');
        if (animationsToggle) animationsToggle.checked = systemData.appearance.enableAnimations;
    }
    
    // Localization settings
    if (systemData.localization) {
        // Language
        const languageSelect = document.getElementById('language');
        if (languageSelect) languageSelect.value = systemData.localization.language;
        
        // Timezone
        const timezoneSelect = document.getElementById('timezone');
        if (timezoneSelect) timezoneSelect.value = systemData.localization.timezone;
        
        // Date format
        const dateFormatSelect = document.getElementById('dateFormat');
        if (dateFormatSelect) dateFormatSelect.value = systemData.localization.dateFormat;
        
        // Time format
        const timeFormatSelect = document.getElementById('timeFormat');
        if (timeFormatSelect) timeFormatSelect.value = systemData.localization.timeFormat;
        
        // Default currency
        const currencySelect = document.getElementById('defaultCurrency');
        if (currencySelect) currencySelect.value = systemData.localization.defaultCurrency;
    }
    
    // Performance settings
    if (systemData.performance) {
        // Data refresh rate
        const refreshRateSelect = document.getElementById('dataRefreshRate');
        if (refreshRateSelect) refreshRateSelect.value = systemData.performance.dataRefreshRate;
        
        // High quality charts
        const chartsToggle = document.getElementById('highQualityCharts');
        if (chartsToggle) chartsToggle.checked = systemData.performance.highQualityCharts;
        
        // Prefetching
        const prefetchToggle = document.getElementById('enablePrefetch');
        if (prefetchToggle) prefetchToggle.checked = systemData.performance.enablePrefetch;
    }
    
    // Advanced settings
    if (systemData.advanced) {
        // Developer mode
        const devModeToggle = document.getElementById('developerMode');
        if (devModeToggle) {
            devModeToggle.checked = systemData.advanced.developerMode;
            toggleDeveloperOptions(systemData.advanced.developerMode);
        }
        
        // Console errors
        const consoleErrorsToggle = document.getElementById('showConsoleErrors');
        if (consoleErrorsToggle) consoleErrorsToggle.checked = systemData.advanced.showConsoleErrors;
        
        // Debug logging
        const debugLoggingToggle = document.getElementById('debugLogging');
        if (debugLoggingToggle) debugLoggingToggle.checked = systemData.advanced.debugLogging;
    }
}

/**
 * Apply current theme and styles to the page
 */
function applyCurrentTheme(appearanceSettings) {
    if (!appearanceSettings) return;
    
    // Apply theme
    const theme = appearanceSettings.theme;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    // Apply accent color
    document.body.className = document.body.className.replace(/accent-\w+/g, '');
    document.body.classList.add(`accent-${appearanceSettings.accentColor}`);
    
    // Apply font size
    document.documentElement.style.fontSize = `${appearanceSettings.fontSize}%`;
    
    // Apply animations setting
    if (!appearanceSettings.enableAnimations) {
        document.body.classList.add('reduce-motion');
    } else {
        document.body.classList.remove('reduce-motion');
    }
}

/**
 * Update font size preview
 */
function updateFontSizePreview(size) {
    const preview = document.querySelector('.font-size-preview');
    if (preview) {
        preview.style.fontSize = `${size}%`;
    }
}

/**
 * Initialize tab switching functionality
 */
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get tab id and activate corresponding content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Initialize form submissions
 */
function initializeForms() {
    // Appearance Settings Form
    const appearanceForm = document.getElementById('appearanceForm');
    if (appearanceForm) {
        appearanceForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = {
                appearance: {
                    theme: document.querySelector('input[name="theme"]:checked').value,
                    accentColor: document.querySelector('input[name="accentColor"]:checked').value,
                    fontSize: parseInt(document.getElementById('fontSize').value),
                    enableAnimations: document.getElementById('enableAnimations').checked
                }
            };
            
            // Save the data
            saveSystemData(formData);
            
            // Apply the theme
            applyCurrentTheme(formData.appearance);
            
            showNotification('Appearance settings saved successfully!');
        });
    }
    
    // Localization Settings Form
    const localizationForm = document.getElementById('localizationForm');
    if (localizationForm) {
        localizationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = {
                localization: {
                    language: document.getElementById('language').value,
                    timezone: document.getElementById('timezone').value,
                    dateFormat: document.getElementById('dateFormat').value,
                    timeFormat: document.getElementById('timeFormat').value,
                    defaultCurrency: document.getElementById('defaultCurrency').value
                }
            };
            
            // Save the data
            saveSystemData(formData);
            showNotification('Localization settings saved successfully!');
        });
    }
    
    // Performance Settings Form
    const performanceForm = document.getElementById('performanceForm');
    if (performanceForm) {
        performanceForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = {
                performance: {
                    dataRefreshRate: document.getElementById('dataRefreshRate').value,
                    highQualityCharts: document.getElementById('highQualityCharts').checked,
                    enablePrefetch: document.getElementById('enablePrefetch').checked
                }
            };
            
            // Save the data
            saveSystemData(formData);
            showNotification('Performance settings saved successfully!');
        });
    }
    
    // Advanced Settings Form
    const advancedForm = document.getElementById('advancedForm');
    if (advancedForm) {
        advancedForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = {
                advanced: {
                    developerMode: document.getElementById('developerMode').checked,
                    showConsoleErrors: document.getElementById('showConsoleErrors').checked,
                    debugLogging: document.getElementById('debugLogging').checked
                }
            };
            
            // Save the data
            saveSystemData(formData);
            showNotification('Advanced settings saved successfully!');
        });
    }
}

/**
 * Initialize interactive elements
 */
function initializeInteractions() {
    // Font size slider
    const fontSizeSlider = document.getElementById('fontSize');
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', function() {
            updateFontSizePreview(this.value);
        });
    }
    
    // Developer mode toggle
    const developerModeToggle = document.getElementById('developerMode');
    if (developerModeToggle) {
        developerModeToggle.addEventListener('change', function() {
            toggleDeveloperOptions(this.checked);
        });
    }
    
    // Clear cache button
    const clearCacheBtn = document.getElementById('clearCache');
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', function() {
            // Simulate cache clearing
            showNotification('Cache cleared successfully!');
            document.getElementById('cacheSize').textContent = '0 KB';
        });
    }
}

/**
 * Toggle developer options visibility
 */
function toggleDeveloperOptions(show) {
    const developerOptions = document.getElementById('developerOptions');
    if (developerOptions) {
        if (show) {
            developerOptions.classList.remove('hidden');
        } else {
            developerOptions.classList.add('hidden');
        }
    }
}

/**
 * Initialize advanced settings functionality
 */
function initializeAdvancedSettings() {
    // Check for updates button
    const checkUpdatesBtn = document.getElementById('checkUpdates');
    if (checkUpdatesBtn) {
        checkUpdatesBtn.addEventListener('click', function() {
            // Simulate checking for updates
            showNotification('Checking for updates...', 'info');
            
            setTimeout(() => {
                showNotification('Your application is up to date!');
            }, 2000);
        });
    }
    
    // Reset to defaults button
    const resetSystemBtn = document.getElementById('resetSystem');
    if (resetSystemBtn) {
        resetSystemBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all system settings to their defaults? This cannot be undone.')) {
                // Remove system settings from localStorage
                localStorage.removeItem('systemSettings');
                
                // Reload the page to apply defaults
                showNotification('System settings have been reset to defaults.', 'info');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        });
    }
}

/**
 * Display system information
 */
function displaySystemInfo() {
    // Version info is usually hardcoded or fetched from a config
    document.getElementById('appVersion').textContent = '1.2.4';
    document.getElementById('lastUpdated').textContent = 'March 17, 2025';
    
    // Get browser information
    const browserInfo = getBrowserInfo();
    document.getElementById('browserInfo').textContent = browserInfo;
    
    // Get OS information
    const osInfo = getOSInfo();
    document.getElementById('osInfo').textContent = osInfo;
}

/**
 * Get browser information
 */
function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
    let browserVersion = "";
    
    if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Chrome";
        browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Firefox";
        browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Safari";
        browserVersion = userAgent.match(/Version\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
        browserName = "Internet Explorer";
        browserVersion = userAgent.match(/(?:MSIE |rv:)([0-9.]+)/)[1];
    } else if (userAgent.indexOf("Edge") > -1) {
        browserName = "Edge";
        browserVersion = userAgent.match(/Edge\/([0-9.]+)/)[1];
    }
    
    return `${browserName} ${browserVersion}`;
}

/**
 * Get operating system information
 */
function getOSInfo() {
    const userAgent = navigator.userAgent;
    let osName = "Unknown";
    
    if (userAgent.indexOf("Win") > -1) {
        if (userAgent.indexOf("Windows NT 10") > -1) {
            osName = "Windows 11";
        } else if (userAgent.indexOf("Windows NT 10") > -1) {
            osName = "Windows 10";
        } else if (userAgent.indexOf("Windows NT 6.3") > -1) {
            osName = "Windows 8.1";
        } else if (userAgent.indexOf("Windows NT 6.2") > -1) {
            osName = "Windows 8";
        } else if (userAgent.indexOf("Windows NT 6.1") > -1) {
            osName = "Windows 7";
        } else {
            osName = "Windows";
        }
    } else if (userAgent.indexOf("Mac") > -1) {
        osName = "macOS";
    } else if (userAgent.indexOf("Android") > -1) {
        osName = "Android";
    } else if (userAgent.indexOf("Linux") > -1) {
        osName = "Linux";
    } else if (userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPad") > -1 || userAgent.indexOf("iPod") > -1) {
        osName = "iOS";
    }
    
    return osName;
}

/**
 * Save system data to localStorage
 */
function saveSystemData(newData) {
    // Get existing data
    let systemData = JSON.parse(localStorage.getItem('systemSettings')) || {};
    
    // Merge with new data
    systemData = {...systemData, ...newData};
    
    // For nested objects, we need to merge manually
    if (newData.appearance) {
        systemData.appearance = {...(systemData.appearance || {}), ...newData.appearance};
    }
    
    if (newData.localization) {
        systemData.localization = {...(systemData.localization || {}), ...newData.localization};
    }
    
    if (newData.performance) {
        systemData.performance = {...(systemData.performance || {}), ...newData.performance};
    }
    
    if (newData.advanced) {
        systemData.advanced = {...(systemData.advanced || {}), ...newData.advanced};
    }
    
    // Save back to localStorage
    localStorage.setItem('systemSettings', JSON.stringify(systemData));
    
    // Attempt to sync with server
    syncSettingsWithServer(systemData);
}

/**
 * Show notification message
 */
function showNotification(message, type = 'success') {
    // Check if notification container exists
    let notificationContainer = document.querySelector('.notification-container');
    
    // If not, create one
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', function() {
        notification.remove();
    });
    
    notification.appendChild(closeBtn);
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

/**
 * Listen for system theme changes
 */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
    const systemData = JSON.parse(localStorage.getItem('systemSettings')) || {};
    if (systemData.appearance && systemData.appearance.theme === 'system') {
        applyCurrentTheme(systemData.appearance);
    }
});

/**
 * Check for dark mode support
 */
function supportsDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Add custom CSS styles for notification system
 */
function addNotificationStyles() {
    if (!document.getElementById('notification-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'notification-styles';
        styleEl.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                max-width: 300px;
            }
            .notification {
                margin-bottom: 10px;
                padding: 15px 20px;
                border-radius: 4px;
                color: #fff;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                position: relative;
                animation: slideIn 0.3s ease-out forwards;
            }
            .notification.success {
                background-color: #4caf50;
            }
            .notification.error {
                background-color: #f44336;
            }
            .notification.info {
                background-color: #2196f3;
            }
            .notification.warning {
                background-color: #ff9800;
            }
            .notification-close {
                position: absolute;
                top: 5px;
                right: 5px;
                background: transparent;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                outline: none;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styleEl);
    }
}

// Add notification styles on page load
addNotificationStyles();

/**
 * Export settings to JSON file
 */
function exportSettings() {
    const systemData = JSON.parse(localStorage.getItem('systemSettings')) || {};
    const dataStr = JSON.stringify(systemData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'system-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

/**
 * Import settings from JSON file
 */
function importSettings(file) {
    const reader = new FileReader();
    
    reader.onload = function(event) {
        try {
            const systemData = JSON.parse(event.target.result);
            localStorage.setItem('systemSettings', JSON.stringify(systemData));
            showNotification('Settings imported successfully. Refreshing page...', 'info');
            
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (e) {
            showNotification('Error importing settings: Invalid file format', 'error');
        }
    };
    
    reader.readAsText(file);
}

/**
 * Track last activity time for automatic logout (if configured)
 */
let lastActivityTime = Date.now();
const INACTIVE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function resetActivityTimer() {
    lastActivityTime = Date.now();
}

function checkInactivity() {
    const systemData = JSON.parse(localStorage.getItem('systemSettings')) || {};
    const autoLogout = systemData.advanced?.autoLogout === true;
    
    if (autoLogout && Date.now() - lastActivityTime > INACTIVE_TIMEOUT) {
        // Redirect to login page after inactivity
        window.location.href = 'login.html';
    }
}

// Setup activity tracking
['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(eventType => {
    document.addEventListener(eventType, resetActivityTimer, true);
});

// Check inactivity every minute
setInterval(checkInactivity, 60000);

/**
 * Setup media query listeners for responsive adjustments
 */
function setupResponsiveListeners() {
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    
    function handleScreenSizeChange(e) {
        if (e.matches) {
            // Mobile view adjustments
            document.body.classList.add('mobile-view');
        } else {
            // Desktop view adjustments
            document.body.classList.remove('mobile-view');
        }
    }
    
    // Initial check
    handleScreenSizeChange(mobileQuery);
    
    // Add listener
    mobileQuery.addEventListener('change', handleScreenSizeChange);
}

// Setup responsive behaviors
setupResponsiveListeners();

/**
 * Connect with server API for settings synchronization
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Data to send
 * @returns {Promise} - Promise resolving to API response
 */
function connectWithAPI(endpoint, data = null) {
    // Base API URL - replace with your actual server URL
    const baseURL = '/api';
    const url = `${baseURL}/${endpoint}`;
    
    const options = {
        method: data ? 'POST' : 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        credentials: 'include' // Include cookies for authentication
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('API Connection Error:', error);
            // For system settings page, we'll just show a notification but continue
            // since settings are also stored locally
            showNotification('Could not connect to server. Changes saved locally only.', 'warning');
            return null;
        });
}

/**
 * Get authentication token from local storage or cookies
 * @returns {string} Auth token or empty string if not found
 */
function getAuthToken() {
    // First try to get from localStorage
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (userData.authToken) {
        return userData.authToken;
    }
    
    // If not in localStorage, try to get from cookie
    const tokenCookie = document.cookie.split(';').find(c => c.trim().startsWith('authToken='));
    if (tokenCookie) {
        return tokenCookie.split('=')[1].trim();
    }
    
    return '';
}

/**
 * Synchronize settings with server
 * @param {Object} settings - The settings to sync
 */
function syncSettingsWithServer(settings) {
    // Only sync if user is authenticated
    if (!getAuthToken()) {
        return; // Not authenticated, don't try to sync
    }
    
    // Add timestamp to track when settings were last updated
    settings.lastUpdated = Date.now();
    
    connectWithAPI('settings/system', {
        action: 'update',
        settings: settings
    }).then(response => {
        if (response && response.success) {
            console.log('Settings synced with server successfully');
            
            // If server has newer settings, ask user if they want to update
            if (response.hasNewerSettings) {
                if (confirm('Server has newer settings. Would you like to update your local settings?')) {
                    localStorage.setItem('systemSettings', JSON.stringify(response.settings));
                    showNotification('Settings updated from server', 'info');
                    setTimeout(() => window.location.reload(), 1000);
                }
            }
        }
    });
}

/**
 * Initialize export/import buttons
 */
function initializeDataTransfer() {
    // Export settings button
    const exportBtn = document.getElementById('exportSettings');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportSettings();
        });
    }
    
    // Import settings button and hidden file input
    const importBtn = document.getElementById('importSettings');
    const importInput = document.getElementById('importInput');
    
    if (importBtn && importInput) {
        importBtn.addEventListener('click', function() {
            importInput.click();
        });
        
        importInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                importSettings(e.target.files[0]);
            }
        });
    } else if (importBtn) {
        // Create hidden file input if it doesn't exist
        const input = document.createElement('input');
        input.type = 'file';
        input.id = 'importInput';
        input.accept = '.json';
        input.style.display = 'none';
        document.body.appendChild(input);
        
        importBtn.addEventListener('click', function() {
            input.click();
        });
        
        input.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                importSettings(e.target.files[0]);
            }
        });
    }
}

/**
 * Check for admin privileges and show admin options if applicable
 */
function checkAdminPrivileges() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    if (userData.role === 'admin') {
        // Add admin options to the Advanced tab
        const advancedSection = document.getElementById('advanced');
        if (advancedSection) {
            const adminSection = document.createElement('div');
            adminSection.className = 'form-group';
            adminSection.innerHTML = `
                <h3>Admin Controls</h3>
                <p>These controls are only visible to administrators.</p>
                <button type="button" class="btn btn-danger" id="systemMaintenance">Enable Maintenance Mode</button>
                <button type="button" class="btn btn-outline" id="viewLogs">View System Logs</button>
                <button type="button" class="btn btn-outline" id="syncAllUsers">Sync Settings to All Users</button>
            `;
            
            advancedSection.insertBefore(adminSection, advancedSection.querySelector('.form-group:last-child'));
            
            // Add event listeners for admin buttons
            document.getElementById('systemMaintenance').addEventListener('click', function() {
                if (confirm('Enable system maintenance mode? This will prevent regular users from accessing the system.')) {
                    connectWithAPI('admin/maintenance', { enabled: true })
                        .then(response => {
                            if (response && response.success) {
                                showNotification('Maintenance mode enabled', 'success');
                                this.textContent = 'Disable Maintenance Mode';
                            }
                        });
                }
            });
            
            document.getElementById('viewLogs').addEventListener('click', function() {
                window.location.href = 'admin-dashboard.html?section=logs';
            });
            
            document.getElementById('syncAllUsers').addEventListener('click', function() {
                if (confirm('Sync current system settings to all users? This will override their individual settings.')) {
                    const systemData = JSON.parse(localStorage.getItem('systemSettings')) || {};
                    
                    connectWithAPI('admin/sync-settings', { settings: systemData })
                        .then(response => {
                            if (response && response.success) {
                                showNotification(`Settings synced to ${response.userCount} users`, 'success');
                            }
                        });
                }
            });
        }
    }
}

/**
 * Initialize WebSocket connection for real-time updates
 */
function initializeWebSocket() {
    // Only connect if there's an auth token
    if (!getAuthToken()) return;
    
    try {
        // Create WebSocket connection
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/settings`;
        
        const socket = new WebSocket(wsUrl);
        
        socket.onopen = function() {
            console.log('WebSocket connection established');
            
            // Send authentication information
            socket.send(JSON.stringify({
                type: 'auth',
                token: getAuthToken()
            }));
        };
        
        socket.onmessage = function(event) {
            try {
                const data = JSON.parse(event.data);
                
                switch (data.type) {
                    case 'settings_update':
                        handleSettingsUpdate(data.settings);
                        break;
                    
                    case 'maintenance_mode':
                        handleMaintenanceMode(data.enabled);
                        break;
                        
                    case 'system_notification':
                        showNotification(data.message, data.notificationType || 'info');
                        break;
                        
                    default:
                        console.log('Unknown WebSocket message type:', data.type);
                }
            } catch (error) {
                console.error('Error processing WebSocket message:', error);
            }
        };
        
        socket.onerror = function(error) {
            console.error('WebSocket error:', error);
        };
        
        socket.onclose = function() {
            console.log('WebSocket connection closed');
            // Try to reconnect after a delay
            setTimeout(initializeWebSocket, 5000);
        };
        
        // Store socket in global variable for later use
        window.settingsSocket = socket;
        
        // Close socket when page is unloaded
        window.addEventListener('beforeunload', function() {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        });
    } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
    }
}

/**
 * Handle settings update from WebSocket
 */
function handleSettingsUpdate(settings) {
    if (!settings) return;
    
    const currentSettings = JSON.parse(localStorage.getItem('systemSettings')) || {};
    
    // Check if the server settings are newer
    if (!currentSettings.lastUpdated || settings.lastUpdated > currentSettings.lastUpdated) {
        if (confirm('New system settings are available. Would you like to update now?')) {
            localStorage.setItem('systemSettings', JSON.stringify(settings));
            showNotification('Settings updated from server', 'info');
            setTimeout(() => window.location.reload(), 1000);
        }
    }
}

/**
 * Handle maintenance mode notification
 */
function handleMaintenanceMode(enabled) {
    if (enabled) {
        // Show maintenance mode banner
        const banner = document.createElement('div');
        banner.className = 'maintenance-banner';
        banner.innerHTML = `
            <strong>System Maintenance Mode Active</strong>
            <p>The system is currently in maintenance mode. Some features may be unavailable.</p>
        `;
        document.body.prepend(banner);
        
        showNotification('System is now in maintenance mode', 'warning');
    } else {
        // Remove maintenance mode banner if exists
        const banner = document.querySelector('.maintenance-banner');
        if (banner) {
            banner.remove();
        }
        
        showNotification('Maintenance mode has been disabled', 'info');
    }
}

/**
 * Set up server-side event listeners
 */
function initializeSSE() {
    // Only connect if there's an auth token
    if (!getAuthToken()) return;
    
    try {
        // Create EventSource connection for server-sent events
        const sseUrl = `/api/events?token=${encodeURIComponent(getAuthToken())}`;
        const source = new EventSource(sseUrl);
        
        source.addEventListener('settings', function(event) {
            const data = JSON.parse(event.data);
            handleSettingsUpdate(data);
        });
        
        source.addEventListener('maintenance', function(event) {
            const data = JSON.parse(event.data);
            handleMaintenanceMode(data.enabled);
        });
        
        source.addEventListener('notification', function(event) {
            const data = JSON.parse(event.data);
            showNotification(data.message, data.type || 'info');
        });
        
        source.onerror = function() {
            console.error('SSE connection error');
            source.close();
            // Try to reconnect after a delay
            setTimeout(initializeSSE, 5000);
        };
        
        // Store source in global variable for later use
        window.settingsEventSource = source;
        
        // Close event source when page is unloaded
        window.addEventListener('beforeunload', function() {
            if (source) {
                source.close();
            }
        });
    } catch (error) {
        console.error('Failed to initialize SSE:', error);
    }
}

/**
 * Connect to server and load remote settings
 */
function loadRemoteSettings() {
    // Only try to load if user is authenticated
    if (!getAuthToken()) return;
    
    connectWithAPI('settings/system')
        .then(response => {
            if (response && response.settings) {
                const localSettings = JSON.parse(localStorage.getItem('systemSettings')) || {};
                
                // If no local settings or server settings are newer
                if (!localSettings.lastUpdated || response.settings.lastUpdated > localSettings.lastUpdated) {
                    localStorage.setItem('systemSettings', JSON.stringify(response.settings));
                    showNotification('Settings loaded from server', 'info');
                    window.location.reload();
                }
            }
        });
}

// Initialize data transfer buttons
initializeDataTransfer();

// Check for admin privileges and show admin panel if applicable
checkAdminPrivileges();

// Connect to server via WebSocket for real-time updates
initializeWebSocket();

// Also set up Server-Sent Events as a fallback
initializeSSE();

// Try to load remote settings
loadRemoteSettings();

// Log initialization complete
console.log('System Settings initialization complete!');