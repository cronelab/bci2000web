
Localization
========================================================================================================

electrodes.glb can only be generated if an electrode Localization step has been completed outside of this pipeline. 
For our purposes we'll be using the fieldtrip pipeline. For a more thorough waklthrough visit the official `Fieltrip documentation <https://www.fieldtriptoolbox.org/tutorial/human_ecog/>`_.

For the automated SEEK pipeline (Steps 0 through 2) see: `SEEK <https://github.com/ncsl/seek>`_

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
For more information and configuration options on dcm2niix visit the `official repo <https://github.com/rordenlab/dcm2niix>`_

.. code-block:: bash

   dcm2niix /path_to_T1_dicom_folder/ -o /output_folder

Step 0b: Convertsion of CT dcm to nii and anonymization 
-------------------------------------------------------------------------------------------------------------
(CT.dcm => CT.nii) 
++++++++++++++++++++++++++++++++++++++++++++++++++++
.. code-block:: bash

   dcm2niix /path_to_CT_dicom_folder/ -o /output_folder


Step 1: MR ACPC alignment
-------------------------------------------------------------------------------------------------------------
(T1.nii => T1_acpc.nii)
++++++++++++++++++++++++++++++++++++++++++++++++++++
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

Step 5: Mark electrodes
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
.. code-block:: matlab

   labels = ["ch1","ch2","ch3"]' %...
   cfg         = [];
   cfg.channel = labels;
   elec_acpc_f = ft_electrodeplacement(cfg, ct_acpc_f, fsmri_acpc);

Step 6: Export electrodes in BIDS-compliant tsv file 
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
(electrodes.tsv)
++++++++++++++++++++++++++++++++++++++++++++++++++++
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
   
   