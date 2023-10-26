// import { MeshStandardMaterial } from 'three';
// import glsl from 'glslify';

// export default class BirdMaterial extends MeshStandardMaterial {
//   /**
//    * @param { import("three").MeshStandardMaterialParameters } params
//    */
//   constructor(params) {
//     super({
//       ...params,
//     });

//     this.params = params;
//   }

//   /**
//    * @param { import("three").Shader } shader
//    * @param { import("three").WebGLRenderer } renderer
//    */
//   onBeforeCompile(shader, renderer) {
//     super.onBeforeCompile(shader, renderer);

//     shader.uniforms.uTime = { value: 0 };

//     const snoise4 = glsl`#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)`;

//     shader.vertexShader = shader.vertexShader.replace(
//       'void main() {',
//       [
//         'uniform float uTime;',
//         'varying vec3 vPosition;',
//         // `varying vec2 vUv;`,
//         snoise4,
//         'float clampedSine(float t){',
//         '   return (sin(t)+1.)*.5;',
//         '}',
//         'float random(vec2 st){',
//         '   return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);',
//         '}',
//         'float fit(float value, float min, float max, float newMin, float newMax){',
//         '   return newMin + (newMax - newMin) * (value - min) / (max - min);',
//         '}',

//         'void main() {',
//         '   vPosition = position;',
//         `   vUv = uv;`,
//         `}`
//       ].join('\n')
//     );

//     shader.fragmentShader = shader.fragmentShader.replace('void main() {',
//       [
//           `uniform float uTime;`,
//           `varying vec3 vPosition;`,
//         //   `varying vec2 vUv;`,
//           'float clampedSine(float t){',
//           '   return (sin(t)+1.)*.5;',
//           '}',
//           snoise4,
//           `void main() {`,
//       ].join('\n')
//     );

//     shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', [
      

//         `transformed += clampedSine(uTime + uv.x) *uv.x *0.5;`,
//         // `void applyFold(out vec2 uv, float s) {`,
//         // `    uv -= 0.5;`,
//         // `    uv.y += abs(uv.x) * s;`,
//         // `    uv += 0.5;`,
//         // `}`,   

//         //   `transformed += normal * mask * 0.5 * (1.-uv.x);`,

//           `#include <project_vertex>`
        
//       ].join('\n'));
    
//     // UVX
//     shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', [
//       '#include <map_fragment>',

//       'diffuseColor = vec4(vec3(diffuseColor.r), 1.0);',

//       // 'float pulse = abs(sin(uTime + (1.-vUv.x * 20.)) * 2.);',
//     ].join('\n'));

//     this.userData.shader = shader;
//   }

//   update(time) {
//     if (this.userData?.shader) {
//       this.userData.shader.uniforms.uTime.value = time;
//     //   this.userData.shader.uniforms.uEasing.value = easingValue;
//     }
//   }
// }
