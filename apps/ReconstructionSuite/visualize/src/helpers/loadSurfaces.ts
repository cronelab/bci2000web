//@ts-nocheck
import { Matrix4, Mesh, Color, MeshBasicMaterial, Scene, FrontSide, BackSide } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Import GLTFLoader
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { activeSubject, data, sceneClip, electrodeLegend } from './renderers';
export const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.1/'); // use a full url path
gltfLoader.setDRACOLoader(dracoLoader);

export let brain, electrodes, brainScene;

export const loadElectrodeScene = async (electrodeColors?) => {
  let electrodes;
  try {
    electrodes = await gltfLoader.loadAsync(`/electrodes/${activeSubject}`);

    electrodes.scene.name = 'ElectrodesMeshScene';
    let i = 1;

    // ElectrodeScene = object3d.scene;
    electrodes.scene.children.forEach((electrodeGroups) => {
      electrodeGroups.children.forEach((electrodeGroup) => {
        let cols = electrodeColors[electrodeGroup.name];
        electrodeGroup.children[0].material.color = new Color(
          cols.split(' ')[0],
          cols.split(' ')[1],
          cols.split(' ')[2]
        );
        electrodeGroup.children.forEach((actualElectrode) => {
          // console.log(cols)
          data[i] = {};
          let meshOpacity = 0.8;

          data[i].scene = new Scene();
          data[i].materialFront = new MeshBasicMaterial({
            color: new Color(cols.split(' ')[0], cols.split(' ')[1], cols.split(' ')[2]),
            side: FrontSide,
            depthWrite: false,
            opacity: 0,
            transparent: true,
            clippingPlanes: [],
          });
          //@ts-ignore
          data[i].meshFront = new Mesh(actualElectrode.geometry, data[i].materialFront);
          data[i].materialBack = new MeshBasicMaterial({
            color: new Color(cols.split(' ')[0], cols.split(' ')[1], cols.split(' ')[2]),
            side: BackSide,
            depthWrite: true,
            opacity: meshOpacity,
            transparent: true,
            clippingPlanes: [],
          });
          //@ts-ignore
          data[i].meshBack = new Mesh(actualElectrode.geometry, data[i].materialBack);
          data[i].meshFront.position.set(
            actualElectrode.position.x,
            actualElectrode.position.y,
            actualElectrode.position.z
          );
          data[i].meshBack.position.set(
            actualElectrode.position.x,
            actualElectrode.position.y,
            actualElectrode.position.z
          );
          data[i].scene.add(data[i].meshFront);
          // data[i].scene.add(data[i].meshBack);
          // data[i].scene.applyMatrix4(RASToLPS);
          sceneClip.add(data[i].scene);
          i++;
        });
      });
    });
  } catch (e) {
    console.log(e);
  }
  return {
    electrodeScene: electrodes !== undefined ? electrodes?.scene : undefined,
  };
};

export const loadBrainScene = async () => {
  let brain;
  try {
    brain = await gltfLoader.loadAsync(`/brain/${activeSubject}`);
    brain.scene.name = 'BrainMeshScene';

    brain.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.material.transparent = true;
      }
    });

    brainScene = brain.scene.children[0];
  } catch (e) {
    console.log(e);
  }

  if (brainScene != undefined) {
    return {
      brainScene: brain.scene,
    };
  } else {
    return {
      brainScene: undefined,
    };
  }
  // return {
  //   brainScene: brain.scene !== undefined ? brain.scene : undefined,

  // };
};

export const reorientateBrainScene = async (r0, worldCenter, brainScene?, electrodeScene?) => {
  const RASToLPS = new Matrix4();
  RASToLPS.set(-1, 0, 0, worldCenter.x, 0, -1, 0, worldCenter.y, 0, 0, 1, worldCenter.z, 0, 0, 0, 1);
  if (brainScene) {
    brainScene.children[0]?.applyMatrix4(RASToLPS);
    r0.scene.add(brainScene);
  }
  if (electrodeScene) {
    electrodeScene?.applyMatrix4(RASToLPS);
    r0.scene.add(electrodeScene);
  }
};
