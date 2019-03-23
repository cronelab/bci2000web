echo off
where /q npm
IF %ERRORLEVEL% EQU 0 (
  pushd bciws & start npm start & popd
  pushd brain-visualization & start npm start & popd
  start "" http://localhost:8000
) else (
  echo DID NOT FIND NPM. Please ensure npm is on your path.
)