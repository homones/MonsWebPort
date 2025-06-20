// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const buttons = document.querySelectorAll('[data-section]');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Section Navigation
function showSection(targetSection) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const target = document.getElementById(targetSection);
    if (target) {
        target.classList.add('active');
    }
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === targetSection) {
            link.classList.add('active');
        }
    });
    
    // Close mobile menu if open
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add click event listeners to all navigation elements
buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = button.getAttribute('data-section');
        showSection(targetSection);
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Show home section by default
    showSection('home');
    
    // Add animation delay for skill bars when skills section is shown
    const skillsSection = document.getElementById('skills');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.animation = 'fillBar 1.5s ease-in-out forwards';
                    }, index * 200);
                });
            }
        });
    });
    
    if (skillsSection) {
        observer.observe(skillsSection);
    }
});

// Add smooth transitions when switching sections
function addSectionTransition() {
    sections.forEach(section => {
        section.style.transition = 'opacity 0.3s ease-in-out';
    });
}

// Call the transition function
addSectionTransition();

// Add loading animation for the profile image
const profileImage = document.querySelector('.profile-image');
if (profileImage) {
    profileImage.addEventListener('load', () => {
        profileImage.style.opacity = '1';
        profileImage.style.transform = 'scale(1)';
    });
    
    // Set initial styles for loading animation
    profileImage.style.opacity = '0';
    profileImage.style.transform = 'scale(0.9)';
    profileImage.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
}

// Add hover effects for interactive elements
const interactiveElements = document.querySelectorAll('.prof-skill, .stat-card, .highlight-item');
interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.style.transform = 'translateY(-5px)';
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'translateY(0)';
    });
});

// Add typing effect for the greeting
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when home section is shown
function initTypeWriter() {
    const greeting = document.querySelector('.greeting');
    if (greeting && !greeting.hasAttribute('data-typed')) {
        const originalText = greeting.textContent;
        greeting.setAttribute('data-typed', 'true');
        setTimeout(() => {
            typeWriter(greeting, originalText, 80);
        }, 500);
    }
}

// Add intersection observer for animations
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, {
    threshold: 0.1
});

// Observe elements for animation
document.querySelectorAll('.about-card, .education-card, .prof-skill').forEach(el => {
    animationObserver.observe(el);
});

// Add CSS animation classes
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Add page visibility change handler
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Re-initialize animations when page becomes visible
        const activeSection = document.querySelector('.section.active');
        if (activeSection && activeSection.id === 'home') {
            initTypeWriter();
        }
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 70px;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #1e3a8a, #3b82f6);
        z-index: 1000;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    const updateProgress = debounce(() => {
        const activeSection = document.querySelector('.section.active');
        if (activeSection) {
            const rect = activeSection.getBoundingClientRect();
            const progress = Math.max(0, Math.min(100, 
                ((window.innerHeight - rect.top) / (window.innerHeight + rect.height)) * 100
            ));
            progressBar.style.width = progress + '%';
        }
    }, 10);
    
    window.addEventListener('scroll', updateProgress);
    updateProgress();
}

// Initialize scroll progress
addScrollProgress();

// Add error handling for image loading
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', (e) => {
            console.warn('Image failed to load:', e.target.src);
            // You could add a placeholder here if needed
        });
    });
});
