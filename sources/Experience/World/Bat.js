import * as THREE from "three";
import Experience from "../Experience";
import anime from "animejs";
import BatMaterial from "../Materials/BatMaterial";

export default class Bat {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resource = this.resources.items.bat
        this.setModel()
    }

    setModel() {
        this.geometry = this.resource.scene.children[0].geometry

        this.material = new BatMaterial({
            map: this.resources.items.batDiffuse,
            roughness: 0.5,
            metalness: 0.5,
            side: THREE.DoubleSide,  
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // scale 10
        this.mesh.scale.set(10, 10, 10)
        this.mesh.position.set(0, 5, 0)

        this.scene.add(this.mesh);

        this.setEasing();
        this.setSpeed();
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

    update(time) 
    {
        if (this.material) {
            this.material.update(time, this.uEasing, this.uSpeed);
        }
    }
}