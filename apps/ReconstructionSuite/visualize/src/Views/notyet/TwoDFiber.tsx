import {
  Vector3,
  Euler,
  DataTexture2DArray,
  Scene,
  RedFormat,
  UnsignedByteType,
  WebGLRenderTarget,
  ShaderMaterial,
  Mesh,
  GLSL3,
  Color,
  // OrthographicCamera,
  PlaneBufferGeometry,
  WebGLRenderer,
  Vector2,
} from 'three';

import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { WEBGL } from 'three/examples/jsm/WebGL.js';
import nifti from 'nifti-reader-js';
import { Suspense, useState, useEffect, useRef } from 'react';
import { OrthographicCamera, OrbitControls, PerspectiveCamera, useFBO } from '@react-three/drei';
import { useFrame, Canvas } from '@react-three/fiber';

const TwoDBrain = () => {
  const cameraRef = useRef();
  const controlRef = useRef();
  const lightRef = useRef();
  const brainRef = useRef();
  const postProcessMatRef = useRef();
  const materialRef = useRef();
  const [tex, setTex] = useState(null);

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

  let depthStep = 0.4;
  let camera, scene, mesh, renderer;

  useEffect(() => {
    (async () => {
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

      const brainReq = await fetch(`/CT/PY20N012`);
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

      const texture = new DataTexture2DArray(data, 256, 256, 256);
      texture.format = RedFormat;
      texture.type = UnsignedByteType;
      setTex(texture);
    })();
  }, []);

  useFrame(() => {
    if (materialRef.current != null) {
      //@ts-ignore
      var value = materialRef.current.uniforms['depth'].value;

      value += depthStep;

      if (value > 109.0 || value < 0.0) {
        if (value > 1.0) value = 109.0 * 2.0 - value;
        if (value < 0.0) value = -value;

        depthStep = -depthStep;
      }

      //@ts-ignore
      materialRef.current.uniforms['depth'].value = value;

      //@ts-ignore
      const layer = Math.floor(materialRef.current.uniforms['depth'].value);
      //@ts-ignore
      postProcessMatRef.current.uniforms.uDepth.value = layer;
      // postProcessMaterial.uniforms.uDepth.value = layer;
      renderer.setRenderTarget(renderTarget, layer);
      // renderer.render(postProcessScene, postProcessCamera);
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    }
  });
  const renderTarget = useFBO({
    multisample: true,
    stencilBuffer: false,
  });
  const renderTargetTexture = new DataTexture2DArray();
  renderTargetTexture.format = RedFormat;
  renderTargetTexture.type = UnsignedByteType;

  // const renderTarget = new WebGLRenderTarget(256, 256);
  renderTarget.depth = 256;
  renderTarget.setTexture(renderTargetTexture);

  return (
    <>
      <group>
        <mesh>
          <planeBufferGeometry args={[50, 50]}></planeBufferGeometry>
          <shaderMaterial
            ref={materialRef}
            uniforms={{
              diffuse: { value: renderTarget.texture },
              depth: { value: 55 },
              size: { value: new Vector2(50, 50) },
              uTexture: { value: tex },
            }}
            vertexShader={shaders.vertexShader}
            fragmentShader={shaders.fragmentShader}
          ></shaderMaterial>
        </mesh>
      </group>

      <group key="postProcessScene">
        <mesh>
          <planeBufferGeometry args={[2, 2]}></planeBufferGeometry>
          <shaderMaterial
            ref={postProcessMatRef}
            uniforms={{
              uTexture: { value: null },
              uDepth: { value: 55 },
              uIntensity: { value: 1.0 },
            }}
            vertexShader={shaders.vertex_postprocess}
            fragmentShader={shaders.fragment_postprocess}
          ></shaderMaterial>
        </mesh>
        <PerspectiveCamera
          ref={cameraRef}
          position={[0, 0, 70]}
          fov={45}
          aspect={window.innerWidth / window.innerHeight}
          near={0.1}
          far={2000}
        ></PerspectiveCamera>
      </group>
    </>
  );
};

const TwoDFiber = () => {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <TwoDBrain></TwoDBrain>
      </Suspense>
    </Canvas>
  );
};
export default TwoDFiber;
