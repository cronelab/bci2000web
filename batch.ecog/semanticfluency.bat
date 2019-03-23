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

# Perform the exposure trial
Reset system
Startup system localhost

Start executable DummyApplication --local

EXECUTE SCRIPT "../batch.ecog/setup_system.txt"

EXECUTE SCRIPT "../batch.ecog/setup_storage.txt" Semantic_Fluency

Set Parameter SampleBlockSize 100
Set Parameter ConditionExpression 0
Set Parameter BaselineExpression 0
Set Parameter VisualizeRaster 0

ECHO Loading Semantic Fluency Task

Set Config
Wait for Resting
Wait for Suspended
