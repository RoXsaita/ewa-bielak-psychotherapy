/**
 * Enhanced JavaScript file for Ewa Bielak Psychotherapy website
 * Handles language switching, animations, smooth scrolling, and testimonial display
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize language
    const defaultLanguage = 'pl';
    let currentLanguage = localStorage.getItem('language') || defaultLanguage;
    
    // DOM elements
    const plButton = document.getElementById('pl-button');
    const enButton = document.getElementById('en-button');
    const testimonialContainer = document.querySelector('.testimonial-carousel');
    
    // Enhanced scroll detection to prevent video brightness changes
    let scrollTimeout;
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Apply scrolling class immediately on page load
    document.documentElement.classList.add('scrolling');
    document.body.classList.add('scrolling');
    
    window.addEventListener('scroll', function() {
        // Add scrolling class to both html and body
        document.documentElement.classList.add('scrolling');
        document.body.classList.add('scrolling');
        document.body.classList.add('is-scrolling');
        
        // Store scroll position
        lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Clear any existing timeout
        clearTimeout(scrollTimeout);
        
        // Set a very long timeout to ensure classes stay during normal scrolling
        scrollTimeout = setTimeout(function() {
            // Don't remove scrolling class to maintain consistent appearance
            // document.documentElement.classList.remove('scrolling');
            // document.body.classList.remove('scrolling');
            document.body.classList.remove('is-scrolling');
        }, 1000);
    });
    
    // Handle mouse movement over hero
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', function() {
            document.documentElement.classList.add('scrolling');
            document.body.classList.add('scrolling');
        });
    }
    
    // Update current year in copyright
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize the page
    setLanguage(currentLanguage);
    initSmoothScrolling();
    initTestimonialCarousel();
    initScrollEffects();
    
    // Language toggle functionality with enhanced animation
    if (plButton && enButton) {
        plButton.addEventListener('click', function() {
            if (currentLanguage !== 'pl') {
                animateLanguageSwitch('pl');
                currentLanguage = 'pl';
                localStorage.setItem('language', currentLanguage);
                setLanguage(currentLanguage);
                console.log('Switching to Polish');
            }
        });
        
        enButton.addEventListener('click', function() {
            if (currentLanguage !== 'en') {
                animateLanguageSwitch('en');
                currentLanguage = 'en';
                localStorage.setItem('language', currentLanguage);
                setLanguage(currentLanguage);
                console.log('Switching to English');
            }
        });
    } else {
        console.error('Language buttons not found!');
    }
    
    /**
     * Animate language switch with a subtle fade effect
     * @param {string} lang - Language code ('pl' or 'en')
     */
    function animateLanguageSwitch(lang) {
        // Only run animation if supported by browser
        if (typeof document.body.animate === 'function') {
            const contentElements = document.querySelectorAll('[data-i18n]');
            
            contentElements.forEach(element => {
                // Create fade out animation
                element.animate([
                    { opacity: 1 },
                    { opacity: 0.5 }
                ], {
                    duration: 200,
                    easing: 'ease-out',
                    fill: 'forwards'
                }).onfinish = function() {
                    // When fade out is complete, content will be updated by setLanguage
                    // Then create fade in animation
                    element.animate([
                        { opacity: 0.5 },
                        { opacity: 1 }
                    ], {
                        duration: 300,
                        easing: 'ease-in',
                        fill: 'forwards'
                    });
                };
            });
        }
    }
    
    /**
     * Set the website language and update content
     * @param {string} lang - Language code ('pl' or 'en')
     */
    function setLanguage(lang) {
        console.log('Setting language to:', lang);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Update active language button
        if (plButton && enButton) {
            if (lang === 'pl') {
                plButton.classList.add('active');
                enButton.classList.remove('active');
            } else {
                plButton.classList.remove('active');
                enButton.classList.add('active');
            }
        }
        
        // Update all translatable elements
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const keys = key.split('.');
            
            // Navigate through the translations object to find the right text
            let text = translations[lang];
            for (const k of keys) {
                if (text && text[k]) {
                    text = text[k];
                } else {
                    console.warn(`Translation missing: ${key} for language ${lang}`);
                    text = '';
                    break;
                }
            }
            
            // Handle special cases like placeholder, title attributes, etc.
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.hasAttribute('placeholder')) {
                    element.placeholder = text;
                } else {
                    element.value = text;
                }
            } else if (element.hasAttribute('data-i18n-attr')) {
                const attr = element.getAttribute('data-i18n-attr');
                element.setAttribute(attr, text);
            } else {
                element.innerHTML = text;
            }
        });
        
        // Update service cards
        updateServiceCards(lang);
        
        // Update testimonials
        updateTestimonials(lang);
        
        // Update credentials
        updateCredentials(lang);
        
        // Update meta tags for SEO
        updateMetaTags(lang);
    }
    
    /**
     * Update service cards based on language
     * @param {string} lang - Language code
     */
    function updateServiceCards(lang) {
        const servicesContainer = document.querySelector('.services-cards');
        if (!servicesContainer) return;
        
        servicesContainer.innerHTML = '';
        
        const services = translations[lang].services.items;
        services.forEach((service, index) => {
            const card = document.createElement('div');
            card.className = 'service-card slide-up';
            card.style.animationDelay = `${index * 100}ms`;
            
            let highlightsHTML = '';
            service.highlights.forEach(item => {
                highlightsHTML += `<li><i class="fas fa-check"></i> ${item}</li>`;
            });
            
            card.innerHTML = `
                <h3>${service.title}</h3>
                <p class="service-brief">${service.brief}</p>
                <p class="service-description">${service.description}</p>
                <ul class="service-highlights">
                    ${highlightsHTML}
                </ul>
            `;
            
            servicesContainer.appendChild(card);
        });
        
        // Trigger animation on newly created elements
        setTimeout(() => {
            const serviceObserver = document.querySelector('.services-section .services-cards');
            if (serviceObserver && 'IntersectionObserver' in window) {
                const serviceCards = serviceObserver.querySelectorAll('.service-card');
                
                serviceCards.forEach(card => {
                    card.style.visibility = 'hidden';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                });
                
                // Force reflow
                serviceObserver.offsetHeight;
                
                // Apply animation
                serviceCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.visibility = 'visible';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }
        }, 0);
    }
    
    /**
     * Update testimonials based on language
     * @param {string} lang - Language code
     */
    function updateTestimonials(lang) {
        // Update both the grid and carousel (for compatibility)
        const testimonialGrid = document.querySelector('.testimonial-grid');
        if (!testimonialGrid) return;
        
        testimonialGrid.innerHTML = '';
        
        // Update credit line
        const creditLine = document.querySelector('[data-i18n="testimonials.creditLine"]');
        if (creditLine) {
            creditLine.innerHTML = translations[lang].testimonials.creditLine;
        }
        
        const testimonials = translations[lang].testimonials.items;
        testimonials.forEach((testimonial, index) => {
            // Create testimonial card with star rating
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.style.animationDelay = `${index * 100}ms`;
            
            // Create 5-star rating
            const stars = document.createElement('div');
            stars.className = 'testimonial-stars';
            stars.innerHTML = '★★★★★'; // 5 stars for all testimonials
            
            // Create the quote with truncated text
            const quote = document.createElement('div');
            quote.className = 'testimonial-quote';
            quote.innerHTML = `<p>"${testimonial.quote}"</p>`;
            
            // Create footer with name and date
            const footer = document.createElement('div');
            footer.className = 'testimonial-footer';
            footer.innerHTML = `
                <strong>${testimonial.name}</strong>
                <span>${testimonial.details}</span>
            `;
            
            // Assemble the card
            card.appendChild(stars);
            card.appendChild(quote);
            card.appendChild(footer);
            
            // Add to the grid
            testimonialGrid.appendChild(card);
        });
        
        // Animate testimonial cards
        setTimeout(() => {
            const testimonialCards = testimonialGrid.querySelectorAll('.testimonial-card');
            testimonialCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 0);
        
        // For compatibility with existing carousel functionality
        if (testimonialContainer) {
            testimonialContainer.innerHTML = '';
            
            testimonials.forEach((testimonial, index) => {
                const slide = document.createElement('div');
                slide.className = `testimonial-slide ${index === 0 ? 'active' : ''}`;
                
                slide.innerHTML = `
                    <blockquote>
                        <p>"${testimonial.quote}"</p>
                        <footer>
                            <strong>${testimonial.name}</strong>
                            <span>${testimonial.details}</span>
                        </footer>
                    </blockquote>
                `;
                
                testimonialContainer.appendChild(slide);
            });
            
            // Reset carousel
            currentSlide = 0;
            updateCarouselIndicators();
        }
    }
    
    /**
     * Update credentials based on language
     * @param {string} lang - Language code
     */
    function updateCredentials(lang) {
        const qualificationsContainer = document.querySelector('.qualifications-grid');
        if (!qualificationsContainer) return;
        
        qualificationsContainer.innerHTML = '';
        
        const credentials = translations[lang].about.credentials;
        credentials.forEach((credential, index) => {
            const card = document.createElement('div');
            card.className = 'qualification-card';
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            
            card.innerHTML = `
                <div class="qualification-title">${credential.title}</div>
                <div class="qualification-institution">${credential.institution}</div>
            `;
            
            qualificationsContainer.appendChild(card);
            
            // Staggered fade-in animation
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
    
    /**
     * Update meta tags for SEO based on language
     * @param {string} lang - Language code
     */
    function updateMetaTags(lang) {
        // Update page title
        document.title = `${translations[lang].hero.name} - ${translations[lang].hero.subtitle}`;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', translations[lang].hero.tagline);
        }
        
        // Update Open Graph tags if they exist
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        
        if (ogTitle) {
            ogTitle.setAttribute('content', `${translations[lang].hero.name} - ${translations[lang].hero.subtitle}`);
        }
        
        if (ogDescription) {
            ogDescription.setAttribute('content', translations[lang].hero.tagline);
        }
    }
    
    /**
     * Initialize smooth scrolling for anchor links
     */
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Highlight the clicked link
                    document.querySelectorAll('a[href^="#"]').forEach(a => {
                        a.classList.remove('active-link');
                    });
                    this.classList.add('active-link');
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Account for header height
                        behavior: 'smooth'
                    });
                    
                    // Add URL hash without scrolling
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    } else {
                        location.hash = targetId;
                    }
                    
                    // Close mobile menu if open
                    const mobileMenu = document.querySelector('.mobile-menu.active');
                    if (mobileMenu) {
                        mobileMenu.classList.remove('active');
                    }
                }
            });
        });
    }
    
    /**
     * Initialize scroll-based effects and animations
     */
    function initScrollEffects() {
        // Highlight active section in navigation based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        function highlightActiveSection() {
            const scrollPosition = window.scrollY + 100; // Offset to account for header
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active-link');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active-link');
                        }
                    });
                }
            });
        }
        
        window.addEventListener('scroll', highlightActiveSection);
        
        // Run initially to highlight current section
        highlightActiveSection();
    }
    
    // Testimonial carousel variables
    let currentSlide = 0;
    let intervalId = null;
    
    /**
     * Initialize testimonial carousel
     */
    function initTestimonialCarousel() {
        if (!testimonialContainer) return;
        
        const slides = testimonialContainer.querySelectorAll('.testimonial-slide');
        if (slides.length === 0) return;
        
        // Create carousel controls
        createCarouselControls(slides.length);
        
        // Start automatic rotation
        startCarouselInterval();
        
        // Pause rotation on hover
        testimonialContainer.addEventListener('mouseenter', () => {
            clearInterval(intervalId);
        });
        
        testimonialContainer.addEventListener('mouseleave', () => {
            startCarouselInterval();
        });
    }
    
    /**
     * Create carousel controls (next/prev buttons and indicators)
     * @param {number} slideCount - Number of slides
     */
    function createCarouselControls(slideCount) {
        // Create container for controls
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'carousel-controls';
        
        // Add prev/next buttons
        controlsContainer.innerHTML = `
            <button class="carousel-prev" aria-label="Previous testimonial">
                <i class="fas fa-chevron-left"></i>
            </button>
            <div class="carousel-indicators"></div>
            <button class="carousel-next" aria-label="Next testimonial">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        testimonialContainer.parentNode.appendChild(controlsContainer);
        
        // Add indicators
        const indicatorsContainer = controlsContainer.querySelector('.carousel-indicators');
        for (let i = 0; i < slideCount; i++) {
            const indicator = document.createElement('button');
            indicator.className = i === 0 ? 'active' : '';
            indicator.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            
            indicator.addEventListener('click', () => {
                goToSlide(i);
            });
            
            indicatorsContainer.appendChild(indicator);
        }
        
        // Add event listeners for prev/next buttons
        controlsContainer.querySelector('.carousel-prev').addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });
        
        controlsContainer.querySelector('.carousel-next').addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });
    }
    
    /**
     * Start carousel automatic rotation
     */
    function startCarouselInterval() {
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000); // Change slide every 5 seconds
    }
    
    /**
     * Go to a specific slide
     * @param {number} slideIndex - Index of the slide to show
     */
    function goToSlide(slideIndex) {
        const slides = testimonialContainer.querySelectorAll('.testimonial-slide');
        if (slides.length === 0) return;
        
        // Handle wraparound
        if (slideIndex < 0) {
            slideIndex = slides.length - 1;
        } else if (slideIndex >= slides.length) {
            slideIndex = 0;
        }
        
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        
        // Add active class to new slide
        slides[slideIndex].classList.add('active');
        
        // Update current slide index
        currentSlide = slideIndex;
        
        // Update indicators
        updateCarouselIndicators();
    }
    
    /**
     * Update carousel indicators to reflect current slide
     */
    function updateCarouselIndicators() {
        const indicators = document.querySelectorAll('.carousel-indicators button');
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', mobileMenu.classList.contains('active'));
            
            // Update toggle appearance
            const spans = this.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans.forEach(span => {
                    span.removeAttribute('style');
                });
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenu && !mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                
                // Reset toggle appearance
                const spans = menuToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.removeAttribute('style');
                });
            }
        }
    });
}); 