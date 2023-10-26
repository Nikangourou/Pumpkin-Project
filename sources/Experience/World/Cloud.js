import * as THREE from "three";
import Experience from "../Experience";

export default class Cloud
{
    constructor(scale, opacity, x, y, z)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.resource = this.resources.items.cloud1

        this.scale = scale
        this.opacity = opacity
        this.x = x
        this.y = y
        this.z = z

        this.cloudsGroup = new THREE.Group();
        this.scene.add(this.cloudsGroup);
        
        this.setCloud(this.scale, this.opacity, this.x, this.y, this.z)
    }

    setCloud(scale, opacity, x, y, z)
    {
        const model = this.resource.scene

        model.scale.set(scale, scale, scale)
        model.position.set(x, y, z)
        model.lookAt(0,0,0)
        this.cloudsGroup.add(model);

        model.traverse((o) => {
            if (o.isMesh) {
                o.material.transparent = true;
                o.material.opacity = opacity;
            }
        });
 
    }
}