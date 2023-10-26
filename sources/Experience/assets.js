export default [
    {
        name: 'base',
        data: {},
        items:
            [
                { name: 'pumpkin', source: '/assets/pumpkin.glb', type: 'gltf' },
                { name: 'pumpkinDiffuse', source: '/assets/pumpkin-diffuse-dark.png', type: 'texture' },
                { name: 'lianaMatcap', source: '/assets/liana-matcap.png', type: 'texture' },

                // grass
                { name: 'grassColor', source: '/assets/grass/color.jpg', type: 'texture' },
                { name: 'grassNormal', source: '/assets/grass/normal.jpg', type: 'texture' },
                { name: 'grassRoughness', source: '/assets/grass/roughness.jpg', type: 'texture' },
                { name: 'grassAmbientOcclusion', source: '/assets/grass/ambientOcclusion.jpg', type: 'texture' },

                // bark
                { name: 'barkColor', source: '/assets/bark2/color-dark.png', type: 'texture' },
                { name: 'barkNormal', source: '/assets/bark2/normal-gl.png', type: 'texture' },
                { name: 'barkRoughness', source: '/assets/bark2/roughness.png', type: 'texture' },
                { name: 'barkAmbientOcclusion', source: '/assets/bark2/ambientOcclusion.png', type: 'texture' },
                { name: 'barkDisplacement', source: '/assets/bark2/displacement.png', type: 'texture' },

                // floor
                { name: 'floor', source: '/assets/floor/floor3.glb', type: 'gltf' },

                // bat
                { name: 'bat', source: '/assets/bat/bat2.glb', type: 'gltf' },
                { name: 'batDiffuse', source: '/assets/bat/bat-diffuse.png', type: 'texture' },

                // moon
                { name: 'moonDiffuse', source: '/assets/moon/color.png', type: 'texture'},
                { name: 'moonNormal', source: '/assets/moon/normal.png', type: 'texture'},

                // clouds
                { name: 'cloud1', source: '/assets/clouds/cloud2.glb', type: 'gltf' },

            ]
    }
]