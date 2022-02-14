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
const BCI2K = require( 'bci2k' );
const bci = new BCI2K.bciOperator();

bci.connect("127.0.0.1")
    .then(() => console.log("Connected"))
    .catch(err => console.log(err)
```

### Execute system commands

```js
bci.showWindow();
bci.hideWindow();
bci.resetSystem();
bci.start();
bci.getVersion();
bci.execute("args"); //args are any BCI2000 Operator commands
```

### Tap data from part of the signal processing chain

```js
const connectToSockets = async () => {
    let sourceConnection = await bci.tap("Source");
    try{
        sourceConnection.onStateFormat = data => console.log(data);
        sourceConnection.onSignalProperties = data => console.log(data);
        sourceConnection.onGenericSignal = data => console.log(data);}
    }
    catch(err){
        console.log(err);
    }

    //or

    let bciDataConnection = new BCI2K.bciData();
    bciDataConnection.connect("127.0.0.1:12345")
    let signal = bciDataConnection.signal;
```

### See more in the examples folder

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
