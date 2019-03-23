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

#Set corpus headlines
#Set corpus potter
#Set corpus sat

Set corpus phonemes

For pfile in ${LIST FILES "../parms.ecog/PassageReading/$corpus"}
  Reset system
  Startup system localhost

  Start executable Spreeder --local

  EXECUTE SCRIPT "../batch.ecog/setup_system.txt"
  EXECUTE SCRIPT "../batch.ecog/setup_storage.txt" PassageReading

  Load parameterfile "../parms.ecog/PassageReading/passagereading.prm"
  ECHO Loading $corpus/$pfile
  Load parameterfile "../parms.ecog/PassageReading/$corpus/$pfile"

  Set Config
  Wait for Resting
  Wait for Suspended
End