#! ../prog/BCI2000Shell
@cls & ..\prog\BCI2000Shell %0 %* #! && exit /b 0 || exit /b 1\n
## Simple data recording from Blackrock -- Also a good system test program
Change directory $BCI2000LAUNCHDIR
Show window; Set title ${Extract file base $0}
Reset system
Startup system localhost

Start executable StimulusPresentation --local
Sleep 1

EXECUTE SCRIPT ../batch.ecog/setup_system.txt 

Load parameterfile "../parms.ecog/latency_test.prm"

EXECUTE SCRIPT ../batch.ecog/setup_storage.txt LatencyTest


