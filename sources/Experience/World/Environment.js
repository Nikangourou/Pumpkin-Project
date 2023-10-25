import * as THREE from "three";
import Experience from "../Experience";

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
    }

    setSunLight()
    {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunLight.castShadow = true
        // this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(5, 10, -15)
        this.scene.add(this.sunLight)

        this.ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
        this.ambientLight.castShadow = true
        this.scene.add(this.ambientLight)
        
        //helper
        this.sunLightHelper = new THREE.DirectionalLightHelper(this.sunLight, 1)
        this.scene.add(this.sunLightHelper)

        // Debug
        if(this.debug)
        {
            // debug intensity
            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('intensity')
                .min(0)
                .max(10)
                .step(0.01)
        }

    }
}