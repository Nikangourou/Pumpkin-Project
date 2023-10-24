import { MeshMatcapMaterial } from 'three';
import glsl from 'glslify';

export default class LianaMaterial extends MeshMatcapMaterial {
  /**
   * @param { import("three").MeshMatcapMaterialParameters } params
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
    shader.uniforms.uSpeed = {value : 0};

    const snoise4 = glsl`#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)`;

    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      [
        'uniform float uTime;',
        'uniform float uEasing;',
        'uniform float uSpeed;',
        'varying vec3 vPosition;',
        `varying vec2 vUv;`,
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
          `varying vec2 vUv;`,
          'float clampedSine(float t){',
          '   return (sin(t)+1.)*.5;',
          '}',
          snoise4,
          `void main() {`,
      ].join('\n')
    );

    // // WAVE :
    // shader.vertexShader = shader.vertexShader.replace(
    //   '#include <project_vertex>',
    //   `
    //     transformed.x += sin(transformed.y*2.+uTime) * .5;
    //     #include <project_vertex>
    //   `
    // );

    // RADIUS :
    shader.vertexShader = shader.vertexShader.replace(
      '#include <project_vertex>',
      `
          transformed = transformed + normalize(normal) * 0.1 * fit(uEasing, 0., 1., mix(0.5, 0., uv.x), 1.) * (1.-uv.x);
          // transformed = clamp(uv.x, 0., 1.);

          // FLOTTEMENT DES LIANES
          // transformed += clampedSine(uTime + uv.x) *uv.x *0.5;

          // TEST
          // transformed = transformed + normalize(normal) * abs(cos(transformed *(1./10.) *10. - uv.x));

          // GROSSISSEMENT AU PROGRES
          float len = 0.0001;
          // la valeur progress doit aller de 0 à 1 et être en boucle
          float progress = abs(sin(uTime * 0.1 + (1.-uv.x) * 2.));
          float smoothing = 0.05;
          float mask = 1. - smoothstep(progress + len - smoothing, progress + len + smoothing, uv.x);
          mask *= smoothstep(progress - len - smoothing, progress - len + smoothing, uv.x);

          transformed += normal * mask * 0.3;

          #include <project_vertex>
        `
    );
    
    // UVX
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', [
      '#include <map_fragment>',
      // transparency
      // 'float a = 1. - vUv.x;', 

      'if(vUv.x > uSpeed ){',
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

      `diffuseColor.rgb = diffuseColor.rgb - mask * 10.;`,

      // 'float pulse = abs(sin(uTime + (1.-vUv.x * 20.)) * 2.);',

      'diffuseColor = vec4(diffuseColor.rgb, 1.0);',
    ].join('\n'));



    // NOISE :
    // shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', [
    //     'transformed += snoise(vec4(position, uTime)) * .05;',
    //     '#include <project_vertex>',
    // ].join('\n'));

    // LIANA COLOR :
    // shader.fragmentShader = shader.fragmentShader.replace('void main() {', 
    // [
    //     `uniform float uTime;`,
    //     `varying vec3 vPosition;`,
    //     `varying vec2 vUv;`,
    //     'float clampedSine(float t){',
    //     '   return (sin(t)+1.)*.5;',
    //     '}',
    //     snoise4,
    //     `void main() {`,
    // ].join('\n'));

    // // map_fragment permet de donner une valeur à diffuseColor. on doit donc l'include avant de faire nos modifs, càd avant que le shader chunk projette les positions transformées depuis l'objet dans le world
    // // diffuseColor est un vec4 qui représente rgba
    // shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', [
    //   '#include <map_fragment>',
    //   // transparency
    //   'float a = 1. - vUv.x;', 
    //   'diffuseColor = vec4(vec3(1. -vUv.x), a);',
    // ].join('\n'));

    this.userData.shader = shader;
  }

  update(time, easingValue, speedValue) {
    if (this.userData?.shader) {
      this.userData.shader.uniforms.uTime.value = time;
      this.userData.shader.uniforms.uEasing.value = easingValue;
      this.userData.shader.uniforms.uSpeed.value = speedValue;
    }
  }
}
