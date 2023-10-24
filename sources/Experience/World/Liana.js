import * as THREE from "three";
import Experience from "../Experience";
import LianaMaterial from "../Materials/LianaMaterial";
import Alea from "alea";
import anime from 'animejs/lib/anime.es.js';

export default class Liana {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // parameters
        this.amount = 6
        this.angle = 0.2
        this.zOffset = 0.5
        this.easing = 0

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

        this.setEasing()
        this.setModels()
        this.update()
        this.setDebug()
    }

    createLiana(prng) {

        this.path.points = []
        const sin = Math.sin

        this.path.points.push(new THREE.Vector3(0, 0, 0))

        // midle points
        for (let x = 0; x < 8; x++) {
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
        const sin = Math.sin


        if (prng < 33) {
            let coef = 0.2
            // Archimedean spiral
            for (let nb = 0; nb < 10; nb ++) {

                let x = nb * Math.cos(nb) * coef + lastPoint.x
                let y = nb * Math.sin(nb) * coef + lastPoint.y
                let z = nb * Math.sin(nb) * nb * 0.02

                this.path.points.push(new THREE.Vector3(x, y, z))
            }
        } else if (prng < 66) {
            // Classic end 
            for (let x = 8; x < 12; x++) {
                let y = (sin(x + prng) + sin(2.2 * (x + prng) + 5.52) + sin(2.9 * (x + prng) + 0.93) + sin(4.6 * (x + prng) + 8.94)) / 4
                this.path.points.push(new THREE.Vector3(x, y, 0))
            }
        } else {
            // Spirng spiral
            for (let nb = 0; nb < 13; nb ++) {

                let x = nb * 0.1 + lastPoint.x
                let y = nb * Math.sin(nb) * 0.05 + lastPoint.y
                let z = nb * Math.cos(nb) * 0.05 

                this.path.points.push(new THREE.Vector3(x, y, z))
            }

            
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
                0.001,
                8,
                false
            );

            this.matcap = this.resources.items.lianaMatcap;
            this.matcap.flipY = false;
            this.matcap.wrapS = THREE.RepeatWrapping;
            this.matcap.wrapT = THREE.RepeatWrapping;

            this.material = new LianaMaterial({
                matcap: this.matcap,
            });
            this.mesh = new THREE.Mesh(this.geometry, this.material);

            this.scene.add(this.mesh);
            this.lianaArray.push(this.mesh);

            (i % 3 == 0) ?
                this.mesh.rotation.y = Math.PI / this.amount * 2 * i + this.angle
                : this.mesh.rotation.y = Math.PI / this.amount * 2 * i - this.angle;
        }
    }

    setEasing() {
        let easingValue = {
            value: 0,
        }

        anime({
            targets: easingValue,
            value: 2,
            duration: 4000,
            delay: 1000,
            easing: 'cubicBezier(.5, .05, .1, .3)',
            update: () => {
                this.easing = easingValue.value
            }
        });

    }

    update(time) {
        for (let i = 0; i < this.lianaArray.length; i++) {
            this.lianaArray[i].material.update(time, this.easing);
            // wave animation
            this.lianaArray[i].rotation.x = Math.sin(time * 0.5 + i) * 0.1
        }
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