import * as THREE from "three";
import Experience from "../Experience";
import LianaMaterial from "../Materials/LianaMaterial";

export default class Liana
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // parameters
        this.amount = 6
        this.angle = 0.2
        this.zOffset = 0.5

        this.lianaArray = []
        this.path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.4, 0.15, 0),
            new THREE.Vector3(1,0.5,0),
            new THREE.Vector3(3,0,0),
            new THREE.Vector3(3.2,-1,0),
            new THREE.Vector3(4,-2,0),
            new THREE.Vector3(5,-2,0),
            new THREE.Vector3(6,-1,0),
            new THREE.Vector3(6.2,-0.5,0),
            new THREE.Vector3(5,-0.2,0),
            new THREE.Vector3(4.5,-0.5,0),
            new THREE.Vector3(4.1,-0.8,0),
            new THREE.Vector3(4.3,-1.1,0),
        ]);

        this.path2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, -0.2, - this.zOffset),
            new THREE.Vector3(2, -0.1, 0),
            new THREE.Vector3(3, 0.2, this.zOffset *1.2),
            new THREE.Vector3(4, 0, 0),
            new THREE.Vector3(4.5, -1, 0),
            new THREE.Vector3(5, -1.5, 0),
            new THREE.Vector3(6, -2, 0),
            new THREE.Vector3(7, -2, this.zOffset *1.5),
            new THREE.Vector3(8, -1.5, 0),
            new THREE.Vector3(8.2, -1, 0),
            new THREE.Vector3(8, 0, 0),
            new THREE.Vector3(7.5, 0.5, this.zOffset / 2),
            new THREE.Vector3(7, 1, 0),
            new THREE.Vector3(6.5, 1.1, 0),
            new THREE.Vector3(6, 1, 0),
            new THREE.Vector3(5.5, 0.5, 0),
            new THREE.Vector3(5.4, 0, 0),
            new THREE.Vector3(5.5, -0.5, 0),
            new THREE.Vector3(5.7, -0.8, 0),
            new THREE.Vector3(5.9, -1, 0),
            new THREE.Vector3(6.4, -1.1, 0),
            new THREE.Vector3(6.6, -1, 0),
            new THREE.Vector3(6.8, -0.9, 0),
            new THREE.Vector3(7, -0.8, 0),
            new THREE.Vector3(7.1, -0.7, 0),
            new THREE.Vector3(7.2, -0.6, 0),
            new THREE.Vector3(7.2, -0.2, 0),
            new THREE.Vector3(7, 0, 0),
            new THREE.Vector3(6.9, 0.1, 0),
            new THREE.Vector3(6.8, 0.2, 0),
            new THREE.Vector3(6.4, 0.2, 0),
            new THREE.Vector3(6.2, 0, 0),
            new THREE.Vector3(6.2, -0.2, 0),
            new THREE.Vector3(6.3, -0.3, 0),
            new THREE.Vector3(6.4, -0.4, 0),
        ]);

        this.path3 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, -0.2, 0),
            new THREE.Vector3(2, -0.1, 0),
            new THREE.Vector3(3, 0.2, 0),
            new THREE.Vector3(4, 0, 0),
            new THREE.Vector3(5, -0.8, 0),
            new THREE.Vector3(5.4, -0.7, 0),
            new THREE.Vector3(6, -0.2, 0),

            new THREE.Vector3(7.5, 0, 0),
            new THREE.Vector3(8, -0.1,0),
            new THREE.Vector3(9,-0.5,0),
        ]);

        // Debug
        this.debug = this.experience.debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder('liana')
        }

        this.setModels()
        this.update()
        this.setDebug()
        
    }

    setModels()
    {
        for(let i = 0; i < this.amount; i++){
            let chosenPath = (i%3 == 0) ? this.path : (i%3 == 1) ? this.path2 : this.path3;
            this.geometry = new THREE.TubeGeometry(
                chosenPath,
                100, 
                0.05 + i*Math.random()*0.01, 
                8, 
                false
            );
            this.material = new LianaMaterial({ 
                matcap: this.resources.items.lianaMatcap,
                points: chosenPath.points,
            });
            this.mesh = new THREE.Mesh(this.geometry, this.material);

            this.scene.add(this.mesh);
            this.lianaArray.push(this.mesh);

            (i%3 == 0) ? 
            this.mesh.rotation.y = Math.PI/this.amount*2*i + this.angle 
            : this.mesh.rotation.y = Math.PI/this.amount*2*i - this.angle;
        }
    }

    update(time) 
    {
        for(let i = 0; i < this.lianaArray.length; i++){
            this.lianaArray[i].material.update(time);
        }
        // animate the liana material
        
    }

    setDebug() 
    {
        // Debug
        if(this.debug)
        {
            this.debugFolder
                .add(this, 'amount')
                .name('amount')
                .min(1)
                .max(10)
                .step(1)
                .onChange(() => {
                    this.destroy()
                    this.setModels()
                })

            this.debugFolder
                .add(this, 'angle')
                .name('angle')
                .min(0)
                .max(1)
                .step(0.01)
                .onChange(() => {
                    this.destroy()
                    this.setModels()
                })
        }
    }


    destroy()
    {
        for(let i = 0; i < this.lianaArray.length; i++){
            this.scene.remove(this.lianaArray[i])
        }
    }
}