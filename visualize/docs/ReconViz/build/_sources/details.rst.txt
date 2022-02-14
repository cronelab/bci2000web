Details
++++++++++++++++++++++++++

Mesh generator
----------------------------------

Dependencies
==================================

* Various freesurfer binaries (for converting, tessellating, etc)
* Various `Brainder <https://brainder.org>`_ scripts for mesh generation

   - Matlab/Octave
* Blender (OBJ to gLTF and scene generation)

   - Comes with a python interpreter

Output data
==============================
2 glb files, brain and electrodes with the following structures:

- Brain
   - Gyri
      - lh.bankssts
      - lh.cuneus
      - rh. superiorfrontal
      - rh. latealocciptal
      - ...
	
   - SubcorticalStructs
      - 3rd-Ventricle
      - CSF
      - Left-Vessel
      - Right-Hippocampus
      - ...
	
   - WhiteMatter
      - Left-Cerebral-White-Matter
      - Right-Cerebral-WhiteMatter


.. image:: images/brain1.png
    :width: 200
.. image:: images/brain2.png
    :width: 200

- Electrodes
   - elecA
      - elecA1
      - elecA2
   - elecB
      -elecB1
	...

.. image:: images/depth_electrodes.png
    :width: 200

Additionally the brain.mgz outputted from recon-all is converted to a nifti and named reconstruction.nii


Visualizer
------------------------------
Dependencies
=========================
+ Node v14+
+ `AMI Medical Imaging (AMI) JS ToolKit <https://github.com/FNNDSC/ami>`_

Usage
======================
After generating the meshes and starting the server, navigate to your web browser: http://localhost/?subject=fsaverage

- To disable the meshes:
   - Open the Mesh or Electrodes menu and toggle the different meshes
- The Slicer menu will slice through T1 in the main view and individual sliced views
- The Transparency menu will make the meshes opaque or transparent

.. image:: images/visualizer.png
    :width: 400