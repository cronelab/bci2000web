# Contributions

Contributions are welcome in the form of pull requests.

Once the implementation of a piece of functionality is considered to be bug
free and properly documented (both API docs and an example script),
it can be incorporated into the master branch.

To help developing `seek` or `ReconstructionVisualizer`, you will need a few adjustments to your
installation as shown below. To install packages, we use ``npm``.

## Running tests
To develop locally, clone the project and run ``yarn`` from the project root. This will install external dependencies.

To make sure all javascript code conforms to standards, run the linter with

    npm run lint

The lint configurations are stored in `.eslintrc.json` file. We follow Google's JavaScript standards (subject to change).

### (Optional) Install Docker
To run the visualization engine, it is recommended to use Docker. Install Docker at: https://docs.docker.com/get-docker/.


## Developing workflows
``SEEK`` automates workflows that output data structures/files that can be visualized using ``ReconstructionVisualizer``. 

### Install development version of seek
First, you should [fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) the `seek` repository. Then, clone the fork and install it. See https://neuroseek.azurewebsites.net/docs/seek/ for more details.

### Install development version of ReconstructionVisualizer
First, you should [fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) the 
`ReconstructionVisualizer` repository. Then, clone the fork and install it.

TODO insert how to install and setup, or link to instructions.

## Updating Dockerfiles



Reference: https://www.learncloudnative.com/blog/2020-02-20-github-action-build-push-docker-images/


## Building the documentation
TODO: @Christopher Coogan, can you help fill this in?

The documentation can be built using sphinx. For that, please additionally
install the following:

    $ pip install matplotlib nilearn sphinx numpydoc sphinx-gallery sphinx_bootstrap_theme pillow

To build the documentation locally, one can run:

    $ cd doc/
    $ make html

or

    $ make html-noplot
    
if you don't want to run the examples to build the documentation. This will result in a faster build but produce no plots in the examples.

## BIDS-Validation
To robustly apply seek workflows and reconstruction visualiztion, we rely on the BIDS specification 
for storing data. One can use the `bids-validator` to verify that a dataset is BIDS-compliant.

### Install the BIDS validator
Finally, it is necessary to install the
[BIDS validator](https://github.com/bids-standard/bids-validator). The outputs
of MNE-BIDS are run through the BIDS validator to check if the conversion
worked properly and produced datasets that conforms to the BIDS specifications.

You will need the `command line version` of the validator.

#### Global (system-wide) installation
- First, install [Node.js](https://nodejs.org/en/).
- For installing the **stable** version of `bids-validator`, please follow the
instructions as detailed in the README of the bids-validator repository.
- For installing the **development** version of `bids-validator`, see [here](https://github.com/bids-standard/bids-validator/blob/master/CONTRIBUTING.md#using-the-development-version-of-bids-validator).

Test your installation by running:

    $ bids-validator --version

#### Local (per-user) development installation

Install [Node.js](https://nodejs.org/en/). If you're use `conda`, you can
install the `nodejs` package from `conda-forge` by running
`conda install -c conda-forge nodejs`.

Then, retrieve the validator and install all its dependencies via `npm`.

    $ git clone git@github.com:bids-standard bids-validator.git
    $ cd bids-validator/bids-validator
    $ npm i

Test your installation by running:

    $ ./bin/bids-validator --version
