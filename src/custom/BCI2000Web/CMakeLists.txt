###########################################################################
## $Id: CMakeLists.txt 4993 2015-09-01 18:48:27Z mellinger $
## Authors: griffin.milsap@gmail.com
## Description: Build information for BCI2000Web

# Set the executable name
SET( NAME BCI2000Web )

UTILS_INCLUDE( frameworks/Core )

SET( SRC_PROJECT
  main.cpp
  HTTPServer.cpp
  BCI2000Web.cpp
  ../shared/HTTPInterpreter.cpp
  ../shared/WebSocketInterpreter.cpp
  ${PROJECT_SRC_DIR}/core/Operator/BCI2000Remote/BCI2000Connection.cpp
  ${PROJECT_SRC_DIR}/shared/utils/QtSignalConnector.h
  ${PROJECT_SRC_DIR}/shared/utils/QtMain.cpp
  ${PROJECT_SRC_DIR}/custom/extlib/bcon_crypto/sha1.cpp
  ${PROJECT_SRC_DIR}/custom/extlib/bcon_crypto/base64.cpp
)

INCLUDE_DIRECTORIES( ${PROJECT_SRC_DIR}/custom/extlib/bcon_crypto )

utils_set_appicon( prompt )

ADD_DEFINITIONS( -DUSE_QT )
UTILS_INCLUDE( frameworks/LibTiny )
BCI2000_ADD_TARGET( QTAPP NOBUNDLE ${NAME} ${SRC_PROJECT} )
