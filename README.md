[![DOI](https://zenodo.org/badge/75337424.svg)](https://zenodo.org/badge/latestdoi/75337424)

bci2000web
===================

### Cloning/Setup

1. Set up a [BCI2000 user account](http://www.bci2000.org/wiki/index.php/Creating_a_User_Account "Creating a user account") if necessary.

2. [Checkout a clean BCI2000](http://www.bci2000.org/wiki/index.php/Programming_Howto:SVN_Client_Setup "Programming Howto:SVN Client Setup") to a new directory.  HEAD is recommended, and should work, but can be unstable.  The most recent revision this repository has been tested to work with is r4774.

3. Clone this repo into the same BCI2000 folder 

		cd <BCI2000 Root Directory>
		git init
		git remote add origin <This repo's URL>
		git pull origin master
		
	If your current BCI2000 distribution already has custom projects, you may need to manually merge src/custom/CMakeLists.txt
4. BCI2000's build system should recognize all of the custom projects.  [At a minimum, build:](http://www.bci2000.org/wiki/index.php/Programming_Howto:Building_BCI2000 "Programming HowTo:Building BCI2000") **Make sure you use build/Configure.sh.cmd to enable WSSourceFilter and WSConnectorFilter and re-configure/generate the build files before building the executables**
    
Requires [Visual C++ Redistributable for Visual Studio 2012 Update 4](https://www.microsoft.com/en-ca/download/details.aspx?id=30679)

    There may be more required projects as BCI2000 matures.  [See doc.bci2000.org for current information](http://doc.bci2000.org)
5. Launch BCI2000Web and navigate to localhost to launch experiments
