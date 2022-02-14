// const processRecordTrials = (trials) => {
//     var channels = Object.keys(trials[0]);
//     var newChannelOpts: any = {};
//     if (dataset.isTimeseries()) {
//       newChannelOpts.baselineWindow = this._windowInSamples(
//         dataset.metadata.baselineWindow
//       );
//     }
//     channels.forEach((ch) => {
//       var newChannel = new ChannelStat(newChannelOpts);
//       trials.forEach((trialData: any) => {
//         newChannel.ingest(trialData[ch]);
//       });
//       dataset._channelStats[ch] = new ChannelStat();
//     });
// }

// const processRecordStats = (data) => {
//     let { values, stats, trials } = data.contents;
//     var channels = Object.keys(stats.estimators.mean);
//     channels.forEach((ch) => {
//       var mean = stats.estimators.mean[ch];
//       var variance = stats.estimators.variance[ch];
//       var count = stats.estimators.count[ch];
//       if (dataset.isTimeseries()) {
//         var baselineMean = stats.baseline.mean[ch];
//         var baselineVariance = stats.baseline.variance[ch];
//         var baselineCount = stats.baseline.count[ch];
//         var statValues = mean.map(
//           (d: any, i: any) => new Gaussian(mean[i], variance[i], count[i])
//         );
//         dataset._channelStats[ch] = new ChannelStat({
//           baseline: new Gaussian(
//             baselineMean,
//             baselineVariance,
//             baselineCount
//           ),
//           values: statValues,
//         });
//       } else {
//         dataset._channelStats[ch] = new ChannelStat({
//           values: [new Gaussian(mean, variance, count)],
//         });
//       }
//     });
// }

import { mean, variance, sqrt, std } from "mathjs";
import Gaussian from "gaussian";
import { jStat } from "jstat";
const pullRecordHG = async (subject, recordName) => {
  const recReq = await fetch(`/api/data/HG/${subject}/${recordName}`);
  const data = await recReq.json();
  // processRecordTrials(data.trials)
  let trials = data.contents.trials;
  let channels = Object.keys(trials[0]);
  let times = data.contents.times;
  let dataStart = data.contents.times[0]; //-1
  let dataEnd = data.contents.times[data.contents.times.length - 1]; //3
  let totalTime = dataEnd - dataStart;
  let { start: baselineStart, end: baselineEnd } = data.metadata.baselineWindow; //-1, -.02
  let windowStart =
    ((baselineStart - dataStart) / totalTime) * data.contents.times.length;
  let windowEnd =
    ((baselineEnd - dataStart) / totalTime) * data.contents.times.length;

  let startSample = Math.ceil(windowStart);
  let endSample = Math.floor(windowEnd);
  let startSecond = dataStart;
  let endSecond = dataEnd;

  let chanStat = {};
  let estimators = {};
  channels.forEach((ch, i) => {
    chanStat[ch] = {
      baseline: null,
      values: [],
      baselineWindow: { startSample, endSample },
      valueTrials: [],
    };
    let a = trials.map((trialData) => trialData[ch]);
    estimators[ch] = {
      mean: mean(a, 0),
      variance: variance(a, 0),
      count: trials.length,
    };
    let b = a.map((trial) => trial.slice(startSample, endSample - 3));
    // console.log(times.slice(startSample, endSample));
    // console.log(times.slice(startSample, endSample - 3));
    let baselineMean = mean(b);
    let baselineVariance = variance(b);
    chanStat[ch].baseline = new Gaussian(baselineMean, baselineVariance);
    let valMean = mean(a, 0);
    let valVar = variance(a, 0);
    times.forEach((dataPoint, i) => {
      chanStat[ch].values[i] = new Gaussian(valMean[i], valVar[i]);
    });
  });

  let chann = "LAH1";
  let num = estimators[chann].mean.map((val) => {
    // console.log((val - chanStat[chann].baseline.mean))
    return val - chanStat[chann].baseline.mean;
  });
  let a = chanStat[chann].baseline.variance / ((endSample - 2) * trials.length);
  let b = estimators[chann].variance.map((val) =>
    val === undefined ? 0 : val / estimators[chann].count
  );
  let den = b.map((x, i) => sqrt(a + x));
  let tValues = times.map((x, i) => num[i] / den[i]);

  let pVals = {
    values: [],
    indices: []
  }
  tValues.forEach((tval, i) => {
    pVals.values[i] = jStat.ttest(tval, 49)
    pVals.indices[i] = i;
  });
  // pVal.sort((a,b) => a-b)
  let sortResult = pVals.values.sort(function (a, b) {
    if (a.value - b.value) {
      return a
    }
    return b;
  });
  let kGood = -1;
  let nTests = sortResult.length;
  let fdr = 0.05;
  // console.log(sortResult);
  sortResult.every((p, k) => {
    let test = p.indices > ((k + 1) / nTests) * fdr;
    if (p.indices > ((k + 1) / nTests) * fdr) {
      return false;
    }
    kGood = k;
    return true;
  });
  // var canReject = pVals.map((p: any) => false);
  // sortResult.every((i, k) => {
  //   if (k > kGood) return false;
  //   canReject[i.indices] = true;
  //   return true;
  // });

  // let baselineNormalized = estimators[chann].mean.map((v, i) => {
  //   if (canReject[i]) {
  //     return (
  //       (v - chanStat[chann].baseline.variance) /
  //       sqrt(chanStat[chann].baseline.variance)
  //     );
  //   } else {
  //     return 0;
  //   }
  // });
  // console.log(baselineNormalized);
  return data;
};

const pullRecordEP = async (subject, recordName, type) => {
  const recReq = await fetch(`/api/data/${type}/${subject}/${recordName}`);
  const data = await recReq.json();
  console.log(data)
  return data
}


export { pullRecordHG, pullRecordEP };
