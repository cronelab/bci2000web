#! ../prog/BCI2000Shell
@cls & ..\prog\BCI2000Shell %0 %* #! && exit /b 0 || exit /b 1\n
#######################################################################################
## $Id: $
## Description: Syllable Reading -- Read the syllable
#######################################################################################
Echo 2 Blocks of 60 trials, ~5 mins ea. (10 minutes total)
EXECUTE SCRIPT rep_rde_syl.txt SyllableReading