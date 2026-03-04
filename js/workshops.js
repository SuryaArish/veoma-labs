// Component loader function
function loadComponent(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error('Error loading component:', error));
}

// Scroll to Accelerator Workshop
window.scrollToAccelerator = () => {
    const acceleratorCard = document.querySelector('.workshop-card.medium');
    if (acceleratorCard) {
        acceleratorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Load navbar and footer
    loadComponent('components/navbar.html', 'navbar-placeholder');
    loadComponent('components/footer.html', 'footer-placeholder');
    
    // Initialize navbar after loading
    setTimeout(() => {
        if (typeof initializeNavbar === 'function') {
            initializeNavbar();
        }
    }, 100);
    
    // Workshop Details Data
    // Workshop Details Data
    const workshopDetails = {
        'Basic': [
            "Learn how a 3D printer works and operate it hands-on",
            "Understand filament types and bed leveling",
            "Solve common 3D printer issues and preventive maintenance",
            "Introduction to design software and AI tools for 3D models",
            "Live demo of FDM and Resin printers",
            "Explore career and business opportunities in 3D printing"
        ],
        'Medium': [
            "All Basic Workshop topics",
            "Advanced printer calibration techniques",
            "Material selection for strength and durability",
            "Error analysis and print optimization",
            "Intermediate-level 3D design workflows",
            "Practical project-based learning"
        ],
        'Advanced': [
            "All Medium Workshop topics",
            "Professional-grade 3D printing workflows",
            "Complex model design and optimization",
            "Industry-level troubleshooting techniques",
            "Production planning and cost estimation",
            "Real-world industrial and startup use cases"
        ]
    };

    // Modal Elements
    const joinModal = document.getElementById('joinModal');
    const infoModal = document.getElementById('infoModal');
    const closeButtons = document.querySelectorAll('.close-btn');

    // Close Modal Function
    window.closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300); // Wait for transition
        }
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    // Open Join Modal
    window.openJoinModal = (workshopName) => {
        const modalTitle = document.getElementById('joinModalTitle');
        const workshopInput = document.getElementById('workshopTypeInput');

        modalTitle.textContent = `Join ${workshopName} Workshop`;
        workshopInput.value = workshopName;

        joinModal.style.display = 'block';
        // Trigger reflow
        void joinModal.offsetWidth;
        joinModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Lock scrolling
    }

    // Open Info Modal
    window.openInfoModal = (type) => {
        const modalTitle = document.getElementById('infoModalTitle');
        const listContainer = document.getElementById('infoList');

        modalTitle.textContent = `${type} Workshop Details`;
        listContainer.innerHTML = '';

        const details = workshopDetails[type] || [];
        details.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            listContainer.appendChild(li);
        });

        infoModal.style.display = 'block';
        void infoModal.offsetWidth;
        infoModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Close buttons specific logic
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal.id);
        });
    });

    // Close on click outside
    window.onclick = (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    }

    // Form Submission
    const joinForm = document.getElementById('joinForm');
    if (joinForm) {
        joinForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic Validation (HTML5 'required' handles most)
            const name = joinForm.querySelector('input[name="fullname"]').value;
            const email = joinForm.querySelector('input[name="email"]').value;

            if (name && email) {
                // Simulate success
                const btn = joinForm.querySelector('.submit-btn');
                const originalText = btn.innerText;

                btn.innerText = 'Submitted!';
                btn.style.backgroundColor = '#28a745';

                setTimeout(() => {
                    closeModal('joinModal');
                    joinForm.reset();
                    btn.innerText = originalText;
                    btn.style.backgroundColor = ''; // Reset to default
                    alert(`Thanks ${name}! We have received your registration.`);
                }, 1500);
            }
        });
    }
});
