document.addEventListener("DOMContentLoaded", function() {

    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
    });

    const burger = document.getElementById('burger-menu');
    const navbar = document.querySelector('.navbar');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navbar.classList.toggle('active');
    });

    new SimpleLightbox('.gallery a', {});

    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar ul li a');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = new URL(link.href).pathname;
        if (currentLocation === linkPath ||
           (currentLocation.startsWith('/services/') && linkPath.includes('/services/index.html')) ||
           (currentLocation.startsWith('/projects/') && linkPath.includes('/projects.html'))) {
            if (linkPath === '/projects.html' && currentLocation.includes('/projects/')) {
                link.classList.add('active');
            } else if (linkPath === '/services/index.html' && currentLocation.includes('/services/')) {
                 link.classList.add('active');
            } else if (currentLocation === linkPath) {
                 link.classList.add('active');
            }
        }
    });

});