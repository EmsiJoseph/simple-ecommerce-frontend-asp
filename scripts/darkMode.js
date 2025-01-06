document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;
    const icon = darkModeToggle.querySelector('i');
    
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('darkMode');
    
    // Initialize theme
    const initialTheme = storedTheme !== null ? storedTheme === 'true' : prefersDark;
    
    function setTheme(isDark) {
        htmlElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('darkMode', isDark);
        
        // Update button appearance
        if (isDark) {
            icon.classList.remove('bi-moon');
            icon.classList.add('bi-sun');
            darkModeToggle.classList.remove('bg-white');
            darkModeToggle.classList.add('btn-outline-light');
        } else {
            icon.classList.remove('bi-sun');
            icon.classList.add('bi-moon');
            darkModeToggle.classList.remove('btn-outline-light');
            darkModeToggle.classList.add('bg-white');
        }
    }
    
    // Initialize theme
    setTheme(initialTheme);
    
    // Toggle theme
    darkModeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        setTheme(currentTheme !== 'dark');
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('darkMode') === null) {
            setTheme(e.matches);
        }
    });
});
