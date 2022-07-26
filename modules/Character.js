"use strict";

import * as THREE from '../libs/three.js/three.module.js';

export default class Character {
    
    /** @type {String} */
    name;
    /** @type {Number} */
    color;
    /** @type {THREE.Object3D} */
    model;

    /** @type {THREE.Vector3} */
    #targetPosition = new THREE.Vector3();
    
    constructor(name, model, color, position) {
        this.name = name;
        this.color = color;
        
        this.model = model.clone();
        this.#setupModel(position);

        this.#targetPosition.copy(this.model.position);
    };

    #setupModel(position) {
        this.model.position.copy(position);
        this.model.scale.set(1.3, 1.3, 1.3);
        this.model.name = this.name;

        const identifier = new THREE.Mesh(
            new THREE.SphereGeometry(1),
            new THREE.MeshPhongMaterial({ color: this.color })
        );
        identifier.name = 'Identifier';
        identifier.position.add(new THREE.Vector3(0, -1, 10));
        this.model.add(identifier);
    };

    #resetRotation() {
        this.model.setRotationFromQuaternion(new THREE.Quaternion());
        this.model.rotateX(-Math.PI / 2);
    };

    moveHorizontal(units) {
        this.model.position.x += units * 10;

        this.#resetRotation();
        const direction = Math.sign(units);
        this.model.rotateZ(direction * Math.PI / 2);
    };

    moveVertical(units) {
        this.model.position.z -= units * 10;

        this.#resetRotation();
        const direction = Math.sign(units);
        if (direction === 1 ) this.model.rotateZ(direction * Math.PI);
    };
};