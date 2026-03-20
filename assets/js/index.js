'use strict';
import { MusicGroupService } from './music-group-service.js';

const service = new MusicGroupService();

function renderList(pageNr) {
    document.title = `Musikgruppslista - Evergreen Music`;
    const h1 = document.getElementById('page-h1');
    if (h1) h1.innerText = `Musikgruppslista`;

    const listContainer = document.getElementById('group-list-container');
    if (!listContainer) return;

    // --- FIX PROBLEM 1: Behåll headern ---
    const header = listContainer.querySelector('.list-header');
    listContainer.innerHTML = ''; 
    listContainer.appendChild(header);

    const pageData = service.readGroups(pageNr, 10);

    pageData.pageItems.forEach(group => {
        const row = document.createElement('div');
        row.className = 'list-row';
        row.innerHTML = `
            <div class="col-name">
                <a href="view-group.html?id=${group.id}">${group.name}</a>
            </div>
            <div class="col-actions">
                <button class="btn btn-edit">Ändra</button>
                <button class="btn btn-delete">Radera</button>
            </div>
        `;
        listContainer.appendChild(row);
    });

    renderPagination(pageData);
}

function renderPagination(pageData) {
    const nav = document.querySelector('.pagination');
    if (!nav) return;

    nav.innerHTML = ''; // Remove old HTML pagination buttons

    // --- FIX: Use <button> elements instead of <a> tags ---

    // Previous
    const prev = document.createElement('button');
    // Keep the class names for the existing CSS but add "disabled" class (also in CSS) if it's the first page
    prev.className = `pag-nav ${pageData.pageNr === 0 ? 'disabled' : ''}`;
    prev.innerText = 'Föregående';
    // Buttons have a "disabled" property that can be set to true to disable them, which is more semantically correct than 
    // just adding a visual "disabled" class. This also prevents the button from being clickable when disabled.
    prev.disabled = pageData.pageNr === 0; 
    prev.onclick = () => {
        if (pageData.pageNr > 0) renderList(pageData.pageNr - 1);
    };
    nav.appendChild(prev);

    // Pagenumbers
    let start = Math.max(0, pageData.pageNr - 4);
    let end = Math.min(pageData.totalPages - 1, start + 9); // Visar upp till 10 nummer

    for (let i = start; i <= end; i++) {
        const btn = document.createElement('button');
        // Sets the active button to have an "active" class for styling.
        btn.className = `pag-num ${i === pageData.pageNr ? 'active' : ''}`;
        btn.innerText = i + 1;
        btn.onclick = () => {
            renderList(i);
        };
        nav.appendChild(btn);
    }

    // Next
    const next = document.createElement('button');
    next.className = `pag-nav ${pageData.pageNr === pageData.totalPages - 1 ? 'disabled' : ''}`;
    next.innerText = 'Nästa';
    next.disabled = pageData.pageNr === pageData.totalPages - 1;
    next.onclick = () => {
        if (pageData.pageNr < pageData.totalPages - 1) renderList(pageData.pageNr + 1);
    };
    nav.appendChild(next);
}

// Wait for the DOM to be fully loaded before trying to manipulate it
document.addEventListener('DOMContentLoaded', () => {
    renderList(0);
});