'use strict';
import { MusicGroupService } from './music-group-service.js';

const service = new MusicGroupService();
const allGroups = service.readAll();

console.log("Här är mina genererade musikgrupper:");

// .table() displays the array of music groups in a nice table format in the console, making it easier to read and compare the properties of each group. 
console.table(allGroups); 