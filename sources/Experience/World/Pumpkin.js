import * as THREE from "three";
import Experience from "../Experience";
import PumpkinMaterial from "../Materials/PumpkinMaterial";
import anime from "animejs";

export default class Pumpkin {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.resource = this.resources.items.pumpkin
    this.map = this.resources.items.pumpkinDiffuse;
    this.raycaster = new THREE.Raycaster()

    this.camera = this.experience.camera.instance
    this.mouse = this.experience.mouse

    // this.map.colorSpace = THREE.SRGBColorSpace;
    this.setModel()
    this.setSparkleLight()
    this.setAnimation()
    this.setResponseToBigWave()
    this.setJumping()

    window.addEventListener('click', (e) => {
      this.click(e)
    })

    this.destroyAnimation = false

    this.pass = false
  }

  setModel() {
    this.map.flipY = false;
    this.map.wrapS = THREE.RepeatWrapping;
    this.map.wrapT = THREE.RepeatWrapping;
    this.material = new THREE.MeshStandardMaterial({
      map: this.map,
    });

    this.model = this.resource.scene
    this.model.scale.set(1, 1, 1)
    this.model.position.set(0, 0, 0)
    this.scene.add(this.model);

    this.pumpkinLight = new THREE.PointLight('#ffaf19', 50, 7)
    this.pumpkinLight.castShadow = true
    this.pumpkinLight.position.set(0, 1.5, 0)
    this.pumpkinLight.shadow.bias = 0.0001
    this.pumpkinLight.shadow.mapSize.width = 2048;
    this.pumpkinLight.shadow.mapSize.height = 2048;
    this.model.add(this.pumpkinLight)

    this.model.traverse((o) => {
      if (o.isMesh) {
        o.material = this.material;
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }

  // anim the light to make it sparkle candle like
  setSparkleLight() {

    let lightValue = {
      value: 9,
    }

    anime({
      targets: lightValue,
      value: 12,
      duration: 1000,
      easing: 'easeInOutQuad',
      direction: 'alternate',
      loop: true,

      update: () => {
        this.pumpkinLight.intensity = lightValue.value + Math.random() * 0.5
      }
    });
  }


  // write an animation to play on reload
  setJumping() {
    let jumpingValue = {
      value: -1,
    }

    anime({
      targets: jumpingValue,
      value: 0.6,
      duration: 2000,
      easing: 'spring(15, 100, 30, 8)',

      update: () => {
        this.model.position.y = jumpingValue.value
      }
    });
  }

  setAnimation() {

    setInterval(() => {

      let animValue = {
        value: 0,
      }

      let posValue = {
        value: 0,
      }

      anime({
        targets: animValue,
        value: Math.PI * 2,
        easing: 'spring(1, 80, 5, 10)',

        update: () => {
          this.model.rotation.y = animValue.value
        }
      });

      if (this.destroyAnimation) return

      anime({
        targets: posValue,
        value: 0.6,
        easing: 'spring(1, 80, 5, 10)',

        update: () => {
          this.model.position.y = posValue.value
        }
      });

    }, 10000);

    // let animValue = {
    //   value: 0,
    // }

    // anime({
    //   targets: animValue,
    //   value: Math.PI * 0.1,
    //   easing: 'spring(1, 80, 5, 10)',
    //   loop: true,
    //   direction: 'alternate',
    //   delay: 2000,

    //   update: () => {
    //     this.model.rotation.x = animValue.value
    //   }
    // });
  }

  setResponseToBigWave() {


    let waveValue = {
      value: 0.6,
    }
    anime({
      targets: waveValue,
      value: 2,
      duration: 3000,
      easing: 'easeInOutSine',
      loop: true,
      direction: 'alternate',
      delay: 6000,

      update: () => {
        this.model.position.y = waveValue.value
      },
      begin: () => {
        this.destroyAnimation = true
      },
      complete: () => {
        this.destroyAnimation = false
      }
    });
  }

  click() {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObject(this.model, true)

    if (intersects.length) {
      this.experience.world.liana.setAnimationDestroy()
      this.destroyAnimation = true

      let animValue = {
        value: 0.6,
      }

      anime({
        targets: animValue,
        value: 4,
        duration: 1000,
        endDelay: 1000,
        easing: 'easeInOutQuad',
        direction: 'alternate',
        update: () => {
          this.model.position.y = animValue.value
        },
        complete: () => {
          this.destroyAnimation = false
        }
      });
    }
  }
  
  lookAt() {
    this.model.lookAt(this.camera.position)
  }

}