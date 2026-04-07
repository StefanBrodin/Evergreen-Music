'use strict';

// Made MusicGroupService into a class to better match the structure of the API service that will be used later. 
// The constructor is used to set up any common properties, and the methods are defined within the class body. 
export class MusicGroupService {

    // The baseUrl is the common denominator for all API calls, so we set it in the constructor. 
    // This way, if the API endpoint changes, we only need to update it in one place.
    constructor() {
        this.baseUrl = 'https://music.api.public.seido.se';
    }


    // Retrieves a paginated list of music groups from the service. It takes pageNr, pageSize, and an optional filter string as parameters.
    async readGroups(pageNr, pageSize, filter = '') {

        // Using the parameters from the API-documentation by Swagger to construct the API URL. 
        const url = `${this.baseUrl}/api/MusicGroups/Read?seeded=false&flat=true&pageNr=${pageNr}&pageSize=${pageSize}&filter=${filter}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            // Throwing an error instead of returning null/empty data, allowing the UI to handle the failure case more explicitly (e.g., by showing an error message to the user).
            const errorText = await response.text();
            throw new Error(`Kunde inte hämta grupper (${response.status}): ${errorText || response.statusText}`);
        }

        const data = await response.json();

        // Mapping the metadata from the API response to the format expected by the frontend already created. 
        // The API returns 'pageCount' for total pages, which we use directly. 
        return {
            pageNr: data?.pageNr ?? pageNr,
            pageSize: data?.pageSize ?? pageSize,
            totalCount: data?.dbItemsCount ?? 0,
            totalPages: data?.pageCount ?? 0,
            pageItems: data?.pageItems ?? [] // Always return an array for pageItems, even if it's empty, to avoid issues in the frontend when trying to iterate over it.
        };
    }


    // Retrieves a single music group by its ID. Uses the 'flat=false' parameter to get the full details of the group, including its members and albums.
    async readGroup(id) {
    
        const url = `${this.baseUrl}/api/MusicGroups/ReadItem?id=${id}&flat=false`;
        
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Kunde inte hitta gruppen (${response.status}): ${errorText || response.statusText}`);
        }
        
        const data = await response.json();
        return data?.item ?? null; // Return the inner "item" which contains the actual group details, since the API wraps it in an outer object.   
    }


    // Deletes a music group by its ID. Sends a DELETE request to the API and returns true if the deletion was successful.
    async deleteGroup(id) {

        const url = `${this.baseUrl}/api/MusicGroups/DeleteItem/${id}`;
        
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'accept': 'text/plain' // Tells the API that we expect a plain text response
            }
        });

        if (!response.ok) {
            const errorText = await response.text(); 
            throw new Error(`Fel vid radering (${response.status}): ${errorText || response.statusText}`);
        }

        return true; // Return true to indicate successful deletion
    }


    // Creates a new music group using the provided groupDto object by sending a POST request to the API with the group data in JSON format.
    // Returns the created group object if successful.
    async createGroup(groupDto) {
        const url = `${this.baseUrl}/api/MusicGroups/CreateItem`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Tells the API that the data sent in the body is JSON data.
                'accept': 'application/json'        // Tells the API that we expect JSON data in response. 
            },
            // JSON.stringify transforms the JavaScript object (groupDto) into a JSON string, which is the format expected by the API for the request body.
            body: JSON.stringify(groupDto)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Kunde inte skapa grupp (${response.status}): ${errorText || response.statusText}`);
        }

        // The API returns the created group object in the response body, so we parse it as JSON and return it. 
        const data = await response.json();

        // The API wraps the actual group object in an outer "item" property, so we return data.item to return the unwrapped group details.
        return data?.item ?? null; 
    }


    // Creates a new artist using the provided artistDto object by sending a POST request to the API with the artist data in JSON format.
    // Returns the created artist object if successful.
    async createArtist(artistDto) {
        const url = `${this.baseUrl}/api/Artists/CreateItem`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', // Tells the API that the data sent in the body is JSON data.
                'accept': 'application/json'        // Tells the API that we expect JSON data in response. 
            }, 
            body: JSON.stringify(artistDto)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Kunde inte skapa artist (${response.status}): ${errorText || response.statusText}`);
        }

        const data = await response.json();
        return data?.item ?? null; 
    }


    // Creates a new album using the provided albumDto object by sending a POST request to the API with the album data in JSON format.
    // Returns the created album object if successful.
    async createAlbum(albumDto) {
        const url = `${this.baseUrl}/api/Albums/CreateItem`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', // Tells the API that the data sent in the body is JSON data.
                'accept': 'application/json'        // Tells the API that we expect JSON data in response. 
            }, 
            body: JSON.stringify(albumDto)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Kunde inte skapa album (${response.status}): ${errorText || response.statusText}`);
        }

        const data = await response.json();
        return data?.item ?? null;
    }


    // Updates an existing music group by its ID using a PUT request.
    // Sends the updated groupDto object as JSON and returns the updated item.
    async updateGroup(id, groupDto) {
        const url = `${this.baseUrl}/api/MusicGroups/UpdateItem/${id}`;
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(groupDto)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Kunde inte uppdatera grupp (${response.status}): ${errorText || response.statusText}`);
        }

        const data = await response.json();
        return data?.item ?? null;
    }


    // Updates an existing artist by its ID using a PUT request.
    // Sends the updated artistDto object as JSON and returns the updated item.
    async updateArtist(id, artistDto) {
        const url = `${this.baseUrl}/api/Artists/UpdateItem/${id}`;
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(artistDto)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Kunde inte uppdatera artist (${response.status}): ${errorText || response.statusText}`);
        }

        const data = await response.json();
        return data?.item ?? null;
    }


    // Updates an existing album by its ID using a PUT request.
    // Sends the updated albumDto object as JSON and returns the updated item.
    async updateAlbum(id, albumDto) {
        const url = `${this.baseUrl}/api/Albums/UpdateItem/${id}`;
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(albumDto)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Kunde inte uppdatera album (${response.status}): ${errorText || response.statusText}`);
        }

        const data = await response.json();
        return data?.item ?? null;
    }


    // Deletes an artist by its ID using a DELETE request. Returns true if successful.
    async deleteArtist(id) {
        const response = await fetch(`${this.baseUrl}/api/Artists/DeleteItem/${id}`, {
            method: 'DELETE',
            headers: {
                'accept': 'text/plain'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Fel vid radering av artist (${response.status}): ${errorText || response.statusText}`);
        }
        return true;
    }


    // Deletes an album by its ID using a DELETE request. Returns true if successful.
    async deleteAlbum(id) {
        const response = await fetch(`${this.baseUrl}/api/Albums/DeleteItem/${id}`, {
            method: 'DELETE',
            headers: {
                'accept': 'text/plain'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Fel vid radering av album (${response.status}): ${errorText || response.statusText}`);
        }
        return true;
    }
}