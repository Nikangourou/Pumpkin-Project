import { MeshStandardMaterial } from 'three';
import glsl from 'glslify';

export default class LianaMaterial extends MeshStandardMaterial {
  /**
   * @param { import("three").MeshStandardMaterialParameters } params
   */
  constructor(params) {
    super({
      ...params,
    });

    this.params = params;

  }

  /**
   * @param { import("three").Shader } shader
   * @param { import("three").WebGLRenderer } renderer
   */
  onBeforeCompile(shader, renderer) {
    super.onBeforeCompile(shader, renderer);

    shader.uniforms.uTime = { value: 0 };
    shader.uniforms.uEasing = { value: 0 };
    shader.uniforms.uWave = { value: 0 };
    shader.uniforms.uSpeed = { value: 0 };

    const snoise4 = glsl`#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)`;

    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      [
        'uniform float uTime;',
        'uniform float uEasing;',
        'uniform float uSpeed;',
        'uniform float uWave;',
        'varying vec3 vPosition;',
        // `varying vec2 vUv;`,
        snoise4,
        'float clampedSine(float t){',
        '   return (sin(t)+1.)*.5;',
        '}',
        'float random(vec2 st){',
        '   return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);',
        '}',
        'float fit(float value, float min, float max, float newMin, float newMax){',
        '   return newMin + (newMax - newMin) * (value - min) / (max - min);',
        '}',

        'void main() {',
        '   vPosition = position;',
        `   vUv = uv;`,
      ].join('\n')
    );

    shader.fragmentShader = shader.fragmentShader.replace('void main() {',
      [
        `uniform float uTime;`,
        `uniform float uEasing;`,
        `uniform float uSpeed;`,
        `varying vec3 vPosition;`,
        // `varying vec2 vUv;`,
        'float clampedSine(float t){',
        '   return (sin(t)+1.)*.5;',
        '}',
        snoise4,
        `void main() {`,
      ].join('\n')
    );

    shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', [

      `transformed += normalize(normal) * 0.2 * fit(uEasing, 0., 1., mix(0.5, 0., uv.x), 1.) * (1.-uv.x);`,
    
      // FLOTTEMENT DES LIANES
      // `transformed += clampedSine(uTime + uv.x) *uv.x *0.5;`,

      // TEST
      // `transformed = transformed + normalize(normal) * abs(cos(transformed *(1./10.) *10. - uv.x));`,

      // GROSSISSEMENT AU PROGRES
      `float len = 0.0001;`,
      // la valeur progress doit aller de 0 à 1 et être en boucle
      `float progress = abs(sin(uTime * 0.1 + (1.-uv.x) * 2.));`,
      `float smoothing = 0.05;`,
      `float mask = 1. - smoothstep(progress + len - smoothing, progress + len + smoothing, uv.x);`,
      `mask *= smoothstep(progress - len - smoothing, progress - len + smoothing, uv.x);`,

      `transformed += normal * mask * 0.5 * (1.-uv.x);`,

      // noise the radius 
      `transformed += normal * snoise(vec4(transformed, uTime)) * 0.05;`,
    
      // wave animation
      'transformed += clampedSine(uTime + uv.x * PI * 4.0) * clampedSine(uTime + uv.x * PI * 4.0) * clampedSine(uTime + uv.x * PI * 4.0) * 0.5;',
      'if (uWave > 0.) {',
      'transformed.y += clampedSine(uTime + uv.x * PI * 4.) * uWave;',
      'transformed.x -= clampedSine(uTime + uv.x * PI * 4.) * uWave;',
      '}',
   
      `#include <project_vertex>`

    ].join('\n'));

    // UVX
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', [
      '#include <map_fragment>',
      'if(vUv.x > uEasing ){',
      '   discard;',
      '}',

      // 'float pulse = abs(cos(uTime * (1.-vUv.x)));',
      'float pulse = abs(sin(uTime * 0.2 + (1.-vUv.x) * 2.) * 2.);',

      // GROSSISSEMENT AU PROGRES
      `float len = 0.0001;`,
      // la valeur progress doit aller de 0 à 1 et être en boucle
      `float progress = abs(sin(uTime * 0.1 + (1.-vUv.x) * 2.));`,
      `float smoothing = 0.05;`,
      `float mask = 1. - smoothstep(progress + len - smoothing, progress + len + smoothing, vUv.x);`,
      `mask *= smoothstep(progress - len - smoothing, progress - len + smoothing, vUv.x);`,

      // `diffuseColor.rgb -=0.5;`,

      `diffuseColor.g += mask * 10.;`,
      `diffuseColor.rb += mask;`,

      'diffuseColor = vec4(diffuseColor.rgb, 1.0);',

      // 'float pulse = abs(sin(uTime + (1.-vUv.x * 20.)) * 2.);',
    ].join('\n'));

    this.userData.shader = shader;
  }

  update(time, easingValue, wave) {
    if (this.userData?.shader) {
      this.userData.shader.uniforms.uTime.value = time;
      this.userData.shader.uniforms.uEasing.value = easingValue;
      this.userData.shader.uniforms.uWave.value = wave;
    }
  }
}
