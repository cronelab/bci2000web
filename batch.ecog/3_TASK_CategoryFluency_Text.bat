#! ../prog/BCI2000Shell
@cls & ..\prog\BCI2000Shell %0 %* #! && exit /b 0 || exit /b 1\n
#######################################################################################
## $Id: $
## Description: Category Fluency -- Name items from a cued category
#######################################################################################
Echo Category Fluency, 6 Blocks, 10 mins ea.
EXECUTE SCRIPT categories.txt CategoryFluency_Text