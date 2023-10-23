import * as THREE from "three";
import Experience from "../Experience";
import PumpkinMaterial from "../Materials/PumpkinMaterial";

export default class Pumpkin {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.resource = this.resources.items.pumpkin
    this.map = this.resources.items.pumpkinDiffuse;
    this.setModel()

    this.pass = false
  }

  setModel() {
    this.map.flipY = false;
    this.map.wrapS = THREE.RepeatWrapping;
    this.map.wrapT = THREE.RepeatWrapping;
    this.material = new THREE.MeshBasicMaterial({
      map: this.map,
    });

    this.model = this.resource.scene
    this.model.scale.set(1, 1, 1)
    this.model.position.set(0, 0, 0)
    this.scene.add(this.model);

    this.model.traverse((o) => {
      if (o.isMesh) o.material = this.material;
    });
  }


  update(time) {
    // jump animation
    if (this.model.position.y < 0.5 && !this.pass) {
      this.model.position.y += 0.01
    }
    else {
      this.pass = true
      // jump
      this.model.position.y = 0.5 + Math.sin(time * 2) * 0.1
      
    }

  }
}