import React from 'react';
import { useEffect, useState } from 'react';
import '../App.scss';
import { Container, Row, Col, Modal, Tab, Table, Nav, ListGroup } from 'react-bootstrap/';

import {
  r0,
  r1,
  r2,
  r3,
  sceneClip,
  data,
  electrodeMarker,
  animate,
  onDoubleClick,
  onScroll,
  lastKnownClick,
  activeSubject,
} from '../helpers/renderers';
import { initHelpersStack, initRenderer3D } from '../helpers/helpers';

import { loadVolume } from '../helpers/loadVolume';

import { loadBrainScene, loadElectrodeScene, reorientateBrainScene } from '../helpers/loadSurfaces';

import { useControls, folder } from 'leva';

import setGUIS from '../helpers/sliceGUI';

import { button } from 'leva';

import { stackHelperFactory } from '../../node_modules/ami.js/build/ami.js';

import {
  Scene,
  Mesh,
  MeshBasicMaterial,
  FrontSide,
  BackSide,
  SphereGeometry,
  Matrix4,
  Vector3,
  DoubleSide,
  Cache,
} from 'three'; // Import THREE

import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'; // Import GLTFLoader

function SlicedView(): JSX.Element {
  Cache.enabled = true;

  const [valuesToSave, setValuesToSave] = useState();
  const [electrodeName, setElectrodeName] = useState('');
  const [newOpts, setNewOpts] = useState([]);
  const [electrodeColor, setElectrodeColor] = useState('');
  const [stack_, setStack_] = useState(null);
  const [show, setShow] = useState(false);
  const [electrodeSpheres, setElectrodeSpheres] = useState([]);
  const [modality_, setModality] = useState();

  let electrodeScene = new Scene();

  const urlParams = new URLSearchParams(window.location.search);
  // const StackHelper = stackHelperFactory();

  // Get the subject and modality of the 3D scan from the url params
  const modality = urlParams.get('modality') || 't1'; //ct

  let stack;
  useEffect(() => {
    (async () => {
      let p = await Promise.all([loadVolume(r0, r1, r2, r3), loadElectrodeScene(), loadBrainScene()]);
      let { stack } = p[0];
      initRenderer3D(r0, stack);
      let { electrodeScene } = p[1];
      let { brainScene } = p[2];

      const worldCenter = stack.worldCenter();

      r0.camera.lookAt(worldCenter.x, worldCenter.y, worldCenter.z);
      r0.camera.updateProjectionMatrix();
      r0.controls.target.set(worldCenter.x, worldCenter.y, worldCenter.z);

      r0.scene.add(electrodeMarker);
      reorientateBrainScene(r0, worldCenter, brainScene, electrodeScene);
      animate();

      const StackHelper = stackHelperFactory();

      const worldbb = stack.worldBoundingBox();
      const lpsDims = new Vector3(
        (worldbb[1] - worldbb[0]) / 2,
        (worldbb[3] - worldbb[2]) / 2,
        (worldbb[5] - worldbb[4]) / 2
      );

      [r1, r2, r3].forEach((r) => {
        let stackHelper = new StackHelper(stack);
        initHelpersStack(r, stack, lpsDims, stackHelper);
        r0.scene.add(r.scene);
        r.domElement.addEventListener('dblclick', onDoubleClick);
        r.controls.addEventListener('OnScroll', onScroll);
      });

      setStack_(stack);
    })();
  }, []);

  let handleKeyDown = async (e) => {
    if (e.key == 'n') {
      let newElecName = prompt('Name of electrode', 'LA');
      setElectrodeName(newElecName);
      let eleCol = prompt('Color?', 'green');
      setElectrodeColor(eleCol);
      setNewOpts((opts) => ({
        ...opts,
        [newElecName]: folder(
          {
            color: {
              value: eleCol,
              onChange: (col) => console.log(col),
            },
          },
          { color: eleCol }
        ),
      }));
    }
    if (e.key == 'a') {
      const LPStoRAS = new Matrix4();
      const worldCenter = stack_.worldCenter();
      LPStoRAS.set(-1, 0, 0, worldCenter.x, 0, -1, 0, worldCenter.y, 0, 0, 1, worldCenter.z, 0, 0, 0, 1).invert();
      let VOX = new Vector3(lastKnownClick.x, lastKnownClick.y, lastKnownClick.z).applyMatrix4(stack_._lps2IJK);

      let req_anatomicalLocation = await fetch(`locationInfo/${activeSubject}?location=${JSON.stringify(VOX)}`);
      let anatomicalLocation = await req_anatomicalLocation.json();
      alert(anatomicalLocation);
    }
    if (e.key == 'Enter') {
      // console.log(stack_);

      // let tkRAS = new Vector3(lastKnownClick.x, lastKnownClick.y, lastKnownClick.z).applyMatrix4(LPStoRAS);
      const LPStoRAS = new Matrix4();
      const worldCenter = stack_.worldCenter();
      LPStoRAS.set(-1, 0, 0, worldCenter.x, 0, -1, 0, worldCenter.y, 0, 0, 1, worldCenter.z, 0, 0, 0, 1).invert();
      let VOX = new Vector3(lastKnownClick.x, lastKnownClick.y, lastKnownClick.z).applyMatrix4(stack_._lps2IJK);
      let tkrRAS = new Vector3(VOX.x, VOX.y, VOX.z).applyMatrix4(stack_._ijk2LPS).applyMatrix4(LPStoRAS);

      let req_anatomicalLocation = await fetch(`locationInfo/${activeSubject}?location=${JSON.stringify(VOX)}`);
      let anatomicalLocation = await req_anatomicalLocation.json();

      let sphere_r0 = new Mesh(new SphereGeometry(1.1), new MeshBasicMaterial({ color: electrodeColor }));
      sphere_r0.position.set(lastKnownClick.x, lastKnownClick.y, lastKnownClick.z);

      r0.scene.add(sphere_r0);

      let i = data.length + 1;
      data[i] = {};
      data[i].scene = new Scene();
      data[i].materialFront = new MeshBasicMaterial({
        color: electrodeColor,
        side: FrontSide,
        depthWrite: true,
        opacity: 0,
        transparent: true,
        clippingPlanes: [],
      });
      data[i].materialBack = new MeshBasicMaterial({
        color: electrodeColor,
        side: BackSide,
        depthWrite: true,
        opacity: 1,
        transparent: true,
        clippingPlanes: [],
      });
      let geometry_r1 = new SphereGeometry(1.1);
      data[i].meshFront = new Mesh(geometry_r1, data[i].materialFront);
      data[i].meshBack = new Mesh(geometry_r1, data[i].materialBack);
      data[i].meshFront.position.set(lastKnownClick.x, lastKnownClick.y, lastKnownClick.z);
      data[i].meshBack.position.set(lastKnownClick.x, lastKnownClick.y, lastKnownClick.z);
      data[i].scene.add(data[i].meshFront);
      data[i].scene.add(data[i].meshBack);
      sceneClip.add(data[i].scene);
      let coordinate: [number, number, number] = [
        -lastKnownClick.x.toFixed(2),
        -lastKnownClick.y.toFixed(2),
        //@ts-ignore
        lastKnownClick.z.toFixed(2),
      ];
      let currentElectrode = `${electrodeName}'${Object.keys(newOpts[electrodeName].schema).length}`;

      let glbScene = new Scene();
      let glbDataGeometry = new SphereGeometry(1.1);
      let glbDataMesh = new Mesh(
        glbDataGeometry,
        new MeshBasicMaterial({
          color: electrodeColor,
          side: BackSide,
          depthWrite: true,
          opacity: 1,
          transparent: true,
          clippingPlanes: [],
        })
      );
      // glbDataMesh.name = currentElectrode;
      glbDataMesh.position.set(...coordinate);
      glbScene.add(glbDataMesh);
      console.log(glbScene);
      setElectrodeSpheres((cur) => [...cur, glbScene]);

      setValuesToSave((vals) => ({
        //@ts-ignore
        ...vals,
        [currentElectrode]: {
          RAS: [...coordinate],
          VOX: [VOX.x.toFixed(2), VOX.y.toFixed(2), VOX.z.toFixed(2)],
          tkrRAS: [tkrRAS.x.toFixed(2), tkrRAS.y.toFixed(2), tkrRAS.z.toFixed(2)],
          location: anatomicalLocation,
        },
      }));

      setNewOpts((opts) => ({
        ...opts,
        [electrodeName]: folder(
          {
            ...opts[electrodeName].schema,
            [currentElectrode]: anatomicalLocation,
          },
          { color: electrodeColor }
        ),
      }));
    }
    if (e.key == 's') {
      electrodeSpheres.forEach((sphere) => {
        electrodeScene.add(sphere);
      });

      let sender = await fetch(`/saveElectrodes/${activeSubject}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(valuesToSave),
      });
      const exporter = new GLTFExporter();
      exporter.parse(
        electrodeScene,
        function (result) {
          const link = document.createElement('a');
          link.style.display = 'none';
          document.body.appendChild(link);
          //@ts-ignore
          link.href = URL.createObjectURL(new Blob([result], { type: 'application/octet-stream' }));
          link.download = 'electrodes.glb';
          link.click();
        },
        { binary: true }
      );
      let answer = await sender.json();
      alert(answer);
    }
    if (e.key == 'm') {
      setShow(true);
    }
    if (e.key == 'c') {
      let elecToChange = prompt('Which electrode name would you like to change?');
      let elecToChangeTo = prompt('Change it to what?');
      let tempOpts = newOpts;
      Object.keys(tempOpts[elecToChange].schema).forEach((elec, index) => {
        tempOpts[elecToChange].schema[`${elecToChangeTo}'${index + 1}`] =
          tempOpts[elecToChange].schema[`${elecToChange}'${index + 1}`];
        delete tempOpts[elecToChange].schema[`${elecToChange}'${index + 1}`];
      });
      tempOpts[elecToChangeTo] = tempOpts[elecToChange];
      delete tempOpts[elecToChange];
      setNewOpts(tempOpts);
      setElectrodeName(elecToChangeTo);
    }
  };
  const handleClose = () => setShow(false);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [stack_, newOpts]);
  console.log(newOpts);

  setGUIS(newOpts, electrodeName);

  // document.onkeypress = (e) => {
  // if (e.key == 'e') {
  //   let editableElectrode = prompt('Which electrode would you like to edit?', "name'num");
  //   let group = editableElectrode.split("'")[0];
  //   let num = editableElectrode.split("'")[1];
  //   let tempOpts = newOpts;
  //   delete tempOpts[group].schema.editableElectrode;
  //   console.log(tempOpts);
  //   setNewOpts(tempOpts);
  // }
  // };

  const ModalToggle = () => {
    if (urlParams.get('modality') == 'CT') {
      return (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Electrode localization</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="first">Instructions</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second">Modify</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col>
                  <Tab.Content>
                    <Tab.Pane eventKey="first">
                      <ListGroup>
                        <ListGroup.Item>s: Save</ListGroup.Item>
                        <ListGroup.Item>m: Show modal</ListGroup.Item>
                        <ListGroup.Item>n: New electrode group</ListGroup.Item>
                        <ListGroup.Item>e: Add electrode to current group</ListGroup.Item>
                        <ListGroup.Item>d: Delete electrode from current group</ListGroup.Item>
                        <ListGroup.Item>a: Get anatomical location</ListGroup.Item>
                      </ListGroup>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>@twitter</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Modal.Body>
        </Modal>
      );
    } else if (urlParams.get('modality') == 'T1') {
      return (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Clinical viewer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListGroup>
              {/* <ListGroup.Item>s: Save</ListGroup.Item>
          <ListGroup.Item>m: Show modal</ListGroup.Item>
          <ListGroup.Item>n: New electrode group</ListGroup.Item>
          <ListGroup.Item>e: Add electrode to current group</ListGroup.Item>
          <ListGroup.Item>d: Delete electrode from current group</ListGroup.Item>
          <ListGroup.Item>a: Get anatomical location</ListGroup.Item> */}
            </ListGroup>
          </Modal.Body>
        </Modal>
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      <Container fluid style={{ height: '100%', width: '100%', padding: '0' }}>
        <div id="my-gui-container"></div>
        <Row style={{ height: '50%' }}>
          <Col id="r0" className="renderer"></Col>
          <Col id="r1" className="renderer"></Col>
        </Row>
        <Row style={{ height: '50%' }}>
          <Col id="r2" className="renderer"></Col>
          <Col id="r3" className="renderer"></Col>
        </Row>
      </Container>
      <ModalToggle></ModalToggle>
    </>
  );
}

export default SlicedView;
