import * as THREE from 'three'
import Experience from './Experience.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

export default class Renderer {
    constructor(_options = {}) {
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.stats = this.experience.stats
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder('renderer')
            this.debugFolder.close()
        }

        this.usePostprocess = true

        this.setInstance()
        this.setPostProcess()
    }

    setInstance() {        
        // Renderer
        this.instance = new THREE.WebGLRenderer({
            alpha: false,
            antialias: true
        })
        this.instance.domElement.style.position = 'absolute'
        this.instance.domElement.style.top = 0
        this.instance.domElement.style.left = 0
        this.instance.domElement.style.width = '100%'
        this.instance.domElement.style.height = '100%'

        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        this.instance.physicallyCorrectLights = true
        // this.instance.gammaOutPut = true
        this.instance.outputColorSpace = THREE.SRGBColorSpace

        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.shadowMap.enabled = true
        // this.instance.shadowMap.autoUpdate = true
        this.instance.toneMapping = THREE.ReinhardToneMapping
        this.instance.toneMappingExposure = 4


        this.context = this.instance.getContext()

        // Add stats panel
        if (this.stats) {
            this.stats.setRenderPanel(this.context)
        }

        // Debug
        if (this.debug) {
            this.debugFolder
                .add(
                    this.instance,
                    'toneMapping',
                    {
                        'NoToneMapping': THREE.NoToneMapping,
                        'LinearToneMapping': THREE.LinearToneMapping,
                        'ReinhardToneMapping': THREE.ReinhardToneMapping,
                        'CineonToneMapping': THREE.CineonToneMapping,
                        'ACESFilmicToneMapping': THREE.ACESFilmicToneMapping
                    }
                )
                .onChange(() => {
                    this.scene.traverse((_child) => {
                        if (_child instanceof THREE.Mesh)
                            _child.material.needsUpdate = true
                    })
                })

            this.debugFolder
                .add(
                    this.instance,
                    'toneMappingExposure'
                )
                .min(0)
                .max(10)
        }
    }

    setPostProcess() {
        this.postProcess = {}

        /**
         * Render pass
         */
        this.postProcess.renderPass = new RenderPass(this.scene, this.camera.instance)

        /**
         * Effect composer
         */
        this.renderTarget = new THREE.WebGLRenderTarget(
            this.config.width,
            this.config.height,
            {
                generateMipmaps: false,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat,
                encoding: THREE.sRGBEncoding,
                samples: 2
            }
        )
        this.postProcess.composer = new EffectComposer(this.instance, this.renderTarget)
        this.postProcess.composer.setSize(this.config.width, this.config.height)
        this.postProcess.composer.setPixelRatio(this.config.pixelRatio)

        this.postProcess.composer.addPass(this.postProcess.renderPass)

        const unrealBloomPass = new UnrealBloomPass()
        unrealBloomPass.resolution.set(2048, 2048)
        unrealBloomPass.strength = 0.8
        unrealBloomPass.radius = 0.5
        unrealBloomPass.threshold = 0.5
        this.postProcess.composer.addPass(unrealBloomPass)

        // vignetage

        const VignetteShader = {
            uniforms: {
                tDiffuse: { value: null },
                offset: { value: 1.0 },
                darkness: { value: 1.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix 
                        * modelViewMatrix 
                        * vec4( position, 1.0 );
                }
            `,
            fragmentShader: `
                uniform float offset;
                uniform float darkness;
                uniform sampler2D tDiffuse;
                varying vec2 vUv;
                void main() {
                    vec4 texel = texture2D( tDiffuse, vUv );
                    vec2 uv = ( vUv - vec2( 0.5 ) ) * vec2( offset );
                    gl_FragColor = vec4( mix( texel.rgb, vec3( 1.0 - darkness ), dot( uv, uv ) ), texel.a );
                }
            `
        }

        const vignettePass = new ShaderPass(VignetteShader)
        vignettePass.uniforms['offset'].value = 0.95
        vignettePass.uniforms['darkness'].value = 1.6
        this.postProcess.composer.addPass(vignettePass)

        // noise pass
        const NoiseShader = {
            uniforms: {
                tDiffuse: { value: null },
                uTime: { value: 0 },
                uNoiseDensity: { value: 0.5 },
                uNoiseStrength: { value: 0.5 },
                uNoiseSpeed: { value: 0.5 },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix 
                        * modelViewMatrix 
                        * vec4( position, 1.0 );
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform float uNoiseDensity;
                uniform float uNoiseStrength;
                uniform float uNoiseSpeed;
                uniform sampler2D tDiffuse;
                varying vec2 vUv;
                float rand(vec2 seed) {
                    return fract(sin(dot(seed.xy, vec2(12.9898, 78.233))) * 43758.5453);
                }
                void main() {
                    vec4 texel = texture2D( tDiffuse, vUv );
                    float noise  = rand(vUv + uTime);
                    vec3 color = texel.rgb + vec3(noise * uNoiseStrength);
                    gl_FragColor = vec4( color, texel.a );
                }
            `
        }

        const noisePass = new ShaderPass(NoiseShader)
        noisePass.uniforms['uNoiseDensity'].value = 0.5
        noisePass.uniforms['uNoiseStrength'].value = 0.1
        noisePass.uniforms['uNoiseSpeed'].value = 0.5
        this.postProcess.composer.addPass(noisePass)




        // Debug
        if (this.debug) {
            this.debugFolder.add(this, 'usePostprocess').name('use postprocess')
            this.debugFolder.add(unrealBloomPass, 'strength').min(0).max(2).step(0.001).name('bloom strength')
            this.debugFolder.add(unrealBloomPass, 'radius').min(0).max(2).step(0.001).name('bloom radius')
            this.debugFolder.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.001).name('bloom threshold')

            this.debugFolder.add(vignettePass.uniforms['offset'], 'value').min(0).max(1).step(0.001).name('vignette offset')
            this.debugFolder.add(vignettePass.uniforms['darkness'], 'value').min(0).max(3).step(0.001).name('vignette darkness')

            this.debugFolder.add(noisePass.uniforms['uNoiseDensity'], 'value').min(0).max(1).step(0.001).name('noise density')
            this.debugFolder.add(noisePass.uniforms['uNoiseStrength'], 'value').min(0).max(1).step(0.001).name('noise strength')
            this.debugFolder.add(noisePass.uniforms['uNoiseSpeed'], 'value').min(0).max(1).step(0.001).name('noise speed')


        }

    }

    resize() {
        // Instance
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        // Post process
        this.postProcess.composer.setSize(this.config.width, this.config.height)
        this.postProcess.composer.setPixelRatio(this.config.pixelRatio)
    }

    update() {
        if (this.stats) {
            this.stats.beforeRender()
        }

        if (this.usePostprocess) {
            this.postProcess.composer.render()
        }
        else {
            this.instance.render(this.scene, this.camera.instance)
        }

        if (this.stats) {
            this.stats.afterRender()
        }

        this.postProcess.composer.passes[3].uniforms['uTime'].value = this.time.elapsed * 0.0005
    }

    destroy() {
        this.instance.renderLists.dispose()
        this.instance.dispose()
        this.renderTarget.dispose()
        this.postProcess.composer.renderTarget1.dispose()
        this.postProcess.composer.renderTarget2.dispose()
    }
}