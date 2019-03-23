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
Echo 6 Blocks of 60 trials, 5 mins ea. (~40 mins total)

# Perform the exposure trial
Reset system
Startup system localhost

Start executable StimulusPresentationCronelab --local

EXECUTE SCRIPT "../batch.ecog/setup_system.txt"

Load parameterfile "../parms.ecog/image_semantics/image_semantics.prm"

EXECUTE SCRIPT "../batch.ecog/setup_storage.txt" ImageSemantics

Echo Which Block? (1, 2, 3, 4, 5, 6)?
Set i ${Read Line}

# Load the specific sequence
ECHO Loading Block $i 
Load parameterfile "../parms.ecog/image_semantics/seq${$i - 1}.prm"

Set Config
