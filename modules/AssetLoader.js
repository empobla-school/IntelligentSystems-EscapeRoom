"use strict";

import * as THREE from '../libs/three.js/three.module.js';
import { OBJLoader } from '../libs/three.js/loaders/OBJLoader.js';
import { FontLoader } from '../libs/three.js/loaders/FontLoader.js';
import { GLTFLoader } from '../libs/three.js/loaders/GLTFLoader.js';

export default class AssetLoader {
    /** @type {THREE.LoadingManager} */
    #loadingManager;

    constructor(assetData) {
        const loaderBar = document.querySelector('.loader__bar');

        this.#loadingManager = new THREE.LoadingManager();
        this.#loadingManager.onLoad = _ => {
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.classList.add('fade-out');
            loadingScreen.addEventListener('animationend', e => e.target.remove(), { once: true });
        };
        this.#loadingManager.onProgress = (item, loaded, total) => {
            loaderBar.style.width = `${loaded / total * 100}%`;
            // console.log(loaderBar.style.width)
        };

        this.assetData = assetData;
    };

    async loadAssets() {
        const gltfLoader = new GLTFLoader(this.#loadingManager);

        const loadedAssets = await Promise.all([
            ...this.assetData.gltfs.map(({ path }) => gltfLoader.loadAsync(path)),
        ]);

        const gltfSlice = this.assetData.gltfs.length;

        const [ gltfs ] = [
            loadedAssets.slice(0, gltfSlice)
        ];

        gltfs.forEach((asset, idx) => this.assetData.gltfs[idx].asset = asset);

        const assets = [
            ...this.assetData.gltfs,
        ];
        return assets;
    };
};