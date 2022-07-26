/**
 * Labyrinth class which creates a labyrinth with start, goals, and obstacles for 
 * the search algorithm simulation.
 *
 * @module Labyrinth
 * @file Labyrinth class for Escape Room
 * @author Emilio Popovits Blake
 */

"use strict";

// Import ThreeJs
import { Group, Vector2, BoxGeometry, Mesh, MeshPhongMaterial, Vector3 } from '../libs/three.js/three.module.js';
// Import VirtualGrid
import VirtualGrid from './VirtualGrid.js';
// Import standard labyrinth
import { standardLabyrinth } from '../data/labyrinths.js';

/**
 * Labyrinth class which creates a labyrinth with start, goals, and obstacles for 
 * the search algorithm simulation.
 * @class
 * @property {Group} labyrinth - Labyrinth Object Group
 * @property {Group} floors - Floors Object Group
 * @property {Group} walls - Walls Object Group
 * @property {VirtualGrid} virtualGrid - Virtual Grid Object
 */
export default class Labyrinth {
    /**
     * Width of the labyrinth in nodes (integer)
     * @private
     * @type {Number}
     */
    #width;
    /**
     * Height of the labyrinth in nodes (integer)
     * @private
     * @type {Number}
     */
    #height;
    /**
     * Probability of obstacles appearing in labyrinth (float)
     * @private
     * @type {Number}
     */
    #obstacleProbability;
    /**
     * Amount of target nodes to spawn (integer)
     * @private
     * @type {Number}
     */
    #goalAmount;

    /**
     * Labyrinth Object Group
     * @type {Group}
     */
    labyrinth = new Group();
    /**
     * Floors Object Group
     * @type {Group}
     */
    floors = new Group();
    /**
     * Walls Object Group
     * @type {Group}
     */
    walls = new Group();

    /** 
     * Virtual Grid Object
     * @type {VirtualGrid} 
     */
    virtualGrid;


    /**
     * Constructs a Labyrinth Object.
     * @param {Number} [width] - Width of the labyrinth in nodes (integer)
     * @param {Number} [height] - Height of the labyrinth in nodes (integer)
     * @param {Number} [obstacleProbability] - Probability of obstacles appearing in labyrinth (float)
     * @param {Number} [goalAmount] - Amount of target nodes to spawn (integer)
     */
    constructor(width, height, obstacleProbability, goalAmount) {
        // Initialize object variables
        this.#width = width ?? 31;
        this.#height = height ?? 31;
        this.#obstacleProbability = obstacleProbability ?? -1;
        this.#goalAmount = goalAmount ?? 1;

        // Name groups
        this.labyrinth.name = 'Labyrinth';
        this.floors.name = 'Floors';
        this.walls.name = 'Walls';

        // Initialize labyrinth objects
        this.#obstacleProbability === -1 ? this.#standardLabyrinth() : this.#generatedLabyrinth();

        // Instantiate virtual grid
        const topRight = this.walls.getObjectByName('Top Right');
        const bottomLeft = this.walls.getObjectByName('Bottom Left');
        this.virtualGrid = new VirtualGrid(this.floors.children, this.walls.children, topRight, bottomLeft, 10);
    };

    /**
     * Creates a standard labyrinth (5x5) for the non-informated search algorithm.
     * @private
     */
    #standardLabyrinth() {
        const labyrinthData = standardLabyrinth
            .substring(1, standardLabyrinth.length - 1)
            .replaceAll(' ', '')
            .split('\n')
            .map(string => string.split(''));

        /** @type { [{name: String, color: Number, group: Group}] } */
        const presets = [
            { name: 'Wall', color: 0x0000FF, group: this.walls },
            { name: 'Floor', color: 0xFFFFFF, group: this.floors }
        ];
        
        labyrinthData.forEach((row, rowIdx) => {
            row.forEach((value, colIdx) => {
                const type = value === '0' ? Labyrinth.WALL : Labyrinth.FLOOR;

                const color = presets[type].color;
                const name = presets[type].name;
                const position = new Vector3(
                    -150 + 10 * colIdx,
                    type === Labyrinth.WALL ? 10 : 0,
                    -150 + 10 * rowIdx
                );

                const cube = new Mesh(
                    new BoxGeometry(10, 10, 10),
                    new MeshPhongMaterial({ color })
                );
                cube.name = name;
                cube.position.copy(position);
                presets[type].group.add(cube);
            });
        });

        // Name top right and bottom left edges of labyrinth
        this.walls.children[labyrinthData[0].length - 1].name = 'Top Right';
        this.walls.children[this.walls.children.length - labyrinthData[0].length].name = 'Bottom Left';

        // Name start and end
        const start = this.floors.children[this.floors.children.length - 1];
        start.name = 'Start';
        // start.material.color.setHex(0x00FF00);
        
        const end = this.floors.children[0];
        end.name = 'End'
        // end.material.color.setHex(0xFF0000);
        
        // Add the floors and walls to the labyrinth object group
        this.labyrinth.add(this.floors, this.walls);
    };

    /**
     * Creates a custom labyrinth for the informated search algorithm.
     * @private
     */
    #generatedLabyrinth() {
        // Get floor width and height (-2 because of outer walls)
        const floorWidth = this.#width - 2;
        const floorHeight = this.#height - 2;

        // Generate Floors and Walls
        for (let x = 0; x < floorWidth; x++) {
            for (let y = 0; y < floorHeight; y++) {
                const wall = Math.random() <= this.#obstacleProbability;

                const cube = new Mesh(
                    new BoxGeometry(10, 10, 10),
                    new MeshPhongMaterial({ color: !wall ? 0xFFFFFF : 0x0000FF })
                );
                cube.position.x = 0 + x * 10;
                cube.position.y = !wall ? 0 : 10;
                cube.position.z = 0 + y * 10;
                cube.name = !wall ? 'Floor' : 'Wall';

                !wall ? this.floors.add(cube) : this.walls.add(cube);
            }
        }

        // Generate outer walls
        const wallPositions = [
            // Top Walls
            ... new Array(this.#width).fill().map((_, idx) => new Vector3(-10 + idx * 10, 10, -10)),
            // Bottom Walls
            ...new Array(this.#width).fill().map((_, idx) => new Vector3(-10 + idx * 10, 10, floorHeight * 10 )),
            // Left Walls
            ...new Array(floorHeight).fill().map((_, idx) => new Vector3(-10, 10, 0 + idx * 10)),
            // Right Walls
            ...new Array(floorHeight).fill().map((_, idx) => new Vector3(floorWidth * 10, 10, 0 + idx * 10))
        ];
        wallPositions.forEach(position => {
            const cube = new Mesh(
                new BoxGeometry(10, 10, 10),
                new MeshPhongMaterial({ color: 0x0000FF })
            );
            cube.position.copy(position);
            if (position.z === -10 && position.x === -10 + (this.#width - 1) * 10) cube.name = 'Top Right';
            else if (position.z === floorHeight * 10 && position.x === -10) cube.name = 'Bottom Left';
            else cube.name = 'Wall';
            // cube.name = position.z === -10 && position.x === -10 + this.#width * 10 ? 'Top Right' : 'Wall';
            this.walls.add(cube)
        });

        // Choose random start
        const start = this.floors.children[Math.round(Math.random() * (this.floors.children.length - 1))];
        start.material.color.setHex(0x00FF00);
        start.name = 'Start';

        // Choose random goals
        for (let i = 0; i < this.#goalAmount; i++) {
            let goal = this.floors.children[Math.round(Math.random() * (this.floors.children.length - 1))];
            while (goal.name === 'Start') goal =  this.floors.children[Math.round(Math.random() * (this.floors.children.length - 1))];
            goal.material.color.setHex(0xFF0000);
            goal.name = 'End';
        }

        // Add the floors and walls to the labyrinth object group
        this.labyrinth.add(this.floors, this.walls);
    };

    /**
     * Draws the found path between start and end nodes on the labyrinth.
     * @param {Node[]} path - Found path by search algorithm.
     */
    drawPath(path) {
        path.forEach(({ cube }, idx) => {
            if (idx !== path.length - 1) cube.material.color.setHex(0x737373);
        });
    };
};

Labyrinth.WALL = 0;
Labyrinth.FLOOR = 1;