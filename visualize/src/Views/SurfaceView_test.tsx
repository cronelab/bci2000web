//@ts-nocheck
import React, { useRef, useState, useEffect, Suspense } from "react";
import {
  OrthographicCamera,
  OrbitControls,
  Html,
  useProgress,
  PerspectiveCamera,
} from "@react-three/drei";
import { modifySize, modifyColor } from "../helpers/modifyElectrodes";
import { useLoader, useFrame, Canvas, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import {
  Mesh,
  Color,
  Scene,
  Material,
  MeshLambertMaterial,
  MeshStandardMaterial,
  MeshBasicMaterial,
} from "three";
import { useControls } from "leva";

const Brain = (props) => {
  const urlParams = new URLSearchParams(window.location.search);

  let first = true;

  const cam = useRef();
  const brainRef = useRef();
  const lightRef = useRef();
  const controlRef = useRef<Mesh>(null);
  const activeSubject = urlParams.get("subject") || "fsaverage";

  // //* Import files
  const brain = useLoader(GLTFLoader, `/brain/${activeSubject}`, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.4.1/"
    );
    loader.setDRACOLoader(dracoLoader);
  });
  console.log(brain);
  // useEffect(() => {
  //   brainRef.current.traverse((child) => {
  //     // if (child instanceof Mesh) {
  //     //   child.material.alphaMap = new Color(0x000000)
  //     // }
  //   })
  //   console.log(brainRef.current)
  // },[brainRef.current])
  useFrame(({ camera, scene, gl }) => {
    lightRef?.current?.position.copy(camera.position);
  });
  return (
    <>
      <group dispose={null}>
        <directionalLight ref={lightRef} position={[250, 250, 250]} />
        <PerspectiveCamera
          ref={cam}
          makeDefault
          position={[250, 250, 250]}
          zoom={1}
        />
        <OrbitControls ref={controlRef} rotateSpeed={2} />
        <mesh geometry={brain.nodes.rhprecentral.geometry} position={[0, 0, 0]}>
          <meshStandardMaterial color="#ff0000" opacity={0.4} transparent />
        </mesh>
        <mesh position={[0, 10, 0]} scale={[10, 10, 10]}>
          <boxGeometry />
          <meshStandardMaterial color="#ff0000" opacity={0.4} transparent />
        </mesh>
      </group>
    </>
  );
};

const SurfaceView = () => {
  function Loader() {
    const { progress } = useProgress();
    return <Html center>{progress} % loaded</Html>;
  }

  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        setClearColor: { color: 0x212121, alpha: 1 },
      }}
    >
      <Suspense fallback={<Loader />}>
        <Brain></Brain>
      </Suspense>
    </Canvas>
  );
};

export default SurfaceView;
