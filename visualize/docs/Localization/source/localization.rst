
Localization
========================================================================================================

``electrodes.glb`` can only be generated if an electrode localization step has been completed outside of this pipeline. 
For our purposes we'll be using the fieldtrip pipeline. For a more thorough waklthrough visit the official `Fieltrip documentation <https://www.fieldtriptoolbox.org/tutorial/human_ecog/>`_.

For the automated SEEK pipeline (Steps 0 through 2) see: `SEEK <https://github.com/ncsl/seek>`_

We also provide the `electrode_localization.m <https://github.com/ncsl/seek/blob/master/workflow/scripts/electrode_localization.m>`_ file, which is already setup
with the steps outlined below and some additional documentation. You will need 
to alter a few paths.

Requirements
-------------------------------------------------------------------------------------------------------------
+ `Fieldtrip <https://www.fieldtriptoolbox.org/>`_
+ `SPM12 <https://www.fil.ion.ucl.ac.uk/spm/software/spm12/>`_
+ `Freesurfer <https://surfer.nmr.mgh.harvard.edu/>`_
+ `Matlab <https://www.mathworks.com/>`_
+ `dcm2niix <https://github.com/neurolabusc/MRIcroGL)>`_ or `MRIcroGL for an interactive GUI <https://github.com/rordenlab/dcm2niix>`_


Step 0a: Convertsion of MR dcm to nii and anonymization
-------------------------------------------------------------------------------------------------------------
(T1.dcm => T1.nii) 
++++++++++++++++++++++++++++++++++++++++++++++++++++
To convert ``.dicom`` images to ``.nii`` (Nifti), one can use ``dcm2niix``. 
For more information and configuration options on dcm2niix visit the `official repo <https://github.com/rordenlab/dcm2niix>`_

.. code-block:: bash

   dcm2niix /path_to_T1_dicom_folder/ -o /output_folder


Step 0b: Convertsion of CT dcm to nii and anonymization 
-------------------------------------------------------------------------------------------------------------
(CT.dcm => CT.nii) 
++++++++++++++++++++++++++++++++++++++++++++++++++++
.. code-block:: bash

   dcm2niix /path_to_CT_dicom_folder/ -o /output_folder

Step 0c: Renaming T1/CT nii files
-------------------------------------------------------------------------------------------------------------
After generating the Nifti T1/CT images, you will want to rename 
your files to be BIDS-compliant. See BIDS_ for more information on 
how to name files. For example

   CT.nii -> sub-01_ses-presurgery_space-orig_CT.nii

and

   T1.nii -> sub-01_ses-presurgery_space-orig_T1w.nii


Step 1: MR ACPC alignment
-------------------------------------------------------------------------------------------------------------
(sub-01_ses-presurgery_space-orig_T1w.nii => sub-01_ses-presurgery_space-acpc_T1w.nii)
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Next, we want to align the T1 MRI to the ACPC. This will 
help FreeSurfer reconstruction downstream.

.. code-block:: matlab

   mri = ft_read_mri([subjID '_MR_acpc.nii']); % we used the dcm series
   ft_determine_coordsys(mri);
   cfg           = [];
   cfg.method    = 'interactive';
   cfg.coordsys  = 'acpc';
   mri_acpc = ft_volumerealign(cfg, mri);
   cfg           = [];
   cfg.filename  = [subjID '_MR_acpc'];
   cfg.filetype  = 'nifti';
   cfg.parameter = 'anatomy';
   ft_volumewrite(cfg, mri_acpc);

This step can be accomplished also with ``acpcdetectv2.0+`` 
software, which is automated in ``SEEK-pipeline``.

Step 2: Freesurfer reconstrucion
------------------------------------------------------------------------------------------------------------------------------------------------------------
(T1_acpc.nii => T1_acpc_processed.nii)
++++++++++++++++++++++++++++++++++++++++++++++++++++
For more information and configuration options on Freesurfer visit the `official page <https://surfer.nmr.mgh.harvard.edu/>`_

.. code-block:: bash

   recon-all -i /path_to_T1_acpc.nii/ -s $SUBJECT_NAME

Step 3: CT CTF alignment 
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
(CT.nii => CT_ctf.nii)
++++++++++++++++++++++++++++++++++++++++++++++++++++
.. code-block:: matlab

   ct = ft_read_mri([subjID '_CT_acpc_f.nii']); % we used the dcm series
   cfg           = [];
   cfg.method    = 'interactive';
   cfg.coordsys  = 'ctf';
   ct_ctf = ft_volumerealign(cfg, ct);
   ct_acpc = ft_convert_coordsys(ct_ctf, 'acpc');

This step is important because it will tell the image 
certain coordinate landmarks to prevent a left/right hemisphere 
flip. Coregistering the CT to the T1 naively without marking the
LPA, RPA, NAS and Z-point, could very easily result in the 
left hemisphere of the CT being registered to the right hemisphere 
of the T1 brain. Marking the sides explicitly prevents this because 
coregistration algorithm can be applied without worrying about flipping 
right/left by accident.

To recognize left/right, one would need the implantation schematic 
of the electrodes. Then one can determine which side is right/left 
based on clinical information. In addition, generally sEEG electrodes 
with a ``'`` character in the channel name indicates a 
left-hemisphere electrode.

Step 4: Register CT to T1 
-------------------------------------------------------------------------------------------------------------------------------------------
(CT_ctf.nii CT_acpc.nii)
++++++++++++++++++++++++++++++++++++++++++++++++++++
.. code-block:: matlab

   cfg             = [];
   cfg.method      = 'spm';
   cfg.spmversion  = 'spm12';
   cfg.coordsys    = 'acpc';
   cfg.viewresult  = 'yes';
   ct_acpc_f = ft_volumerealign(cfg, ct_acpc, fsmri_acpc);
   cfg           = [];
   cfg.filename  = [subjID '_CT_acpc_f'];
   cfg.filetype  = 'nifti';
   cfg.parameter = 'anatomy';
   ft_volumewrite(cfg, ct_acpc_f);

Note that this step occurs within FieldTrip, and utilizes ``SPM12``.

Step 5: Mark electrodes
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
.. code-block:: matlab

   labels = ["ch1","ch2","ch3"]' %...
   cfg         = [];
   cfg.channel = labels;
   elec_acpc_f = ft_electrodeplacement(cfg, ct_acpc_f, fsmri_acpc);

Marking electrodes will require a list of the channel labels to be marked. This 
can be obtained from the ``*channels.tsv`` file in the BIDS_ layout for 
iEEG data.

Step 6: Export electrodes in BIDS-compliant tsv file 
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
(electrodes.tsv)
++++++++++++++++++++++++++++++++++++++++++++++++++++
Finally, to store the electrode coordinates in BIDS_, we have a 
short function to do so. This matlab script also shows how to apply warping 
using FieldTrip functions to get the channels in voxel space, and tkRAS (pial surface) space.

.. code-block:: matlab

   MR_vox = elec_acpc_f;
   MR_vox.chanpos = ft_warp_apply(inv(fsmri_acpc.hdr.vox2ras0), elec_acpc_f.chanpos);
   tkrRAS = MR_vox;
   tkrRAS.chanpos =  ft_warp_apply(fsmri_acpc.hdr.tkrvox2ras, MR_vox.chanpos);
   exportTSV(tkrRAS,strcat(rawPath,subjID,'\electrodes\electrodes.tsv'));
   exportTSV(RASelectrodes,strcat(rawPath,subjID,'\electrodes\RAS_electrodes.tsv'));

   function exportTSV(elec,name)
      sep = regexp(elec.label,'\d');
      file{3} = elec.chanpos(:,1);
      file{4} = elec.chanpos(:,2);
      file{5} = elec.chanpos(:,3);
      fid = fopen(name,'wt');
      fprintf(fid,'name\tx\ty\tz\n');
      for i = 1:length(elec.label)
         elecName = strcat(elec.label{i}(1:sep{i}-1),"'",elec.label{i}((sep{i}:length(elec.label{i}))));
         fprintf(fid, '%s\t%-.3f\t%-.3f\t%-.3f\n', elecName, file{3}(i), file{4}(i), file{5}(i));
      end
      fclose(fid)
   end

Here is an example output:

.. list-table:: electrodes.tsv
   :widths: 10 10 10 10
   :header-rows: 1
   
   *  - name	
      - x
      - y
      - z
   *  - LA'1	
      - 144.678	
      - 154.419	
      - 129.642
   *  - LA'2	
      - 149.758	
      - 154.419	
      - 129.674
   *  - LA'3	
      - 154.790	
      - 154.419	
      - 129.696
   *  - LA'4	
      - 159.366	
      - 154.419	
      - 129.712
   
.. _BIDS: https://bids-specification.readthedocs.io/