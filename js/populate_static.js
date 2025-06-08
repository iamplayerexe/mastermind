// <-- comment (.js file)(js/populate_static.js)
// <-- comment (.js file)(js/populate_static.js)
export function populatePVB(data, container) {
    if (!container || !data.targetGroup) return;
    
    container.innerHTML = ''; // Clear previous content

    // --- Create a card for each PVB section ---
    const createCard = (title, content) => {
        const card = document.createElement('div');
        // Add both the specific and the shared fancy class
        card.className = 'pvb-card fancy-card';

        const cardTitle = document.createElement('h3');
        cardTitle.textContent = title;
        card.appendChild(cardTitle);

        // If content is an array, create a list
        if (Array.isArray(content)) {
            const list = document.createElement('ul');
            content.forEach(itemText => {
                const li = document.createElement('li');
                const isSubItem = itemText.trim().startsWith('-');
                li.textContent = isSubItem ? itemText.trim().substring(1).trim() : itemText;
                if (isSubItem) {
                    li.classList.add('sub-item');
                }
                list.appendChild(li);
            });
            card.appendChild(list);
        } else { // Otherwise, it's just text
            const p = document.createElement('p');
            p.textContent = content;
            card.appendChild(p);
        }
        return card;
    };

    // --- Populate and append cards ---
    const targetCard = createCard('Target Group', data.targetGroup);
    const needsCard = createCard('Needs', data.needs);
    const productCard = createCard('Product', data.productFeatures);

    container.appendChild(targetCard);
    container.appendChild(needsCard);
    container.appendChild(productCard);
}

export function populateTechNotes(data, dtContainer, ulJust, ulMocks, preProto) {
    if (dtContainer) {
        dtContainer.innerHTML = '';
        if (data.dataTypes && data.dataTypes.length > 0) {
            const dl = document.createElement('dl');
            data.dataTypes.forEach(item => {
                if (item.isSeparator) {
                    const hr = document.createElement('hr');
                    hr.style.borderColor = 'var(--border-dark)'; hr.style.opacity = '0.5'; hr.style.margin = '10px 0';
                    dl.appendChild(hr);
                } else {
                    const dt = document.createElement('dt');
                    dt.innerHTML = `<code>${item.name || ''}</code> : ${item.type || ''}`;
                    dl.appendChild(dt);
                    if (item.comment) {
                        const dd = document.createElement('dd');
                        dd.textContent = `# ${item.comment}`;
                        dl.appendChild(dd);
                    }
                }
            });
            dtContainer.appendChild(dl);
        } else {
            dtContainer.innerHTML = '<p class="placeholder-text-small"><em>(Vide)</em></p>';
        }
    }

    if (ulJust) {
        ulJust.innerHTML = '';
        if (data.dataJustifications && data.dataJustifications.length > 0) {
            data.dataJustifications.forEach(text => { const li = document.createElement('li'); li.textContent = text; ulJust.appendChild(li); });
        } else {
            ulJust.innerHTML = '<li><em>(Vide)</em></li>';
        }
    }
    if (ulMocks) {
        ulMocks.innerHTML = '';
        if (data.mockExamples && data.mockExamples.length > 0) {
            data.mockExamples.forEach(text => { const li = document.createElement('li'); li.innerHTML = `<code>${text.replace(/`(.*?)`/g, '$1')}</code>`; ulMocks.appendChild(li); });
        } else {
            ulMocks.innerHTML = '<li><em>(Vide)</em></li>';
        }
    }
    if (preProto) {
        preProto.textContent = data.prototypeExample || '/* (Vide) */';
    }
}

export function populateBreakdowns(breakdowns, targetContainer) {
    if (!targetContainer) return;
    targetContainer.innerHTML = '';
    let hasBreakdowns = false;
    for (const key in breakdowns) {
        if (breakdowns.hasOwnProperty(key) && breakdowns[key].steps && breakdowns[key].steps.length > 0) {
            hasBreakdowns = true;
            const breakdownData = breakdowns[key];
            const sectionDiv = document.createElement('div');
            sectionDiv.classList.add('story-breakdown');
            sectionDiv.id = `breakdown-${key}`;

            const titleH3 = document.createElement('h3');
            titleH3.textContent = breakdownData.title || `Détail ${key}`;
            sectionDiv.appendChild(titleH3);

            const stepsDiv = document.createElement('div');
            stepsDiv.classList.add('steps');
            breakdownData.steps.forEach(stepText => {
                const stepDiv = document.createElement('div');
                stepDiv.classList.add('step');
                stepDiv.textContent = stepText;
                stepsDiv.appendChild(stepDiv);
            });
            sectionDiv.appendChild(stepsDiv);
            targetContainer.appendChild(sectionDiv);
        }
    }
    if (!hasBreakdowns) {
        targetContainer.innerHTML = '<p class="placeholder-text"><em>(Aucune décomposition de story définie)</em></p>';
    }
}
// <-- end comment (.js file)(js/populate_static.js)
// <-- end comment (.js file)(js/populate_static.js)