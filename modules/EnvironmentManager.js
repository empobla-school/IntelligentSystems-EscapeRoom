"use strict";

import * as THREE from '../libs/three.js/three.module.js';
import { OrbitControls } from '../libs/three.js/controls/OrbitControls.js';

export default class EnvironmentManager {
    /** @type {THREE.WebGLRenderer} */
    #renderer;
    /** @type {THREE.Scene} */
    scene;
    /** @type {THREE.PerspectiveCamera} */
    #camera;

    assets = {};

    constructor(assets) {
        // assets.forEach(({ name, asset }) => this.assets[name] = asset);

        window.addEventListener('resize', () => this.onWindowResize(), false);

        this.#initEnvironment();
        this.#setupScene();
    };

    /** Initializes ThreeJs Environment and Controls. */
    #initEnvironment() {
        this.#renderer = new THREE.WebGLRenderer({ antialias: true });

        this.#renderer.setPixelRatio(window.devicePixelRatio);
        this.#renderer.setSize(window.innerWidth, window.innerHeight);
        this.#renderer.shadowMap.enabled = true;
        this.#renderer.shadowMap.type = THREE.PCFShadowMap;
        document.body.appendChild(this.#renderer.domElement);

        this.scene = new THREE.Scene();

        this.#camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 4000);
        this.#camera.position.set(0, 400, 80);

        new OrbitControls(this.#camera, this.#renderer.domElement);
    };

    #setupScene() {
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
		const pointLight = new THREE.PointLight(0xFFFFFF, 0.5);
		pointLight.position.set(0, 50, -40);
		this.scene.add(ambientLight, pointLight);
    };

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.#renderer.render(this.scene, this.#camera);
    };

    onWindowResize() {
        this.#camera.aspect = window.innerWidth / window.innerHeight;
        this.#camera.updateProjectionMatrix();
        this.#renderer.setSize(window.innerWidth, window.innerHeight);
    };
};