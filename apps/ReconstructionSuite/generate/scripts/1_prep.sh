#!/bin/bash

mkdir -p $SUBJECTS_DIR/$SUBJECT/obj
mkdir -p $SUBJECTS_DIR/$SUBJECT/rois
mkdir -p $SUBJECTS_DIR/$SUBJECT/electrodes
mkdir -p /usr/local/freesurfer/matlab

./bash/aseg2srf.sh $SUBJECT

mris_convert $SUBJECTS_DIR/$SUBJECT/surf/lh.pial $SUBJECTS_DIR/$SUBJECT/surf/lh.pial.asc
mris_convert $SUBJECTS_DIR/$SUBJECT/surf/rh.pial $SUBJECTS_DIR/$SUBJECT/surf/rh.pial.asc

mv $SUBJECTS_DIR/$SUBJECT/surf/lh.pial.asc $SUBJECTS_DIR/$SUBJECT/surf/lh.pial.srf
mv $SUBJECTS_DIR/$SUBJECT/surf/rh.pial.asc $SUBJECTS_DIR/$SUBJECT/surf/rh.pial.srf

./octave/annot2dpv $SUBJECTS_DIR/$SUBJECT/label/lh.aparc.annot $SUBJECTS_DIR/$SUBJECT/label/lh.aparc.annot.dpv
./octave/annot2dpv $SUBJECTS_DIR/$SUBJECT/label/rh.aparc.annot $SUBJECTS_DIR/$SUBJECT/label/rh.aparc.annot.dpv

./octave/splitsrf $SUBJECTS_DIR/$SUBJECT/surf/lh.pial.srf $SUBJECTS_DIR/$SUBJECT/label/lh.aparc.annot.dpv $SUBJECTS_DIR/$SUBJECT/rois/lh.pial_roi
./octave/splitsrf $SUBJECTS_DIR/$SUBJECT/surf/rh.pial.srf $SUBJECTS_DIR/$SUBJECT/label/rh.aparc.annot.dpv $SUBJECTS_DIR/$SUBJECT/rois/rh.pial_roi

counter=0001
while [ $counter -le 0035 ]; do
	newCount=$(printf "%04g" $counter)
	labelName=$(cat ./octave/roiNames.json | jq '.["'$newCount'"]')
	labelName="${labelName#\"}"
	labelName="${labelName%\"}"
	./octave/srf2obj $SUBJECTS_DIR/$SUBJECT/rois/lh.pial_roi.$newCount.srf >$SUBJECTS_DIR/$SUBJECT/obj/lh.$labelName.obj
	./octave/srf2obj $SUBJECTS_DIR/$SUBJECT/rois/rh.pial_roi.$newCount.srf >$SUBJECTS_DIR/$SUBJECT/obj/rh.$labelName.obj
	((counter++))
done
