let config = {
  stimuli: {
    'LeftASL A': 1,
    'LeftASL B': 2,
    'LeftASL C': 3,
    'LeftASL D': 4,
    'LeftASL E': 5,
    'LeftASL F': 6,
    'LeftASL G': 7,
    'LeftASL H': 8,
    'LeftASL I': 9,
    'LeftASL J': 10,
    'LeftASL K': 11,
    'LeftASL L': 12,
    'LeftASL M': 13,
    'LeftASL N': 14,
    'LeftASL O': 15,
    'LeftASL P': 16,
    'LeftASL Q': 17,
    'LeftASL R': 18,
    'LeftASL S': 19,
    'LeftASL T': 20,
    'LeftASL U': 21,
    'LeftASL V': 22,
    'LeftASL W': 23,
    'LeftASL X': 24,
    'LeftASL Y': 25,
    'LeftASL Z': 26,
    'RightASL A': 27,
    'RightASL B': 28,
    'RightASL C': 29,
    'RightASL D': 30,
    'RightASL E': 31,
    'RightASL F': 32,
    'RightASL G': 33,
    'RightASL H': 34,
    'RightASL I': 35,
    'RightASL J': 36,
    'RightASL K': 37,
    'RightASL L': 38,
    'RightASL M': 39,
    'RightASL N': 40,
    'RightASL O': 41,
    'RightASL P': 42,
    'RightASL Q': 43,
    'RightASL R': 44,
    'RightASL S': 45,
    'RightASL T': 46,
    'RightASL U': 47,
    'RightASL V': 48,
    'RightASL W': 49,
    'RightASL X': 50,
    'RightASL Y': 51,
    'RightASL Z': 52,
  },
  sequence: [
    6, 7, 2, 6, 5, 4, 4, 6, 8, 1, 2, 8, 8, 8, 3, 3, 2, 3, 6, 3, 3, 5, 8, 6, 5,
    4, 4, 5, 6, 5, 4, 3, 2, 2, 4, 6, 7, 7, 4, 2, 3, 3, 4, 5, 1, 8, 5, 6, 4, 5,
    8, 1, 2, 7, 1, 1, 4, 1, 3, 1, 1, 2, 2, 7, 8, 5, 1, 8, 3, 7, 5, 7, 7, 1, 6,
    7, 6, 7, 8, 2,
  ],
  stimulusDuration: 2000,
  ISImin: 3000,
  ISImax: 4000,
};

let images = await Promise.all(
  Object.keys(config.stimuli).map(async (stim) => {
    let a = await import(`../images/signs/${stim}.png`);
    return a.default;
  })
);
// let { sequence, stimulusDuration, ISImin, ISImax } = data;
config.ISI =
  Math.random() * (config.ISImax - config.ISImin + 1) + config.ISImin;
config.images = images;

export default config