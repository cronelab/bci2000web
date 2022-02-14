import React from 'react';
import { useEffect } from 'react';
import '../App.scss';
import {Container, Row, Col} from 'react-bootstrap';

import { r0, r1, r2, r3, activeSubject } from '../helpers/renderers';
import { initRenderer3D } from '../helpers/helpers';

import { loadVolume } from '../helpers/loadVolume';

import { loadElectrodeScene, reorientateBrainScene } from '../helpers/loadSurfaces';

import * as dat from '../../node_modules/dat.gui/build/dat.gui';

import { VolumeRenderingHelper, LutHelper } from '../../node_modules/ami.js/build/ami';

import { TextGeometry, MeshPhongMaterial, Mesh, FontLoader, Cache, Vector3 } from 'three';
import font from 'three/examples/fonts/helvetiker_regular.typeface.json';


function VolumetricRender(): JSX.Element {
  // setGUIS();
  Cache.enabled = true;

  const myStack = {
    lut: 'default',
    opacity: 'random',
    steps: 256,
    alphaCorrection: 0.5,
    interpolation: 1,
  };

  let vrHelper;
  let lut;
  let textMeshes;
  let numberMeshes = []

  const listeners = () => {
    r0.domElement.addEventListener(
      'mousedown',
      () => {
        if (vrHelper && vrHelper.uniforms) {
          vrHelper.uniforms.uSteps.value = Math.floor(myStack.steps / 2);
          vrHelper.interpolation = 0;
        }
      },
      false
    );
    r0.domElement.addEventListener(
      'mouseup',
      () => {
        if (vrHelper && vrHelper.uniforms) {
          vrHelper.uniforms.uSteps.value = myStack.steps;
          vrHelper.interpolation = myStack.interpolation;
        }
      },
      false
    );
  };


  const animate = () => {
    r0.controls.update();
    r0.light.position.copy(r0.camera.position);
    r0.renderer.render(r0.scene, r0.camera);
    textMeshes.forEach((text) => {
      text.lookAt(r0.camera.position);
      text.quaternion.copy(r0.camera.quaternion);
    });
    if(numberMeshes != undefined){

      numberMeshes?.forEach((text) => {
        text.lookAt(r0.camera.position);
        text.quaternion.copy(r0.camera.quaternion);
      });
    }
    requestAnimationFrame(() => animate());
  };

  useEffect(() => {
    (async () => {
      let specificImage = 'cerebellumRemoved';
      let { stack } = await loadVolume(r0, r1, r2, r3, specificImage);
      let colorReq = await fetch(`electrodeColors/${activeSubject}`);
      let colors = await colorReq.json();
      stack.prepare();
      initRenderer3D(r0, stack);
      vrHelper = new VolumeRenderingHelper(stack);

      r0.scene.add(vrHelper);
      
      const worldCenter = stack.worldCenter();
      r0.camera.lookAt(worldCenter.x, worldCenter.y, worldCenter.z);
      r0.camera.updateProjectionMatrix();
      r0.controls.target.set(worldCenter.x, worldCenter.y, worldCenter.z);

      // let { brainScene, electrodeScene } = await loadBrainSurface(r0, worldCenter);
      let { electrodeScene } = await loadElectrodeScene(colors);
      reorientateBrainScene(r0, worldCenter, null, electrodeScene);
      let loader = new FontLoader();
      let fl = loader.parse(font);

      textMeshes = electrodeScene.children[0].children.map((group) => {
        let nums=[];
        group.children.forEach((elec, index) => {
          if (index == 0 || index == group.children.length-1) {
            let numberText = new TextGeometry(`${index+1}`, {
              font: fl,
              size: 2,
              height: 1,
              curveSegments: 12,
              bevelThickness: 10,
              bevelSize: 8,
              bevelOffset: 0,
              bevelSegments: 5,
            });
            numberText.computeBoundingBox();
            let materials = [
              new MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
              new MeshPhongMaterial({ color: 0xffffff }), // side
            ];
            let tempVec = new Vector3();

            elec.getWorldPosition(tempVec);
            let numberText1 = new Mesh(numberText, materials);
            numberText1.position.x = tempVec.x+1;
            numberText1.position.y = tempVec.y+1;
            numberText1.position.z = tempVec.z+1;
            numberText1.lookAt(r0.camera.position);
            r0.scene.add(numberText1);
            numberMeshes.push(numberText1)
          }
          nums.push(parseInt(elec.name.split(/([0-9]+)/)[1]));
        });
        var indexOfMaxValue = nums.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0);
        let textGeo = new TextGeometry(group.name, {
          font: fl,
          size: 2,
          height: 1,
          curveSegments: 12,
          bevelThickness: 10,
          bevelSize: 8,
          bevelOffset: 0,
          bevelSegments: 5,
        });

        textGeo.computeBoundingBox();
        let materials = [
          new MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
          new MeshPhongMaterial({ color: 0xffffff }), // side
        ];
        let tempVec = new Vector3();

        group.children[indexOfMaxValue].getWorldPosition(tempVec);
        let textMesh1 = new Mesh(textGeo, materials);
        textMesh1.position.x = tempVec.x;
        textMesh1.position.y = tempVec.y;
        textMesh1.position.z = tempVec.z;
        textMesh1.lookAt(r0.camera.position);
        r0.scene.add(textMesh1);
        return textMesh1;
      });


      animate();

      buildGUI();
      listeners();
    })();
  }, []);

  function buildGUI() {
    lut = new LutHelper('r0');
    lut.luts = LutHelper.presetLuts();
    lut.lutsO = LutHelper.presetLutsO();
    vrHelper.uniforms.uTextureLUT.value = lut.texture;
    vrHelper.uniforms.uLut.value = 1;
    lut.lut = 'default';
    vrHelper.uniforms.uTextureLUT.value.dispose();
    vrHelper.uniforms.uTextureLUT.value = lut.texture;

    const gui = new dat.GUI({
      autoPlace: false,
    });

    const customContainer = document.getElementById('my-gui-container');
    customContainer.appendChild(gui.domElement);

    const camUtils = {
      invertRows: false,
      invertColumns: false,
      orientation: 'default',
    };
  
    // camera
    const cameraFolder = gui.addFolder('Camera');
    const invertRows = cameraFolder.add(camUtils, 'invertRows');
    invertRows.onChange(() => {
      r0.camera.invertRows();
    });

    
  const invertColumns = cameraFolder.add(camUtils, 'invertColumns');
  invertColumns.onChange(() => {
    r0.camera.invertColumns();
  });


  const orientationUpdate = cameraFolder.add(camUtils, 'orientation', [
    'default',
    'axial',
    'coronal',
    'sagittal',
  ]);
  orientationUpdate.onChange(value => {
    r0.camera.orientation = value;
    r0.camera.update();
    r0.camera.fitBox(2,.6);
    
    // stackHelper.orientation = r0.camera.stackOrientation;
  });

  cameraFolder.open();
    const stackFolder = gui.addFolder('Settings');
    // const lutUpdate = stackFolder.add(myStack, 'lut', lut.lutsAvailable());
    // lutUpdate.onChange(function (value) {
    // lut.lut = value;
    // vrHelper.uniforms.uTextureLUT.value.dispose();
    // vrHelper.uniforms.uTextureLUT.value = lut.texture;
    // });
    // init LUT

    const opacityUpdate = stackFolder.add(myStack, 'opacity', lut.lutsAvailable('opacity'));
    opacityUpdate.onChange((value) => {
      lut.lutO = value;
      vrHelper.uniforms.uTextureLUT.value.dispose();
      vrHelper.uniforms.uTextureLUT.value = lut.texture;
    });

    const stepsUpdate = stackFolder.add(myStack, 'steps', 0, 512).step(1);
    stepsUpdate.onChange((value) => {
      if (vrHelper.uniforms) {
        vrHelper.uniforms.uSteps.value = value;
      }
    });

    const alphaCorrrectionUpdate = stackFolder.add(myStack, 'alphaCorrection', 0, 1).step(0.01);
    alphaCorrrectionUpdate.onChange((value) => {
      if (vrHelper.uniforms) {
        vrHelper.uniforms.uAlphaCorrection.value = value;
      }
    });

    stackFolder.add(vrHelper, 'interpolation', 0, 1).step(0.1);

    stackFolder.open();
  }

  return (
    <>
      <Container fluid style={{ height: '100%', width: '100%', padding: '0' }}>
        <div id="my-gui-container"></div>
        <div id="my-tf"></div>
        <Row style={{ height: '100%' }}>
          <Col id="r0" className="renderer"></Col>
        </Row>
      </Container>
    </>
  );
}

export default VolumetricRender;
