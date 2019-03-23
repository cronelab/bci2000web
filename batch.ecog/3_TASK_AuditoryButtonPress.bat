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
Echo 4 Blocks of 100-120 trials, ~3-4 mins ea. (~15 mins total)

# Perform the exposure trial
Reset system
Startup system localhost

Start executable StimulusPresentationCronelab --local

EXECUTE SCRIPT "../batch.ecog/setup_system.txt"

Load parameterfile "../parms.ecog/AuditoryButtonPress/AuditoryButtonPress.prm"

EXECUTE SCRIPT "../batch.ecog/setup_storage.txt" AuditoryButtonPress

Echo Which Block? 
Echo 1 (Tone)
Echo 2 (Press + Tone)
Echo 3 (Press + Tone Dropout)
Echo 4 (Press + Tone Alter)
Echo 5 (Alter Tone)
Echo 6 (Press + No Tone)
Set i ${Read Line}

# Load the specific sequence
ECHO Loading Block $i 
Load parameterfile "../parms.ecog/AuditoryButtonPress/seq$i.prm"

Set Config
