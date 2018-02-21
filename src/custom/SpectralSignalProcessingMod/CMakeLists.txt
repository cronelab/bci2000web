###########################################################################
## $Id: CMakeLists.txt 4536 2013-08-05 14:30:13Z mellinger $
## Authors: griffin.milsap@gmail.com
## Description: Build information for SpectralSignalProcessing in Qt

# Set the executable name
SET( EXECUTABLE_NAME SpectralSignalProcessingMod )

# Set the project specific sources
SET( SRC_PROJECT
  PipeDefinition.cpp
  ${PROJECT_SRC_DIR}/custom/shared/WebSocketInterpreter.cpp
  ${PROJECT_SRC_DIR}/custom/shared/HTTPInterpreter.cpp
  ${PROJECT_SRC_DIR}/custom/shared/WSIOFilter.cpp
  ${PROJECT_SRC_DIR}/custom/shared/SimpleCAR.cpp
  ${PROJECT_SRC_DIR}/custom/extlib/bcon_crypto/sha1.cpp
  ${PROJECT_SRC_DIR}/custom/extlib/bcon_crypto/base64.cpp
)
SET( HDR_PROJECT
  ${PROJECT_SRC_DIR}/custom/shared/WSIOFilter.h
  ${PROJECT_SRC_DIR}/custom/shared/SimpleCAR.h
)

BCI2000_USE( "FFT" )

# Create the signal processing module
BCI2000_ADD_SIGNAL_PROCESSING_MODULE( 
  "${EXECUTABLE_NAME}" 
  "${SRC_PROJECT}" "${HDR_PROJECT}" 
)


