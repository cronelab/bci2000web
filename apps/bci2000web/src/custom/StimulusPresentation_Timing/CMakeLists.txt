###########################################################################
## $Id: CMakeLists.txt 4536 2013-08-05 14:30:13Z mellinger $
## Authors: griffin.milsap@gmail.com
## Description: Build information for StimulusPresentation in Qt

# Set the executable name
SET( EXECUTABLE_NAME StimulusPresentation_Timing )

# Set the project specific sources
SET( SRC_PROJECT
  StimulusPresentationTask.cpp
)
SET( HDR_PROJECT
  StimulusPresentationTask.h
)

# Define extra include directories
INCLUDE_DIRECTORIES(
)

# Create the module
BCI2000_ADD_APPLICATION_MODULE( 
  "${EXECUTABLE_NAME}" 
  "${SRC_PROJECT}" "${HDR_PROJECT}" 
)


