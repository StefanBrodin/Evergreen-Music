'use strict';
import { MusicGroupService } from './music-group-service.js';

const service = new MusicGroupService();

// 1. Catch ID from the URL (for example ?id=42)
const urlParams = new URLSearchParams(window.location.search);
const groupId = urlParams.get('id');

// 2. Fetch data from the service
const group = service.readGroup(groupId);

if (group) {
    renderGroupDetails(group);
} else {
    document.getElementById('group-name').innerText = "Gruppen hittades inte";
}

// 3. Render the page using the retrieved data
function renderGroupDetails(group) {
    document.title = `${group.name} - Evergreen Music`;

    // Group details
    document.getElementById('group-name').innerText = group.name;
    document.getElementById('group-genre').innerText = group.genre;
    document.getElementById('group-established').innerText = group.establishedYear;
    
    const imgElement = document.getElementById('group-image');
    imgElement.src = group.imageUrl;
    imgElement.alt = group.name;

    // Render the members list
    const memberList = document.getElementById('member-list');
    memberList.innerHTML = ''; // Rensa statisk data
    group.members.forEach(member => {
        const li = document.createElement('li');
        li.innerText = member.name;
        memberList.appendChild(li);
    });

    // Render the albums list
    const albumContainer = document.getElementById('album-list');
    // Keep the header but clear the rest of the album list container
    const header = albumContainer.firstElementChild;
    albumContainer.innerHTML = '';
    albumContainer.appendChild(header);

    group.albums.forEach(album => {
        const row = document.createElement('div');
        row.className = 'list-row album-view-grid';
        row.innerHTML = `
            <div class="col-name">${album.title}</div>
            <div class="col-year">${album.releaseYear}</div>
        `;
        albumContainer.appendChild(row);
    });
}