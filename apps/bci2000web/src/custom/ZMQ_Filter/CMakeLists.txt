###########################################################################
## $Id: CMakeLists.txt 4536 2013-08-05 14:30:13Z mellinger $
## Authors: griffin.milsap@gmail.com
## Description: Build information for SpectralSignalProcessing in Qt

# Set the executable name
SET( EXECUTABLE_NAME ZMQ_Filter )

# Set the project specific sources
SET( SRC_PROJECT
  PipeDefinition.cpp
  ${PROJECT_SRC_DIR}/custom/shared/ZMQFilter.cpp
  ${BCI2000_SRC_DIR}/custom/extlib/libzmq-v141-mt-4_3_3.dll
  ${BCI2000_SRC_DIR}/custom/extlib/libsodium.dll


)
SET( HDR_PROJECT
  ${PROJECT_SRC_DIR}/custom/shared/ZMQFilter.h
  ${PROJECT_SRC_DIR}/custom/shared/zmq.h
  ${PROJECT_SRC_DIR}/custom/shared/zmq.hpp
)


# Create the signal processing module
BCI2000_ADD_SIGNAL_PROCESSING_MODULE( 
  "${EXECUTABLE_NAME}" 
  "${SRC_PROJECT}" "${HDR_PROJECT}" 
)

target_link_libraries(ZMQ_Filter ${BCI2000_SRC_DIR}/custom/extlib/libzmq-mt-4_3_3.lib)