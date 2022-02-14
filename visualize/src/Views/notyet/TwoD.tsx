import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { WEBGL } from 'three/examples/jsm/WebGL.js';
import nifti from 'nifti-reader-js';
import { useEffect } from 'react';

const TwoD = () => {
  let depthStep = 0.4;
  let camera, scene, mesh, renderer, stats;

  const planeWidth = 50;
  const planeHeight = 50;
  let renderTarget, postProcessScene, postProcessCamera, postProcessMaterial;
  useEffect(() => {
    init();
  }, []);

  async function init() {
    var container = document.createElement('div');
    let cont2 = document.getElementById('init');
    cont2.appendChild(container);

    const shaders = {
      vertex_postprocess: `
      
      out vec2 vUv;
    
      void main()
      {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
      fragment_postprocess: `
    
    precision highp sampler2DArray;
    precision mediump float;
    
    in vec2 vUv;
    
    uniform sampler2DArray uTexture;
    uniform int uDepth;
    uniform float uIntensity;
    
    void main()
    {
      float voxel = texture(uTexture, vec3( vUv, uDepth )).r;
      gl_FragColor.r = voxel * uIntensity;
    }
    `,
      vertexShader: `
    uniform vec2 size;
    out vec2 vUv;
    
    void main() {
    
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    
      // Convert position.xy to 1.0-0.0
    
      vUv.xy = position.xy / size + 0.5;
      vUv.y = 1.0 - vUv.y; // original data is upside down
    
    }`,
      fragmentShader: `	precision highp float;
    precision highp int;
    precision highp sampler2DArray;
    
    uniform sampler2DArray diffuse;
    in vec2 vUv;
    uniform int depth;
    
    void main() {
    
      vec4 color = texture( diffuse, vec3( vUv, depth ) );
    
      // lighten a bit
      gl_FragColor = vec4( color.rrr * 1.5, 1.0 );
    }`,
    };

    postProcessScene = new THREE.Scene();

    postProcessCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderTargetTexture = new THREE.DataTexture2DArray();
    renderTargetTexture.format = THREE.RedFormat;
    renderTargetTexture.type = THREE.UnsignedByteType;

    const renderTarget = new THREE.WebGLRenderTarget(256, 256);
    renderTarget.depth = 256;
    renderTarget.setTexture(renderTargetTexture);

    postProcessMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uDepth: { value: 55 },
        uIntensity: { value: 1.0 },
      },
      vertexShader: shaders.vertex_postprocess,
      fragmentShader: shaders.fragment_postprocess,
    });

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 70;

    scene = new THREE.Scene();

    /** Post-processing scene */

    const planeGeometry = new THREE.PlaneBufferGeometry(2, 2);
    const screenQuad = new THREE.Mesh(planeGeometry, postProcessMaterial);
    postProcessScene.add(screenQuad);

    // 2D Texture array is available on WebGL 2.0

    // renderer = new THREE.WebGLRenderer();
    // renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // container.appendChild(renderer.domElement);

    // window.addEventListener('resize', onWindowResize);

    // const gui = new GUI();

    // gui
    //   .add(
    //     {
    //       intensity: 1,
    //     },
    //     'intensity',
    //     0,
    //     1
    //   )
    //   .step(0.01)
    //   .onChange((value) => (postProcessMaterial.uniforms.uIntensity.value = value));
    // gui.open();

    // width 256, height 256, depth 109, 8-bit, zip archived raw data
    const brainReq = await fetch(`/T1/PY20N012`);
    let data1 = await brainReq.arrayBuffer();
    if (nifti.isCompressed(data1)) {
      data1 = nifti.decompress(data1);
    }

    let header = nifti.readHeader(data1);
    let image = nifti.readImage(header, data1);
    let typedData;
    if (header.datatypeCode === nifti.NIFTI1.TYPE_UINT8) {
      typedData = new Uint8Array(image);
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_INT16) {
      typedData = new Int16Array(image);
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_INT32) {
      typedData = new Int32Array(image);
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_FLOAT32) {
      typedData = new Float32Array(image);
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_FLOAT64) {
      typedData = new Float64Array(image);
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_INT8) {
      typedData = new Int8Array(image);
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_UINT16) {
      typedData = new Uint16Array(image);
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_UINT32) {
      typedData = new Uint32Array(image);
    } else {
      return;
    }
    const data = Uint8Array.from(typedData);

    //@ts-ignore

    const texture = new THREE.DataTexture2DArray(data, 256, 256, 256);
    texture.format = THREE.RedFormat;
    texture.type = THREE.UnsignedByteType;

    var material = new THREE.ShaderMaterial({
      uniforms: {
        diffuse: { value: renderTarget.texture },
        depth: { value: 55 },
        size: { value: new THREE.Vector2(planeWidth, planeHeight) },
      },
      vertexShader: shaders.vertexShader,
      fragmentShader: shaders.fragmentShader,
    });

    var geometry = new THREE.PlaneBufferGeometry(planeWidth, planeHeight);

    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    postProcessMaterial.uniforms.uTexture.value = texture;

    animate();
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);

    var value = mesh.material.uniforms['depth'].value;

    value += depthStep;

    if (value > 109.0 || value < 0.0) {
      if (value > 1.0) value = 109.0 * 2.0 - value;
      if (value < 0.0) value = -value;

      depthStep = -depthStep;
    }

    mesh.material.uniforms['depth'].value = value;

    const layer = Math.floor(mesh.material.uniforms['depth'].value);
    postProcessMaterial.uniforms.uDepth.value = layer;
    renderer.setRenderTarget(renderTarget, layer);
    renderer.render(postProcessScene, postProcessCamera);
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }

  return (
    <>
      <div id="init"></div>
    </>
  );
};
export default TwoD;
