import { r0,r1, r2, r3 } from './renderers';
import { Mesh } from 'three';
import { useControls, folder } from 'leva';
import { brainScene } from './loadSurfaces';
import { modality } from './renderers';

// let brainScene;
export const setGUIS = async (newOpts, electrodeName) => {

  // if(modality == "T1"){
  // }
  // else if(modality == "CT"){
    useControls('Electrodes', newOpts, [newOpts, electrodeName]);
    console.log(brainScene)
    // }


  // @ts-ignore
  const [, si] = useControls('Slice index', {
    redIndex: {
      value: r1.stackHelper?.index || 0,
      min: 0,
      max: r1.stackHelper?.orientationMaxIndex || 255,
      step: 1,
      //@ts-ignore
      onChange: (val) => {
        if(r1.stackHelper) r1.stackHelper.index = val
      },
    },
    yellowIndex: {
      value: r2.stackHelper?.index || 0,
      min: 0,
      max: r2.stackHelper?.orientationMaxIndex || 255,
      step: 1,
      //@ts-ignore
      onChange: (val) => {
        if(r2.stackHelper) r2.stackHelper.index = val
      }
    },
    greenIndex: {
      value: r3.stackHelper?.index || 0,
      min: 0,
      max: r3.stackHelper?.orientationMaxIndex || 255,
      step: 1,
      //@ts-ignore
      onChange: (val) => {
        if(r3.stackHelper) r3.stackHelper.index = val
      },
    },
  });
  // @ts-ignore
  const [, trans] = useControls('Transparency', {
    Gyri: {
      value: 0.5,
      min: 0,
      max: 1,
      onChange: (val) => {
        brainScene?.children.forEach((child) => {
          if (child.name == 'Gyri') {
            if(val == 0){
              child.visible = false
            } else{
              child.visible = true;
            }
            child.traverse((c) => {
              if (c instanceof Mesh) {
                c.material.opacity = val;
              }
            });
          }
        });
      },
    },
    WhiteMatter: {
      value: 0.5,
      min: 0,
      max: 1,
      onChange: (val) => {
        brainScene?.children.forEach((child) => {
          if (child.name == 'WhiteMatter') {
            if(val == 0){
              child.visible = false
            } else{
              child.visible = true;
            }

            child.traverse((c) => {
              if (c instanceof Mesh) {
                c.material.opacity = val;
              }
            });
          }
        });
      },
    },
    subcorticalStructures: {
      value: 0.5,
      min: 0,
      max: 1,
      onChange: (val) => {
        brainScene?.children.forEach((child) => {
          if (child.name == 'SubcorticalStructs') {
            if(val == 0){
              child.visible = false
            } else{
              child.visible = true;
            }

            child.traverse((c) => {
              if (c instanceof Mesh) {
                c.material.opacity = val;
              }
            });
          }
        });
      },
    },
    All:{
      value: 0.5,
      min: 0,
      max: 1,
      onChange: (val) => {
        brainScene?.children.forEach((child) => {
            if(val == 0){
              child.visible = false
            } else{
              child.visible = true;
            }

            child.traverse((c) => {
              if (c instanceof Mesh) {
                c.material.opacity = val;
              }
            });
        });
      },
    }
  });

  // @ts-ignore
  const [, trans2] = useControls('Transparency', {
    Gyri: {
      value: 0.5,
      min: 0,
      max: 1,
      onChange: (val) => {
        brainScene?.children.forEach((child) => {
          if (child.name == 'Gyri') {
            if(val == 0){
              child.visible = false
            } else{
              child.visible = true;
            }
            child.traverse((c) => {
              if (c instanceof Mesh) {
                c.material.opacity = val;
              }
            });
          }
        });
      },
    },
    WhiteMatter: {
      value: 0.5,
      min: 0,
      max: 1,
      onChange: (val) => {
        brainScene?.children.forEach((child) => {
          if (child.name == 'WhiteMatter') {
            if(val == 0){
              child.visible = false
            } else{
              child.visible = true;
            }

            child.traverse((c) => {
              if (c instanceof Mesh) {
                c.material.opacity = val;
              }
            });
          }
        });
      },
    },
    subcorticalStructures: {
      value: 0.5,
      min: 0,
      max: 1,
      onChange: (val) => {
        brainScene?.children.forEach((child) => {
          if (child.name == 'SubcorticalStructs') {
            if(val == 0){
              child.visible = false
            } else{
              child.visible = true;
            }

            child.traverse((c) => {
              if (c instanceof Mesh) {
                c.material.opacity = val;
              }
            });
          }
        });
      },
    },
    All:{
      value: 0.5,
      min: 0,
      max: 1,
      onChange: (val) => {
        brainScene?.children.forEach((child) => {
            if(val == 0){
              child.visible = false
            } else{
              child.visible = true;
            }

            child.traverse((c) => {
              if (c instanceof Mesh) {
                c.material.opacity = val;
              }
            });
        });
      },
    }
  });

};

export default setGUIS;
