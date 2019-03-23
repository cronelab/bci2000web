#! ../prog/BCI2000Shell
@cls & ..\prog\BCI2000Shell %0 %* #! && exit /b 0 || exit /b 1\n
#######################################################################################
## $Id: $
## Description: Auditory Word Repetition -- Repeat the auditory stimulus
#######################################################################################
Echo 2 Blocks of 116 trials, ~11 mins ea. (22 minutes total)
EXECUTE SCRIPT rep_rde.txt AuditoryWordRepetition