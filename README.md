[![DOI](https://zenodo.org/badge/75337424.svg)](https://zenodo.org/badge/latestdoi/75337424)

BCI2000Web
===================

###Cloning/Setup

1. Set up a [BCI2000 user account](http://www.bci2000.org/wiki/index.php/Creating_a_User_Account "Creating a user account") if necessary.
2. [Checkout a clean copy of the BCI2000 source](http://www.bci2000.org/wiki/index.php/Programming_Howto:SVN_Client_Setup "Programming Howto:SVN Client Setup") to a new directory.  HEAD is recommended, and should work, but can be unstable.  The most recent revision this repository has been tested to work with is r4774.
3. Clone this repo into the same BCI2000 folder

		cd <BCI2000 Root Directory>
		git init
		git remote add origin <This repo's URL>
		git pull origin master

	If your current BCI2000 distribution already has custom projects, you may need to manually merge src/custom/CMakeLists.txt
4. BCI2000's build system should recognize all of the custom projects.  [Visit this guide for BCI2000 build instructions:](https://www.bci2000.org/mediawiki/index.php/Programming_Howto:Building_BCI2000#Building_Contributions) 
**Make sure you use build/Configure.sh.cmd to enable WSSourceFilter and WSConnectorFilter and re-configure/generate the build files before building the executables**
5. Launch BCI2000Web and navigate to localhost to launch experiments


###Requires
#####(BCI2000)
- Visual Studio 2017
- CMake 3.13.2
- QT 5.12
#####(BCI2000Web)
- NodeJS


###Notes
Introducing a new way to parameterize tasks.
- *server/Config/config.json* relates to server control
- *server/Config/localconfig.json* is experiment dependent
- *server/Config/amplifiers.json* includes templates for various neural amplifiers
- *server/paradigms/Paradigm/task.json* contains various fields that are task and block specific.
	- Allows users to select the processing and application layers used for the task
	- Which parameters to be set and loaded
	- Title and descriptions to be displayed in the web interface.
	- See *server/paradigms/_newTaskFormat/task.json* for the template

#Known issues:
- Loading .jpgs into the stimulus presentation application is currently throwing an error.
- Adding events to the BCI2000 operator module is also throwing an error (states are still working fine).