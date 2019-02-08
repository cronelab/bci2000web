const dsp = require('dsp.js')
const tf = require('@tensorflow/tfjs');

var osc = new dsp.Oscillator(dsp.SINEWAVE, 440, 1, 2048, 22050);
osc.generate();
var signal = osc.signal;
// console.log(signal)


 

const real = tf.tensor1d(new Float32Array(signal));

let realComps = tf.real(tf.rfft(real))
let nums = realComps.data()

real.data().then(z => console.log(z))
// nums.then(x => console.log(x))

