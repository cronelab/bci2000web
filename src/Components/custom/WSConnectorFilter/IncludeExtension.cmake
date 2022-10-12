###########################################################################
## $Id: IncludeExtension.cmake 4970 2015-08-21 16:46:07Z mellinger $
## Authors: griffin.milsap@gmail.com

# Add the WSConnectorFilter to all application modules

SET( BCI2000_APP_FILES
   ${BCI2000_APP_FILES}
   ${BCI2000_EXTENSION_DIR}/WSConnectorFilter.cpp
   ${BCI2000_SRC_DIR}/custom/shared/WebSocketInterpreter.cpp
   ${BCI2000_SRC_DIR}/custom/shared/HTTPInterpreter.cpp
   ${BCI2000_SRC_DIR}/custom/shared/WSIOFilter.cpp
   ${BCI2000_SRC_DIR}/custom/extlib/bcon_crypto/sha1.cpp
   ${BCI2000_SRC_DIR}/custom/extlib/bcon_crypto/base64.cpp
)

SET( BCI2000_APPINCDIRS
   ${BCI2000_APPINCDIRS}
   ${BCI2000_SRC_DIR}/custom/extlib/bcon_crypto
)