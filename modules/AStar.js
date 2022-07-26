/**
 * A* algorithm class uses A* pathfinding to find the shortest path between a given 
 * start position and target positions.
 *
 * @module AStar
 * @file AStar class for Labyrinth search simulation
 * @author Emilio Popovits Blake
 * @author Hector R.A.D.
 */

"use strict";

// Import ThreeJs
import { Mesh } from '../libs/three.js/three.module.js';
// Import VirtualGrid
import VirtualGrid from './VirtualGrid.js';
// Import Custom Node class
import Node from './Node.js';

/**
 * A* algorithm class uses A* pathfinding to find the shortest path between a given 
 * start position and target positions.
 * @class
 */
export default class AStar {
    /** 
     * Reference to the map grid
     * @private
     * @type {VirtualGrid} 
     */
    #virtualGrid;

    /**
     * Constructs an A* Object
     * @param {VirtualGrid} virtualGrid - Reference to the map grid
     */
    constructor(virtualGrid) {
        // Initialize object variables
        this.#virtualGrid = virtualGrid;
    };

    /**
     * Runs the A* algorithm and finds the shortest path between the start position and the target position.
     * @param {Mesh} start - Start cube for the A* Algorithm
     * @param {Mesh[]} targets - Target cubes for the A* Algorithm
     */
    findPath(start, ...targets) {
        const target = targets[Math.round(Math.random() * (targets.length - 1))];
        target.material.color.setHex(0xffc400);

        // Get the closest node to the starting and target position from the grid
        const startNode = this.#virtualGrid.getNodeFromWorldSpace(start.position);
        const targetNode = this.#virtualGrid.getNodeFromWorldSpace(target.position);

        // Create A* open and closed lists
        const openList = [];
        const closedList = new Set();   // Set to prevent duplicates

        // Start A* Algorithm
        openList.push(startNode);

        // Flag to know if destination is unreachable
        let unreachable = true;
        // While open list is not empty
        while (openList.length > 0) {
            // Get the lowest FCost node from the open list and make it the current node
            const currentNode = this.#getLowestFCostNode(openList);

            // Remove the current node from the open list and add it to the closed list
            const currentNodeIdx = openList.indexOf(currentNode);
            openList.splice(currentNodeIdx, 1);
            closedList.add(currentNode);

            // (Guard Clause) If the current node is equal to the target node, the target node has 
            // been found. Break out of the loop.
            if (currentNode == targetNode) {
                unreachable = false;
                break;
            }
            
            // For each neighbor of the current node
            for (const neighborNode of this.#virtualGrid.getNeighborNodes(currentNode)) {
                // (Guard Clause) If the neighbor is a wall or is in the closed list, skip it
                if (neighborNode.isWall || closedList.has(neighborNode))
                    continue;

                // Calculate new gValue (cost of getting to the neighbor node from the current node)
                // const newGValue = currentNode.gValue + this.#calculateManhattanDistance(currentNode, neighborNode);
                const newGValue = currentNode.gValue + Math.sqrt(Math.pow(currentNode.gridPosition.x - neighborNode.gridPosition.x, 2) + Math.pow(currentNode.gridPosition.y - neighborNode.gridPosition.y, 2));

                // If the neighbor is not in the open list or its gCost is higher than the new gCost
                if (!openList.includes(neighborNode) || newGValue < neighborNode.gValue) {
                    neighborNode.parent = currentNode;  // Set the parent (past node) of the neighbor node as the current node
                    neighborNode.gValue = newGValue;  // Set the neighbor's gValue equal to the new gValue
                    neighborNode.hValue = this.#calculateManhattanDistance(neighborNode, targetNode);  // Re-calculate the neighbor's hValue (distance from the target)

                    // If the neighbor node is not in the open list, add it to the open list
                    if (!openList.includes(neighborNode)) openList.push(neighborNode);
                }
            }
        }

        // If destination is unreachable, print it to the console and return an empty path list
        if (unreachable) {
            console.log('Destination Unreachable!');
            return [];
        }

        // Once the loop has ended, the final path has been found. Construct the final path.
        return this.#getFinalPath(startNode, targetNode);
    };

    /**
     * Helper method that linearly finds the lowest fCost node from a list and returns it.
     * @private
     * @param {Node[]} nodeList 
     * @returns 
     */
    #getLowestFCostNode(nodeList) {
        // Assume the first node is the one with the lowest FCost
        let leastFCost = 0;
        // For each node in the node list, check if it's FCost is lower than the current one (index).
        // If it is, replace the leastFCost variable with the index of the new least FCost node. 
        for (let i = 0; i < nodeList.length; i++)
            if (nodeList[i].fCost < nodeList[leastFCost].fCost)
                leastFCost = i;

        // Return the node with the least FCost from the list.
        return nodeList[leastFCost];
    };

    /**
     * Helper method to calculate the Manhattan distance from a node A to a node B.
     * @private
     * @param {Node} nodeA - A node to calculate the Manhattan distance from
     * @param {Node} nodeB - A node to calculate the Manhattan distance to
     * @returns {Number} An integer with the Manhattan distance from node A to node B.
     */
    #calculateManhattanDistance(nodeA, nodeB) {
        // Subtract the gridX and the gridY from both nodes and return the sum of them
        const deltaX = Math.abs(nodeA.gridPosition.x - nodeB.gridPosition.x);
        const deltaY = Math.abs(nodeA.gridPosition.y - nodeB.gridPosition.y);

        return deltaX + deltaY;
    };

    /**
     * Constructs a list with the final path found from the A* algorithm from the startNode to the targetNode.
     * @param {Node} startNode - The starting node for the A* pathfinding algorithm
     * @param {Node} targetNode - The target node for the A* pathfinding algorithm
     * @returns {Node[]} The final path found from the A* algorithm from the startNode to the targetNode.
     */
    #getFinalPath (startNode, targetNode) {
        const finalPath = [];    // Make a list for the final path to be stored in
        let currentNode = targetNode;  // Set the current node as the final node, to trace back from it

        // While the current node is not the starting node
        while (currentNode != startNode) {
            if (currentNode.parent == null) continue;   // Prevent null reference error
            finalPath.push(currentNode); // Add the current node to the final path list
            currentNode = currentNode.parent;   // Set the current node as the current node's parent (preceding node)
        }

        // Reverse the list to get a path from the starting node to the target node
        finalPath.reverse();
        // Return the calculated final path from A*
        return finalPath;
    };
};