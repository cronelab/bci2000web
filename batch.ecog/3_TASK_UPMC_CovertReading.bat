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
Echo 5 Blocks of 200 trials, ~7 mins ea. ( ~35 mins total )

Reset system
Startup system localhost

Start executable StimulusPresentationCronelab --local
Sleep 1

EXECUTE SCRIPT "../batch.ecog/setup_system.txt"

Load parameterfile "../parms.ecog/UPMC/CovertReading/covertreading.prm"

EXECUTE SCRIPT "../batch.ecog/setup_storage.txt" UPMC_CovertReading

Echo Which Block (1, 2)?
Set seq ${Read Line}
ECHO Loading Block $seq 
Load parameterfile "../parms.ecog/UPMC/CovertReading/block$seq.prm"
Set title ${Extract file base $0}_Block$seq

Set Config
