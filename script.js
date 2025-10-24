/**
 * Ariatek Studio Desktop Homepage JavaScript
 * Handles smooth scrolling, animations, and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initScrollAnimations();
    initHeaderScroll();
    initFormHandling();
    initCounterAnimations();
    initParallaxEffects();
});

/**
 * Smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize scroll-based animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.service__card, .portfolio__item, .pricing__card, .testimonial__card, .about__values .value'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('fade-in-up');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Set initial styles and observe elements
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
}

/**
 * Header scroll effects
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

/**
 * Form handling and validation
 */
function initFormHandling() {
    const form = document.querySelector('.form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Basic validation
            if (validateForm(formObject)) {
                // Simulate form submission
                showFormSuccess();
            }
        });
    }
}

/**
 * Form validation
 */
function validateForm(data) {
    const requiredFields = ['name', 'email', 'subject', 'message'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = document.querySelector(`input[name="${field}"], textarea[name="${field}"]`);
        if (input && !input.value.trim()) {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else if (input) {
            clearFieldError(input);
        }
    });
    
    // Email validation
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            showFieldError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Show field error
 */
function showFieldError(input, message) {
    clearFieldError(input);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--error-color)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--spacing-xs)';
    
    input.parentNode.appendChild(errorElement);
    input.style.borderColor = 'var(--error-color)';
}

/**
 * Clear field error
 */
function clearFieldError(input) {
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    input.style.borderColor = 'var(--border-color)';
}

/**
 * Show form success message
 */
function showFormSuccess() {
    const submitButton = document.querySelector('.form button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Message Sent!';
    submitButton.style.background = 'var(--success-color)';
    
    setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.style.background = '';
        document.querySelector('.form').reset();
    }, 3000);
}

/**
 * Animate counters in hero stats
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat__number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Animate individual counter
 */
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        const displayValue = Math.floor(current);
        const suffix = element.textContent.replace(/[\d]/g, '');
        element.textContent = displayValue + suffix;
    }, 16);
}

/**
 * Initialize parallax effects
 */
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.floating-card');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

/**
 * Add hover effects to interactive elements
 */
document.addEventListener('DOMContentLoaded', function() {
    // Service cards hover effect
    const serviceCards = document.querySelectorAll('.service__card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Portfolio items hover effect
    const portfolioItems = document.querySelectorAll('.portfolio__item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Pricing cards hover effect
    const pricingCards = document.querySelectorAll('.pricing__card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('pricing__card--featured')) {
                this.style.transform = 'translateY(-8px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('pricing__card--featured')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
});

/**
 * Add typing effect to hero title (optional enhancement)
 */
function initTypingEffect() {
    const titleElement = document.querySelector('.hero__title');
    if (!titleElement) return;
    
    const originalText = titleElement.textContent;
    const words = originalText.split(' ');
    titleElement.textContent = '';
    
    let wordIndex = 0;
    const typeWord = () => {
        if (wordIndex < words.length) {
            titleElement.textContent += words[wordIndex] + ' ';
            wordIndex++;
            setTimeout(typeWord, 200);
        }
    };
    
    setTimeout(typeWord, 1000);
}

/**
 * Add loading animation
 */
function initLoadingAnimation() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <h2>Ariatek Studio</h2>
            <p>Loading Digital Excellence...</p>
        </div>
    `;
    
    const loadingStyles = `
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            color: white;
        }
        
        .loading-content {
            text-align: center;
        }
        
        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 2rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = loadingStyles;
    document.head.appendChild(styleSheet);
    document.body.appendChild(loadingOverlay);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.remove();
            }, 500);
        }, 1500);
    });
}

/**
 * Add scroll progress indicator
 */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress__bar"></div>';
    
    const progressStyles = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: transparent;
            z-index: 1001;
        }
        
        .scroll-progress__bar {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
            width: 0%;
            transition: width 0.1s ease-out;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = progressStyles;
    document.head.appendChild(styleSheet);
    document.body.appendChild(progressBar);
    
    const progressBarElement = progressBar.querySelector('.scroll-progress__bar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBarElement.style.width = scrollPercent + '%';
    });
}

/**
 * Add theme toggle functionality
 */
function initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    
    const themeStyles = `
        .theme-toggle {
            position: fixed;
            top: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            cursor: pointer;
            z-index: 1000;
            transition: var(--transition-normal);
            box-shadow: var(--shadow-lg);
        }
        
        .theme-toggle:hover {
            transform: scale(1.1);
            background: var(--primary-light);
        }
        
        .dark-theme {
            --background-primary: #0f172a;
            --background-secondary: #1e293b;
            --text-primary: #f1f5f9;
            --text-secondary: #cbd5e1;
            --text-light: #64748b;
            --border-color: #334155;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = themeStyles;
    document.head.appendChild(styleSheet);
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    document.body.appendChild(themeToggle);
}

// Initialize additional features (uncomment as needed)
// initTypingEffect();
// initLoadingAnimation();
// initScrollProgress();
// initThemeToggle();
