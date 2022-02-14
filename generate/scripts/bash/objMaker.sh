#!/bin/bash

workdir='/home/generate'

$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_002.srf > $SUBJECTS_DIR/$1/obj/Left-Cerebral-White-Matter.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_003.srf > $SUBJECTS_DIR/$1/obj/Left-Cerebral-Cortex.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_004.srf > $SUBJECTS_DIR/$1/obj/Left-Lateral-Ventricle.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_005.srf > $SUBJECTS_DIR/$1/obj/Left-Inf-Lat-Vent.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_007.srf > $SUBJECTS_DIR/$1/obj/Left-Cerebellum-White-Matter.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_008.srf > $SUBJECTS_DIR/$1/obj/Left-Cerebellum-Cortex.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_010.srf > $SUBJECTS_DIR/$1/obj/Left-Thalamus-Proper.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_011.srf > $SUBJECTS_DIR/$1/obj/Left-Caudate.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_012.srf > $SUBJECTS_DIR/$1/obj/Left-Putamen.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_013.srf > $SUBJECTS_DIR/$1/obj/Left-Pallidum.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_014.srf > $SUBJECTS_DIR/$1/obj/3rd-Ventricle.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_015.srf > $SUBJECTS_DIR/$1/obj/4th-Ventricle.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_016.srf > $SUBJECTS_DIR/$1/obj/Brain-Stem.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_017.srf > $SUBJECTS_DIR/$1/obj/Left-Hippocampus.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_018.srf > $SUBJECTS_DIR/$1/obj/Left-Amygdala.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_024.srf > $SUBJECTS_DIR/$1/obj/CSF.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_026.srf > $SUBJECTS_DIR/$1/obj/Left-Accumbens-area.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_028.srf > $SUBJECTS_DIR/$1/obj/Left-VentralDC.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_030.srf > $SUBJECTS_DIR/$1/obj/Left-vessel.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_031.srf > $SUBJECTS_DIR/$1/obj/Left-choroid-plexus.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_041.srf > $SUBJECTS_DIR/$1/obj/Right-Cerebral-White-Matter.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_042.srf > $SUBJECTS_DIR/$1/obj/Right-Cerebral-Cortex.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_043.srf > $SUBJECTS_DIR/$1/obj/Right-Lateral-Ventricle.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_044.srf > $SUBJECTS_DIR/$1/obj/Right-Inf-Lat-Vent.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_046.srf > $SUBJECTS_DIR/$1/obj/Right-Cerebellum-White-Matter.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_047.srf > $SUBJECTS_DIR/$1/obj/Right-Cerebellum-Cortex.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_049.srf > $SUBJECTS_DIR/$1/obj/Right-Thalamus-Proper.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_050.srf > $SUBJECTS_DIR/$1/obj/Right-Caudate.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_051.srf > $SUBJECTS_DIR/$1/obj/Right-Putamen.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_052.srf > $SUBJECTS_DIR/$1/obj/Right-Pallidum.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_053.srf > $SUBJECTS_DIR/$1/obj/Right-Hippocampus.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_054.srf > $SUBJECTS_DIR/$1/obj/Right-Amygdala.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_058.srf > $SUBJECTS_DIR/$1/obj/Right-Accumbens-area.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_060.srf > $SUBJECTS_DIR/$1/obj/Right-VentralDC.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_063.srf > $SUBJECTS_DIR/$1/obj/Right-choroid-plexus.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_077.srf > $SUBJECTS_DIR/$1/obj/WM-hypointensities.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_085.srf > $SUBJECTS_DIR/$1/obj/Optic-Chiasm.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_251.srf > $SUBJECTS_DIR/$1/obj/CC_Posterior.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_252.srf > $SUBJECTS_DIR/$1/obj/CC_Mid_Posterior.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_253.srf > $SUBJECTS_DIR/$1/obj/CC_Central.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_254.srf > $SUBJECTS_DIR/$1/obj/CC_Mid_Anterior.obj
$workdir/scripts/octave/srf2obj $SUBJECTS_DIR/$1/aseg2srf/aseg_255.srf > $SUBJECTS_DIR/$1/obj/CC_Anterior.obj