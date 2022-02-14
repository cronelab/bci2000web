let data = {
  stimuli: {
    footExtensionLeft: 1,
    footExtensionRight: 2,
    footFlexionLeft: 3,
    footFlexionRight: 4,
    kneeExtensionLeft: 5,
    kneeExtensionRight: 6,
    kneeFlexionLeft: 7,
    kneeFlexionRight: 8,
    legAbductionLeft: 9,
    legAbductionRight: 10,
    legAdductionLeft: 11,
    legAdductionRight: 12,
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
  Object.keys(data.stimuli).map(async (stim) => {
    let a = await import(`../images/leg/${stim}.png`);
    return a.default;
  })
);
let { sequence, stimulusDuration, ISImin, ISImax } = data;
let ISI = Math.random() * (ISImax - ISImin + 1) + ISImin;

export { images, sequence, stimulusDuration, ISI };
