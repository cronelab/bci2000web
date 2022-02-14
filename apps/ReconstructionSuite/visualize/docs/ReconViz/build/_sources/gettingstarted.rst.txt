   .. _gettingstarted:
   
Getting Started
====================================================


This project is split between two modules:
   - :ref:`meshgen`
   - :ref:`viz`



   .. _meshgen:

Mesh generation
----------------------------------------------
- Ensure that Docker is installed and a successful recon-all has been performed on the subject of interest

   - See `SEEK <https://github.com/ncsl/seek>`_ for help getting started with freesurfer
- Open the docker-compose.yml file and map your local freesurfer subjects directory (default: /usr/local/freesurfer/subjects) is set as the local $SUBJECTS_DIR.
- In the docker-compose.yml file set the environment variable SUBJECT to whatever subject you want to process/visualize

- Perform a CT/T1 coregistration

    + Freesurfer
    + Fieldtrip
- Perform an electrode localization on the coregistered CT

    + Fieldtrip
    + BioimageSuite
- create a folder in the FS subject/subject directory 'electrodes'
- Place a BIDS-compliant electrode file corresponding to the Freesurfer tkRAS brain meshes in the electrodes folder

   .. _viz:

Visualization
----------------------------------------------
- Ensure a successful mesh generation has been performed
- As in the mesh generation step, ensure both the SUBJECTS_DIR and SUBJECT environment variables are properly set
- Navigate to localhost/?subject=$SUBJECT

   .. _run:

Example configuration
--------------------------------------
.. code-block:: yaml
   :emphasize-lines: 9,10,12,22,23,25

   version: '3'
   services:
   mesh_generator:
      container_name: mesh_generator
      build:
         context: .
         dockerfile: ./generate.Dockerfile
      environment: 
         - SUBJECTS_DIR=/data/
         - SUBJECT=fsaverage
      volumes:
         - $SUBJECTS_DIR:/data/

   visualizer:
      container_name: mesh_visualizer
      build: 
         context: .
         dockerfile: ./visualize.Dockerfile
      ports:
         - "80:80"
      environment: 
         - SUBJECTS_DIR=/data/
         - SUBJECT=fsaverage
         - PORT=80
      volumes:
         - $SUBJECTS_DIR:/data

Running
-----------------------------------------
.. code-block:: bash

   docker-compose up --build

