// Load navbar and footer
document.addEventListener('DOMContentLoaded', function () {
    loadNavbar();
    loadFooter();
    initializeEventListeners();
});

// Load navbar
function loadNavbar() {
    fetch('components/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            initializeNavbar();
        })
        .catch(error => console.error('Error loading navbar:', error));
}

// Load footer
function loadFooter() {
    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Initialize navbar functionality

// Initialize navbar functionality
function initializeNavbar() {
    const navToggle = document.querySelector('.nav-mobile-toggle');
    const navContainer = document.querySelector('.nav-container');

    if (navToggle && navContainer) {
        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            navContainer.classList.toggle('active');

            if (navContainer.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't close if it's the Workshop dropdown trigger
                if (!link.parentElement.classList.contains('nav-dropdown') || link.classList.contains('dropdown-link')) {
                    navContainer.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navContainer.classList.contains('active') && 
                !navContainer.contains(e.target) && 
                !navToggle.contains(e.target)) {
                navContainer.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // CTA button smooth scroll
    setTimeout(() => {
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', function () {
                const servicesSection = document.getElementById('services') || document.querySelector('.services');
                if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }, 100);
}

// Modal functionality
// Modal functionality
function openServiceModal(type) {
    let modalId = '';
    if (type === 'printing') modalId = 'printingModal';
    if (type === 'scanning') modalId = 'scanningModal';
    if (type === 'designing') modalId = 'designingModal';

    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeServiceModal(type) {
    let modalId = '';
    if (type === 'printing') modalId = 'printingModal';
    if (type === 'scanning') modalId = 'scanningModal';
    if (type === 'designing') modalId = 'designingModal';

    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modals when clicking outside
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Handle Service Form Submission
function handleServiceSubmit(e, type) {
    e.preventDefault();

    // Validate file type for printing form
    if (type === 'printing') {
        const fileInput = document.querySelector('#printingForm input[name="file"]');
        const fileError = document.getElementById('fileError');
        
        if (fileInput && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileName = file.name.toLowerCase();
            
            if (!fileName.endsWith('.stl') && !fileName.endsWith('.obj')) {
                fileError.style.display = 'block';
                return;
            }
            fileError.style.display = 'none';
        }
    }

    // In a real app, you would send data to backend here
    // For now, we simulate success

    const successPopup = document.getElementById('successPopup');
    const successMessage = document.getElementById('successMessage');
    let message = '';

    if (type === 'printing') {
        message = 'Printing takes 10 days to 1 week for delivery, based on our work.';
    } else if (type === 'designing') {
        message = 'Design takes 5 days to 1 week for delivery, based on the complexity of the model.';
    } else if (type === 'scanning') {
        // Default message since not specified, but good to have one
        message = 'Scanning request received. We will contact you shortly with a quote.';
    }

    successMessage.textContent = message;

    // Close the specific modal
    closeServiceModal(type);

    // Open Success Popup
    successPopup.style.display = 'block';

    // Reset form
    e.target.reset();
}

// Show notification (Legacy - keeping helper if needed, but unused in new flow)
function showNotification(message) {
    // ... logic preserved if needed ...
}

// Smooth scrolling for anchor links
document.addEventListener('click', function (e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add scroll effect to navbar
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Carousel functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (slides[index]) {
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(currentSlideIndex);
}

function prevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
}

// Auto-advance carousel
setInterval(nextSlide, 5000);

// Career Modal Functions
function openCareerModal() {
    document.getElementById('careerModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCareerModal() {
    document.getElementById('careerModal').style.display = 'none';
    document.getElementById('contactOptions').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function selectCareerType(type) {
    const contactOptions = document.getElementById('contactOptions');
    const whatsappLink = document.getElementById('whatsappLink');
    const gmailLink = document.getElementById('gmailLink');
    
    // Update contact links based on career type
    const subject = type === 'intern' ? 'Internship Application' : 'Employment Application';
    const whatsappText = type === 'intern' ? 'Hi, I am interested in an internship opportunity at VEOMA Labs' : 'Hi, I am interested in employment opportunities at VEOMA Labs';
    
    // Replace with actual contact details
    whatsappLink.href = `https://wa.me/919876543210?text=${encodeURIComponent(whatsappText)}`;
    gmailLink.href = `mailto:info@veomalabs.com?subject=${encodeURIComponent(subject)}`;
    
    contactOptions.style.display = 'flex';
}

// Close career modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('careerModal');
    if (event.target === modal) {
        closeCareerModal();
    }
});