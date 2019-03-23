echo off
where /q npm

pushd %~dp0

if not exist .\semanticfluency\node_modules pushd semanticfluency & npm install & popd

IF %ERRORLEVEL% EQU 0 (
  pushd bciws & start npm start & popd
  pushd semanticfluency & start npm start & popd
  rem start "" http://localhost:8000
) else (
  echo DID NOT FIND NPM. Please ensure npm is on your path.
)

popd

rem start cmd /c semanticfluency.bat
