// <-- comment (.js file)(js/ui_helpers.js)
export function createMapItem(type, text, col, row) {
    const element = document.createElement('div');
    element.classList.add('map-item', type);
    element.textContent = text;
    element.title = text;
    element.style.gridColumn = col;
    element.style.gridRow = row;
    return element;
}

export function createSeparator(row, totalColumns) {
    const separator = document.createElement('div');
    separator.classList.add('grid-separator');
    separator.style.gridRow = row;
    separator.style.gridColumn = `1 / span ${totalColumns}`;
    return separator;
}

export function createNFRItem(text) {
    const element = document.createElement('div');
    element.classList.add('nfr-item');
    element.textContent = text;
    element.title = text;
    return element;
}

export function formatDetailsList(detailsArray) {
    if (!detailsArray || detailsArray.length === 0) return "<p>Aucun détail spécifique disponible.</p>";
    let listHTML = "<ul>";
    detailsArray.forEach(detail => { listHTML += `<li>${detail}</li>`; });
    listHTML += "</ul>";
    return listHTML;
}
// <-- end comment (.js file)(js/ui_helpers.js)