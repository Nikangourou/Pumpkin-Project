import * as THREE from "three";
import Experience from "../Experience";
import anime from "animejs";
// import BirdMaterial from "../Materials/BirdMaterial";

export default class Bird {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.time = 0

    this.map = this.resources.items.pumpkinDiffuse;

    this.setModels()
  }

  setModels() {

    this.birds = new THREE.Group();
    this.scene.add(this.birds);

    // create a mesh that will represent a bird
    this.geometry = new THREE.SphereGeometry( 0.2, 16, 16 );

    this.material = new THREE.MeshStandardMaterial({
        map: this.map,
        });

    for (let i=0; i<5; i++) {
      // const baseAngle = (Math.PI * 2) / 10
      // this.angle = baseAngle * i + Math.random() * baseAngle;
      // this.radius = 3 + Math.random() * 5;
      // this.x = Math.sin(this.angle) * this.radius;
      // this.z = Math.cos(this.angle) * this.radius;

      this.model = new THREE.Mesh( this.geometry, this.material )
      // this.model.position.set(this.x, 5, this.z);
      this.model.castShadow = true
      this.model.receiveShadow = true

      this.birds.add( this.model )
    }
  }

    setAnimation(){
      setInterval(() => {
      let animValue = {
        value: 0,
      }

      let posValue = {
        value: 0,
      }

      anime({
        targets: animValue,
        value: Math.PI*2,
        easing: 'spring(1, 80, 5, 10)',

        update: () => {
            this.model.rotation.y = animValue.value
        }
      });

      anime({
        targets: posValue,
        value: 0.6,
        easing: 'spring(1, 80, 5, 10)',

        update: () => {
            this.model.position.y = posValue.value
        }
      });

      }, 10000);
    }

    update(time) 
    {
        // this.birds.rotation.y = time * 0.5
        // this.time = time;
        if(this.birds.children){
          this.birds.children.forEach(b => {
            // const baseAngle = (Math.PI * 2) / 5
            const angle = Math.random() + Math.PI * 2;
            const radius = 3 + Math.random() * 5;
            b.position.x = Math.sin(angle + time * 0.5) * radius;
            b.position.z = Math.cos(angle + time * 0.5) * radius;
            b.position.y = 4 + Math.sin(time * 3 + angle);
          });
      }
        
    }

}