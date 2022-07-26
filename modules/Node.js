/**
 * Custom Node class which creates a node for the virtual grid representing a spot (cube) 
 * on the map. Used for pathfinding.
 *
 * @module Node
 * @file Node for Labyrinth search simulation
 * @author Emilio Popovits Blake
 * @author Hector R.A.D.
 */

"use strict";

// Import ThreeJs
import { Vector2, Vector3, Mesh } from '../libs/three.js/three.module.js';

/**
 * Custom Node class which creates a node for the virtual grid representing a spot (cube) 
 * on the map. Used for pathfinding.
 * @class
 * @property {Mesh} cube - Reference to the cube the node represents
 * @property {Boolean} isWall - Flag to know if the node is a wall
 * @property {Vector2} gridPosition - Node position in the grid
 * @property {Vector3} worldPosition - Node position in the world
 * @property {Node} parent - For A*, will store what node it previously came from so it can trace the shortest path
 * @property {Number} gValue - The cost of moving to the next square from the current square
 * @property {Number} hValue - The distance to the goal from the node
 * @property {Number} fCost - The sum of the g value and the h value
 */
export default class Node {
    /** 
     * Reference to the cube the node represents
     * @type {Mesh} 
     */
    cube;

    /** 
     * Flag to know if the node is a wall
     * @type {Boolean} 
     */
    isWall;

    /**
     * Node position in the grid
     * @type {Vector2}
     */
    gridPosition = new Vector2();
    /**
     * Node position in the world
     * @type {Vector3}
     */
    worldPosition = new Vector3();

    /** 
     * For A*, will store what node it previously came from so it can trace the shortest path
     * @type {Node} 
     */
    parent;
    /** 
     * The cost of moving to the next square from the current square
     * @type {Number} 
     */
    gValue;
    /** 
     * The distance to the goal from the node
     * @type {Number} 
     */
    hValue;
    /** 
     * Get function to get the f cost, which is the sum of the g value and the h value.
     * @returns {Number} The fCost of the node.
     */
    get fCost() { return this.gValue + this.hValue; }

    /**
     * Constructs a Node Object.
     * @param {Mesh} cube - Reference to the cube the node represents
     * @param {Boolean} isWall - Flag to know if the node is a wall
     * @param {Vector3} worldPosition - Node position in the world
     * @param {Vector2} gridPosition - Node position in the grid
     */
    constructor(cube, isWall, worldPosition, gridPosition) {
        // Initialize object variables
        this.cube = cube;
        this.isWall = isWall;
        this.worldPosition = worldPosition;
        this.gridPosition = gridPosition;
    };
};