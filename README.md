# Chris' Monorepo

`apps` and `packages` contain other repos related to bci, functional mapping, reconstructions, etc. This repo exists to keep them all in the same place with a shared config.


### Repos

- `apps/bci2000`: [BCI2000Web](https://github.com/cronelab/bci2000web)
- `apps/webfm`: [WebFM](https://github.com/cronelab/webfm)
- `apps/ReconstructionSuite`: [ReconstructionSuite](https://github.com/cronelab/ReconstructionSuite)
- `packages/bci2k.js`: [bci2k.js](https://github.com/cronelab/bci2k.js)
- `packages/ui`: a stub React component library shared by both `web` and `docs` applications
- `packages/config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `packages/tsconfig`: `tsconfig.json`s used throughout the monorepo

### To push to individual repos

- git subtree push --prefix=packages/bci2k.js bci2k.js_master master
- git subtree push --prefix=apps/bci2000 bci20000web_master master
- git subtree push --prefix=apps/webfm webfm_master master
- git subtree push --prefix=apps/ReconstructionSuite ReconstructionSuite_master master


