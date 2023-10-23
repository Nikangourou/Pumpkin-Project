import * as THREE from "three";
import Experience from "../Experience";

export default class Floor
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resource = this.resources.items.pumpkin
        this.map = this.resources.items.pumpkinDiffuse;
        this.setModel()
    }

    setModel()
    {
        // add a plane parallel to XY plane
        const geometry = new THREE.PlaneGeometry( 10, 10, 32 );
        const material = new THREE.MeshBasicMaterial( {color: 0x271c07, side: THREE.DoubleSide} );
        const plane = new THREE.Mesh( geometry, material );
        plane.rotateX(Math.PI/2)
        plane.position.y = -5.5

        this.scene.add( plane );
    }
}