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
                { name: 'floor', source: '/assets/floor/floor.glb', type: 'gltf' },

            ]
    }
]