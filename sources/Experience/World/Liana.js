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
        this.amount = 8
        this.angle = 0.2
        this.zOffset = 0.5
        this.easing = 0
        this.speed = 4000

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
            this.debugFolder.close()
        }

        this.setModels()
        this.update()
        this.setDebug()
        this.setBigWave()
    }

    createLiana(prng) {

        this.path.points = []
        const sin = Math.sin

        this.path.points.push(new THREE.Vector3(0, 0, 0))

        // midle points
        for (let x = 0; x < 8; x++) {
            let y = (sin(x + prng) + sin(2.2 * (x + prng) + 5.52) + sin(2.9 * (x + prng) + 0.93) + sin(4.6 * (x + prng) + 8.94)) / 4
            let z = sin(prng + x * 2) * 0.3
            this.path.points.push(new THREE.Vector3(x, y, z))
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
            for (let nb = 0; nb < 10; nb++) {

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
            for (let nb = 0; nb < 13; nb++) {

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

            this.map = this.resources.items.barkColor;
            this.map.flipY = false;
            this.map.wrapS = THREE.RepeatWrapping;
            this.map.wrapT = THREE.RepeatWrapping;

            this.normalMap = this.resources.items.barkNormal;
            this.normalMap.flipY = false;
            this.normalMap.wrapS = THREE.RepeatWrapping;
            this.normalMap.wrapT = THREE.RepeatWrapping;

            this.roughnessMap = this.resources.items.barkRoughness;
            this.roughnessMap.flipY = false;
            this.roughnessMap.wrapS = THREE.RepeatWrapping;
            this.roughnessMap.wrapT = THREE.RepeatWrapping;

            this.aoMap = this.resources.items.barkAmbientOcclusion;
            this.aoMap.flipY = false;
            this.aoMap.wrapS = THREE.RepeatWrapping;
            this.aoMap.wrapT = THREE.RepeatWrapping;

            this.material = new LianaMaterial({
                map: this.map,
                normalMap: this.normalMap,
                roughnessMap: this.roughnessMap,
                aoMap: this.aoMap,
                depthWrite: true
            });

            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            //this.mesh.customDepthMaterial = this.material

            this.scene.add(this.mesh);
            this.lianaArray.push(this.mesh);
            this.setEasing();
            this.setSpeed();

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
            delay: 1000,
            value: 2,
            duration: this.speed,
            easing: 'cubicBezier(1.000, 0.000, 0.575, 0.760)',

            update: () => {
                this.uEasing = easingValue.value
            }
        });
    }

    setSpeed() {
        let speedValue = {
            value: 0,
        }

        anime({
            targets: speedValue,
            value: 1,
            duration: this.speed,
            easing: 'cubicBezier(1.000, 0.000, 0.575, 0.760)',
            update: () => {
                this.uSpeed = speedValue.value
            }
        });
    }

    setBigWave() {
        let waveValue = {
            value: 0,
        }

        anime({
            targets: waveValue,
            value: 1,
            duration: 3000,
            easing: 'easeInOutSine',
            loop: true,
            direction: 'alternate',
            delay: 6000,

            update: () => {
                this.uWave = waveValue.value
            }
        });
    }

    setAnimationDestroy() {
        let animValue = {
            value: 0,
        }

        anime({
            targets: animValue,
            value: 2,
            duration: 1000,
            endDelay: 1000,
            easing: 'easeInOutQuad',
            direction: 'alternate',
            update: () => {
                for (let i = 0; i < this.lianaArray.length; i++) {
                    this.lianaArray[i].rotation.y += animValue.value * Math.PI / 45
                    this.lianaArray[i].position.y = animValue.value
                    this.lianaArray[i].scale.y = 1 + animValue.value / 2
                    this.lianaArray[i].scale.x = 1 - animValue.value / 4
                }
            }
        });
    }


    update(time) {
        for (let i = 0; i < this.lianaArray.length; i++) {
            // let finalEasing;
            // (i % 3 == 0) ?
            //     finalEasing = this.uEasing * i * 0.4
            //     : finalEasing = this.uEasing * i * 0.2;
            this.lianaArray[i].material.update(time, this.uEasing, this.uWave);
        }
    }

    setDebug() {
        // Debug
        if (this.debug) {
            this.debugFolder
                .add(this, 'amount')
                .name('amount')
                .min(5)
                .max(10)
                .step(1)
                .onChange(() => {
                    this.destroy()
                    this.setEasing()
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
                    this.setEasing()
                    this.setModels()
                })

            this.debugFolder
                .add(this, 'speed')
                .name('speed')
                .min(4000)
                .max(8000)
                .step(1000)
                .onChange(() => {
                    this.destroy()
                    this.setEasing()
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