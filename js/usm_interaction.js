// <-- comment (.js file)(js/usm_interaction.js)
import { storyMapData, userStoryBreakdowns } from './data.js';
import { openModal } from './modal.js';
import { formatDetailsList } from './ui_helpers.js';

export function findStoryById(storyId) {
    for (const theme of storyMapData) {
        for (const epic of theme.epics) {
            if (epic.stories) {
                const story = epic.stories.find(s => s.id === storyId);
                if (story) return story;
            }
        }
    }
    return null;
}

export function findParentEpic(storyId) {
    for (const theme of storyMapData) {
        if (theme.epics) {
            const parent = theme.epics.find(e => e.stories && e.stories.some(s => s.id === storyId));
            if (parent) return parent;
        }
    }
    return null;
}

export function attachClickListener(element, itemData, parentEpicData = null) {
    let title = "";
    let content = "";
    let hasClickAction = false;

    const epicHasMockup = parentEpicData?.mockupRef || itemData.mockupRef;
    const epicHasDetails = parentEpicData?.detailsRef || itemData.detailsRef;
    const storyHasDetails = itemData.detailsRef || (itemData.details && Array.isArray(itemData.details));

    if (element.classList.contains('epic')) {
        if (itemData.mockupRef) {
            const mockupImage = document.getElementById(itemData.mockupRef);
            const mockupImageLose = document.getElementById(itemData.mockupRefLose);
            if (mockupImage) {
                title = itemData.name;
                content = `<p>Interface associée:</p><img class='mockup' src='${mockupImage.src}' alt='Mockup ${itemData.name}'>`;
                if (mockupImageLose) { content += `<img class='mockup' src='${mockupImageLose.src}' alt='Mockup ${itemData.name} Perdu'>`; }
                hasClickAction = true;
            }
        } else if (itemData.detailsRef && userStoryBreakdowns[itemData.detailsRef]) {
            const breakdown = userStoryBreakdowns[itemData.detailsRef];
            title = itemData.detailsTitle || `Détails: ${itemData.name}`;
            content = formatDetailsList(breakdown.steps);
            hasClickAction = true;
        }
    } else if (element.classList.contains('story')) {
        if (storyHasDetails) {
            const breakdownRef = itemData.detailsRef;
            const breakdownInline = itemData.details;
            if (breakdownRef && userStoryBreakdowns[breakdownRef]) {
                title = itemData.detailsTitle || `Détails: ${itemData.text}`;
                content = formatDetailsList(userStoryBreakdowns[breakdownRef].steps);
                hasClickAction = true;
            } else if (breakdownInline) {
                title = itemData.detailsTitle || `Détails: ${itemData.text}`;
                content = formatDetailsList(breakdownInline);
                hasClickAction = true;
            }
        } else if (parentEpicData && epicHasDetails && !epicHasMockup) {
            const breakdownRef = parentEpicData?.detailsRef;
            if (breakdownRef && userStoryBreakdowns[breakdownRef]) {
                title = parentEpicData.detailsTitle || `Détails: ${parentEpicData.name}`;
                content = formatDetailsList(userStoryBreakdowns[breakdownRef].steps);
                hasClickAction = true;
            }
        }
    }

    if (hasClickAction) {
        element.classList.add('clickable');
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(title, content);
        });
    }
}
// <-- end comment (.js file)(js/usm_interaction.js)