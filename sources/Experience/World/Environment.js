import * as THREE from "three";
import Experience from "../Experience";
import { ShadowMapViewer } from 'three/examples/jsm/utils/ShadowMapViewer.js';

export default class Environment {

    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene

        // Debug
        this.debug = this.experience.debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder('environment')
        }

        this.setSunLight()
    //    this.createHUD()
    }

    setSunLight()
    {
        this.ambientLight = new THREE.AmbientLight('#8accff', 2)
        this.scene.add(this.ambientLight)

        this.moonLight = new THREE.DirectionalLight('#8accff', 6)
        this.moonLight.castShadow = true

        this.moonLight.shadow.mapSize.set(2048, 2048)
        this.moonLight.shadow.camera.left = - 10
        this.moonLight.shadow.camera.right = 10
    
        this.moonLight.position.set(7, 6, -15)
        this.scene.add(this.moonLight)

        // helper
        this.moonLightHelper = new THREE.DirectionalLightHelper(this.moonLight, 1)
        this.scene.add(this.moonLightHelper)

        // Debug
        if(this.debug)
        {
            this.debugFolder
                .add(this.moonLight, 'intensity')
                .name('intensity')
                .min(0)
                .max(10)
                .step(0.01)
        }

    }

    // createHUD() and update() are made for ShadowMapViewer
    createHUD() {

        const lightShadowMapViewer = new ShadowMapViewer( this.moonLight );
        lightShadowMapViewer.position.x = 10;
        lightShadowMapViewer.position.y = 10;
        lightShadowMapViewer.size.width = 400;
        lightShadowMapViewer.size.height = 400;
        lightShadowMapViewer.update();
        this.viewer = lightShadowMapViewer

    }

    update(renderer){
        if (this.viewer && this.moonLight.shadow.map) {
            this.viewer.update()
            this.viewer.render( renderer );
        }
    }
}