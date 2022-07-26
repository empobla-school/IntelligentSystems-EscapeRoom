/**
 * Virtual Grid class which creates an array grid representation of the map 
 * for pathfinding.
 *
 * @module VirtualGrid
 * @file Virtual Grid for Labyrinth search simulation
 * @author Emilio Popovits Blake
 * @author Hector R.A.D.
 */

"use strict";

// Import ThreeJs
import { Mesh, Vector2, Vector3 } from '../libs/three.js/three.module.js';
// Import Custom Node Class
import Node from './Node.js';

/**
 * Virtual Grid class which creates an array grid representation of the map 
 * for pathfinding.
 * @class
 * @property {Node[][]} grid - Map array grid representation for pathfinding
 */
export default class VirtualGrid {
    /**
     * Top right cube of the labyrinth
     * @private 
     * @type {Mesh} 
     */
    #topRight;
    /**
     * Bottom left cube of the labyrinth
     * @private 
     * @type {Mesh} 
     */
    #bottomLeft;
    /** 
     * Size of all cubes in labyrinth
     * @private
     * @type {Number} 
     */
    #nodeSize;
    
    /** 
     * Map array grid representation for pathfinding
     * @type {Node[][]} 
     */
    grid;
    /** 
     * Width of the grid
     * @private
     * @type {Number}
     */
    #gridSizeX;
    /** 
     * Height of the grid
     * @private
     * @type {Number}
     */
    #gridSizeY;

    /**
     * Constructs a Virtual Grid Object.
     * @param {Mesh[]} floors - Array with all the labyrinth floors
     * @param {Mesh[]} walls - Array with all the labyrinth walls
     * @param {Mesh} topRight - Top right cube of the labyrinth
     * @param {Mesh} bottomLeft - Bottom left cube of the labyrinth
     * @param {Number} nodeSize - Size of all cubes in labyrinth
     */
    constructor(floors, walls, topRight, bottomLeft, nodeSize) {
        // Initialize object variables
        this.#topRight = topRight;
        this.#bottomLeft = bottomLeft;
        this.#nodeSize = nodeSize;

        // Create the virtual grid
        this.#createVirtualGrid(floors, walls);
    };

    /**
     * Creates the map array grid representation for pathfinding.
     * @private
     * @param {Mesh[]} floors - Array with all the labyrinth floors
     * @param {Mesh[]} walls - Array with all the labyrinth walls
     */
    #createVirtualGrid(floors, walls) {
        // Calculate the grid array size based on the bottom left and top right nodes of the map
        this.#gridSizeX = Math.abs(Math.round((this.#topRight.position.x - this.#bottomLeft.position.x) / this.#nodeSize)) + 1;
        this.#gridSizeY = Math.abs(Math.round((this.#topRight.position.z - this.#bottomLeft.position.z) / this.#nodeSize)) + 1;
        
        // Initialize grid array
        this.grid = new Array(this.#gridSizeY).fill().map(_ => new Array(this.#gridSizeX).fill());

        // Add all floor objects to correct positions in grid array
        floors.forEach(floor => {
            const x = Math.abs(Math.round((floor.position.x - this.#bottomLeft.position.x) / this.#nodeSize));
            const y = Math.abs(Math.round((floor.position.z - this.#topRight.position.z) / this.#nodeSize));
            const gridPosition = new Vector2(x, y);
            this.grid[y][x] = new Node(floor, false, floor.position, gridPosition);
        });
        
        // Add all wall objects to correct positions in grid array
        walls.forEach(wall => {
            const x = Math.abs(Math.round((wall.position.x - this.#bottomLeft.position.x) / this.#nodeSize));
            const y = Math.abs(Math.round((wall.position.z - this.#topRight.position.z) / this.#nodeSize));
            const gridPosition = new Vector2(x, y);
            this.grid[y][x] = new Node(wall, true, wall.position, gridPosition);
        });
    };

    /**
     * Returns a number whose value is limited to the given range.
     *
     * Example: limit the output of this computation to between 0 and 255
     * (x * 255).clamp(0, 255)
     *
     * @private
     * @param {Number} value The number to clamp
     * @param {Number} min The lower boundary of the output range
     * @param {Number} max The upper boundary of the output range
     * @returns {Number} A number in the range [min, max]
     */
    #clamp(value, min, max) { 
        return Math.min(Math.max(value, min), max); 
    };

    /**
     * Gets closest node in the grid to the specified world space coordinates.
     * @param {Vector3} worldPosition - World position to find a node from the grid for
     * @returns {Node} The closest node from the grid to the specified world position.
     */
    getNodeFromWorldSpace(worldPosition) {
        const x = this.#clamp(Math.abs(Math.round((worldPosition.x - this.#bottomLeft.position.x) / this.#nodeSize)), 0, this.#gridSizeX);
        const y = this.#clamp(Math.abs(Math.round((worldPosition.z - this.#topRight.position.z) / this.#nodeSize)), 0, this.#gridSizeY);

        return this.grid[y][x];
    };

    /**
     * Private helper function that returns a boolean specifying if the neighbor to be checked is within the grid.
     * @param {Vector2} direction - Direction (index) in the grid to check, relative to the current node
     * @returns {Boolean} True if the node is inside of the grid, false if the node is not inside of the grid.
     */
    checkNeighbor(direction) {
        return (direction.x >= 0 && direction.x < this.#gridSizeX) && (direction.y >= 0 && direction.y < this.#gridSizeY);
    };

    /**
     * Gets the neighboring nodes to the specified node in the north, east, south, and west directions relative to the node.
     * @param {Node} node - Node to find the neighbors for
     * @returns {Node[]} A list with the neighbors of the specified node.
     */
    getNeighborNodes(node) {
        const neighborNodes = [];

        const directions = [
            new Vector2(node.gridPosition.x, node.gridPosition.y + 1),    // North side neighbor
            new Vector2(node.gridPosition.x + 1, node.gridPosition.y),    // East side neighbor
            new Vector2(node.gridPosition.x, node.gridPosition.y - 1),    // South side neighbor
            new Vector2(node.gridPosition.x - 1, node.gridPosition.y),    // West side neighbor
            // new Vector2(node.gridPosition.x + 1, node.gridPosition.y + 1),    // North east side neighbor
            // new Vector2(node.gridPosition.x + 1, node.gridPosition.y - 1),    // South east side neighbor
            // new Vector2(node.gridPosition.x - 1, node.gridPosition.y - 1),    // South west side neighbor
            // new Vector2(node.gridPosition.x - 1, node.gridPosition.y + 1),    // North west side neighbor
        ];

        // For each direction pair, check if neighbors are in the grid. If they are, add them to the neighbor list
        directions.forEach(direction => {
            if (this.checkNeighbor(direction)) neighborNodes.push(this.grid[direction.y][direction.x]);
        });
        
        return neighborNodes;
    };
};