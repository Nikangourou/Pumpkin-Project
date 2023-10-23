import * as THREE from "three";
import Experience from "../Experience";
import LianaMaterial from "../Materials/LianaMaterial";
import Alea from "alea";

export default class Liana {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // parameters
        this.amount = 6
        this.angle = 0.2
        this.zOffset = 0.5

        this.lianaArray = []
        this.basePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.4, 0.15, 0),
            new THREE.Vector3(1, 0.5, 0),
            new THREE.Vector3(3, 0, 0),
            new THREE.Vector3(3.2, -1, 0),
            new THREE.Vector3(4, -2, 0),
            new THREE.Vector3(5, -2, 0),
            new THREE.Vector3(6, -1, 0),
            new THREE.Vector3(6.2, -0.5, 0),
            new THREE.Vector3(5, -0.2, 0),
            new THREE.Vector3(4.5, -0.5, 0),
            new THREE.Vector3(4.1, -0.8, 0),
            new THREE.Vector3(4.3, -1.1, 0),
        ]);

        this.basePath2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, -0.2, - this.zOffset),
            new THREE.Vector3(2, -0.1, 0),
            new THREE.Vector3(3, 0.2, this.zOffset * 1.2),
            new THREE.Vector3(4, 0, 0),
            new THREE.Vector3(4.5, -1, 0),
            new THREE.Vector3(5, -1.5, 0),
            new THREE.Vector3(6, -2, 0),
            new THREE.Vector3(7, -2, this.zOffset * 1.5),
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

        this.basePath3 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, -0.2, 0),
            new THREE.Vector3(2, -0.1, 0),
            new THREE.Vector3(3, 0.2, 0),
            new THREE.Vector3(4, 0, 0),
            new THREE.Vector3(5, -0.8, 0),
            new THREE.Vector3(5.4, -0.7, 0),
            new THREE.Vector3(6, -0.2, 0),

            new THREE.Vector3(7.5, 0, 0),
            new THREE.Vector3(8, -0.1, 0),
            new THREE.Vector3(9, -0.5, 0),
        ]);

        this.path = new THREE.CatmullRomCurve3([]);

        this.prng1 = new Alea(200)

        // Debug
        this.debug = this.experience.debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder('liana')
        }

        this.setModels()
        this.update()
        this.setDebug()
    }

    createLiana(prng) {

        this.path.points = []
        const sin = Math.sin

        this.path.points.push(new THREE.Vector3(0, 0, 0))

        // midle points
        for (let x = 0; x < 5; x++) {
            let y = (sin(x + prng) + sin(2.2 * (x + prng) + 5.52) + sin(2.9 * (x + prng) + 0.93) + sin(4.6 * (x + prng) + 8.94)) / 4
            this.path.points.push(new THREE.Vector3(x, y, 0))
        }

        // parcours the base path
        // this.basePath3.points.forEach(point => {
        //     let y = (sin(point.x + prng) + sin(2.2 * (point.x + prng) + 5.52) + sin(2.9 * (point.x + prng) + 0.93) + sin(4.6 * (point.x + prng) + 8.94)) / 4
        //     // average path
        //     let y2 = (point.y + y) 
        //     this.path.points.push(new THREE.Vector3(point.x, y2, point.z))
        // });

        this.createLianaEndSpirale(prng)
    }

    createLianaEndSpirale(prng) {
        // last point
        let lastPoint = this.path.points[this.path.points.length - 1]
        let coef = 0.2

        //    take the 7 lats point of the path and do a spirale
        for (let nb = 0; nb < 10; nb += 0.1) {

            // Archimedean spiral
            let x = nb * Math.cos(nb) * coef + lastPoint.x
            let y = nb * Math.sin(nb) * coef + lastPoint.y
            let z = nb * Math.sin(nb)


            this.path.points.push(new THREE.Vector3(x, y, 0))
        }

    }

    setModels() {
        for (let i = 0; i < this.amount; i++) {
            let prng = this.prng1()
            this.createLiana(prng * 100)
            let chosenPath = this.path
            this.geometry = new THREE.TubeGeometry(
                chosenPath,
                100,
                0.05 + i * Math.random() * 0.01,
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

            (i % 3 == 0) ?
                this.mesh.rotation.y = Math.PI / this.amount * 2 * i + this.angle
                : this.mesh.rotation.y = Math.PI / this.amount * 2 * i - this.angle;
        }
    }

    update(time) {
        
    }

    setDebug() {
        // Debug
        if (this.debug) {
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


    destroy() {
        for (let i = 0; i < this.lianaArray.length; i++) {
            this.scene.remove(this.lianaArray[i])
        }
    }
}