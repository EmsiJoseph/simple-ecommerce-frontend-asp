function loadComponents() {
    // Load navbar
    fetch('../components/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            
            // Initialize dark mode toggle after navbar is loaded
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                darkModeToggle.addEventListener('click', function() {
                    document.body.classList.toggle('dark-mode');
                    const isDarkMode = document.body.classList.contains('dark-mode');
                    this.innerHTML = isDarkMode ? 
                        '<i class="bi bi-sun"></i> Light Mode' : 
                        '<i class="bi bi-moon"></i> Dark Mode';
                });
            }
        });

    // Load sidebar
    fetch('../components/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-placeholder').innerHTML = data;
            
            // Set active nav item based on current page
            const currentPage = window.location.pathname.split('/').pop();
            const navLinks = document.querySelectorAll('.sidebar .nav-link');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.classList.add('active');
                }
            });
        });

    // Load add user modal if placeholder exists
    const addUserModalPlaceholder = document.getElementById('add-user-modal-placeholder');
    if (addUserModalPlaceholder) {
        fetch('../components/add-user-modal.html')
            .then(response => response.text())
            .then(data => {
                addUserModalPlaceholder.innerHTML = data;
                // Re-initialize any event listeners for the modal
                if (typeof initializeUserModal === 'function') {
                    initializeUserModal();
                }
            });
    }

    // Load modal component
    const modalPlaceholder = document.getElementById('modal-placeholder');
    if (modalPlaceholder) {
        fetch('../components/modal.html')
            .then(response => response.text())
            .then(data => {
                modalPlaceholder.innerHTML = data;
            });
    }
}

// Add this utility function for modal handling
function initializeModal(options = {}) {
    const modalElement = document.getElementById('dynamicModal');
    if (!modalElement) return;
    
    const modal = {
        element: modalElement,
        title: modalElement.querySelector('.modal-title'),
        body: modalElement.querySelector('.modal-body'),
        saveBtn: modalElement.querySelector('.modal-save')
    };

    // Set modal properties
    modal.title.textContent = options.title || '';
    modal.body.innerHTML = options.content || '';
    modal.saveBtn.textContent = options.saveButtonText || 'Save';
    
    // Clear previous event listeners
    const newSaveBtn = modal.saveBtn.cloneNode(true);
    modal.saveBtn.parentNode.replaceChild(newSaveBtn, modal.saveBtn);
    
    // Add new save event listener
    if (options.onSave) {
        newSaveBtn.addEventListener('click', options.onSave);
    }

    return modal;
}

// Export for use in other scripts
window.initializeModal = initializeModal;

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', loadComponents);
