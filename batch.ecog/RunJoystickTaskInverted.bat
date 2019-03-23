#! ../prog/BCI2000Shell
@cls & ..\prog\BCI2000Shell %0 %* #! && exit /b 0 || exit /b 1\n
## Simple data recording from Blackrock -- Also a good system test program
Change directory $BCI2000LAUNCHDIR
Show window; Set title ${Extract file base $0}
Reset system
Startup system localhost

Start executable JoystickTask --local

EXECUTE SCRIPT ../batch.ecog/setup_system.txt JoystickTask
EXECUTE SCRIPT ../batch.ecog/setup_storage.txt JoystickTask
Load Parameterfile "../parms.ecog/JoystickTask.prm"
Load Parameterfile "../parms.ecog/JoystickTaskInverted.prm"
