#! ../prog/BCI2000Shell
@cls & ..\prog\BCI2000Shell %0 %* #! && exit /b 0 || exit /b 1\n
#######################################################################################
## $Id: $
## Description: BCI2000 startup Operator module script. For an Operator scripting
##   reference, see
##   http://doc.bci2000.org/index/User_Reference:Operator_Module_Scripting
#######################################################################################
# Launch BCI2000
Change directory $BCI2000LAUNCHDIR
Show window; Set title ${Extract file base $0}

Set configfile ../batch.ecog/config.txt
IF [ ${IS FILE $configfile} ]
	Set SubjectID ${EXECUTE SCRIPT $configfile SubjectID}
END

Set PlaybackDir ../data/$SubjectID/ImageSemantics
Set PlaybackFile $PlaybackDir/$SubjectID_ImageSemantics_S001R01.dat

Echo FILE PLAYBACK: $PlaybackFile

# Perform the exposure trial
Reset system
Startup system localhost

#Start executable StimulusPresentationCronelab --local
Start executable DummyApplication --local
Start executable BandPowerSignalProcessing --local
Sleep 2

Start executable FilePlayback --local --FileFormat=Null --PlaybackFileName=$PlaybackFile --PlaybackStates=1

Wait for Connected

Load Parameterfile ../parms.ecog/HGSigProc.prm
IF [ ${IS FILE $PlaybackDir/$SubjectID_classifier.prm} ]
	Load Parameterfile $PlaybackDir/$SubjectID_classifier.prm
ELSE
	Echo No Classifier detected for patient $SubjectID
END

Set Parameter ConnectorOutputAddress localhost:20321
Set Parameter VisualizeSource 0
Set Parameter SampleBlockSize 100

#Set Config
#Wait for Resting
#Start