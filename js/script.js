// Function to determine the base path based on current location
function getBasePath() {
    const path = window.location.pathname;
    const depth = path.split('/').filter(p => p && p.endsWith('.html')).length;
    const folders = path.split('/').filter(p => p && !p.endsWith('.html')).length;
    
    // If we're in a subdirectory (services/, projects/), return '../'
    if (folders > 0 || path.includes('/services/') || path.includes('/projects/')) {
        return '../';
    }
    // Otherwise, we're in the root
    return '';
}

// Function to correct paths in HTML content
function correctPaths(html, basePath) {
    if (!basePath) return html; // No correction needed for root pages
    
    // Don't modify paths that already start with ../ or http(s)://
    return html
        .replace(/href="(?!\.\.\/|https?:\/\/)([^"]+)"/g, `href="${basePath}$1"`)
        .replace(/src="(?!\.\.\/|https?:\/\/)([^"]+)"/g, `src="${basePath}$1"`);
}

// Function to load component
async function loadComponent(elementId, componentPath) {
    try {
        const basePath = getBasePath();
        const fullPath = basePath + componentPath;
        
        const response = await fetch(fullPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let html = await response.text();
        html = correctPaths(html, basePath);
        
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error(`Error loading ${componentPath}:`, error);
    }
}

// Load header and footer before initializing other scripts
async function loadComponents() {
    await Promise.all([
        loadComponent('header-placeholder', 'includes/header.html'),
        loadComponent('footer-placeholder', 'includes/footer.html')
    ]);
}

// Initialize everything after components are loaded
loadComponents().then(() => {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
    });

    // Burger menu functionality
    const burger = document.getElementById('burger-menu');
    const navbar = document.querySelector('.navbar');
    const logo = document.querySelector('.logo');

    if (burger && navbar && logo) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navbar.classList.toggle('active');
            logo.classList.toggle('menu-open');
        });
    }

    // Initialize SimpleLightbox if gallery exists
    const gallery = document.querySelector('.gallery');
    if (gallery) {
        new SimpleLightbox('.gallery a', {});
    }

    // Set active menu item based on current page
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar ul li a');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = new URL(link.href).pathname;
        
        // Normalize paths for comparison
        const normalizedCurrent = currentLocation.replace(/\\/g, '/');
        const normalizedLink = linkPath.replace(/\\/g, '/');
        
        // 1. Exact match (covers most cases)
        if (normalizedCurrent === normalizedLink) {
            link.classList.add('active');
            return;
        }

        // 2. Root handling (Homepage)
        // If we are at root or index.html, ONLY match exactly that, do not match other index.html files
        if (normalizedCurrent === '/' || normalizedCurrent.endsWith('/index.html')) {
            // Check if we are effectively at the root
            const isRootCurrent = normalizedCurrent === '/' || normalizedCurrent === '/index.html';
            const isRootLink = normalizedLink === '/' || normalizedLink === '/index.html';
            
            if (isRootCurrent && isRootLink) {
                link.classList.add('active');
                return;
            }
        }

        // 3. Section Matching (for subdirectories like /services/)
        // If current page is in a subdirectory, highlight the parent section link
        if (normalizedCurrent.includes('/services/') && normalizedLink.includes('/services/index.html')) {
            link.classList.add('active');
        }
        else if (normalizedCurrent.includes('/projects/') && normalizedLink.includes('/projects.html')) {
            link.classList.add('active');
        }
    });
});