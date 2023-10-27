import * as THREE from "three";
import Experience from "../Experience";
import { ShadowMapViewer } from 'three/examples/jsm/utils/ShadowMapViewer.js';

export default class Environment {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        // Debug
        this.debug = this.experience.debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder('environment')
            this.debugFolder.close()
        }

        this.setSunLight()
        //    this.createHUD()
        this.createHDRI()
    }

    setSunLight() {
        this.ambientLight = new THREE.AmbientLight('#8accff', 2)
        this.scene.add(this.ambientLight)

        this.moonLight = new THREE.DirectionalLight('#8accff', 6)
        this.moonLight.castShadow = true

        this.moonLight.shadow.mapSize.set(2048, 2048)
        this.moonLight.shadow.camera.left = - 10
        this.moonLight.shadow.camera.right = 10
        this.moonLight.position.set(7, 6, -15)
        this.scene.add(this.moonLight)

        // Debug
        if (this.debug) {
            this.debugFolder
                .add(this.moonLight, 'intensity')
                .name('intensity')
                .min(0)
                .max(10)
                .step(0.01)
        }
    }

    createHDRI() {

        let color = '#6ea5cf'

        const geometry = new THREE.BoxGeometry(1, 1, 1);

        const material = new THREE.ShaderMaterial({
            side: THREE.BackSide,
            uniforms: {
                uColor: { value: new THREE.Color(color) },
            },
            vertexShader: `
                varying vec2 vPosition;
                void main() {
                    vPosition = position.xy * 0.5 + 0.5;
                    gl_Position = projectionMatrix 
                        * modelViewMatrix 
                        * vec4( position * 100.0, 1.0 );
                }
            `,
            fragmentShader: `
                varying vec2 vPosition;
                uniform vec3 uColor;
                void main() {
                    gl_FragColor = vec4(uColor, 1.0) * vPosition.y;
                }
            `,
        });

        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        if (this.debug) {
            // color
            this.debugFolder
                .addColor({ color: color }, 'color')
                .name('color')
                .onChange((value) => {
                    material.uniforms.uColor.value.set(value);
                });
        }
    }

    // createHUD() and update() are made for ShadowMapViewer
    createHUD() {

        const lightShadowMapViewer = new ShadowMapViewer(this.moonLight);
        lightShadowMapViewer.position.x = 10;
        lightShadowMapViewer.position.y = 10;
        lightShadowMapViewer.size.width = 400;
        lightShadowMapViewer.size.height = 400;
        lightShadowMapViewer.update();
        this.viewer = lightShadowMapViewer
    }

    update(renderer) {
        if (this.viewer && this.moonLight.shadow.map) {
            this.viewer.update()
            this.viewer.render(renderer);
        }
    }
}