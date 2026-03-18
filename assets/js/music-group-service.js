'use strict';
import { seedGenerator } from './SeidoHelpers/seido-helpers.js';

// A music group service that will manage the music groups. 
export function MusicGroupService() {

    // In the real application, code would be replaced with API calls to a backend server, but for now we'll use an in-memory
    //  array to store our music groups. This array will be filled with music group objects generated from the seeder. 
    const _seeder = new seedGenerator();
    this.musicGroups = [];

    // A private helper function to create a music group object from the seeder
    let _nextId = 0;
    const createMusicGroup = (_sgen) => {
        return {
            id: _nextId++,
            name: _sgen.musicBandName,
            establishedYear: Math.floor(Math.random() * (2024 - 1960) + 1960),
            genre: _sgen.fromString("Rock, Pop, Jazz, Metal, Synth, Blues")
        };
    };

    // Create a mockup "database"/list of 1000 music groups using the seeder
    this.musicGroups = _seeder.toArray(1000, createMusicGroup);

    // Simple method to retrieve all music groups
    this.readAll = function() {
        return this.musicGroups;
    };
}