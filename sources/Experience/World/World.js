import * as THREE from 'three'
import Experience from '../Experience.js'
import Environment from './Environment.js'
import Pumpkin from './Pumpkin.js'
import Liana from './Liana.js'
import Floor from './Floor.js'
import Bat from './Bat.js'
import Moon from './Moon.js'
import Cloud from './Cloud.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.environment = this.experience.environment
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.pumpkin = new Pumpkin()
                this.liana = new Liana()
                this.floor = new Floor()
                this.bat = new Bat()
                this.moon = new Moon()
                this.cloud = new Cloud(1, 0.06, 4, 6, -5)
            }
        })
    }

    update()
    {
        this.deltaTime = this.time - window.performance.now();
        this.elapsedTime = window.performance.now() * 0.001;
        this.time = window.performance.now();


        // animate the liana material
        if (this.liana) {
            this.liana.update(this.elapsedTime);
        }

        if (this.fly) {
            this.fly.update(this.elapsedTime);
        }
        
        if(this.bat)
        {
            this.bat.update(this.elapsedTime);
        }

        // update for the ShadowMapViewer 
        // if (this.environment) {
        //     this.environment.update(this.experience.renderer.instance);
        // }
      
        if (this.pumpkin) {
            this.pumpkin.update(this.elapsedTime);
        }

    }

    destroy()
    {
    }
}