import { Scene, FrontSide, BackSide, Mesh, MeshBasicMaterial, SphereGeometry, Plane, Vector3, Raycaster } from 'three';
import { UtilsCore } from '../../node_modules/ami.js/build/ami'; // Import AMI (from TheBrainChain repo)

export const r0 = {
  domId: 'r0',
  targetID: 0,
  controls:null,
  light: null,
  camera: null, 
  renderer: null,
  scene: null,
  domElement: null
};

// 2d axial renderer
export const r1 = {
  domId: 'r1',
  sliceOrientation: 'axial',
  targetID: 1,
  controls:null,
  light: null,
  camera: null, 
  renderer: null,
  scene: null,
  stackHelper: null,
  domElement: null

};

// 2d sagittal renderer
export const r2 = {
  domId: 'r2',
  sliceOrientation: 'sagittal',
  targetID: 2,
  controls:null,
  light: null,
  camera: null, 
  renderer: null,
  scene: null,
  stackHelper: null,
  domElement: null
};

// 2d coronal renderer
export const r3 = {
  domId: 'r3',
  sliceOrientation: 'coronal',
  targetID: 3,
  controls:null,
  light: null,
  camera: null, 
  renderer: null,
  scene: null,
  stackHelper: null,
  domElement: null

};

export const sceneClip = new Scene();
export const data = [];

let electrodeMarker_geometry = new SphereGeometry(1);
let electrodeMarker_material = new MeshBasicMaterial({ color: 0x0000ff });
export let electrodeMarker = new Mesh(electrodeMarker_geometry, electrodeMarker_material);
electrodeMarker.position.set(0, 0, 0);
data[0] = {
  scene: null,
  materialFront: null,
  materialBack: null,
  meshFront: null,
  meshBack: null,
};
data[0].scene = new Scene();
data[0].materialFront = new MeshBasicMaterial({
  color: 0x00ff00,
  side: FrontSide,
  depthWrite: true,
  opacity: 0,
  transparent: true,
  clippingPlanes: [],
});
data[0].materialBack = new MeshBasicMaterial({
  color: 0x00ff00,
  side: BackSide,
  depthWrite: true,
  opacity: 1,
  transparent: true,
  clippingPlanes: [],
});
data[0].meshFront = new Mesh(electrodeMarker_geometry, data[0].materialFront);
data[0].meshBack = new Mesh(electrodeMarker_geometry, data[0].materialBack);
data[0].meshFront.position.set(0, 0, 0);
data[0].meshBack.position.set(0, 0, 0);
data[0].scene.add(data[0].meshFront);
data[0].scene.add(data[0].meshBack);
sceneClip.add(data[0].scene);

const urlParams = new URLSearchParams(window.location.search);

// Get the subject and modality of the 3D scan from the url params
export const activeSubject = urlParams.get('subject') || 'fsaverage';
export const modality = urlParams.get('modality') || 't1'; //ct

export const clipPlane1 = new Plane(new Vector3(0, 0, 0), 0);
export const clipPlane2 = new Plane(new Vector3(0, 0, 0), 0);
export const clipPlane3 = new Plane(new Vector3(0, 0, 0), 0);

export const electrodeLegend = {};

export function animate() {
  r0.controls?.update();
  r0.light?.position.copy(r0.camera?.position);
  r0.renderer?.render(r0.scene, r0.camera);

  [r1, r2, r3].forEach((r) => {
    r.controls?.update();

  })

  // r1.controls.update();
  // r2.controls.update();
  // r3.controls.update();

  r1.renderer?.clear();
  r1.renderer?.render(r1.scene, r1.camera);
  r1.renderer?.clearDepth();
  data.forEach((object) => {
    object.materialFront.clippingPlanes = [clipPlane1];
    object.materialBack.clippingPlanes = [clipPlane1];
  });
  r1.renderer?.render(sceneClip, r1.camera);
  r1.renderer?.clearDepth();

  r2.renderer?.clear();
  r2.renderer?.render(r2.scene, r2.camera);
  r2.renderer?.clearDepth();
  data.forEach((object) => {
    object.materialFront.clippingPlanes = [clipPlane2];
    object.materialBack.clippingPlanes = [clipPlane2];
  });
  r2.renderer?.render(sceneClip, r2.camera);
  r2.renderer?.clearDepth();

  r3.renderer?.clear();
  r3.renderer?.render(r3.scene, r3.camera);
  r3.renderer?.clearDepth();
  data.forEach((object) => {
    object.materialFront.clippingPlanes = [clipPlane3];
    object.materialBack.clippingPlanes = [clipPlane3];
  });
  r3.renderer?.render(sceneClip, r3.camera);
  r3.renderer?.clearDepth();
  // [r1, r2, r3].forEach((r) => {
  //   r.controls?.update();
  //   r.renderer?.clear();
  //   r.renderer?.render(r.scene, r.camera);
  //   r.renderer?.clearDepth();
  //   data.forEach((object) => {
  //     object.materialFront.clippingPlanes = [clipPlane1,clipPlane2,clipPlane3];
  //     object.materialBack.clippingPlanes = [clipPlane1,clipPlane2,clipPlane3];
  //   });
  //   r.renderer?.render(sceneClip, r.camera);
  //   r.renderer?.clearDepth();
  
  // })
  requestAnimationFrame(() => animate());
}


export function updateClipPlane(refObj, clipPlane) {
  const stackHelper = refObj.stackHelper;
  const camera = refObj.camera;
  const vertices = stackHelper.slice.geometry.vertices;
  const p1 = new Vector3(vertices[0].x, vertices[0].y, vertices[0].z).applyMatrix4(stackHelper._stack.ijk2LPS);
  const p2 = new Vector3(vertices[1].x, vertices[1].y, vertices[1].z).applyMatrix4(stackHelper._stack.ijk2LPS);
  const p3 = new Vector3(vertices[2].x, vertices[2].y, vertices[2].z).applyMatrix4(stackHelper._stack.ijk2LPS);

  clipPlane.setFromCoplanarPoints(p1, p2, p3);

  const cameraDirection = new Vector3(1, 1, 1);
  cameraDirection.applyQuaternion(camera.quaternion);

  if (cameraDirection.dot(clipPlane.normal) > 0) {
    clipPlane.negate();
  }
}
export let lastKnownClick = new Vector3();

export function onDoubleClick(event) {
  const canvas = event.target.parentElement;
  const id = event.target.id;
  const mouse = {
    x: ((event.clientX - canvas.offsetLeft) / canvas.clientWidth) * 2 - 1,
    y: -((event.clientY - canvas.offsetTop) / canvas.clientHeight) * 2 + 1,
  };
  //
  let camera = null;
  let stackHelper = null;
  let scene = null;
  switch (id) {
    case '1':
      camera = r1.camera;
      stackHelper = r1.stackHelper;
      scene = r1.scene;
      break;
    case '2':
      camera = r2.camera;
      stackHelper = r2.stackHelper;
      scene = r2.scene;
      break;
    case '3':
      camera = r3.camera;
      stackHelper = r3.stackHelper;
      scene = r3.scene;
      break;
  }

  const raycaster = new Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    let ijk = UtilsCore.worldToData(stackHelper.stack.lps2IJK, intersects[0].point);

    r1.stackHelper.index = ijk.getComponent((r1.stackHelper.orientation + 2) % 3);
    r2.stackHelper.index = ijk.getComponent((r2.stackHelper.orientation + 2) % 3);
    r3.stackHelper.index = ijk.getComponent((r3.stackHelper.orientation + 2) % 3);

    lastKnownClick = new Vector3(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
    electrodeMarker.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
    data[0].meshFront.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
    data[0].meshBack.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
    updateClipPlane(r1, clipPlane1);
    updateClipPlane(r2, clipPlane2);
    updateClipPlane(r3, clipPlane3);
  }
}

export function onScroll(event) {
  const id = event.target.domElement.id;
  let stackHelper = null;
  switch (id) {
    case 'r1':
      stackHelper = r1.stackHelper;
      break;
    case 'r2':
      stackHelper = r2.stackHelper;
      break;
    case 'r3':
      stackHelper = r3.stackHelper;
      break;
  }

  if (event.delta > 0) {
    if (stackHelper.index >= stackHelper.orientationMaxIndex - 1) {
      return false;
    }
    stackHelper.index += 1;
  } else {
    if (stackHelper.index <= 0) {
      return false;
    }
    stackHelper.index -= 1;
  }

  updateClipPlane(r1, clipPlane1);
  updateClipPlane(r2, clipPlane2);
  updateClipPlane(r3, clipPlane3);
}

window.addEventListener(
  'resize',
  () => {
    function windowResize2D(rendererObj) {
      rendererObj.camera.canvas = {
        width: rendererObj.domElement.clientWidth,
        height: rendererObj.domElement.clientHeight,
      };
      rendererObj.camera.fitBox(2, 1);
      rendererObj.renderer.setSize(rendererObj.domElement.clientWidth, rendererObj.domElement.clientHeight);

      // update info to draw borders properly
      rendererObj.stackHelper.slice.canvasWidth = rendererObj.domElement.clientWidth;
      rendererObj.stackHelper.slice.canvasHeight = rendererObj.domElement.clientHeight;
    } // update 3D
    r0.camera.aspect = r0.domElement.clientWidth / r0.domElement.clientHeight;
    r0.camera.updateProjectionMatrix();
    r0.renderer.setSize(r0.domElement.clientWidth, r0.domElement.clientHeight);

    // update 2d
    windowResize2D(r1);
    windowResize2D(r2);
    windowResize2D(r3);
  },
  false
);
