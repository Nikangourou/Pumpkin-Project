import * as THREE from "three";
import Experience from "../Experience";
import anime from "animejs";
import Alea from "alea";

export default class Pumpkin {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.resource = this.resources.items.pumpkin
    this.map = this.resources.items.pumpkinDiffuse;
    // this.map.colorSpace = THREE.SRGBColorSpace;


    this.parameters = {}
    this.parameters.count = 100
    this.parameters.radius = 5
    this.parameters.size = 0.2

    this.setModel()
    this.setParticles()
    this.setSparkleLight()
    this.setJumping()
    this.setAnimation()

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

  setParticles()
  {
    let prng = new Alea(200)
    const particleGeometry = new THREE.BufferGeometry()

    const positions = new Float32Array(this.parameters.count * 3)
    const scales = new Float32Array(this.parameters.count)

    for(let i = 0; i < this.parameters.count; i++)
    {
        const i3 = i * 3
        this.radius = Math.random() * this.parameters.radius

        positions[i3    ] = Math.cos(this.radius) * 3 * Math.random()
        positions[i3 + 1] = 3 * Math.random()
        positions[i3 + 2] = Math.sin(this.radius) * 3 * Math.random()

        scales[i] = prng()
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))


    this.particleMaterial = new THREE.ShaderMaterial({
      // color: '#ffaf19',
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 140 * this.experience.renderer.config.pixelRatio},
        uDistortion: { value: 0 },
      
      },
      vertexShader: `
      uniform float uTime; 
      uniform float uSize;
      uniform float uDistortion;
      attribute float aScale;

      void main()
      {
          /**
              * Position
              */
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          

          // interval
          // le mod teste uTime et la 2ème valeur correspond à l'intervalle
          float alt = step(mod(uTime, 5.), 10.);

          modelPosition += sin(uTime + modelPosition * 10.0 * uDistortion) * 0.1;

          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          gl_Position = projectedPosition;

          /**
              * Size
              */
          gl_PointSize = uSize * aScale;
          gl_PointSize *= (1.0 / - viewPosition.z);
      }
      `,
      fragmentShader: `
      void main()
      {
        // Diffuse point
        float strength = distance(gl_PointCoord, vec2(0.5));
        strength *= 2.0;
        strength = 1.0 - strength;

        gl_FragColor = vec4(vec3(strength), 1.0);
      }
      `,
    })

    const particles = new THREE.Points(particleGeometry, this.particleMaterial)
    this.model.add(particles)

  }

  noise(x){
    const sin = Math.sin
    return (sin(x) + sin(2.2*x+5.52) + sin(2.9*x+0.93) + sin(4.6*x+8.94)) / 4
  }


  // anim the light to make it sparkle candle like with some noise
  setSparkleLight() {

    // get a prng
    let prng = new Alea(200)
    
    let lightValue = {
      value: 18,
    }

    anime({
      targets: lightValue,
      value: 21,
      duration: 1000,
      easing: 'easeInOutQuad',
      direction: 'alternate',
      loop: true,

      // add noise
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
      value: 0.2,
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

      anime({
        targets: posValue,
        value: 0.6,
        easing: 'spring(1, 80, 5, 10)',

        update: () => {
          this.model.position.y = posValue.value
          this.uDistortion = posValue.value
        }
      });

    }, 10000);
  }

  update(time) 
  {
      this.particleMaterial.uniforms.uTime.value = time;
      this.particleMaterial.uniforms.uDistortion.value = this.uDistortion;
  }

}