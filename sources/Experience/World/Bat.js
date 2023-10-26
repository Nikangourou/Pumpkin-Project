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
        this.batArea = new THREE.Group();
        this.scene.add(this.batArea);

        this.geometry = this.resource.scene.children[0].geometry
        this.resources.items.batDiffuse.flipY = false
        this.material = new BatMaterial({
            map: this.resources.items.batDiffuse,
            roughness: 0.5,
            metalness: 0.5,
            side: THREE.DoubleSide,  
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.scale.set(5, 5, 5)

        this.batArea.add(this.mesh);
        this.mesh.position.set(3, 3, 3)
        this.mesh.rotation.set(0, 5*Math.PI/6, 0)
        this.mesh.castShadow = true


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
            this.batArea.rotation.y = time
            this.batArea.position.y = Math.sin(time * 10) * 0.2 + Math.sin(time)

            this.material.update(time, this.uEasing, this.uSpeed);
        }
    }
}