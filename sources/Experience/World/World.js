import * as THREE from 'three'
import Experience from '../Experience.js'
import PumpkinMaterial from '../Materials/PumpkinMaterial.js'
import Environment from './Environment.js'
import Pumpkin from './Pumpkin.js'
import Liana from './Liana.js'
import Floor from './Floor.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.pumpkin = new Pumpkin()
                this.liana = new Liana()
                this.floor = new Floor()

                this.environment = new Environment()
                this.setup3D()
            }
        })
    }

    setup3D() {

        /**
         * Axes Helper
         */
        const axesHelper = new THREE.AxesHelper(5)
        this.scene.add(axesHelper)

        // Debug
        if(this.debug)
        {
            // debug intensity
            this.debugFolder
                .add(this.amount)
                .name('amount')
                .min(1)
                .max(10)
                .step(1)
        }

      }

    resize()
    {
    }

    update()
    {
        this.deltaTime = this.time - window.performance.now();
        this.elapsedTime = window.performance.now() * 0.001;
        this.time = window.performance.now();

        // // animate the pumpkin material
        // if (this.pumpkin) {
        //     this.pumpkin.material.update(this.elapsedTime);
        // }

        // animate the liana material
        if (this.liana) {
            this.liana.update(this.elapsedTime);
        }
        // if (this.pumpkin) {
        //     this.pumpkin.update(this.elapsedTime);
        // }
    }

    destroy()
    {
    }
}