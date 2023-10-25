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

  
    setModel()
    {
        // const geometry = new THREE.PlaneGeometry( 10, 10, 32 );

        // this.map = this.resources.items.grassColor;
        // this.map.repeat.set(2, 2)
        // this.map.flipY = false;
        // this.map.wrapS = THREE.RepeatWrapping;
        // this.map.wrapT = THREE.RepeatWrapping;

        // this.normalMap = this.resources.items.grassNormal;
        // this.normalMap.repeat.set(2, 2)
        // this.normalMap.flipY = false;
        // this.normalMap.wrapS = THREE.RepeatWrapping;
        // this.normalMap.wrapT = THREE.RepeatWrapping;

        // this.roughnessMap = this.resources.items.grassRoughness;
        // this.roughnessMap.repeat.set(2, 2)
        // this.roughnessMap.flipY = false;
        // this.roughnessMap.wrapS = THREE.RepeatWrapping;
        // this.roughnessMap.wrapT = THREE.RepeatWrapping;

        // this.aoMap = this.resources.items.grassAmbientOcclusion;
        // this.aoMap.repeat.set(2, 2)
        // this.aoMap.flipY = false;
        // this.aoMap.wrapS = THREE.RepeatWrapping;
        // this.aoMap.wrapT = THREE.RepeatWrapping;

        // const material = new THREE.MeshStandardMaterial( {
        //     map: this.map,
        //     normalMap: this.normalMap,
        //     // roughnessMap: this.roughnessMap,
        //     aoMap: this.aoMap,
        //     side: THREE.DoubleSide
        // } );
        // const plane = new THREE.Mesh( geometry, material );
        // plane.receiveShadow = true;
        // plane.rotateX(Math.PI/2)
        // plane.position.y = -1.5

        // this.scene.add( plane );

        this.model = this.resource.scene
        this.model.scale.set(1, 1, 1)
        this.model.position.set(0, 0, 0)
        this.scene.add(this.model);

        this.model.traverse((o) => {
            if (o.isMesh) {
              o.castShadow = true;
              o.receiveShadow = true;
            }
          });
    }
}