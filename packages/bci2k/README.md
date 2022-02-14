# bci2k.js

> A javascript connector for BCI2000

![badge](https://img.shields.io/github/package-json/v/cronelab/bci2k.js)
![badge](https://action-badges.now.sh/cronelab/bci2k.js)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

bci2k.js relies on a binary server called BCI2000Web, which allows browsers to communicate with Operator using the Operator Scripting language and stream data in to the browser using websockets.

## Install

```bash
npm install --save bci2k
```

## Usage

### Connect to BCI2000

```js
import { BCI2K_OperatorConnection } from "./dist/index.js";

const bciOperator = new BCI2K_OperatorConnection();

(async () => {
    try{
        await bciOperator.connect("ws://127.0.0.1")
        console.log("Connected"))
    } catch(err){
        console.log(err)
    }
})()
```

### Execute system commands

```js
bciOperator.showWindow();
bciOperator.hideWindow();
bciOperator.resetSystem();
bciOperator.start();
bciOperator.getVersion();
bciOperator.execute("args"); //args are any BCI2000 Operator commands
```

### Tap data from part of the signal processing chain

```js
import { BCI2K_DataConnection } from "./dist/index.js";

async () => {
    let bciSourceConnection = new BCI2K_DataConnection();
    try{
        await bciSourceConnection.connect("ws://localhost:20100")
        bciSourceConnection.onStateFormat = data => console.log(data);
        bciSourceConnection.onSignalProperties = data => console.log(data);
        bciSourceConnection.onGenericSignal = data => console.log(data);}
    }
    catch(err){
        console.log(err);
    }
```


## Development

```bash
npm run build
```

```bash
npm run dev
```

## License

[MIT](http://vjpr.mit-license.org)

[npm-image]: https://img.shields.io/npm/v/bci2k.svg
[npm-url]: https://npmjs.org/package/bci2k
