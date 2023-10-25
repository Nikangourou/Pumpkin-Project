import * as THREE from "three";
import Experience from "../Experience";

export default class Floor
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resource = this.resources.items.floor
        // this.map = this.resources.items.pumpkinDiffuse;
        this.setModel()
    }

    setModel() {
        // this.map.flipY = false;
        // this.map.wrapS = THREE.RepeatWrapping;
        // this.map.wrapT = THREE.RepeatWrapping;
        // this.material = new THREE.MeshBasicMaterial({
        //   map: this.map,
        // });

    
        this.model = this.resource.scene

        this.model.scale.set(1, 1, 1)
        // this.model.scale.set(.5, .5, .5)
        this.model.position.set(0, 0, 0)
        this.scene.add(this.model);
    
        // this.model.traverse((o) => {
        //   if (o.isMesh) o.material = this.material;
        // });
      }
}