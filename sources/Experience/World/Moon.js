import * as THREE from "three";
import Experience from "../Experience";

export default class Moon
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resource = this.resources.items.cloud1

        this.setMoon()

    }

  
    setMoon()
    {
        const geometry = new THREE.SphereGeometry( 2, 32, 32 );

        this.map = this.resources.items.moonDiffuse;
        this.map.repeat.set(2, 2)
        this.map.flipY = false;
        this.map.wrapS = THREE.RepeatWrapping;
        this.map.wrapT = THREE.RepeatWrapping;

        this.normalMap = this.resources.items.moonNormal;
        this.normalMap.repeat.set(2, 2)
        this.normalMap.flipY = false;
        this.normalMap.wrapS = THREE.RepeatWrapping;
        this.normalMap.wrapT = THREE.RepeatWrapping;

        const material = new THREE.MeshStandardMaterial( {
            map: this.map,
            normalMap: this.normalMap
        } );

        this.moon = new THREE.Mesh( geometry, material );
        this.moon.position.y = -1.5

        
        this.moon.scale.set(1, 1, 1)
        this.moon.position.set(7, 6, -15)
        this.scene.add(this.moon);  
    }
}