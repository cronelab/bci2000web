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
Show window
Reset system
Startup system localhost

Start executable DummyApplication --local

Echo Mapping what task?:
Set MappingTask ${Read Line}

Echo What channel is trigger on?:
Set TriggerChannel ${Read Line}

Set title ${Extract file base $0}_$MappingTask_(TrigCh:$TriggerChannel)

EXECUTE SCRIPT ../batch.ecog/setup_system.txt Mapping
EXECUTE SCRIPT ../batch.ecog/setup_storage.txt $MappingTask

Wait for Connected

Set Parameter BaselineExpression OFMActive==0
Set Parameter ConditionExpression Signal(%22$TriggerChannel%22,1)>10.0

Set Parameter ConnectorOutputAddress localhost:20321
#Set Parameter SampleBlockSize 100

#Set Config
#Wait for Resting
#Start