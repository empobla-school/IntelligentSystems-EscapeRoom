"use strict";

import * as THREE from './libs/three.js/three.module.js';
import EnvironmentManager from './modules/EnvironmentManager.js';
import AssetLoader from './modules/AssetLoader.js';
import Labyrinth from './modules/Labyrinth.js';
import Character from './modules/Character.js';
import AStar from './modules/AStar.js';
 
/** Main method. */
async function main() {
    // const assetData = {
    //     gltfs: [
    //         { name: 'dummy', path: './models/dummy/scene.gltf' }
    //     ]
    // };
    // const assetLoader = new AssetLoader(assetData);
    // const assets = await assetLoader.loadAssets();

    const environment = new EnvironmentManager();

    // Standard labyrinth
    const labyrinth = new Labyrinth();
    environment.scene.add(labyrinth.labyrinth);

    // Pathfinding
    const start = labyrinth.floors.getObjectByName('Start');
    const end = labyrinth.floors.children[50];
    const aStar = new AStar(labyrinth.virtualGrid);
    const path = aStar.findPath(start, end);
    labyrinth.drawPath(path);

    // Get a reference to the dummy model
    // const dummy = environment.assets.dummy.scene.children[0];

    // Create characters
    const prisonerPosition = new THREE.Vector3().copy(labyrinth.floors.getObjectByName('Start').position).add(new THREE.Vector3(0, 5, -1));
    const prisoner = new Character('Prisoner', 0x00FF00, prisonerPosition);
    environment.scene.add(prisoner.model);
    
    const policePosition = new THREE.Vector3().copy(labyrinth.floors.getObjectByName('End').position).add(new THREE.Vector3(0, 5, -1));
    const police = new Character('Police', 0xFF0000, policePosition);
    environment.scene.add(police.model);

    // Character Movement
    prisoner.moveHorizontal(-1);
    prisoner.moveVertical(2);

    environment.animate();
};
main();