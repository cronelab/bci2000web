// @ts-nocheck
import nifti from 'nifti-reader-js';
import { useEffect, useRef, Suspense, useState } from 'react';
import { OrthographicCamera, OrbitControls } from '@react-three/drei';
import { useFrame, Canvas } from '@react-three/fiber';
import {
  RedFormat,
  LinearFilter,
  DataTexture3D,
  Color,
  Vector3,
  BackSide,
  GLSL3,
  Euler,
  DoubleSide,
  FrontSide,
} from 'three';
import { useControls } from 'leva';

const Brain = () => {
  const vertexShader = /* glsl */ `
    uniform mat4 modelMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform vec3 cameraPos;
  
    out vec3 vOrigin;
    out vec3 vDirection;
    in vec3 position;
     
    void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vOrigin = vec3( inverse( modelMatrix ) * vec4( cameraPos, 1.0 ) ).xyz;
        vDirection = position - vOrigin;
        gl_Position = projectionMatrix * mvPosition;
    }
    `;

  //   const vertexShader = /* glsl */ `#version 300 es
  //     #line 4
  //     layout(location=0) in vec3 pos;
  //     uniform mat4 proj_view;
  //     uniform vec3 eye_pos;
  //     uniform vec3 volume_scale;

  //     out vec3 vray_dir;
  //     flat out vec3 transformed_eye;

  //     void main(void) {
  //         vec3 volume_translation = vec3(0.5) - volume_scale * 0.5;
  //         gl_Position = proj_view * vec4(pos * volume_scale + volume_translation, 1);
  //         transformed_eye = (eye_pos - volume_translation) / volume_scale;
  //         vray_dir = pos - transformed_eye;
  //     }`;

  const fragmentShader = /* glsl */ `
        precision highp float;
        precision highp sampler3D;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform vec3 base;
        uniform sampler3D map;
        uniform float threshold;
        uniform float range;
        uniform float opacity;
        uniform float steps;
        uniform float frame;
  
  
        in vec3 vOrigin;
        in vec3 vDirection;
        out vec4 color;
        
        uint wang_hash(uint seed)
        {
            seed = (seed ^ 61u) ^ (seed >> 16u);
            seed *= 9u;
            seed = seed ^ (seed >> 4u);
            seed *= 0x27d4eb2du;
            seed = seed ^ (seed >> 15u);
            return seed;
        }
        float randomFloat(inout uint seed)
        {
            return float(wang_hash(seed)) / 4294967296.;
        }
        vec2 hitBox( vec3 orig, vec3 dir ) {
          const vec3 box_min = vec3( - 0.5 );
          const vec3 box_max = vec3( 0.5 );
          vec3 inv_dir = 1.0 / dir;
          vec3 tmin_tmp = ( box_min - orig ) * inv_dir;
          vec3 tmax_tmp = ( box_max - orig ) * inv_dir;
          vec3 tmin = min( tmin_tmp, tmax_tmp );
          vec3 tmax = max( tmin_tmp, tmax_tmp );
          float t0 = max( tmin.x, max( tmin.y, tmin.z ) );
          float t1 = min( tmax.x, min( tmax.y, tmax.z ) );
          return vec2( t0, t1 );
        }
        float sample1( vec3 p ) {
          return texture( map, p ).r;
        }
        float shading( vec3 coord ) {
          float step = 0.01;
          return sample1( coord + vec3( - step ) ) - sample1( coord + vec3( step ) );
        }
        void main(){
          vec3 rayDir = normalize( vDirection );
          vec2 bounds = hitBox( vOrigin, rayDir );
          if ( bounds.x > bounds.y ) discard;
          bounds.x = max( bounds.x, 0.0 );
          vec3 p = vOrigin + bounds.x * rayDir;
          vec3 inc = 1.0 / abs( rayDir );
          float delta = min( inc.x, min( inc.y, inc.z ) );
          delta /= steps;
          // Jitter
          // Nice little seed from
          // https://blog.demofox.org/2020/05/25/casual-shadertoy-path-tracing-1-basic-camera-diffuse-emissive/
          uint seed = uint( gl_FragCoord.x ) * uint( 1973 ) + uint( gl_FragCoord.y ) * uint( 9277 ) + uint( frame ) * uint( 26699 );
          vec3 size = vec3( textureSize( map, 0 ) );
          float randNum = randomFloat( seed ) * 2.0 - 1.0;
          p += rayDir * randNum * ( 1.0 / size );
          //
          vec4 ac = vec4( base, 0.0 );
          for ( float t = bounds.x; t < bounds.y; t += delta ) {
            float d = sample1( p + 0.5 );
            d = smoothstep( threshold - range, threshold + range, d ) * opacity;
            float col = shading( p + 0.5 ) * 3.0 + ( ( p.x + p.y ) * 0.25 ) + 0.2;
            ac.rgb += ( 1.0 - ac.a ) * d * col;
            ac.a += ( 1.0 - ac.a ) * d;
            if ( ac.a >= 0.95 ) break;
            p += rayDir * delta;
          }
          color = ac;
          if ( color.a == 0.0 ) discard;
        }
      `;

  //   const fragmentShader = /* glsl */ `#version 300 es
  // #line 24
  // precision highp int;
  // precision highp float;
  // uniform highp sampler3D volume;
  // uniform highp sampler2D colormap;
  // uniform ivec3 volume_dims;
  // uniform float dt_scale;

  // in vec3 vray_dir;
  // flat in vec3 transformed_eye;
  // out vec4 color;
  // vec2 intersect_box(vec3 orig, vec3 dir) {
  // 	const vec3 box_min = vec3(0);
  // 	const vec3 box_max = vec3(1);
  // 	vec3 inv_dir = 1.0 / dir;
  // 	vec3 tmin_tmp = (box_min - orig) * inv_dir;
  // 	vec3 tmax_tmp = (box_max - orig) * inv_dir;
  // 	vec3 tmin = min(tmin_tmp, tmax_tmp);
  // 	vec3 tmax = max(tmin_tmp, tmax_tmp);
  // 	float t0 = max(tmin.x, max(tmin.y, tmin.z));
  // 	float t1 = min(tmax.x, min(tmax.y, tmax.z));
  // 	return vec2(t0, t1);
  // }
  // // Pseudo-random number gen from
  // // http://www.reedbeta.com/blog/quick-and-easy-gpu-random-numbers-in-d3d11/
  // // with some tweaks for the range of values
  // float wang_hash(int seed) {
  // 	seed = (seed ^ 61) ^ (seed >> 16);
  // 	seed *= 9;
  // 	seed = seed ^ (seed >> 4);
  // 	seed *= 0x27d4eb2d;
  // 	seed = seed ^ (seed >> 15);
  // 	return float(seed % 2147483647) / float(2147483647);
  // }
  // float linear_to_srgb(float x) {
  // 	if (x <= 0.0031308f) {
  // 		return 12.92f * x;
  // 	}
  // 	return 1.055f * pow(x, 1.f / 2.4f) - 0.055f;
  // }
  // void main(void) {
  // 	vec3 ray_dir = normalize(vray_dir);
  // 	vec2 t_hit = intersect_box(transformed_eye, ray_dir);
  // 	if (t_hit.x > t_hit.y) {
  // 		discard;
  // 	}
  // 	t_hit.x = max(t_hit.x, 0.0);
  // 	vec3 dt_vec = 1.0 / (vec3(volume_dims) * abs(ray_dir));
  // 	float dt = dt_scale * min(dt_vec.x, min(dt_vec.y, dt_vec.z));
  // 	float offset = wang_hash(int(gl_FragCoord.x + 640.0 * gl_FragCoord.y));
  // 	vec3 p = transformed_eye + (t_hit.x + offset * dt) * ray_dir;
  // 	for (float t = t_hit.x; t < t_hit.y; t += dt) {
  // 		float val = texture(volume, p).r;
  // 		vec4 val_color = vec4(texture(colormap, vec2(val, 0.5)).rgb, val);
  // 		// Opacity correction
  // 		val_color.a = 1.0 - pow(1.0 - val_color.a, dt_scale);
  // 		color.rgb += (1.0 - color.a) * val_color.a * val_color.rgb;
  // 		color.a += (1.0 - color.a) * val_color.a;
  // 		if (color.a >= 0.95) {
  // 			break;
  // 		}
  // 		p += ray_dir * dt;
  // 	}
  //     color.r = linear_to_srgb(color.r);
  //     color.g = linear_to_srgb(color.g);
  //     color.b = linear_to_srgb(color.b);
  // }`;
  const [tex, setTex] = useState(null);
  const lightRef = useRef();
  const cameraRef = useRef();
  const controlRef = useRef();
  const brainRef = useRef();

  //   useControls('Sliders', {
  //     Opacity: {
  //       value: 1,
  //       min: 0,
  //       max: 1,
  //       step: 0.1,
  //       onChange: (val) => {
  //         if (brainRef.current != undefined) {
  //           //@ts-ignore
  //           brainRef.current.material.uniforms.opacity.value = val;
  //         }
  //       },
  //     },
  //     Range: {
  //       value: 0.1,
  //       min: 0,
  //       max: 0.1,
  //       step: 0.01,
  //       onChange: (val) => {
  //         if (brainRef.current != undefined) {
  //           //@ts-ignore
  //           brainRef.current.material.uniforms.range.value = val;
  //         }
  //       },
  //     },
  //     Steps: {
  //       value: 100,
  //       min: 0,
  //       max: 100,
  //       onChange: (val) => {
  //         if (brainRef.current != undefined) {
  //           //@ts-ignore
  //           brainRef.current.material.uniforms.steps.value = val;
  //         }
  //       },
  //     },
  //   });

  useEffect(() => {
    (async () => {
      const brainReq = await fetch(`/T1/PY20N012`);
      let data = await brainReq.arrayBuffer();
      if (nifti.isCompressed(data)) {
        data = nifti.decompress(data);
      }

      let header = nifti.readHeader(data);
      let image = nifti.readImage(header, data);

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
      const volume = Uint8Array.from(typedData);

      //@ts-ignore
      const texture = new DataTexture3D(volume, 256, 256, 256);
      texture.format = RedFormat;
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;
      texture.unpackAlignment = 1;
      setTex(texture);
    })();
  }, []);

  useFrame(({ scene }) => {
    // console.log(scene);
    if (brainRef.current != null) {
      //   @ts-ignore
      //   brainRef.current.material.uniforms.cameraPos.value.copy(cameraRef.current.position);
    }
  });
  return (
    <>
      <OrthographicCamera ref={cameraRef} makeDefault position={[0, 10, 0]} zoom={30} />
      <OrbitControls ref={controlRef} rotateSpeed={2} minZoom={10} maxZoom={100} target={new Vector3(0, 0, 0)} />
      <directionalLight ref={lightRef} position={[0, -10, 0]} />
      {tex != null ? (
        <mesh ref={brainRef} rotation={new Euler(Math.PI / 2, Math.PI, 0)}>
          <boxGeometry args={[256, 256, 256]} />
          <rawShaderMaterial
            uniforms={{
              base: { value: new Color(0xffff00) },
              map: { value: tex },
              //@ts-ignore
              cameraPos: { value: cameraRef.current.position },
              threshold: { value: 0.1 },
              opacity: { value: 1 },
              range: { value: 0.09 },
              steps: { value: 100 },
            }}
            glslVersion={GLSL3}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            side={BackSide}
            transparent={true}
          ></rawShaderMaterial>
        </mesh>
      ) : (
        <></>
      )}
    </>
  );
};

const ThreeDFiber = () => {
  return (
    <Canvas style={{ backgroundColor: 'black' }}>
      <Suspense fallback={null}>
        <Brain></Brain>
      </Suspense>
    </Canvas>
  );
};

export default ThreeDFiber;
