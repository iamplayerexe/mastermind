// <-- comment (.js file)(script.js)
// <-- comment (.js file)(script.js)
// Import data
import { productVisionBoardData } from './js/data.js';

// Import UI modules
import { initializeModal, openModal } from './js/modal.js';
import { populatePVB } from './js/populate_static.js';

// --- Footer Year Update ---
function updateFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// --- Navbar Logic ---
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;
const scrollThreshold = 10; 
let initialNavbarHeight = 0; 

function setNavbarHeightVarAndPadding() {
    if (navbar) {
        const wasFixed = navbar.classList.contains('navbar-fixed');
        if (wasFixed) navbar.classList.remove('navbar-fixed');
        
        initialNavbarHeight = navbar.offsetHeight; 
        document.documentElement.style.setProperty('--navbar-height', `${initialNavbarHeight}px`);

        if (wasFixed) navbar.classList.add('navbar-fixed'); 
        
        handleScroll(); 
    } else {
        initialNavbarHeight = 100; 
        document.documentElement.style.setProperty('--navbar-height', `${initialNavbarHeight}px`);
        document.body.style.paddingTop = `${initialNavbarHeight}px`; 
    }
}

function handleScroll() {
    if (!navbar || initialNavbarHeight === 0) return;
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const halfwayPoint = viewportHeight / 2;
    if (Math.abs(scrollTop - lastScrollTop) <= scrollThreshold && scrollTop > initialNavbarHeight) {
        lastScrollTop = scrollTop; 
        return;
    }
    if (scrollTop <= initialNavbarHeight) { 
        navbar.classList.remove('navbar-fixed', 'navbar-hidden');
        document.body.style.paddingTop = '0px';
    } else if (scrollTop > lastScrollTop) {
        if (scrollTop > initialNavbarHeight) {
            navbar.classList.add('navbar-hidden');
            navbar.classList.remove('navbar-fixed'); 
            document.body.style.paddingTop = '0px'; 
        }
    } else {
        if (scrollTop > halfwayPoint) {
            navbar.classList.add('navbar-fixed');
            navbar.classList.remove('navbar-hidden');
            document.body.style.paddingTop = `${initialNavbarHeight}px`;
        } else if (scrollTop <= halfwayPoint && scrollTop > initialNavbarHeight) {
            navbar.classList.remove('navbar-fixed', 'navbar-hidden');
            document.body.style.paddingTop = '0px';
        }
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}

// --- View Switching Logic ---
const navLinks = document.querySelectorAll('.nav-link');
const views = document.querySelectorAll('.view');
const gameIframe = document.getElementById('game-iframe');

function switchView(viewIdToShow) {
    views.forEach(view => {
        view.classList.toggle('active-view', view.id === viewIdToShow);
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.view === viewIdToShow);
    });

    if (viewIdToShow === 'game-view') {
        if (gameIframe && !gameIframe.src.endsWith('Mastermind.html')) {
            gameIframe.src = 'Mastermind.html';
        }
    } else {
        if (gameIframe && gameIframe.src !== '') {
            gameIframe.src = '';
            // Destroy the touch-to-mouse shim when the game is unloaded
            if (window.TouchMouseShim) {
                window.TouchMouseShim.destroy();
            }
        }
    }
}

function initializeActiveView() {
    const activeViewInHTML = document.querySelector('.view.active-view');
    let initialViewId = 'game-view'; 

    if (activeViewInHTML) {
        initialViewId = activeViewInHTML.id;
    }
    switchView(initialViewId);
}

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', function() {
    setNavbarHeightVarAndPadding(); 
    initializeModal();
    updateFooterYear();
    initializeActiveView();

    const pvbContainer = document.getElementById('pvb-card-container');
    if (pvbContainer) {
      populatePVB(productVisionBoardData, pvbContainer);
    }
    
    document.querySelectorAll('.mockup-gallery figure').forEach(figure => {
        figure.addEventListener('click', () => {
            const img = figure.querySelector('img');
            const figcaption = figure.querySelector('figcaption'); 
            
            if (img) {
                const title = figcaption ? figcaption.textContent : "Interface Mockup";
                openModal(title, `<img class='mockup' src='${img.src}' alt='${img.alt || title}'>`);
            }
        });
        figure.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.keyCode === 13) {
                event.preventDefault(); 
                figure.click();
            }
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); 
            const viewId = this.dataset.view;
            if (viewId) {
                switchView(viewId);
            }
        });
    });
    
    // Initialize the touch shim only after the iframe has loaded its content
    if (gameIframe) {
        gameIframe.addEventListener('load', function() {
            // Check if the source is the game page before initializing
            if (gameIframe.src.endsWith('Mastermind.html')) {
                // Initialize the shim on the iframe's content window
                if (window.TouchMouseShim) {
                    window.TouchMouseShim.init(gameIframe.contentWindow);
                }
            }
        });
    }

    // Fullscreen button logic
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const gameCard = document.querySelector('.game-card');
    const iconEnter = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 2h-2v3h-3v2h5v-5zm-3-4V7h-2V5h5v5h-2z"/></svg>';
    const iconExit = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>';

    function updateFullscreenButton() {
        if (document.fullscreenElement) {
            fullscreenBtn.innerHTML = iconExit;
            fullscreenBtn.title = "Quitter le plein écran";
        } else {
            fullscreenBtn.innerHTML = iconEnter;
            fullscreenBtn.title = "Plein écran";
        }
    }
    if (fullscreenBtn && gameCard) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                gameCard.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });
        document.addEventListener('fullscreenchange', updateFullscreenButton);
        updateFullscreenButton();
    }
    
    window.addEventListener('scroll', handleScroll, false);
    console.log("Mastermind Dashboard Initialized (Iframe Method)!");
});

window.addEventListener('resize', setNavbarHeightVarAndPadding);
// <-- end comment (.js file)(script.js)
// <-- end comment (.js file)(script.js)