/**
 * Help and Support Center JavaScript
 * Natural Surplus Investment
 * 
 * This script handles all functionality for the help and support center including:
 * - Search functionality
 * - FAQ accordion toggles
 * - Category navigation
 * - Contact form submission
 * - Live chat widget
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initSearchFunctionality();
    initFaqAccordions();
    initCategoryNavigation();
    initContactForm();
    initChatWidget();
    initTabNavigation();
    initBackToTop();
    initFileUpload();
    initAnalytics();
});

/**
 * Initialize search functionality
 */
function initSearchFunctionality() {
    const searchInput = document.getElementById('support-search');
    const clearSearchBtn = document.getElementById('clear-search');
    const faqItems = document.querySelectorAll('.faq-item');
    const faqSections = document.querySelectorAll('.faq-section');
    const noResultsMessage = createElement('div', {
        className: 'no-results-message',
        innerHTML: '<i class="fas fa-search"></i><p>No results found. Please try a different search term.</p>'
    });
    
    if (!searchInput || !clearSearchBtn) return;
    
    // Add event listener for search input
    searchInput.addEventListener('input', debounce(function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        // Remove any existing no results message
        const existingMessage = document.querySelector('.no-results-message');
        if (existingMessage) existingMessage.remove();
        
        // Reset all items if search is cleared
        if (searchTerm === '') {
            faqItems.forEach(item => {
                item.style.display = '';
                item.classList.remove('search-highlight');
            });
            
            faqSections.forEach(section => {
                section.style.display = '';
            });
            
            return;
        }
        
        let hasResults = false;
        
        // Show only matching items
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = '';
                item.classList.add('search-highlight');
                hasResults = true;
                
                // Expand items that match search
                const answerElement = item.querySelector('.faq-answer');
                const toggleElement = item.querySelector('.faq-toggle i');
                
                if (answerElement && !answerElement.classList.contains('active')) {
                    answerElement.classList.add('active');
                    answerElement.style.maxHeight = answerElement.scrollHeight + 'px';
                    toggleElement.className = 'fas fa-chevron-up';
                }
                
                // Make sure the section is visible
                const parentSection = item.closest('.faq-section');
                if (parentSection) {
                    parentSection.style.display = '';
                    
                    // Activate the corresponding tab
                    const sectionId = parentSection.id;
                    const tabBtn = document.querySelector(`.tab-btn[data-target="${sectionId}"]`);
                    if (tabBtn) {
                        activateTab(tabBtn);
                    }
                }
            } else {
                item.style.display = 'none';
                item.classList.remove('search-highlight');
            }
        });
        
        // Hide sections with no visible items
        faqSections.forEach(section => {
            const visibleItems = section.querySelectorAll('.faq-item[style="display: none;"]');
            if (visibleItems.length === section.querySelectorAll('.faq-item').length) {
                section.style.display = 'none';
            } else {
                section.style.display = '';
            }
        });
        
        // Show "no results" message if needed
        if (!hasResults) {
            const faqContainer = document.querySelector('.faq-container');
            if (faqContainer) {
                faqContainer.appendChild(noResultsMessage);
            }
        }
    }, 300));
    
    // Add event listener for clear search button
    clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        
        // Reset all items
        faqItems.forEach(item => {
            item.style.display = '';
            item.classList.remove('search-highlight');
            
            // Reset accordions to closed state
            const answerElement = item.querySelector('.faq-answer');
            const toggleElement = item.querySelector('.faq-toggle i');
            
            if (answerElement && answerElement.classList.contains('active')) {
                answerElement.classList.remove('active');
                answerElement.style.maxHeight = null;
                toggleElement.className = 'fas fa-chevron-down';
            }
        });
        
        // Show all sections
        faqSections.forEach(section => {
            section.style.display = '';
        });
        
        // Remove any existing no results message
        const existingMessage = document.querySelector('.no-results-message');
        if (existingMessage) existingMessage.remove();
        
        // Focus the search input
        searchInput.focus();
    });
}

/**
 * Initialize FAQ accordion toggles
 */
function initFaqAccordions() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const toggleIcon = this.querySelector('.faq-toggle i');
            
            // Toggle active state
            answer.classList.toggle('active');
            
            // Update max height for animation
            if (answer.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                toggleIcon.className = 'fas fa-chevron-up';
            } else {
                answer.style.maxHeight = null;
                toggleIcon.className = 'fas fa-chevron-down';
            }
        });
    });
}

/**
 * Initialize category navigation
 */
function initCategoryNavigation() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Find and activate the corresponding tab
                const tabBtn = document.querySelector(`.tab-btn[data-target="${targetId}"]`);
                if (tabBtn) {
                    activateTab(tabBtn);
                }
                
                // Scroll to the section with smooth animation
                const yOffset = -100; // Adjust offset as needed
                const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
                
                // Update URL hash (without scrolling)
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
    
    // Check URL hash on page load
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // Find and activate the corresponding tab
            const tabBtn = document.querySelector(`.tab-btn[data-target="${targetId}"]`);
            if (tabBtn) {
                setTimeout(() => {
                    activateTab(tabBtn);
                    
                    // Scroll to the section
                    const yOffset = -100;
                    const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    
                    window.scrollTo({
                        top: y,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        }
    }
}

/**
 * Initialize tab navigation
 */
function initTabNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            activateTab(this);
        });
    });
}

/**
 * Activate a specific tab
 */
function activateTab(tabBtn) {
    const targetId = tabBtn.getAttribute('data-target');
    const targetSection = document.getElementById(targetId);
    
    // Hide all sections and deactivate all tabs
    document.querySelectorAll('.faq-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activate the selected tab and section
    if (targetSection) {
        targetSection.classList.add('active');
        tabBtn.classList.add('active');
    }
}

/**
 * Initialize contact form functionality
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const statusMessage = document.getElementById('status-message');
    
    if (!contactForm || !statusMessage) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showStatusMessage('error', 'Please fill in all required fields.');
            return;
        }
        
        // Email validation
        if (!isValidEmail(email)) {
            showStatusMessage('error', 'Please enter a valid email address.');
            return;
        }
        
        // Show loading state
        showStatusMessage('loading', 'Sending your message...');
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Simulate successful submission
            showStatusMessage('success', 'Your message has been sent! We\'ll get back to you shortly.');
            
            // Reset form
            contactForm.reset();
            
            // Clear file upload label
            const fileLabel = document.querySelector('.file-text');
            if (fileLabel) {
                fileLabel.textContent = 'Choose a file';
            }
            
            // Hide message after 5 seconds
            setTimeout(() => {
                statusMessage.classList.remove('show');
            }, 5000);
        }, 1500);
    });
}

/**
 * Show status message
 */
function showStatusMessage(type, message) {
    const statusMessage = document.getElementById('status-message');
    if (!statusMessage) return;
    
    // Clear any existing classes
    statusMessage.className = 'status-message';
    
    // Add appropriate class and message
    statusMessage.classList.add('show', type);
    
    if (type === 'loading') {
        statusMessage.innerHTML = `
            <div class="spinner"></div>
            <span>${message}</span>
        `;
    } else {
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        statusMessage.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
    }
    
    // Scroll to message
    statusMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Initialize chat widget functionality
 */
function initChatWidget() {
    const startChatBtn = document.getElementById('start-chat');
    const chatWidget = document.getElementById('chat-widget');
    const closeChat = document.getElementById('close-chat');
    const minimizeChat = document.getElementById('minimize-chat');
    const chatInput = document.getElementById('chat-input-field');
    const sendMessageBtn = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');
    
    if (!startChatBtn || !chatWidget) return;
    
    // Open chat widget
    startChatBtn.addEventListener('click', function() {
        chatWidget.classList.add('active');
        chatInput.focus();
        
        // Add 'minimized' class if it was minimized before
        if (chatWidget.classList.contains('minimized')) {
            chatWidget.classList.remove('minimized');
        }
    });
    
    // Close chat widget
    if (closeChat) {
        closeChat.addEventListener('click', function() {
            chatWidget.classList.remove('active');
        });
    }
    
    // Minimize chat widget
    if (minimizeChat) {
        minimizeChat.addEventListener('click', function() {
            chatWidget.classList.toggle('minimized');
            
            // Update button icon
            if (chatWidget.classList.contains('minimized')) {
                minimizeChat.innerHTML = '<i class="fas fa-expand"></i>';
            } else {
                minimizeChat.innerHTML = '<i class="fas fa-minus"></i>';
                chatInput.focus();
            }
        });
    }
    
    // Send message
    if (sendMessageBtn && chatInput && chatMessages) {
        // Send on button click
        sendMessageBtn.addEventListener('click', function() {
            sendChatMessage();
        });
        
        // Send on Enter key
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }
    
    // Attach file button
    const attachFileBtn = document.getElementById('attach-file');
    if (attachFileBtn) {
        attachFileBtn.addEventListener('click', function() {
            showStatusMessage('info', 'File attachment feature coming soon!');
        });
    }
}

/**
 * Send a chat message
 */
function sendChatMessage() {
    const chatInput = document.getElementById('chat-input-field');
    const chatMessages = document.getElementById('chat-messages');
    
    if (!chatInput || !chatMessages) return;
    
    const message = chatInput.value.trim();
    
    if (message) {
        // Add user message
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const userMessageHTML = `
            <div class="message user">
                <div class="message-content">
                    <p>${escapeHTML(message)}</p>
                    <span class="message-time">${currentTime}</span>
                </div>
            </div>
        `;
        
        chatMessages.insertAdjacentHTML('beforeend', userMessageHTML);
        
        // Clear input
        chatInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate response after a short delay
        setTimeout(() => {
            const responses = [
                "Thank you for your message. A support agent will be with you shortly.",
                "I understand your concern. Let me check that for you.",
                "We're looking into this issue and will get back to you as soon as possible.",
                "Thank you for providing that information. Is there anything else you'd like to ask?",
                "I'll connect you with a specialist who can help with your specific question."
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            const supportMessageHTML = `
                <div class="message support">
                    <div class="message-content">
                        <p>${randomResponse}</p>
                        <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            `;
            
            chatMessages.insertAdjacentHTML('beforeend', supportMessageHTML);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (!backToTopBtn) return;
    
    // Show or hide the button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initialize file upload functionality
 */
function initFileUpload() {
    const fileInput = document.getElementById('attachment');
    const fileLabel = document.querySelector('.file-text');
    
    if (!fileInput || !fileLabel) return;
    
    fileInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            const fileName = this.files[0].name;
            fileLabel.textContent = fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName;
            
            // Check file size
            const fileSize = this.files[0].size / 1024 / 1024; // Convert to MB
            if (fileSize > 5) {
                showStatusMessage('error', 'File size exceeds 5MB limit. Please choose a smaller file.');
                this.value = '';
                fileLabel.textContent = 'Choose a file';
            }
        } else {
            fileLabel.textContent = 'Choose a file';
        }
    });
}

/**
 * Initialize analytics tracking
 */
function initAnalytics() {
    // Track FAQ interactions
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            const question = this.querySelector('.faq-question h3').textContent;
            const category = this.closest('.faq-section').getAttribute('data-category');
            
            // Example analytics tracking (replace with your actual implementation)
            console.log('FAQ Interaction:', { category, question });
        });
    });
    
    // Track category card clicks
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Example analytics tracking
            console.log('Category Selected:', category);
        });
    });
}

/**
 * Utility function to create HTML elements
 */
function createElement(tag, attributes = {}) {
    const element = document.createElement(tag);
    
    for (const key in attributes) {
        if (key === 'className') {
            element.className = attributes[key];
        } else if (key === 'innerHTML') {
            element.innerHTML = attributes[key];
        } else {
            element.setAttribute(key, attributes[key]);
        }
    }
    
    return element;
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Utility function to validate email format
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Utility function to escape HTML
 */
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function(match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match];
    });
}