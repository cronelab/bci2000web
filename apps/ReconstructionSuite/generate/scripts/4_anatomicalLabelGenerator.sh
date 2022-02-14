#!/bin/bash

currentElecLabel=_
prevX=0
prevY=0
prevZ=0
echo "Label" >>$SUBJECTS_DIR/$SUBJECT/electrodes/anatomicalLabels.txt
while IFS=$'\t' read -r -a myArray; do
	x=${myArray[1]}
	y=${myArray[2]}
	z=${myArray[3]}
	seg=$(mri_info $SUBJECTS_DIR/$SUBJECT/mri/wmparc.mgz --voxel $x $y $z)	
	segment=$(printf "%1.0f" "${seg}")
	while IFS=" " read -a line; do
		if [[ ${line[0]} != \#* && ! -z ${line[0]} && ${myArray[0]} != 'name' ]]; then
			if [ "$segment" -eq ${line[0]} ]; then
				echo ${line[1]} >>$SUBJECTS_DIR/$SUBJECT/electrodes/anatomicalLabels.txt
			fi
		fi
	done < $FREESURFER_HOME/FreeSurferColorLUT.txt


	# if [ "$currentElecLabel" != ${myArray[2]} ]; then
	# 	_averageX=`echo "($prevX+$x)/2" | bc -l`
	# 	_averageY=`echo "($prevY+$y)/2" | bc -l`
	# 	_averageZ=`echo "($prevZ+$z_)/2" | bc -l`
	# 	averageX=$(printf "%.01f" "$_averageX")
	# 	averageY=$(printf "%.01f" "$_averageY")
	# 	averageZ=$(printf "%.01f" "$_averageZ")
	# 	prevX=$x
	# 	prevY=$y
	# 	prevZ=$z_
	# 	averageElectrode="$currentElecLabel"_"${myArray[2]}"
	# 	currentElecLabel=${myArray[2]}
	# fi 

	
	# avgSeg=$(mri_info $SUBJECTS_DIR/$SUBJECT/mri/aparc+aseg.mgz --voxel $averageX $averageY $averageZ)
	# avgSegment=$(printf "%1.0f" "${avgSeg}")

	# while IFS=" " read -a line; do
	# 	labelIndex=$(printf "%1.0f" ${line[0]})
	# 	if [ "$avgSegment" -eq "$labelIndex" ]; then
	# 		echo $averageX $averageY $averageZ "    " "$averageElectrode" "    " ${line[1]} >>$SUBJECTS_DIR/$SUBJECT/electrodes/anatomicalLocations.txt
	# 	fi
	# done <LUT.txt




done <$SUBJECTS_DIR/$SUBJECT/electrodes/VOX_electrodes.tsv

sed $'s/\r$//' $SUBJECTS_DIR/$SUBJECT/electrodes/VOX_electrodes.tsv > $SUBJECTS_DIR/$SUBJECT/electrodes/VOX_electrodes_LF.tsv
paste $SUBJECTS_DIR/$SUBJECT/electrodes/VOX_electrodes_LF.tsv $SUBJECTS_DIR/$SUBJECT/electrodes/anatomicalLabels.txt >> $SUBJECTS_DIR/$SUBJECT/electrodes/anatomicalLabels.tsv