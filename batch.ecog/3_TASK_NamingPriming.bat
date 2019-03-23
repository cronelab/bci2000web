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
Echo 2 + 5 Blocks of 50 trials, ~4 mins ea. ( ~28 mins total )

Reset system
Startup system localhost

Start executable StimulusPresentationCronelab --local
Sleep 1

EXECUTE SCRIPT "../batch.ecog/setup_system.txt"

Load parameterfile "../parms.ecog/NamingPriming/namingpriming.prm"

EXECUTE SCRIPT "../batch.ecog/setup_storage.txt" NamingPriming

Echo Which Sequence (seq1_r1, seq1_r2, seq2_r1, seq2_r2, seq2_r3, seq2_r4, seq2_r5)?
Set seq ${Read Line}
ECHO Loading Block $seq 
Load parameterfile "../parms.ecog/NamingPriming/$seq.prm"
Set title ${Extract file base $0}_$seq

Set Config
