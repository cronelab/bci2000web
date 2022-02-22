[![DOI](https://zenodo.org/badge/75337424.svg)](https://zenodo.org/badge/latestdoi/75337424)

# BCI2000Web

### Cloning/Setup

1.  Set up a [BCI2000 user account](http://www.bci2000.org/wiki/index.php/Creating_a_User_Account "Creating a user account") if necessary.
2.  [Checkout a clean copy of the BCI2000 source](http://www.bci2000.org/wiki/index.php/Programming_Howto:SVN_Client_Setup "Programming Howto:SVN Client Setup") to a new directory. HEAD is recommended, and should work, but can be unstable. The most recent revision this repository has been tested to work with is r6030.
3.  Clone this repo into the same BCI2000 folder

        cd <BCI2000 Root Directory>
        git init
        git remote add origin https://github.com/cronelab/bci2000web.git
        git pull origin master

    If your current BCI2000 distribution already has custom projects, you may need to manually merge src/custom/CMakeLists.txt

4.  BCI2000's build system should recognize all of the custom projects. [Visit this guide for BCI2000 build instructions:](https://www.bci2000.org/mediawiki/index.php/Programming_Howto:Building_BCI2000#Building_Contributions)
    **Make sure you use build/Configure.sh.cmd to enable WSSourceFilter and WSConnectorFilter and re-configure/generate the build files before building the executables**

#### A note on custom BCI2000 modules

- Follow the SpectralSignalProcessingMod folder in src/custom if you want to add the websocket pipeline to a new filter
  - Add the .cpp/.h dependencies in your CMakeLists.txt
  - Place the WSIOFilter at the end of your pipeline in the PipeDefinition.cpp

5. Launch BCI2000Web and navigate to localhost to launch experiments

### Dependencies

#### BCI2000

- Visual Studio >= 2017
- CMake >= 3.13
- QT 5

#### BCI2000Web

- NodeJS >= v13 (--experimental-module)
- Chrome/Firefox

### Configuration settings:

- server/Config/amplifiers
  - Amplifier specific BCI2000 configuration parameters
- server/Config/config
  - Backend specific setup
- server/Config/localconfig
  - Experiment/Subject specific settings

### Task creation:

- See _server/paradigms/Template/task.json_ for the template
- Set number of tasks/blocks each with their own parameters
- Each folder in server/paradigms corresponds to a separate experimental paradigm
