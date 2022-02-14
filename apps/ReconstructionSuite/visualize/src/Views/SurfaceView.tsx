//@ts-nocheck
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { OrthographicCamera, OrbitControls, Html, useProgress } from '@react-three/drei';
import { modifySize, modifyColor } from './notyet/modifyElectrodes';
import { useLoader, useFrame, Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Mesh, Color, Scene } from 'three';
import { useControls } from 'leva';

const Electrodes = (props) => {
  const urlParams = new URLSearchParams(window.location.search);
  const activeSubject = urlParams.get('subject') || 'fsaverage';

  const { disableElectrode } = useControls('Electrode view', {
    disableElectrode: false,
  });

  let electrodes
  try {
    electrodes = useLoader(GLTFLoader, `/electrodes/${activeSubject}`, null, (e) => console.log(e)) || null;
    const elecInfoRef = useRef();
    const electrodeRef = useRef<Mesh>(null);
  
    // const { Electrodes } = electrodes.nodes; // * Destructure nodes
  
  } catch (e) {
    console.log(e);
  }

  const ElectrodeRenderer = () => {
    if(electrodes != undefined){
      return(
        <primitive
        ref={electrodeRef}
        object={electrodes.nodes}
        activeSubject={activeSubject}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        position={[0, 0, 0]}
        // onPointerOver={(e) => {
        //   e.stopPropagation();
        //   e.object.scale.set(3, 3, 3);
        //   let location = labels?.filter((label) => {
        //     let withoutApost = label.name.split("'");
        //     if (withoutApost[0] + withoutApost[1] === e.object.name) {
        //       return label;
        //     } else {
        //       return null;
        //     }
        //   });
        //   elecInfoRef.current.innerText = `${e.object.name}`;
        //   if (location.length > 0) {
        //     elecInfoRef.current.innerText = `${e.object.name}: ${location[0].location}`;
        //   }
        // }}
        // onPointerOut={(e) => {
        //   elecInfoRef.current.innerText = `Hover over another electrode`;

        //   e.object.scale.set(1, 1, 1);
        // }}
      ></primitive>
      )
    }
    else{
      return(<></>)
    }
  }

  return (
    <>
<ElectrodeRenderer></ElectrodeRenderer>
    </>
  );
};

const Brain = (props) => {
  const urlParams = new URLSearchParams(window.location.search);

  let first = true;

  const subCortRef = useRef<Mesh>(null);
  const gyriRef = useRef<Mesh>(null);
  const wmRef = useRef<Mesh>(null);
  const cam = useRef();
  const lightRef = useRef<Mesh>(null);
  const brainRef = useRef();
  const controlRef = useRef<Mesh>(null);
  const structureNameRef = useRef<HTMLElement>(null);
  const activeSubject = urlParams.get('subject') || 'fsaverage';

  // //* Import files
  const brain = useLoader(GLTFLoader, `/brain/${activeSubject}`);

  const { Gyri, SubcorticalStructs, WhiteMatter } = brain.nodes;

  // //* Set states
  const [labels, setLabels] = useState([]);
  const [allowHover, setAllowHover] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  // const [selectedStructure, setSelectedStructure] = useState('Click a structure to display name');
  const [elecState, setElecState] = useState('Hover over an electrode to view location');
  const [initialGyriColorsDeclared, setInitialGyriColorsDeclared] = useState([]);
  const [initialSubcortColorsDeclared, setInitialSubcortColorsDeclared] = useState([]);

  const { subcortTransparency, gyriTransparency, wmTransparency } = useControls('Transparency', {
    subcortTransparency: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.1,
    },
    gyriTransparency: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.1,
    },
    wmTransparency: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.1,
    },
  });
  const { gyriGrayScale, subcortGrayScale } = useControls('Grayscale', {
    gyriGrayScale: false,
    subcortGrayScale: false,
  });

  // * Gyri grayscale
  useEffect(() => {
    if (initialGyriColorsDeclared.length <= 0) {
      //@ts-ignore
      let _initialGyriColorsDeclared = gyriRef.current.children.map((mat) => mat.material.color);
      setInitialGyriColorsDeclared(_initialGyriColorsDeclared);
    } else {
      if (gyriGrayScale === true)
        gyriRef.current.children.map((mat) => {
          //@ts-ignore
          mat.material.color = new Color('rgb(255,255,255)');
          //@ts-ignore
          mat.material.opacity = 1;
        });
      else if (gyriGrayScale === false) {
        gyriRef.current.children.map((mat, i) => {
          //@ts-ignore
          mat.material.color = initialGyriColorsDeclared[i];
          //@ts-ignore
          mat.material.opacity = gyriTransparency;
        });
      }
    }
  }, [gyriGrayScale]);

  //Subcortical grayscale
  useEffect(() => {
    if (initialSubcortColorsDeclared.length <= 0) {
      let _initialSubcortColorsDeclared = subCortRef.current.children.map((mat) => {
        if (mat instanceof Mesh) {
          return mat.material.color;
        } else {
          return null;
        }
      });
      setInitialSubcortColorsDeclared(_initialSubcortColorsDeclared);
    } else {
      if (subcortGrayScale === true)
        subCortRef.current.children.map((mat) => {
          if (mat instanceof Mesh) {
            mat.material.color = new Color('rgb(50,50,50)');
            //@ts-ignore
            mat.materialopacity = 1;
          }
        });
      else if (subcortGrayScale === false) {
        subCortRef.current.children.map((mat, i) => {
          if (mat instanceof Mesh) {
            mat.material.color = initialSubcortColorsDeclared[i];
            //@ts-ignore
            mat.materialopacity = subcortTransparency;
          }
        });
      }
    }
  }, [subcortGrayScale]);

  //Current electrode
  let elecDescriptor = useControls('currentElectrode', {
    elecDescriptor: '',
    // component: () => <div ref={elecInfoRef}>{elecState}</div>,
  });

  //Current structure
  let { selectedStructure } = useControls('selectedStructure', {
    selectedStructure: '',
    // component: () => <div ref={structureNameRef}>{selectedStructure}</div>,
  });

  // useEffect(() => {
  //   electrodeRef.current.children.forEach((child) => {
  //     child.traverse((electrode) => {
  //       electrode.visible = !disableElectrode;
  //     });
  //   });
  // }, [disableElectrode]);

  // useEffect(() => {
  //   electrodeRef.current.children.forEach((child) => {
  //     child.traverse((electrode) => {
  //       modifySize(electrode,1);
  //       electrode.visible = !disableElectrode;
  //     });
  //   });
  // }, [disableElectrode]);

  useEffect(() => {
    subCortRef.current?.traverse((child) => {
      if (child instanceof Mesh) {
        child.material.transparent = true;
        child.material.opacity = subcortTransparency;
      }
    });
    if (subcortTransparency === 0) {
      subCortRef.current.visible = false;
    } else {
      subCortRef.current.visible = true;
    }
  }, [subcortTransparency]);

  useEffect(() => {
    wmRef.current.traverse((child) => {
      if (child instanceof Mesh) {
        child.material.transparent = true;
        child.material.opacity = wmTransparency;
      }
    });
    if (wmTransparency === 0) {
      wmRef.current.visible = false;
    } else {
      wmRef.current.visible = true;
    }
  }, [wmTransparency]);

  useEffect(() => {
    gyriRef.current.traverse((child) => {
      if (child instanceof Mesh) {
        child.material.transparent = true;
        child.material.opacity = gyriTransparency;
      }
    });
    if (gyriTransparency === 0) {
      gyriRef.current.visible = false;
    } else {
      gyriRef.current.visible = true;
    }
  }, [gyriTransparency]);

  useFrame(({ camera, scene }) => {
    lightRef.current.position.copy(camera.position);
    //    console.log(electrodeRef)
  });
  //renderOrder
  useEffect(() => {
    if (controlRef.current && first === true) {
      first = false;
      controlRef.current.addEventListener('end', (e) => setAllowHover(true));
      controlRef.current.addEventListener('start', (e) => setAllowHover(false));
    }
  }, [controlRef.current || first]);
  return (
    <>
      <group dispose={null}>
        <directionalLight ref={lightRef} position={[0, 0, -400]} />
        <OrthographicCamera ref={cam} makeDefault position={[0, 0, -400]} zoom={1} />
        <OrbitControls ref={controlRef} rotateSpeed={2} target0={brainRef} />
        {/* Gyri */}
        <primitive
          onClick={(e) => {
            e.stopPropagation();
            e.object.scale.set(1.5, 1.5, 1.5);
            structureNameRef.current.innerText = `Selected structure: ${e.object.name}`;
            setTimeout(() => {
              structureNameRef.current.innerText = `Select a structure`;
              e.object.scale.set(1, 1, 1);
            }, 1000);
          }}
          ref={gyriRef}
          activeSubject={activeSubject}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          position={[0, 0, 0]}
          object={Gyri}
        ></primitive>
        {/* Subcortical structures */}
        <primitive
          onClick={(e) => {
            e.stopPropagation();
            e.object.scale.set(1.5, 1.5, 1.5);
            structureNameRef.current.innerText = `Selected structure: ${e.object.name}`;
            setTimeout(() => {
              structureNameRef.current.innerText = `Select a structure`;
              e.object.scale.set(1, 1, 1);
            }, 1000);
          }}
          ref={subCortRef}
          activeSubject={activeSubject}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          position={[0, 0, 0]}
          object={SubcorticalStructs}
        ></primitive>
        {/* White Matter */}

        <primitive
          ref={wmRef}
          activeSubject={activeSubject}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          position={[0, 0, 0]}
          object={WhiteMatter}
        ></primitive>
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
    <Canvas style={{ backgroundColor: 'gray' }}>
      <Suspense fallback={<Loader />}>
        <Brain></Brain>
        <Electrodes></Electrodes>
      </Suspense>
    </Canvas>
  );
};

export default SurfaceView;
