echo off
where /q git
IF %ERRORLEVEL% EQU 0 (
  git clone https://github.com/griffinmilsap/bciws.git
  pushd bciws & npm install & popd

  git clone https://bitbucket.org/vchandr6/brain-visualization.git
  pushd brain-visualization & npm install & popd
) else (
  echo DID NOT FIND GIT. Please ensure git is on your path.
  pause
)