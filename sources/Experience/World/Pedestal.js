import * as THREE from "three";
import Experience from "../Experience";

export default class Floor {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resource = this.resources.items.pedestal
        this.map = this.resources.items.pedestalDiffuse;
        this.setModel()
    }

    setModel() {
        this.map.flipY = false;
        this.map.wrapS = THREE.RepeatWrapping;
        this.map.wrapT = THREE.RepeatWrapping;
        this.material = new THREE.MeshBasicMaterial({
            map: this.map,
        });

        this.model = this.resource.scene
        this.model.scale.set(0.2, 0.2, 0.2)
        this.model.position.set(0, -5.5, 2.5)
        this.scene.add(this.model);

        this.model.traverse((o) => {
            if (o.isMesh) o.material = this.material;
        });
    }
}