// <-- comment (.js file)(js/modal.js)
let modal = null;
let modalTitle = null;
let modalBody = null;
let closeButton = null;

export function initializeModal() {
    modal = document.getElementById('info-modal');
    modalTitle = document.getElementById('modal-title');
    modalBody = document.getElementById('modal-body');
    closeButton = document.querySelector('.close-button');

    if (modal && closeButton) {
        closeButton.onclick = closeModal;
        // Click outside modal to close
        modal.addEventListener('click', function(event) {
            if (event.target === modal) { // Only if click is on the modal backdrop itself
                closeModal();
            }
        });
        // Escape key to close
        document.addEventListener('keydown', function(event) {
            if (event.key === "Escape" && modal.classList.contains('modal-active')) {
                closeModal();
            }
        });
    }
}

export function openModal(title, contentHTML) {
    if (modal && modalTitle && modalBody) {
        modalTitle.textContent = title;
        modalBody.innerHTML = contentHTML;
        // modal.style.display = "block"; // OLD WAY
        modal.classList.add('modal-active'); // NEW WAY: Toggle class for visibility and animation
        document.body.style.overflow = 'hidden'; // Prevent background scrolling when modal is open
        if(closeButton) closeButton.focus(); // Optionally focus the close button
    }
}

export function closeModal() {
    if (modal) {
        // modal.style.display = "none"; // OLD WAY
        modal.classList.remove('modal-active'); // NEW WAY
        document.body.style.overflow = ''; // Restore background scrolling
        // Don't clear title/body immediately, let fade-out animation complete
        // If you want to clear after animation:
        // modal.addEventListener('transitionend', function clearContent() {
        //     if (!modal.classList.contains('modal-active')) { // Check if still hidden
        //          if (modalTitle) modalTitle.textContent = "";
        //          if (modalBody) modalBody.innerHTML = "";
        //          modal.removeEventListener('transitionend', clearContent);
        //     }
        // });
        // For simplicity now, content remains until next openModal call
    }
}
// <-- end comment (.js file)(js/modal.js)