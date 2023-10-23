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
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3, 3, - 2.25)
        this.sunLight.castShadow = true;
        this.scene.add(this.sunLight)

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