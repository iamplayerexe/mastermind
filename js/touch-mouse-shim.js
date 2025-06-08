/* <-- comment (.js file)(js/touch-mouse-shim.js) */
// A simple shim to convert touch events to mouse events for a target window.
// This allows mouse-only applications (like the Pyxel game) to work on touch devices.

(function() {
    let targetWindow = null;

    function touchHandler(event) {
        // Only handle single-touch events
        if (event.touches.length > 1) {
            return;
        }

        const touch = event.changedTouches[0];
        let simulatedEvent;

        // Determine the corresponding mouse event type
        let mouseEventType = "";
        switch (event.type) {
            case "touchstart":
                mouseEventType = "mousedown";
                break;
            case "touchmove":
                mouseEventType = "mousemove";
                // Prevent the page from scrolling when the user is "dragging" inside the game
                event.preventDefault(); 
                break;
            case "touchend":
                mouseEventType = "mouseup";
                break;
            default:
                return;
        }

        // Create and dispatch the simulated mouse event
        simulatedEvent = new MouseEvent(mouseEventType, {
            bubbles: true,
            cancelable: true,
            view: targetWindow,
            clientX: touch.clientX,
            clientY: touch.clientY,
            screenX: touch.screenX,
            screenY: touch.screenY,
            button: 0, // Left mouse button
        });

        // Dispatch the event on the element that was touched
        touch.target.dispatchEvent(simulatedEvent);
    }

    function init(win) {
        if (!win) {
            console.error("TouchMouseShim: Target window is not valid.");
            return;
        }
        targetWindow = win;
        console.log("TouchMouseShim: Initializing for target window.");
        targetWindow.document.addEventListener("touchstart", touchHandler, true);
        targetWindow.document.addEventListener("touchmove", touchHandler, true);
        targetWindow.document.addEventListener("touchend", touchHandler, true);
        targetWindow.document.addEventListener("touchcancel", touchHandler, true);
    }

    function destroy() {
        if (targetWindow) {
            console.log("TouchMouseShim: Destroying listeners.");
            targetWindow.document.removeEventListener("touchstart", touchHandler, true);
            targetWindow.document.removeEventListener("touchmove", touchHandler, true);
            targetWindow.document.removeEventListener("touchend", touchHandler, true);
            targetWindow.document.removeEventListener("touchcancel", touchHandler, true);
            targetWindow = null;
        }
    }

    // Expose the init and destroy functions globally
    window.TouchMouseShim = {
        init: init,
        destroy: destroy,
    };
})();
/* <-- end comment (.js file)(js/touch-mouse-shim.js) */