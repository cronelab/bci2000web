# ReconstructionSuite
![Github Actions](https://github.com/cronelab/ReconstructionSuite/workflows/Node.js%20CI/badge.svg?branch=master)

A web-based processing and visualization platform for placing and visualizing intracranial electrodes in subject-specific brain space. 


### Visualize Freesurfer cortical parcellations and subcortical segmentations in the browser

Input: Subject directory with a directory for MR and CT nifti files
Output: 
- Freesurfer-processed subject directory
- 3D mesh files containing brain regions and electrodes
- BIDS-compliant electrode coordinates
- Webserver to view and localize electrodes

### To run:

- docker-compose up --build
- docker exec -it -e SUBJECT=$SUBJECT preprocessor python3 scripts/1_reconstruction.py
- docker exec -it -e SUBJECT=$SUBJECT mesh_generator bash 1_prep.sh
- docker exec -it -e SUBJECT=$SUBJECT mesh_generator bash 2_brainGenerator.sh
- docker exec -it -e SUBJECT=$SUBJECT preprocessor python3 scripts/2_coregistration.py
- docker exec -it mesh_visualizer npm run start
- docker exec -it -e SUBJECT=$SUBJECT mesh_generator bash 3_electrodeGenerator.sh

### Example:

![Example](./docs/_static/Picture.jpg)
The gLTF binary file format allows for optimized viewing directly in browsers and VR/AR devices.

### Dependencies:

- Freesurfer
- Various [Brainder](https://brainder.org/) scripts for mesh generation
    - Matlab/Octave
- Blender (Freesurfer OBJ to FBX/gLTF)
    - Comes with a python interpreter
- [acpcdetect](https://www.nitrc.org/projects/art) for automatic ac-pc detection


### Instructions:

- In the docker-compose.yml file edit the volumes field:
    - path to $SUBJECTS_DIR

### electrodes.tsv:
| name              | x         | y       | z       |size|
| ----------------- | --------- | ------- | ------- |----|
| electrodeGroupA'1 | 4.52036   | 61.73   | 66.4995 |  1 |
| electrodeGroupA'2 | 1.85841   | 63.8435 | 66.9489 |  1 |
| electrodeGroupA'3 | -2.14716  | 65.0158 | 67.3797 |  1 |
| electrodeGroupB'1 | -5.17384  | 65.0651 | 68.1047 |  1 |

### reconstruction.glb:
- Brain
    - Gyri
        - all of the left and right hemisphere aparc regions
    - SubcorticalStructs
        - all of the aseg rois
    - WhiteMatter
        - Left-Cerebral-White-Matter
        - Right-Cerebral-White-Matter
- Electrodes
    - electrodeGroupA
        - electrodeGroupA1

Citing
------

+ Preprocessing
    - https://brainder.org/2012/05/08/importing-freesurfer-subcortical-structures-into-blender/
    - https://brainder.org/research/brain-for-blender/

+ Visualization
    - https://github.com/FNNDSC/ami


Version 2.0 viewer
+ Written with react/react-three-fiber/drei



