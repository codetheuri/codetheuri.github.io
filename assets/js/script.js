// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavbar();
    initSmoothScrolling();
    initPortfolio();
    initAnimations();
    initThemeToggle();
    updateCurrentYear();
});

// Navbar functionality
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    
    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        
        // Toggle icon
        if (mobileMenu.classList.contains('active')) {
            menuIcon.className = 'fas fa-times';
        } else {
            menuIcon.className = 'fas fa-bars';
        }
    });
    
    // Close mobile menu when clicking on links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            menuIcon.className = 'fas fa-bars';
        });
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for navbar height
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Portfolio functionality with GitHub API
async function initPortfolio() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    try {
        // Fetch GitHub repositories
        const response = await fetch('https://api.github.com/users/codetheuri/repos?sort=updated&per_page=6');
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }
        
        const repos = await response.json();
        
        // Clear loading message
        portfolioGrid.innerHTML = '';
        
        // Filter and display repositories
        const featuredRepos = repos.filter(repo => !repo.fork && repo.description);
        
        if (featuredRepos.length === 0) {
            portfolioGrid.innerHTML = '<div class="loading">No projects found</div>';
            return;
        }
        
        featuredRepos.slice(0, 6).forEach(repo => {
            const projectCard = createProjectCard(repo);
            portfolioGrid.appendChild(projectCard);
        });
        
    } catch (error) {
        console.error('Error fetching repositories:', error);
        portfolioGrid.innerHTML = `
            <div class="loading">
                <p>Unable to load projects at the moment.</p>
                <p><a href="https://github.com/codetheuri" target="_blank" class="portfolio-link">
                    <i class="fab fa-github"></i> View on GitHub
                </a></p>
            </div>
        `;
    }
}

// Create project card element
function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'portfolio-card';
    
    // Get primary language or default
    const language = repo.language || 'Code';
    
    // Create tech tags from topics or language
    const topics = repo.topics && repo.topics.length > 0 ? repo.topics : [language.toLowerCase()];
    const techTags = topics.slice(0, 3).map(topic => 
        `<span class="tech-tag">${topic}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="portfolio-image" style="background: linear-gradient(135deg, hsl(263, 70%, 50%, 0.1), hsl(280, 100%, 70%, 0.1)); display: flex; align-items: center; justify-content: center;">
            <i class="fab fa-github" style="font-size: 3rem; color: var(--primary); opacity: 0.5;"></i>
        </div>
        <div class="portfolio-content">
            <h3 class="portfolio-title">${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
            <p class="portfolio-description">${repo.description || 'A project built with modern technologies.'}</p>
            <div class="portfolio-tech">
                ${techTags}
            </div>
            <div class="portfolio-links">
                <a href="${repo.html_url}" target="_blank" class="portfolio-link">
                    <i class="fab fa-github"></i> View Code
                </a>
                ${repo.homepage ? `
                    <a href="${repo.homepage}" target="_blank" class="portfolio-link">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>
                ` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Animation functionality
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-card, .contact-item');
    
    // Set initial states
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Skill tags animation delay
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 100}ms`;
    });
}

// Theme Toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    } else {
        body.removeAttribute('data-theme');
        themeIcon.className = 'fas fa-moon';
    }
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            // Switch to light theme
            body.removeAttribute('data-theme');
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        } else {
            // Switch to dark theme
            body.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        }
        
        // Add a subtle animation effect
        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
}

// Update current year in footer
function updateCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Utility function to debounce scroll events
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

// Smooth reveal animation for sections
function revealOnScroll() {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const revealPoint = 150;
        
        if (sectionTop < windowHeight - revealPoint) {
            section.classList.add('active');
        }
    });
}

// Add scroll event listener with debouncing
window.addEventListener('scroll', debounce(revealOnScroll, 10));

// Initialize reveal on load
revealOnScroll();