// <-- comment (.js file)(js/usm_layout.js)
import { createMapItem, createSeparator, createNFRItem } from './ui_helpers.js';
import { attachClickListener, findStoryById, findParentEpic } from './usm_interaction.js';

export function populateMap(container, data, applyVersionStyles, mapIdSuffix = '') {
    if (!container) return { coords: {}, maxStories: 0, totalGridRows: 0, separatorRows: {} };
    container.innerHTML = '';
    if (!data || data.length === 0) {
        container.innerHTML = '<p class="placeholder-text"><em>(Pas de données pour la carte)</em></p>';
        return { coords: {}, maxStories: 0, totalGridRows: 0, separatorRows: {} };
    }
    let maxStories = 0;
    const coords = {};
    const epicElementsData = [];
    const storyElementsData = [];

    let tempColCounter = 0;
    data.forEach(themeData => {
        if (themeData.epics && themeData.epics.length > 0) {
            themeData.epics.forEach(epicData => {
                const epicCol = tempColCounter + 1;
                maxStories = Math.max(maxStories, epicData.stories ? epicData.stories.length : 0);
                epicElementsData.push({ epicData, epicCol });
                if (epicData.stories) {
                    epicData.stories.forEach((storyData, index) => {
                        const storyRow = 5 + index;
                        const storyIdBase = storyData.id;
                        coords[storyIdBase] = { row: storyRow, col: epicCol };
                        storyElementsData.push({ storyData, storyRow, epicCol, mapIdSuffix, applyVersionStyles });
                    });
                }
                tempColCounter++;
            });
        }
    });
    const totalColumns = Math.max(1, epicElementsData.length); // Ensure at least 1 column
    const totalGridRows = 4 + maxStories;

    container.style.gridTemplateColumns = `repeat(${totalColumns}, minmax(100px, auto))`;
    container.style.gridTemplateRows = `auto 1px auto 1px repeat(${maxStories}, auto)`;

    let currentPlacementColumn = 1;
    data.forEach(themeData => {
        if (themeData.epics && themeData.epics.length > 0) {
            const themeStartCol = currentPlacementColumn;
            let themeWidth = themeData.epics.length;
            const themeElement = createMapItem('theme', themeData.theme, themeStartCol, 1);
            themeElement.style.gridColumn = `${themeStartCol} / span ${themeWidth}`;
            container.appendChild(themeElement);

            themeData.epics.forEach(epicData => {
                const epicId = epicData.id + mapIdSuffix;
                const epicElement = createMapItem('epic', epicData.name, currentPlacementColumn, 3);
                epicElement.id = epicId;
                attachClickListener(epicElement, epicData); // Pass only epicData
                container.appendChild(epicElement);
                currentPlacementColumn++;
            });
        }
    });

    if (totalColumns > 0) { // Only add separators if there are columns
        const separator1 = createSeparator(2, totalColumns);
        const separator2 = createSeparator(4, totalColumns);
        container.appendChild(separator1);
        container.appendChild(separator2);
    }

    storyElementsData.forEach(item => {
        const storyId = item.storyData.id + item.mapIdSuffix;
        const storyElement = createMapItem('story', item.storyData.text, item.epicCol, item.storyRow);
        storyElement.id = storyId;
        if (item.applyVersionStyles) {
            if (item.storyData.mvp) storyElement.classList.add('mvp');
            else if (item.storyData.version === 2) storyElement.classList.add('v2');
            else storyElement.classList.add('later');
        }
        let parentEpic = findParentEpic(item.storyData.id);
        attachClickListener(storyElement, item.storyData, parentEpic);
        container.appendChild(storyElement);
    });

    const separatorRows = { sep1: 2, sep2: 4 };
    return { coords, maxStories, totalGridRows, separatorRows };
}

export function populateNFRColumn(nfrs, container, totalFunctionalRows) {
    if (!container) return;
    container.innerHTML = '';
    if (!nfrs || nfrs.length === 0) {
        container.innerHTML = '<p class="placeholder-text-small"><em>(Vide)</em></p>';
        return;
    }
    const availableStoryRows = Math.max(0, totalFunctionalRows - 4); // NFRs start after the header row for NFRs
    container.style.gridTemplateRows = `repeat(${availableStoryRows}, auto)`;
    nfrs.forEach((nfrText, index) => {
        if (index < availableStoryRows) {
            const nfrElement = createNFRItem(nfrText);
            nfrElement.style.gridRow = index + 1; // NFR items start from grid row 1 within their container
            container.appendChild(nfrElement);
        }
    });
}

export function positionSeparatorLines(wrapperElement, separatorRowsInfo) {
    const sep1 = wrapperElement.querySelector(`#separator-1${wrapperElement.id.replace('wrapper', '')}`);
    const sep2 = wrapperElement.querySelector(`#separator-2${wrapperElement.id.replace('wrapper', '')}`);
    const gridElement = wrapperElement.querySelector('.story-map-grid');
    if (!gridElement || !sep1 || !sep2) return;

    const themeElement = gridElement.querySelector('.map-item.theme');
    const firstEpicElement = gridElement.querySelector('.map-item.epic');
    const firstStoryElement = gridElement.querySelector('.map-item.story');

    let sep1Top = (themeElement ? themeElement.offsetHeight : 30) + 4;
    if (themeElement && firstEpicElement) {
        sep1Top = themeElement.offsetTop + themeElement.offsetHeight + (firstEpicElement.offsetTop - (themeElement.offsetTop + themeElement.offsetHeight)) / 2 - 1;
    }

    let sep2Top = sep1Top + (firstEpicElement ? firstEpicElement.offsetHeight : 30) + 8;
    if (firstEpicElement && firstStoryElement) {
        sep2Top = firstEpicElement.offsetTop + firstEpicElement.offsetHeight + (firstStoryElement.offsetTop - (firstEpicElement.offsetTop + firstEpicElement.offsetHeight)) / 2 - 1;
    } else if (firstEpicElement) { // Case: Epics exist, but no stories yet
        sep2Top = firstEpicElement.offsetTop + firstEpicElement.offsetHeight + 8; // Default spacing after epic
    }


    sep1.style.top = `${sep1Top}px`;
    sep2.style.top = `${sep2Top}px`;
    sep1.style.display = 'block';
    sep2.style.display = 'block';
}

export function positionMvpLines(wrapperElement, coords, showMvpLines, idSuffix = '') {
    const mvpLine1 = wrapperElement.querySelector('#mvp-line-1' + idSuffix);
    const mvpLine2 = wrapperElement.querySelector('#mvp-line-2' + idSuffix);
    const gridElement = wrapperElement.querySelector('.story-map-grid');

    if (!gridElement || !showMvpLines || !mvpLine1 || !mvpLine2) {
        if (mvpLine1) mvpLine1.style.display = 'none';
        if (mvpLine2) mvpLine2.style.display = 'none';
        return;
    }

    mvpLine1.setAttribute('data-label', 'MVP/MMP');
    mvpLine2.setAttribute('data-label', 'V2');
    mvpLine1.style.display = 'block';

    let mvpCutoffGridRow = 4; // Start checking from below epic row
    let v2CutoffGridRow = 4;  // Start checking from below epic row

    for (const id in coords) {
        const storyData = findStoryById(id); // findStoryById is imported
        const gridRow = coords[id].row;
        if (storyData?.mvp) mvpCutoffGridRow = Math.max(mvpCutoffGridRow, gridRow);
        if (storyData?.version === 2) v2CutoffGridRow = Math.max(v2CutoffGridRow, gridRow);
    }
    v2CutoffGridRow = Math.max(v2CutoffGridRow, mvpCutoffGridRow);

    const lastMvpElement = mvpCutoffGridRow > 4 ? gridElement.querySelector(`.map-item.story[style*="grid-row: ${mvpCutoffGridRow}"]`) : null;
    const lastV2Element = v2CutoffGridRow > 4 ? gridElement.querySelector(`.map-item.story[style*="grid-row: ${v2CutoffGridRow}"]`) : null;
    const epicSeparator = gridElement.querySelector(`.grid-separator[style*="grid-row: 4"]`); // Separator below epics

    const gridTopOffset = gridElement.offsetTop; // Offset of the grid itself within its wrapper

    let mvpLineTop;
    if (lastMvpElement) {
        mvpLineTop = gridTopOffset + lastMvpElement.offsetTop + lastMvpElement.offsetHeight + 4;
    } else if (epicSeparator) { // If no MVP stories, line goes just below epic separator
        mvpLineTop = gridTopOffset + epicSeparator.offsetTop + epicSeparator.offsetHeight + 4;
    } else { // Fallback if grid is empty or has no epics/stories
        mvpLineTop = gridTopOffset + (gridElement.querySelector('.map-item.epic')?.offsetHeight || 30) * 2 + 20; // Estimate
    }
    mvpLine1.style.top = `${mvpLineTop}px`;

    if (v2CutoffGridRow > mvpCutoffGridRow && v2CutoffGridRow > 4) { // Only show V2 line if distinct and actual V2 stories exist
        let v2LineTop;
        if (lastV2Element) {
            v2LineTop = gridTopOffset + lastV2Element.offsetTop + lastV2Element.offsetHeight + 4;
        } else if (lastMvpElement) { // Should not happen if v2Cutoff > mvpCutoff, but as fallback
             v2LineTop = mvpLineTop; // Place it same as MVP if lastV2Element not found but was expected
        } else if (epicSeparator) {
            v2LineTop = gridTopOffset + epicSeparator.offsetTop + epicSeparator.offsetHeight + 4 + 20; // Further down
        } else {
            v2LineTop = mvpLineTop + 20; // Fallback
        }
        mvpLine2.style.top = `${v2LineTop}px`;
        mvpLine2.style.display = 'block';
    } else {
        mvpLine2.style.display = 'none';
    }
}
// <-- end comment (.js file)(js/usm_layout.js)