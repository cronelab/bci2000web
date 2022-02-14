import { Color, Material, MeshStandardMaterial, Object3D } from 'three';

const modifySize = (electrodeObject: Object3D, size: number): void => {
  electrodeObject.scale.set(size, size, size);
};
const modifyColor = (electrodeObject: Material, color: number): void => {
  // const clone = electrodeObject.clone();
  const newMaterial = new MeshStandardMaterial({ color: new Color(color) });
  // newM
  // clone.color = new Color(color);
  electrodeObject = newMaterial;
  // electrodeObject.name = `${electrodeObject.name}_color`;
};

// const modifyElec = (size, color) =>{

// }

// const modifyElec = (size) =>{

// }

// const modifyElec = (color) =>{

// }

// fetch(`/anatomy/${props.activeSubject}`)
//   .then((response) => response.json())
//   .then((text) => {
//     let data = text.map((element) => {
//       return {
//         name: element[0],
//         location: element[4],
//       };
//     });
//     setLabels(data);
//   });

export { modifySize, modifyColor };
